import React from 'react';
import { Provider } from 'react-redux';

import { getLocale, injectIntl, IntlProvider } from '@edx/frontend-platform/i18n';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import {
  DEFAULT_STATE, FORGOT_PASSWORD_FORM, LOGIN_FORM, PROGRESSIVE_PROFILING_FORM, REGISTRATION_FORM,
} from '../../data/constants';
import { getThirdPartyAuthContext, setCurrentOpenedForm } from '../data/reducers';
import SignUpComponent, { AuthnComponent, SignInComponent } from '../index';

const IntlAuthnComponent = injectIntl(AuthnComponent);
const mockStore = configureStore();

jest.mock('@edx/frontend-platform/react', () => ({
  // eslint-disable-next-line react/prop-types
  AppProvider: ({ children }) => <div>{children}</div>,
}));
jest.mock('@edx/frontend-platform/i18n', () => ({
  ...jest.requireActual('@edx/frontend-platform/i18n'),
  getLocale: jest.fn(),
}));

describe('AuthnComponent Test', () => {
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
    register: {
      submitState: DEFAULT_STATE,
      registrationError: {},
      registrationResult: { success: false, redirectUrl: '' },
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

  describe('SignInComponent', () => {
    beforeEach(() => {
      store = mockStore({
        ...initialState,
        commonData: {
          ...initialState.commonData,
          currentForm: LOGIN_FORM,
        },
      });
    });

    it('renders login form when rendering SignInComponent', () => {
      // It also tests that component is rendered only when isOpen is true
      const { getByTestId } = render(reduxWrapper(
        <SignInComponent isOpen close={() => {}} />,
      ));
      expect(getByTestId('sign-in-heading')).toBeTruthy();
    });

    it('does not render when isOpen is false', () => {
      const { queryByTestId } = render(reduxWrapper(
        <SignInComponent isOpen={false} close={() => {}} />,
      ));
      expect(queryByTestId('sign-in-heading')).toBeFalsy();
    });
  });

  describe('SignUpComponent', () => {
    beforeEach(() => {
      store = mockStore({
        ...initialState,
        commonData: {
          ...initialState.commonData,
          currentForm: REGISTRATION_FORM,
        },
      });
    });

    it('renders registration form when rendering SignUpComponent', () => {
      // It also tests that component is rendered only when isOpen is true
      const { getByTestId } = render(reduxWrapper(
        <SignUpComponent isOpen close={() => {}} />,
      ));
      expect(getByTestId('sign-up-heading')).toBeTruthy();
    });

    it('does not render when isOpen is false', () => {
      const { queryByTestId } = render(reduxWrapper(
        <SignUpComponent isOpen={false} close={() => {}} />,
      ));
      expect(queryByTestId('sign-up-heading')).toBeFalsy();
    });
  });

  describe('AuthnComponent', () => {
    it('sets currentForm in commonData from formToRender prop', () => {
      store.dispatch = jest.fn(store.dispatch);

      // Render the AuthnComponent with context and formToRender props
      render(reduxWrapper(<IntlAuthnComponent isOpen close={() => {}} formToRender={LOGIN_FORM} />));

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
      // Render the AuthnComponent with context
      render(reduxWrapper(<IntlAuthnComponent isOpen close={() => {}} context={contextData} />));

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
        <IntlAuthnComponent isOpen close={() => {}} />,
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
        <IntlAuthnComponent isOpen close={() => {}} />,
      ));

      expect(getByTestId('sign-up-heading')).toBeTruthy();
    });

    // TODO: this test will be fixed when progressive profiling form is fixed.
    it.skip('renders PROGRESSIVE_PROFILING_FORM form if currentForm=PROGRESSIVE_PROFILING_FORM', () => {
      getLocale.mockImplementation(() => ('en-us'));
      store = mockStore({
        ...initialState,
        commonData: {
          ...initialState.commonData,
          currentForm: PROGRESSIVE_PROFILING_FORM,
        },
      });
      const { getByTestId } = render(reduxWrapper(
        <IntlAuthnComponent isOpen close={() => {}} />,
      ));

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
        <IntlAuthnComponent isOpen close={() => {}} />,
      ));

      expect(getByTestId('forgot-password-heading')).toBeTruthy();
    });
  });
});
