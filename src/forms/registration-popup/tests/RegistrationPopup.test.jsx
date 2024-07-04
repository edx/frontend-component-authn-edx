import React from 'react';
import { Provider } from 'react-redux';

import { getConfig, mergeConfig } from '@edx/frontend-platform';
import { injectIntl, IntlProvider } from '@edx/frontend-platform/i18n';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import Cookies from 'universal-cookie';

import { setCurrentOpenedForm } from '../../../authn-component/data/reducers';
import {
  COMPLETE_STATE, DEFAULT_STATE, LOGIN_FORM,
} from '../../../data/constants';
import { AuthnContext } from '../../../data/storeHooks';
import { clearRegistrationBackendError, registerUser } from '../data/reducers';
import * as utils from '../data/utils';
import RegistrationForm from '../index';

const IntlRegistrationForm = injectIntl(RegistrationForm);
const mockStore = configureStore();

const emptyFieldValidation = {
  name: 'Full name is required',
  email: 'Email is required',
  password: 'Password criteria has not been met',
};

const populateRequiredFields = (
  getByLabelText,
  payload,
  isThirdPartyAuth = false,
) => {
  fireEvent.change(getByLabelText('Full name'), { target: { value: payload.name, name: 'name' } });

  fireEvent.change(getByLabelText('Email'), { target: { value: payload.email, name: 'email' } });

  if (!isThirdPartyAuth) {
    fireEvent.change(getByLabelText('Password'), { target: { value: payload.password, name: 'password' } });
  }
};

describe('RegistrationForm Test', () => {
  let store = {};

  const reduxWrapper = children => (
    <IntlProvider locale="en">
      <MemoryRouter>
        <Provider context={AuthnContext} store={store}>{children}</Provider>
      </MemoryRouter>
    </IntlProvider>
  );

  const initialState = {
    register: {
      submitState: DEFAULT_STATE,
      registrationError: {},
      registrationResult: {},
    },
    login: {
      isLoginSSOIntent: false,
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
      TOS_AND_HONOR_CODE: process.env.TOS_AND_HONOR_CODE,
      PRIVACY_POLICY: process.env.PRIVACY_POLICY,
      USER_RETENTION_COOKIE_NAME: 'authn-returning-user',
      ONBOARDING_COMPONENT_ENV: process.env.ONBOARDING_COMPONENT_ENV,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ******** test registration form submission ********
  it('should submit form for valid input', async () => {
    jest.spyOn(global.Date, 'now').mockImplementation(() => 0);
    store.dispatch = jest.fn(store.dispatch);
    const payload = {
      email: 'test@example.com',
      name: 'test',
      password: 'test-password12',
      marketing_emails_opt_in: true,
      honor_code: true,
      terms_of_service: true,
      total_registration_time: 0,
      app_name: 'onboarding_component',
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

  it('should submit form with country code', async () => {
    jest.spyOn(global.Date, 'now').mockImplementation(() => 0);
    // Mock Cookies class
    jest.mock('universal-cookie');

    const cookie = new Cookies();
    cookie.set(`${getConfig().ONBOARDING_COMPONENT_ENV}-edx-cf-loc`, 'US');

    store.dispatch = jest.fn(store.dispatch);
    const payload = {
      email: 'test@example.com',
      name: 'test',
      password: 'test-password12',
      marketing_emails_opt_in: true,
      honor_code: true,
      terms_of_service: true,
      country: 'US',
      total_registration_time: 0,
      app_name: 'onboarding_component',
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

  it('should display an error when form is submitted with an invalid email', () => {
    jest.spyOn(global.Date, 'now').mockImplementation(() => 0);
    const emailError = 'We couldn’t create your account. Please correct the errors below.';

    const formPayload = {
      name: 'Petro',
      email: 'petro  @example.com',
      password: 'password1',
      honor_code: true,
      totalRegistrationTime: 0,
    };

    store.dispatch = jest.fn(store.dispatch);
    const { getByLabelText, container } = render(reduxWrapper(<IntlRegistrationForm />));
    populateRequiredFields(getByLabelText, formPayload, true);

    const registerButton = container.querySelector('#register-user');
    fireEvent.click(registerButton);

    const validationErrors = container.querySelector('#registration-failure-alert');
    expect(validationErrors.textContent).toContain(emailError);
  });

  it('should not dispatch registerNewUser on empty form Submission', () => {
    store.dispatch = jest.fn(store.dispatch);

    const { container } = render(reduxWrapper(<IntlRegistrationForm />));

    const registerButton = container.querySelector('#register-user');
    fireEvent.click(registerButton);

    expect(store.dispatch).not.toHaveBeenCalledWith(registerUser({}));
  });

  // ******** test registration form validations ********

  it('should show error messages for required fields on empty form submission', () => {
    const { container } = render(reduxWrapper(<IntlRegistrationForm />));

    const registerButton = container.querySelector('#register-user');
    fireEvent.click(registerButton);

    Object.entries(emptyFieldValidation).forEach(([fieldName, validationMessage]) => {
      const feedbackElement = container.querySelector(`div[feedback-for="${fieldName}"]`);
      expect(feedbackElement.textContent).toContain(validationMessage);
    });

    const alertBanner = 'We couldn’t create your account. Please correct the errors below.';
    const validationErrors = container.querySelector('#registration-failure-alert');
    expect(validationErrors.textContent).toContain(alertBanner);
  });

  it('should set errors with validations returned by registration api', () => {
    const emailError = 'This email is already associated with an existing or previous edX account';
    store = mockStore({
      ...initialState,
      register: {
        ...initialState.register,
        registrationError: {
          email: [{ userMessage: emailError }],
        },
      },
    });
    const { container } = render(reduxWrapper(<IntlRegistrationForm />));
    const emailFeedback = container.querySelector('div[feedback-for="email"]');

    expect(emailFeedback.textContent).toContain(emailError);
  });

  it('should clear error on focus', () => {
    const { container } = render(reduxWrapper(<IntlRegistrationForm />));

    const registerButton = container.querySelector('#register-user');
    fireEvent.click(registerButton);

    const passwordFeedback = container.querySelector('div[feedback-for="password"]');
    expect(passwordFeedback.textContent).toContain(emptyFieldValidation.password);

    const passwordField = container.querySelector('input#password');
    fireEvent.focus(passwordField);

    const isFeedbackPresent = container.contains(passwordFeedback);
    expect(isFeedbackPresent).toBeFalsy();
  });

  it('should clear registration backend error on change', () => {
    const emailError = 'This email is already associated with an existing or previous account';
    store = mockStore({
      ...initialState,
      register: {
        ...initialState.register,
        registrationError: {
          email: [{ userMessage: emailError }],
        },
      },
    });
    store.dispatch = jest.fn(store.dispatch);

    const { container } = render(reduxWrapper(
      <IntlRegistrationForm />,
    ));

    const emailInput = container.querySelector('input#email');
    fireEvent.change(emailInput, { target: { value: 'test1@gmail.com', name: 'email' } });
    expect(store.dispatch).toHaveBeenCalledWith(clearRegistrationBackendError('email'));
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

  it('should prevent default behavior on mouse down', () => {
    const { container } = render(reduxWrapper(<IntlRegistrationForm />));

    const registerButton = container.querySelector('#register-user');

    const preventDefaultMock = jest.fn();
    registerButton.onmousedown = preventDefaultMock;
    fireEvent.mouseDown(registerButton);
    expect(preventDefaultMock).toHaveBeenCalledTimes(1);
  });

  it('should dispatch setCurrentOpenedForm action on "Sign In" link click', () => {
    store.dispatch = jest.fn(store.dispatch);
    const { getByText } = render(reduxWrapper(<IntlRegistrationForm />));

    fireEvent.click(getByText('Sign In'));

    expect(store.dispatch).toHaveBeenCalledWith(setCurrentOpenedForm(LOGIN_FORM));
  });

  it('should load pipeline user details into form if autoSubmitRegForm is true', async () => {
    store = mockStore({
      ...initialState,
      commonData: {
        ...initialState.commonData,
        thirdPartyAuthApiStatus: COMPLETE_STATE,
        thirdPartyAuthContext: {
          ...initialState.commonData.thirdPartyAuthContext,
          currentProvider: 'Apple',
          pipelineUserDetails: {
            name: 'John Doe',
            email: 'john.doe@example.com',
          },
        },
      },
    });
    store.dispatch = jest.fn(store.dispatch);

    const { container } = render(reduxWrapper(<IntlRegistrationForm />));

    await act(async () => {
      await waitFor(() => {
        expect(container.querySelector('#name').value).toBe('John Doe');
        expect(container.querySelector('#email').value).toBe('john.doe@example.com');
      });
    });
  });

  it('should show spinner instead of form while registering if autoSubmitRegForm is true', () => {
    delete window.location;
    window.location = {
      href: 'localhost:2999/?authMode=Register',
      search: '?authMode=Register',
    };
    store = mockStore({
      ...initialState,
      commonData: {
        ...initialState.commonData,
        thirdPartyAuthApiStatus: COMPLETE_STATE,
        thirdPartyAuthContext: {
          currentProvider: 'Google',
          ...initialState.commonData.thirdPartyAuthContext,
          pipelineUserDetails: {
            name: 'John Doe',
            email: 'john.doe@example.com',
          },
        },
      },
    });
    store.dispatch = jest.fn(store.dispatch);

    const { container } = render(reduxWrapper(<IntlRegistrationForm />));
    const spinnerElement = container.querySelector('#tpa-spinner');
    const registrationFormElement = container.querySelector('#registration-form');

    expect(spinnerElement).toBeTruthy();
    expect(registrationFormElement).toBeFalsy();
  });

  it('should auto register if autoSubmitRegForm is true and pipeline details are loaded', () => {
    store = mockStore({
      ...initialState,
      commonData: {
        ...initialState.commonData,
        thirdPartyAuthApiStatus: COMPLETE_STATE,
        thirdPartyAuthContext: {
          ...initialState.commonData.thirdPartyAuthContext,
          currentProvider: 'Apple',
          pipelineUserDetails: {
            name: 'John Doe',
            email: 'john.doe@example.com',
          },
        },
      },
    });
    store.dispatch = jest.fn(store.dispatch);
    jest.spyOn(utils, 'default').mockImplementation(() => ({
      isValid: true,
    }));
    render(reduxWrapper(<IntlRegistrationForm />));

    expect(store.dispatch).toHaveBeenCalled();
  });

  it('should show error message if third party Authentication failed on SSO', () => {
    const errorMsg = 'Error: Third party authenticated failed.';
    store = mockStore({
      ...initialState,
      commonData: {
        ...initialState.commonData,
        thirdPartyAuthApiStatus: COMPLETE_STATE,
        thirdPartyAuthContext: {
          ...initialState.commonData.thirdPartyAuthContext,
          pipelineUserDetails: {},
          errorMessage: errorMsg,
        },
      },
    });
    store.dispatch = jest.fn(store.dispatch);

    const { container } = render(reduxWrapper(<IntlRegistrationForm />));

    expect(container.querySelector('#SSO-failure-alert').textContent).toContain(errorMsg);
  });

  it('should check user retention cookie', () => {
    store = mockStore({
      ...initialState,
      register: {
        ...initialState.register,
        registrationResult: {
          success: true,
        },
      },
    });

    render(reduxWrapper(<IntlRegistrationForm />));
    expect(document.cookie).toMatch(`${getConfig().USER_RETENTION_COOKIE_NAME}=true`);
  });
});
