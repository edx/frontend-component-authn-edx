import React from 'react';
import { Provider } from 'react-redux';

import { injectIntl, IntlProvider } from '@edx/frontend-platform/i18n';
import { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import { DEFAULT_STATE, INTERNAL_SERVER_ERROR } from '../../../data/constants';
import getAllPossibleQueryParams from '../../../data/utils';
import { loginUser } from '../data/reducers';
import LoginForm from '../index';

const IntlLoginForm = injectIntl(LoginForm);
const mockStore = configureStore();

// mocking getAllPossibleQueryParams
jest.mock('../../../data/utils', () => jest.fn());

describe('LoginForm Test', () => {
  let store = {};

  const reduxWrapper = children => (
    <IntlProvider locale="en">
      <MemoryRouter>
        <Provider store={store}>{children}</Provider>
      </MemoryRouter>
    </IntlProvider>
  );

  const initialState = {
    login: {
      submitState: DEFAULT_STATE,
      loginResult: { success: false, redirectUrl: '' },
      loginError: {},
    },
    commonData: {
      thirdPartyAuthContext: {
        finishAuthUrl: null,
        providers: [],
        errorMessage: null,
      },
    },
  };

  beforeEach(() => {
    store = mockStore(initialState);
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
      container.querySelector('#login-failure-alert').textContent,
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
      container.querySelector('#login-failure-alert').textContent,
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
});
