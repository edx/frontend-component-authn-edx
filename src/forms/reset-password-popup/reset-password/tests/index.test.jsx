import React from 'react';
import { Provider } from 'react-redux';

import { configure, injectIntl, IntlProvider } from '@edx/frontend-platform/i18n';
import {
  fireEvent, render, screen,
} from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import {
  DEFAULT_STATE, FORGOT_PASSWORD_FORM,
  LOGIN_FORM,
} from '../../../../data/constants';
import { OnboardingComponentContext } from '../../../../data/storeHooks';
import { setCurrentOpenedForm } from '../../../../onboarding-component/data/reducers';
import {
  PASSWORD_RESET, PASSWORD_RESET_ERROR, SUCCESS, TOKEN_STATE,
} from '../data/constants';
import { resetPassword, validateToken } from '../data/reducers';
import ResetPasswordPage from '../index';

const mockedNavigator = jest.fn();
const token = '1c-bmjdkc-5e60e084cf8113048ca7';

jest.mock('@edx/frontend-platform/analytics', () => ({
  sendPageEvent: jest.fn(),
}));

jest.mock('@edx/frontend-platform/auth');
jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom')),
  useNavigate: () => mockedNavigator,
  useParams: jest.fn().mockReturnValue({ token }),
}));

const IntlResetPasswordPage = injectIntl(ResetPasswordPage);
const mockStore = configureStore();

describe('ResetPasswordPage', () => {
  let store = {};

  const reduxWrapper = children => (
    <IntlProvider locale="en">
      <MemoryRouter>
        <Provider context={OnboardingComponentContext} store={store}>{children}</Provider>
      </MemoryRouter>
    </IntlProvider>
  );

  const initialState = {
    register: {
      validationApiRateLimited: false,
    },
    resetPassword: {
      tokenState: DEFAULT_STATE,
      submitState: DEFAULT_STATE,
      status: TOKEN_STATE.PENDING,
      token: null,
      errorMsg: null,
      tokenError: null,
    },
  };

  beforeEach(() => {
    store = mockStore(initialState);
    configure({
      loggingService: { logError: jest.fn() },
      config: {
        ENVIRONMENT: 'production',
        LANGUAGE_PREFERENCE_COOKIE_NAME: 'yum',
      },
      messages: { 'es-419': {}, de: {}, 'en-us': {} },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ******** form submission tests ********

  // TODO: test will be fixed later
  it.skip('with valid inputs resetPassword action is dispatched', async () => {
    const password = 'test-password-1';

    store = mockStore({
      ...initialState,
      resetPassword: {
        status: TOKEN_STATE.VALID,
      },
    });

    jest.mock('@edx/frontend-platform/auth', () => ({
      getHttpClient: jest.fn(() => ({
        post: async () => ({
          data: {},
          catch: () => {},
        }),
      })),
    }));

    store.dispatch = jest.fn(store.dispatch);
    render(reduxWrapper(<IntlResetPasswordPage />));
    const newPasswordInput = screen.getByLabelText('New password');
    const confirmPasswordInput = screen.getByTestId('confirmPassword');

    fireEvent.change(newPasswordInput, { target: { value: password } });
    fireEvent.change(confirmPasswordInput, { target: { value: password } });

    const resetPasswordButton = screen.getByRole('button', { name: /Reset password/i, id: 'submit-new-password' });
    await act(async () => {
      fireEvent.click(resetPasswordButton);
    });
    expect(store.dispatch).toHaveBeenCalledWith(
      resetPassword({
        formPayload:
        { new_password1: password, new_password2: password },
        token: null,
        params: {},
      }),
    );
  });

  // ******** test reset password field validations ********

  it('should show error messages for required fields on empty form submission', () => {
    store = mockStore({
      ...initialState,
      resetPassword: {
        status: TOKEN_STATE.VALID,
      },
    });
    render(reduxWrapper(<IntlResetPasswordPage />));
    const resetPasswordButton = screen.getByRole('button', { name: /Reset password/i, id: 'submit-new-password' });
    fireEvent.click(resetPasswordButton);

    expect(screen.queryByText('Password is a required field')).toBeTruthy();
    expect(screen.queryByText('Confirm your password')).toBeTruthy();

    const newPasswordInput = screen.getByLabelText('New password');
    fireEvent.focus(newPasswordInput);
    expect(screen.queryByText('Password criteria has not been met')).toBeNull();

    const confirmPasswordInput = screen.getByTestId('confirmPassword');
    fireEvent.focus(confirmPasswordInput);
    expect(screen.queryByText('Confirm your password')).toBeNull();
  });

  it('should show error message when new and confirm password do not match', () => {
    store = mockStore({
      ...initialState,
      resetPassword: {
        status: TOKEN_STATE.VALID,
      },
    });
    render(reduxWrapper(<IntlResetPasswordPage />));
    const confirmPasswordInput = screen.getByTestId('confirmPassword');
    fireEvent.blur(confirmPasswordInput, { target: { value: 'password-mismatch' } });

    const passwordsDoNotMatchError = screen.getByText('Passwords do not match');
    expect(passwordsDoNotMatchError).toBeTruthy();
  });

  //   // ******** alert message tests ********

  it('should show reset password rate limit error', () => {
    const validationMessage = 'An error has occurred because of too many requests. Please try again after some time.';
    store = mockStore({
      ...initialState,
      resetPassword: {
        status: PASSWORD_RESET.FORBIDDEN_REQUEST,
      },
    });

    const { container } = render(reduxWrapper(<IntlResetPasswordPage />));

    const alertElements = container.querySelectorAll('.alert-danger');
    const rateLimitError = alertElements[0].textContent;
    expect(rateLimitError).toBe(validationMessage);
  });

  it('should show reset password internal server error', () => {
    const validationMessage = 'An error has occurred. Try refreshing the page, or check your internet connection.';
    store = mockStore({
      ...initialState,
      resetPassword: {
        status: PASSWORD_RESET.INTERNAL_SERVER_ERROR,
      },
    });

    const { container } = render(reduxWrapper(<IntlResetPasswordPage />));
    const alertElements = container.querySelectorAll('.alert-danger');
    const internalServerError = alertElements[0].textContent;
    expect(internalServerError).toBe(validationMessage);
  });

  //   // ******** miscellaneous tests ********
  // TODO: test will be fixed later
  it.skip('should call validation on password field when blur event fires', () => {
    const resetPasswordPage = render(reduxWrapper(<IntlResetPasswordPage />));
    const expectedText = 'Password is a required field';
    const newPasswordInput = screen.getByLabelText('New password');
    fireEvent.change(newPasswordInput, { value: 'test-password' });

    fireEvent.blur(newPasswordInput, { value: 'test-password' });

    const feedbackDiv = resetPasswordPage.container.querySelector('div[feedback-for="newPassword"]');
    expect(feedbackDiv.textContent).toEqual(expectedText);
  });

  it('show spinner when api call is pending', () => {
    delete window.location;
    window.location = {
      href: 'localhost:2999?authMode=PasswordResetConfirm&password_reset_token=1c-bmjdkc-5e60e084cf8113048ca7&track=pwreset',
      pathname: '/password_reset_confirm/',
      search: '?authMode=PasswordResetConfirm&password_reset_token=1c-bmjdkc-5e60e084cf8113048ca7&track=pwreset',
    };
    store = mockStore({
      ...initialState,
      resetPassword: {
        status: TOKEN_STATE.PENDING,
      },
    });
    window.history.replaceState = jest.fn();
    store.dispatch = jest.fn(store.dispatch);
    render(reduxWrapper(<IntlResetPasswordPage />));

    expect(store.dispatch).toHaveBeenCalledWith(validateToken(token));
  });
  it('should redirect the user to Reset password email screen ', async () => {
    store = mockStore({
      ...initialState,
      resetPassword: {
        status: PASSWORD_RESET_ERROR,
      },
    });
    store.dispatch = jest.fn(store.dispatch);
    render(reduxWrapper(<IntlResetPasswordPage />));
    expect(store.dispatch).toHaveBeenCalledWith(setCurrentOpenedForm(FORGOT_PASSWORD_FORM));
  });

  it('should redirect the user to root url of the application ', async () => {
    store = mockStore({
      ...initialState,
      resetPassword: {
        status: SUCCESS,
      },
    });
    store.dispatch = jest.fn(store.dispatch);
    render(reduxWrapper(<IntlResetPasswordPage />));
    expect(store.dispatch).toHaveBeenCalledWith(setCurrentOpenedForm(LOGIN_FORM));
  });
});
