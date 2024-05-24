import React from 'react';
import { Provider } from 'react-redux';

import { getConfig, mergeConfig } from '@edx/frontend-platform';
import { injectIntl, IntlProvider } from '@edx/frontend-platform/i18n';
import { fireEvent, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import { DEFAULT_STATE } from '../../../data/constants';
import { registerUser } from '../data/reducers';
import RegistrationForm from '../index';

const IntlRegistrationForm = injectIntl(RegistrationForm);
const mockStore = configureStore();

describe('RegistrationForm Test', () => {
  let store = {};

  const reduxWrapper = children => (
    <IntlProvider locale="en">
      <MemoryRouter>
        <Provider store={store}>{children}</Provider>
      </MemoryRouter>
    </IntlProvider>
  );

  const initialState = {
    register: {
      submitState: DEFAULT_STATE,
      registrationError: {},
      registrationResult: {},
    },
    commonData: {
      thirdPartyAuthApiStatus: DEFAULT_STATE,
      thirdPartyAuthContext: {
        finishAuthUrl: null,
        providers: [],
        errorMessage: null,
      },
    },
  };

  beforeEach(() => {
    store = mockStore(initialState);
    mergeConfig({
      AUTHN_TOS_AND_HONOR_CODE_LINK: process.env.AUTHN_TOS_AND_HONOR_CODE_LINK,
      AUTHN_PRIVACY_POLICY_LINK: process.env.AUTHN_PRIVACY_POLICY_LINK,
    });
  });

  // ******** test registration form submission ********
  it('should submit form for valid input', async () => {
    store.dispatch = jest.fn(store.dispatch);
    const payload = {
      email: 'test@example.com',
      name: 'test',
      password: 'test-password',
      marketing_email_opt_in: true,
    };
    const { container } = render(reduxWrapper(<IntlRegistrationForm />));

    const emailInput = container.querySelector('#email');
    fireEvent.change(emailInput, { target: { value: payload.email, name: 'email' } });

    const nameInput = container.querySelector('#name');
    const passwordInput = container.querySelector('#password');
    const registerButton = container.querySelector('#register-user');
    fireEvent.change(nameInput, { target: { value: payload.name, name: 'name' } });
    fireEvent.change(passwordInput, { target: { value: payload.password, name: 'password' } });
    fireEvent.click(registerButton);

    expect(store.dispatch).toHaveBeenCalledWith(registerUser(payload));
  });

  // ******** School or Organization Login Link Tests ********
  it('should show company and school credentials link', async () => {
    const { getByText } = render(reduxWrapper(<IntlRegistrationForm />));
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
    const { getByText } = render(reduxWrapper(<IntlRegistrationForm />));
    const schoolAndCompanyLink = getByText(
      'Sign in with your credentials',
    );

    expect(schoolAndCompanyLink.getAttribute('href')).toBe(`${getConfig().LMS_BASE_URL}/enterprise/login`);
  });
});
