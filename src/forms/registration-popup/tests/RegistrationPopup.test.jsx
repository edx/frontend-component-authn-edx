import React from 'react';
import { Provider } from 'react-redux';

import { getConfig, mergeConfig } from '@edx/frontend-platform';
import { injectIntl, IntlProvider } from '@edx/frontend-platform/i18n';
import { fireEvent, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import { setCurrentOpenedForm } from '../../../authn-component/data/reducers';
import {
  COMPLETE_STATE, DEFAULT_STATE, LOGIN_FORM,
} from '../../../data/constants';
import { registerUser, setUserPipelineDataLoaded } from '../data/reducers';
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
      honor_code: true,
      terms_of_service: true,
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

  it('should show spinner instead of form while registering if autoSubmitRegForm is true', () => {
    store = mockStore({
      ...initialState,
      register: {
        ...initialState.register,
        userPipelineDataLoaded: false,
      },
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
          autoSubmitRegForm: true,
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

  it('should load pipeline user details into form is autoSubmitRegForm is true', () => {
    store = mockStore({
      ...initialState,
      register: {
        ...initialState.register,
        userPipelineDataLoaded: false,
      },
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
          autoSubmitRegForm: true,
        },
      },
    });
    store.dispatch = jest.fn(store.dispatch);

    render(reduxWrapper(<IntlRegistrationForm />));

    expect(store.dispatch).toHaveBeenCalledWith(setUserPipelineDataLoaded(true));
  });

  it('should auto register if autoSubmitRegForm is true and pipeline details are loaded', () => {
    store = mockStore({
      ...initialState,
      register: {
        ...initialState.register,
        userPipelineDataLoaded: true,
      },
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
          autoSubmitRegForm: true,
        },
      },
    });
    store.dispatch = jest.fn(store.dispatch);

    render(reduxWrapper(<IntlRegistrationForm />));

    expect(store.dispatch).toHaveBeenCalled();
  });

  it('should show error message if third party Authentication failed on SSO', () => {
    const errorMsg = 'Error: Third party authenticated failed.';
    store = mockStore({
      ...initialState,
      register: {
        ...initialState.register,
        userPipelineDataLoaded: false,
      },
      commonData: {
        ...initialState.commonData,
        thirdPartyAuthApiStatus: COMPLETE_STATE,
        thirdPartyAuthContext: {
          ...initialState.commonData.thirdPartyAuthContext,
          pipelineUserDetails: {},
          autoSubmitRegForm: true,
          errorMessage: errorMsg,
        },
      },
    });
    store.dispatch = jest.fn(store.dispatch);

    const { container } = render(reduxWrapper(<IntlRegistrationForm />));

    expect(container.querySelector('#registration-failure-alert').textContent).toContain(errorMsg);
  });
});
