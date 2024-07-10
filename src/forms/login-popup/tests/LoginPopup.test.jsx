import React from 'react';
import { Provider } from 'react-redux';

import { getConfig, mergeConfig } from '@edx/frontend-platform';
import { injectIntl, IntlProvider } from '@edx/frontend-platform/i18n';
import { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import {
  DEFAULT_STATE, FORGOT_PASSWORD_FORM, INTERNAL_SERVER_ERROR, REGISTRATION_FORM,
} from '../../../data/constants';
import { OnboardingComponentContext } from '../../../data/storeHooks';
import getAllPossibleQueryParams from '../../../data/utils';
import { setCurrentOpenedForm } from '../../../onboarding-component/data/reducers';
import { NUDGE_PASSWORD_CHANGE, REQUIRE_PASSWORD_CHANGE } from '../data/constants';
import { loginUser } from '../data/reducers';
import LoginForm from '../index';

const IntlLoginForm = injectIntl(LoginForm);
const mockStore = configureStore();

// mocking getAllPossibleQueryParams
jest.mock('../../../data/utils', () => ({
  ...jest.requireActual('../../../data/utils'),
  __esModule: true,
  default: jest.fn(),
}));

// Mocking the trackForgotPasswordLinkClick function
jest.mock('../../../tracking/trackers/login', () => ({
  ...jest.requireActual('../../../tracking/trackers/login'),
  trackForgotPasswordLinkClick: jest.fn(),
}));

describe('LoginForm Test', () => {
  let store = {};

  const reduxWrapper = children => (
    <IntlProvider locale="en">
      <MemoryRouter>
        <Provider context={OnboardingComponentContext} store={store}>{children}</Provider>
      </MemoryRouter>
    </IntlProvider>
  );

  const initialState = {
    login: {
      submitState: DEFAULT_STATE,
      loginResult: { success: false, redirectUrl: '' },
      loginError: {},
    },
    register: {
      registrationFields: {},
    },
    commonData: {
      currentForm: '',
      thirdPartyAuthContext: {
        finishAuthUrl: null,
        providers: [],
        errorMessage: null,
      },
    },
  };

  beforeEach(() => {
    store = mockStore(initialState);
    window.history.replaceState = jest.fn();
    mergeConfig({
      TOS_AND_HONOR_CODE: process.env.TOS_AND_HONOR_CODE,
      PRIVACY_POLICY: process.env.PRIVACY_POLICY,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render login form', () => {
    render(reduxWrapper(<IntlLoginForm />));

    expect(screen.getByTestId('sign-in-heading')).toBeTruthy();
    expect(screen.getByText('Username or email')).toBeTruthy();
    expect(screen.getByText('Password')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeTruthy();
  });

  // ******** test login form submission ********

  it('should submit form for valid input', async () => {
    store.dispatch = jest.fn(store.dispatch);

    const { container } = render(reduxWrapper(<IntlLoginForm />));

    const usernameInput = container.querySelector('#emailOrUsername');
    const passwordInput = container.querySelector('#password');
    const loginButton = container.querySelector('#login-user');

    await act(async () => {
      fireEvent.change(usernameInput, { target: { value: 'test', name: 'emailOrUsername' } });
      fireEvent.change(passwordInput, { target: { value: 'test-password', name: 'password' } });
    });
    fireEvent.click(loginButton);

    expect(store.dispatch).toHaveBeenCalledWith(loginUser({ email_or_username: 'test', password: 'test-password' }));
  });

  // ******** test login form elements ********
  it('should show company and school credentials link', async () => {
    const { getByText } = render(reduxWrapper(<IntlLoginForm />));
    const schoolAndCompanyLabel = getByText(
      'Have an account through school or organization?',
    );
    const schoolAndCompanyLink = getByText(
      'Sign in with your credentials',
    );
    expect(schoolAndCompanyLabel).toBeTruthy();
    expect(schoolAndCompanyLink).toBeTruthy();
  });

  it('should have the correct redirect url for school or organization login', async () => {
    const { getByText } = render(reduxWrapper(<IntlLoginForm />));
    const schoolAndCompanyLink = getByText(
      'Sign in with your credentials',
    );

    expect(schoolAndCompanyLink.getAttribute('href')).toBe(`${getConfig().LMS_BASE_URL}/enterprise/login`);
  });

  it('should submit form with query params', () => {
    // Mocking the query parameters
    getAllPossibleQueryParams.mockReturnValue({
      next: '/redirect',
    });

    store.dispatch = jest.fn(store.dispatch);

    const { container } = render(reduxWrapper(<IntlLoginForm />));

    const usernameInput = container.querySelector('#emailOrUsername');
    const passwordInput = container.querySelector('#password');
    const loginButton = container.querySelector('#login-user');

    fireEvent.change(usernameInput, { target: { value: 'test', name: 'emailOrUsername' } });
    fireEvent.change(passwordInput, { target: { value: 'test-password', name: 'password' } });
    fireEvent.click(loginButton);

    expect(store.dispatch).toHaveBeenCalledWith(loginUser({
      email_or_username: 'test',
      password: 'test-password',
      next: '/redirect',
    }));
  });

  it('should show error message on empty/invalid form submission', () => {
    const { container } = render(reduxWrapper(<IntlLoginForm />));

    const loginButton = container.querySelector('#login-user');

    fireEvent.click(loginButton);

    expect(screen.getByText('Please fill in the fields below.')).toBeTruthy();
  });

  it('should show error message for invalid emailOrUsername field value on form submission', () => {
    store.dispatch = jest.fn(store.dispatch);

    const { container } = render(reduxWrapper(<IntlLoginForm />));

    const usernameInput = container.querySelector('#emailOrUsername');
    const passwordInput = container.querySelector('#password');
    const loginButton = container.querySelector('#login-user');

    fireEvent.change(usernameInput, { target: { value: 'a', name: 'emailOrUsername' } });
    fireEvent.change(passwordInput, { target: { value: 'test-password', name: 'password' } });
    fireEvent.click(loginButton);

    expect(screen.getByText('Username or email must have at least 2 characters.')).toBeTruthy();
  });

  it('should clear field error on focus', () => {
    const { container } = render(reduxWrapper(<IntlLoginForm />));

    const loginButton = container.querySelector('#login-user');

    fireEvent.click(loginButton);
    expect(screen.getByText('Enter your username or email')).toBeTruthy();

    fireEvent.focus(screen.getByLabelText('Username or email'));
    expect(screen.queryByText('Enter your username or email')).toBeNull();
  });

  it('should show error message if there is any loginErrorCode', () => {
    store = mockStore({
      ...initialState,
      commonData: {
        ...initialState.commonData,
        thirdPartyAuthContext: {
          ...initialState.commonData.thirdPartyAuthContext,
          errorMessage: 'Third party authentication failed.',
        },
      },
    });
    store.dispatch = jest.fn(store.dispatch);

    const { container } = render(reduxWrapper(<IntlLoginForm />));

    expect(
      container.querySelector('#SSO-failure-alert').textContent,
    ).toContain('Third party authentication failed.');
  });

  it('should show error message if there is thirdPartyAuthErrorMessage', () => {
    store = mockStore({
      ...initialState,
      login: {
        ...initialState.login,
        loginError: {
          errorCode: INTERNAL_SERVER_ERROR,
        },
      },
    });
    store.dispatch = jest.fn(store.dispatch);

    const { container } = render(reduxWrapper(<IntlLoginForm />));

    const expectedMessage = 'We couldn\'t sign you in. An error has occurred. '
                      + 'Try refreshing the page, or check your internet connection.';

    expect(container.querySelector('#login-failure-alert').textContent).toBe(expectedMessage);
  });

  it('should prevent default behavior on mouse down', () => {
    const { container } = render(reduxWrapper(<IntlLoginForm />));

    const loginButton = container.querySelector('#login-user');

    const preventDefaultMock = jest.fn();
    loginButton.onmousedown = preventDefaultMock;
    fireEvent.mouseDown(loginButton);
    expect(preventDefaultMock).toHaveBeenCalledTimes(1);
  });

  it('should dispatch setCurrentOpenedForm action on "Create account" link click', () => {
    store.dispatch = jest.fn(store.dispatch);
    const { getByText } = render(reduxWrapper(<IntlLoginForm />));

    fireEvent.click(getByText('Create account'));

    expect(store.dispatch).toHaveBeenCalledWith(setCurrentOpenedForm(REGISTRATION_FORM));
  });

  it('should dispatch setCurrentOpenedForm action on "Forgot Password?" link click', () => {
    store.dispatch = jest.fn(store.dispatch);
    const { getByText } = render(reduxWrapper(<IntlLoginForm />));

    fireEvent.click(getByText('Forgot Password?'));

    expect(store.dispatch).toHaveBeenCalledWith(setCurrentOpenedForm(FORGOT_PASSWORD_FORM));
  });

  it('should redirects to forget password popup if login API returns error code NUDGE_PASSWORD_CHANGE', () => {
    store = mockStore({
      ...initialState,
      login: {
        ...initialState.login,
        loginError: {
          errorCode: NUDGE_PASSWORD_CHANGE,
        },
      },
    });
    store.dispatch = jest.fn(store.dispatch);

    render(reduxWrapper(<IntlLoginForm />));

    expect(store.dispatch).toHaveBeenCalledWith(setCurrentOpenedForm(FORGOT_PASSWORD_FORM));
  });

  it('should redirects to forget password popup if login API returns error code REQUIRE_PASSWORD_CHANGE', () => {
    store = mockStore({
      ...initialState,
      login: {
        ...initialState.login,
        loginError: {
          errorCode: REQUIRE_PASSWORD_CHANGE,
        },
      },
    });
    store.dispatch = jest.fn(store.dispatch);

    render(reduxWrapper(<IntlLoginForm />));

    expect(store.dispatch).toHaveBeenCalledWith(setCurrentOpenedForm(FORGOT_PASSWORD_FORM));
  });
});
