import React from 'react';
import { Provider } from 'react-redux';

import { injectIntl, IntlProvider } from '@edx/frontend-platform/i18n';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import { setCurrentOpenedForm } from '../../../../authn-component/data/reducers';
import { COMPLETE_STATE, LOGIN_FORM } from '../../../../data/constants';
import { AuthnContext } from '../../../../data/storeHooks';
import { forgotPassword, forgotPasswordClearStatus } from '../data/reducers';
import ForgotPasswordPage from '../index';

jest.mock('@edx/frontend-platform/analytics', () => ({
  sendTrackEvent: jest.fn(),
  sendPageEvent: jest.fn(),
}));

const IntlForgotPasswordPage = injectIntl(ForgotPasswordPage);
const mockStore = configureStore();

const initialState = {
  forgotPassword: {
    status: '',
  },
};

describe('ForgotPasswordPage', () => {
  let store = {};

  const reduxWrapper = (children) => (
    <IntlProvider locale="en">
      <MemoryRouter>
        <Provider context={AuthnContext} store={store}>{children}</Provider>
      </MemoryRouter>
    </IntlProvider>
  );

  beforeEach(() => {
    store = mockStore(initialState);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders forgot password form', () => {
    render(reduxWrapper(<IntlForgotPasswordPage />));

    // Assert elements present in the form
    expect(screen.getByLabelText('Email')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Back to login' })).toBeTruthy();
  });

  it('displays error message with empty email', async () => {
    render(reduxWrapper(<IntlForgotPasswordPage />));

    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByRole('button', { name: 'Submit' });

    // Clear the email input field
    fireEvent.change(emailInput, { target: { value: ' ' } });
    fireEvent.click(submitButton);

    // Check if error message for empty email is displayed
    expect(await screen.findByText('Email is required below.')).toBeTruthy();
    expect(await screen.findByText('Email is required')).toBeTruthy();
  });

  it('displays error message with invalid email', async () => {
    render(reduxWrapper(<IntlForgotPasswordPage />));

    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByRole('button', { name: 'Submit' });

    // Enter an invalid email and submit the form
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    // Check if error messages are displayed
    expect(await screen.findByText('Enter a valid email address below.')).toBeTruthy();
    expect(await screen.findByText('Enter a valid email address')).toBeTruthy();
  });

  it('dispatches correct actions on Back to login click', () => {
    render(reduxWrapper(<IntlForgotPasswordPage />));

    const backToLoginButton = screen.getByRole('button', { name: 'Back to login' });

    fireEvent.click(backToLoginButton);

    const actions = store.getActions();
    expect(actions).toEqual([
      { type: forgotPasswordClearStatus.type },
      { type: setCurrentOpenedForm.type, payload: LOGIN_FORM },
    ]);
  });

  it('handles COMPLETE_STATE correctly in useEffect', () => {
    // Update initial state to COMPLETE_STATE
    store = mockStore({
      forgotPassword: {
        status: COMPLETE_STATE,
      },
    });

    render(reduxWrapper(<IntlForgotPasswordPage />));

    const emailInput = screen.queryByLabelText('Email');
    expect(emailInput).toBeNull();
  });

  it('dispatches forgotPassword action with valid email on form submission', () => {
    render(reduxWrapper(<IntlForgotPasswordPage />));

    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByRole('button', { name: 'Submit' });

    fireEvent.change(emailInput, { target: { value: 'valid@example.com' } });

    fireEvent.click(submitButton);

    const actions = store.getActions();
    const forgotPasswordAction = actions.find(action => action.type === forgotPassword.type);

    expect(forgotPasswordAction).toBeDefined();
    expect(forgotPasswordAction.payload).toEqual('valid@example.com');
  });

  it('prevents default behavior on mouse down event', () => {
    render(reduxWrapper(<IntlForgotPasswordPage />));

    const backButton = screen.getByRole('button', { name: 'Back to login' });

    const mockMouseDownEvent = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
    });

    jest.spyOn(mockMouseDownEvent, 'preventDefault');
    fireEvent(backButton, mockMouseDownEvent);

    expect(mockMouseDownEvent.preventDefault).toHaveBeenCalled();
  });

  it('prevents default behavior on mouse down event for submit button', () => {
    render(reduxWrapper(<IntlForgotPasswordPage />));

    const submitButton = screen.getByRole('button', { name: 'Submit' });

    const mockMouseDownEvent = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
    });

    jest.spyOn(mockMouseDownEvent, 'preventDefault');
    fireEvent(submitButton, mockMouseDownEvent);

    expect(mockMouseDownEvent.preventDefault).toHaveBeenCalled();
  });
});
