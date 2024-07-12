import React from 'react';
import { Provider } from 'react-redux';

import { mergeConfig } from '@edx/frontend-platform';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { getLocale, injectIntl, IntlProvider } from '@edx/frontend-platform/i18n';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import {
  COMPLETE_STATE,
  DEFAULT_STATE,
  ENTERPRISE_LOGIN,
  FORGOT_PASSWORD_FORM,
  LOGIN_FORM,
  PENDING_STATE,
  PROGRESSIVE_PROFILING_FORM,
  REGISTRATION_FORM,
} from '../../data/constants';
import { OnboardingComponentContext } from '../../data/storeHooks';
import { getThirdPartyAuthContext, setCurrentOpenedForm } from '../data/reducers';
import { OnBoardingComponent, SignInComponent, SignUpComponent } from '../index';

const IntlOnBoardingComponent = injectIntl(OnBoardingComponent);
const mockStore = configureStore();

jest.mock('@edx/frontend-platform/react', () => ({
  // eslint-disable-next-line react/prop-types
  AppProvider: ({ children }) => <div>{children}</div>,
}));
jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedUser: jest.fn(),
}));
jest.mock('@edx/frontend-platform/analytics', () => ({
  sendTrackEvent: jest.fn(),
  sendPageEvent: jest.fn(),
}));
jest.mock('@edx/frontend-platform/i18n', () => ({
  ...jest.requireActual('@edx/frontend-platform/i18n'),
  getLocale: jest.fn(),
  getMessages: jest.fn(),
}));

describe('OnBoardingComponent Test', () => {
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
      loginFormData: {
        formFields: {
          emailOrUsername: '', password: '',
        },
        errors: {
          emailOrUsername: '', password: '',
        },
      },
    },
    register: {
      submitState: DEFAULT_STATE,
      registrationError: {},
      registrationResult: { success: false, redirectUrl: '' },
      registrationFormData: {
        formFields: {
          isFormFilled: true,
          name: '',
          email: '',
          password: '',
          marketingEmailsOptIn: true,
        },
        errors: {
          name: '', email: '', password: '',
        },
      },
    },
    forgotPassword: {
      status: DEFAULT_STATE,
      forgotPasswordFormData: {
        email: '',
        error: '',
      },
    },
    commonData: {
      thirdPartyAuthContext: {
        finishAuthUrl: null,
        providers: [],
        secondaryProviders: [],
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
      INFO_EMAIL: process.env.INFO_EMAIL,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('SignInComponent', () => {
    const IntlSignInComponent = injectIntl(SignInComponent);
    beforeEach(() => {
      store = mockStore({
        ...initialState,
        commonData: {
          ...initialState.commonData,
          currentForm: LOGIN_FORM,
        },
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('renders login form when rendering SignInComponent', () => {
      // It also tests that component is rendered only when isOpen is true
      const { getByTestId } = render(reduxWrapper(
        <IntlSignInComponent isOpen close={() => {}} />,
      ));
      expect(getByTestId('sign-in-heading')).toBeTruthy();
    });

    it('does not render when isOpen is false', () => {
      const { queryByTestId } = render(reduxWrapper(
        <IntlSignInComponent isOpen={false} close={() => {}} />,
      ));
      expect(queryByTestId('sign-in-heading')).toBeFalsy();
    });
  });

  describe('SignUpComponent', () => {
    const IntlSignUpComponent = injectIntl(SignUpComponent);

    beforeEach(() => {
      store = mockStore({
        ...initialState,
        commonData: {
          ...initialState.commonData,
          currentForm: REGISTRATION_FORM,
        },
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('renders registration form when rendering SignUpComponent', () => {
      // It also tests that component is rendered only when isOpen is true
      const { getByTestId } = render(reduxWrapper(
        <IntlSignUpComponent isOpen close={() => {}} />,
      ));
      expect(getByTestId('sign-up-heading')).toBeTruthy();
    });

    it('does not render when isOpen is false', () => {
      const { queryByTestId } = render(reduxWrapper(
        <IntlSignUpComponent isOpen={false} close={() => {}} />,
      ));
      expect(queryByTestId('sign-up-heading')).toBeFalsy();
    });
  });

  describe('OnBoardingComponent', () => {
    it('sets currentForm in commonData from formToRender prop', () => {
      store.dispatch = jest.fn(store.dispatch);

      // Render the OnBoardingComponent with context and formToRender props
      render(reduxWrapper(<IntlOnBoardingComponent isOpen close={() => {}} formToRender={LOGIN_FORM} />));

      expect(store.dispatch).toHaveBeenCalledWith(setCurrentOpenedForm(LOGIN_FORM));
    });

    it('validates context before making third party auth API call', () => {
      store.dispatch = jest.fn(store.dispatch);

      const contextData = {
        course_id: 'test_course_id',
        enrollment_action: 'enroll',
        email_opt_in: true,
        invalid_key_in_context: 'Splash!!!!',
      };
      // Render the OnBoardingComponent with context
      render(reduxWrapper(<IntlOnBoardingComponent isOpen close={() => {}} context={contextData} />));

      // Expect dispatch to have been called with getThirdPartyAuthContext action
      expect(store.dispatch).toHaveBeenCalledWith(getThirdPartyAuthContext({
        course_id: 'test_course_id',
        enrollment_action: 'enroll',
        email_opt_in: true,
      }));
    });

    it('renders LOGIN_FORM form if currentForm=LOGIN_FORM', () => {
      store = mockStore({
        ...initialState,
        commonData: {
          ...initialState.commonData,
          currentForm: LOGIN_FORM,
        },
      });
      const { getByTestId } = render(reduxWrapper(
        <IntlOnBoardingComponent isOpen close={() => {}} />,
      ));

      expect(getByTestId('sign-in-heading')).toBeTruthy();
    });

    it('renders REGISTRATION_FORM form if currentForm=REGISTRATION_FORM', () => {
      store = mockStore({
        ...initialState,
        commonData: {
          ...initialState.commonData,
          currentForm: REGISTRATION_FORM,
        },
      });
      const { getByTestId } = render(reduxWrapper(
        <IntlOnBoardingComponent isOpen close={() => {}} />,
      ));

      expect(getByTestId('sign-up-heading')).toBeTruthy();
    });

    it('renders PROGRESSIVE_PROFILING_FORM form if currentForm=PROGRESSIVE_PROFILING_FORM', () => {
      getLocale.mockImplementation(() => ('en-us'));
      getAuthenticatedUser.mockReturnValue({ userId: 3, username: 'abc123', name: 'Test User' });

      store = mockStore({
        ...initialState,
        commonData: {
          ...initialState.commonData,
          currentForm: PROGRESSIVE_PROFILING_FORM,
        },
        progressiveProfiling: {
          submitState: DEFAULT_STATE,
          subjectsList: {
            options: [
              { label: 'Computer' },
              { label: 'Science' },
            ],
          },
        },
      });
      const { container, getByTestId } = render(reduxWrapper(
        <IntlOnBoardingComponent isOpen close={() => {}} />,
      ));
      const closeButton = container.querySelector('.btn-icon__icon');

      expect(closeButton).toBeFalsy();
      expect(getByTestId('progressive-profiling-heading')).toBeTruthy();
    });

    it('renders FORGOT_PASSWORD_FORM form if currentForm=FORGOT_PASSWORD_FORM', () => {
      store = mockStore({
        ...initialState,
        commonData: {
          ...initialState.commonData,
          currentForm: FORGOT_PASSWORD_FORM,
        },
      });
      const { getByTestId } = render(reduxWrapper(
        <IntlOnBoardingComponent isOpen close={() => {}} />,
      ));

      expect(getByTestId('forgot-password-heading')).toBeTruthy();
    });
  });

  it('should render EnterpriseSSO button on the base of provided tpa_hint param', () => {
    const appleProvider = {
      id: 'oa2-apple-id',
      name: 'Apple',
      loginUrl: '/auth/login/apple-id/',
      registerUrl: '/auth/login/apple-id/',
    };
    store = mockStore({
      ...initialState,
      commonData: {
        ...initialState.commonData,
        thirdPartyAuthApiStatus: COMPLETE_STATE,
        currentForm: ENTERPRISE_LOGIN,
        thirdPartyAuthContext: {
          ...initialState.commonData.thirdPartyAuthContext,
          providers: [appleProvider],
        },
      },
    });

    delete window.location;
    window.location = { href: 'localhost:2999/login', search: `?tpa_hint=${appleProvider.id}` };
    const { getByText } = render(reduxWrapper(<IntlOnBoardingComponent isOpen close={() => {}} />));

    expect(getByText(`Sign in with ${appleProvider.name}`)).toBeTruthy();
  });

  it('should render Spinner if tpa_hint query param is available and TPA request is pending', () => {
    store = mockStore({
      ...initialState,
      commonData: {
        ...initialState.commonData,
        thirdPartyAuthApiStatus: PENDING_STATE,
      },
    });

    delete window.location;
    window.location = { href: 'localhost:2999/login', search: '?tpa_hint=oa2-apple-id' };
    const { getByTestId } = render(reduxWrapper(<IntlOnBoardingComponent isOpen close={() => {}} />));
    expect(getByTestId('tpa-spinner')).toBeTruthy();
  });
});
