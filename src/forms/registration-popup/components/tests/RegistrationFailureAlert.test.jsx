import React from 'react';
import { Provider } from 'react-redux';

import { mergeConfig } from '@edx/frontend-platform';
import {
  configure, getLocale, injectIntl, IntlProvider,
} from '@edx/frontend-platform/i18n';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import {
  FORBIDDEN_REQUEST, INTERNAL_SERVER_ERROR, TPA_AUTHENTICATION_FAILURE, TPA_SESSION_EXPIRED,
} from '../../../../data/constants';
import { OnboardingComponentContext } from '../../../../data/storeHooks';
import SSOFailureAlert from '../../../common-components/SSOFailureAlert';
import RegistrationPage from '../../index';
import RegistrationFailureAlert from '../RegistrationFailureAlert';

jest.mock('@edx/frontend-platform/i18n', () => ({
  ...jest.requireActual('@edx/frontend-platform/i18n'),
  getLocale: jest.fn(),
  getMessages: jest.fn(),
}));

const IntlRegistrationPage = injectIntl(RegistrationPage);
const IntlRegistrationFailure = injectIntl(RegistrationFailureAlert);
const IntlSSOFailureAlert = injectIntl(SSOFailureAlert);
const mockStore = configureStore();

jest.mock('react-router-dom', () => {
  const mockNavigation = jest.fn();

  // eslint-disable-next-line react/prop-types
  const Navigate = ({ to }) => {
    mockNavigation(to);
    return <div />;
  };

  return {
    ...jest.requireActual('react-router-dom'),
    Navigate,
  };
});

describe('RegistrationFailure', () => {
  mergeConfig({
    PRIVACY_POLICY: 'https://privacy-policy.com',
    TOS_AND_HONOR_CODE: 'https://tos-and-honot-code.com',
    USER_RETENTION_COOKIE_NAME: 'authn-returning-user',
  });

  let props = {};
  let store = {};
  const registrationFormData = {
    configurableFormFields: {
      marketingEmailsOptIn: true,
    },
    formFields: {
      name: '', email: '', username: '', password: '',
    },
    emailSuggestion: {
      suggestion: '', type: '',
    },
    errors: {
      name: '', email: '', username: '', password: '',
    },
  };

  const reduxWrapper = children => (
    <IntlProvider locale="en">
      <Provider context={OnboardingComponentContext} store={store}>{children}</Provider>
    </IntlProvider>
  );

  const routerWrapper = children => (
    <Router>
      {children}
    </Router>
  );

  const thirdPartyAuthContext = {
    currentProvider: null,
    finishAuthUrl: null,
    providers: [],
    secondaryProviders: [],
    pipelineUserDetails: null,
    countryCode: null,
  };

  const initialState = {
    login: {
      isLoginSSOIntent: false,
    },
    register: {
      registrationResult: { success: false, redirectUrl: '' },
      registrationError: {},
      registrationFormData,
      usernameSuggestions: [],
    },
    commonComponents: {
      thirdPartyAuthApiStatus: null,
      thirdPartyAuthContext,
      fieldDescriptions: {},
      optionalFields: {
        fields: {},
        extended_profile: [],
      },
    },
  };

  beforeEach(() => {
    store = mockStore(initialState);
    window.history.replaceState = jest.fn();
    configure({
      loggingService: { logError: jest.fn() },
      config: {
        ENVIRONMENT: 'production',
        LANGUAGE_PREFERENCE_COOKIE_NAME: 'yum',
      },
      messages: { 'es-419': {}, de: {}, 'en-us': {} },
    });
    props = {
      handleInstitutionLogin: jest.fn(),
      institutionLogin: false,
    };
    window.location = { search: '' };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Test Registration Failure', () => {
    getLocale.mockImplementation(() => ('en-us'));

    it('should match internal server error message', () => {
      const expectedMessage = 'An error has occurred. Try refreshing the page, or check your internet connection.';
      props = {
        errorCode: INTERNAL_SERVER_ERROR,
        failureCount: 0,
      };

      const { container } = render(reduxWrapper(<IntlRegistrationFailure {...props} />));

      const alert = container.querySelector('div.alert');
      expect(alert.textContent).toContain(expectedMessage);
    });

    it('should match registration api rate limit error message', () => {
      const expectedMessage = 'Too many failed registration attempts. Try again later.';
      props = {
        errorCode: FORBIDDEN_REQUEST,
        failureCount: 0,
      };

      const { container } = render(reduxWrapper(<IntlRegistrationFailure {...props} />));

      const alert = container.querySelector('div.alert');
      expect(alert.textContent).toContain(expectedMessage);
    });

    it('should match tpa session expired error message', () => {
      const expectedMessage = 'Registration using Google has timed out.';
      props = {
        context: {
          provider: 'Google',
        },
        errorCode: TPA_SESSION_EXPIRED,
        failureCount: 0,
      };

      const { container } = render(reduxWrapper(<IntlRegistrationFailure {...props} />));

      const alert = container.querySelector('div.alert');
      expect(alert.textContent).toContain(expectedMessage);
    });

    it('should match tpa authentication failed error message', () => {
      const expectedMessageSubstring = 'We are sorry, you are not authorized to access';
      props = {
        context: {
          provider: 'Google',
        },
        errorCode: TPA_AUTHENTICATION_FAILURE,
        failureCount: 0,
      };

      const { container } = render(reduxWrapper(<IntlSSOFailureAlert {...props} />));

      const alert = container.querySelector('div.alert');
      expect(alert.textContent).toContain(expectedMessageSubstring);
    });

    it('should display error message based on the error code returned by API', () => {
      store = mockStore({
        ...initialState,
        register: {
          ...initialState.register,
          registrationError: {
            errorCode: INTERNAL_SERVER_ERROR,
          },
        },
        commonData: {
          thirdPartyAuthContext: {
            providers: [],
            currentProvider: 'Google',
          },
        },
      });

      render(routerWrapper(reduxWrapper(<IntlRegistrationPage {...props} />)));
      const validationError = screen.queryByText('An error has occurred. Try refreshing the page, or check your internet connection.');

      expect(validationError).not.toBeNull();
    });
  });
});
