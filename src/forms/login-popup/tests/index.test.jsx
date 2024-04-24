import React from 'react';
import { Provider } from 'react-redux';

import { injectIntl, IntlProvider } from '@edx/frontend-platform/i18n';
import { fireEvent, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import { DEFAULT_STATE } from '../../../data/constants';
import { loginUser } from '../data/reducers';
import LoginForm from '../index';

const IntlLoginForm = injectIntl(LoginForm);
const mockStore = configureStore();

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
  };

  beforeEach(() => {
    store = mockStore(initialState);
  });

  // ******** test login form submission ********

  it('should submit form for valid input', () => {
    store.dispatch = jest.fn(store.dispatch);

    const { container } = render(reduxWrapper(<IntlLoginForm />));

    const usernameInput = container.querySelector('#emailOrUsername');
    const passwordInput = container.querySelector('#password');
    const loginButton = container.querySelector('#login-user');

    fireEvent.change(usernameInput, { target: { value: 'test', name: 'emailOrUsername' } });
    fireEvent.change(passwordInput, { target: { value: 'test-password', name: 'password' } });
    fireEvent.click(loginButton);

    expect(store.dispatch).toHaveBeenCalledWith(loginUser({ email_or_username: 'test', password: 'test-password' }));
  });
});
