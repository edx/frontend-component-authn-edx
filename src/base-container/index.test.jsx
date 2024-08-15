import React from 'react';
import { Provider } from 'react-redux';

import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import { FORGOT_PASSWORD_FORM } from '../data/constants';
import { OnboardingComponentContext } from '../data/storeHooks';
import { NUDGE_PASSWORD_CHANGE } from '../forms/login-popup/data/constants';
import { loginErrorClear } from '../forms/login-popup/data/reducers';
import { clearAllRegistrationErrors } from '../forms/registration-popup/data/reducers';
import {
  forgotPasswordClearStatus,
} from '../forms/reset-password-popup/forgot-password/data/reducers';
import { setCurrentOpenedForm } from '../onboarding-component/data/reducers';

import BaseContainer from './index';

const mockStore = configureStore();

describe('BaseContainer Tests', () => {
  let store = {};

  const reduxWrapper = children => (
    <MemoryRouter>
      <Provider context={OnboardingComponentContext} store={store}>{children}</Provider>
    </MemoryRouter>
  );

  const initialState = {
    login: {},
    register: {},
    forgotPassword: {},
    commonData: {},
  };

  beforeEach(() => {
    store = mockStore(initialState);
    window.history.replaceState = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the modal when isOpen is true', () => {
    render(reduxWrapper(
      <BaseContainer
        isOpen
        close={jest.fn()}
        currentForm={FORGOT_PASSWORD_FORM}
      >
        <div>Test Modal Content</div>
      </BaseContainer>,
    ));
    expect(screen.getByText('Test Modal Content')).toBeTruthy();
  });

  it('does not render the modal when isOpen is false', () => {
    render(reduxWrapper(
      <BaseContainer
        isOpen={false}
        close={jest.fn()}
        currentForm={FORGOT_PASSWORD_FORM}
      >
        <div>Test Modal Content</div>
      </BaseContainer>,
    ));
    expect(screen.queryByText('Test Modal Content')).toBeFalsy();
  });

  it('calls the close function and dispatches actions on modal close', () => {
    store.dispatch = jest.fn(store.dispatch);
    const closeMock = jest.fn();

    render(reduxWrapper(
      <BaseContainer
        isOpen
        close={closeMock}
        currentForm={FORGOT_PASSWORD_FORM}
      >
        <div>Test Modal Content</div>
      </BaseContainer>,
    ));

    const closeButton = screen.getByRole('button', { ariaLabel: /Close/i });
    fireEvent.click(closeButton);

    expect(store.dispatch).toHaveBeenCalledWith(forgotPasswordClearStatus());
    expect(store.dispatch).toHaveBeenCalledWith(loginErrorClear());
    expect(store.dispatch).toHaveBeenCalledWith(clearAllRegistrationErrors());
    expect(store.dispatch).toHaveBeenCalledWith(setCurrentOpenedForm(null));
    expect(closeMock).toHaveBeenCalled();
  });

  it('redirects to finish auth url if user clicks close on nudge password change error', () => {
    store = mockStore({
      ...initialState,
      login: {
        ...initialState.login,
        loginError: {
          errorCode: NUDGE_PASSWORD_CHANGE,
          redirectUrl: 'https://example.com',
        },
        commonData: {
          ...initialState.commonData,
          currentForm: FORGOT_PASSWORD_FORM,
        },
      },
    });

    const closeMock = jest.fn();
    delete window.location;
    window.location = { href: '' };

    render(reduxWrapper(
      <BaseContainer
        isOpen
        close={closeMock}
        currentForm={FORGOT_PASSWORD_FORM}
      >
        <div>Test Modal Content</div>
      </BaseContainer>,
    ));

    const closeButton = screen.getByRole('button', { ariaLabel: /Close/i });
    fireEvent.click(closeButton);

    expect(window.location.href).toBe('https://example.com');
  });
});
