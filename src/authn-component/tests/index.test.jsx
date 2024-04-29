import React from 'react';
import { Provider } from 'react-redux';

import { injectIntl, IntlProvider } from '@edx/frontend-platform/i18n';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import { DEFAULT_STATE } from '../../data/constants';
import { getThirdPartyAuthContext } from '../data/reducers';
import SignUpComponent, { AuthnComponent, SignInComponent } from '../index';

const IntlAuthnComponent = injectIntl(AuthnComponent);
const mockStore = configureStore();

jest.mock('@edx/frontend-platform/react', () => ({
  // eslint-disable-next-line react/prop-types
  AppProvider: ({ children }) => <div>{children}</div>,
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
    it('validates context before making third party auth API call', () => {
      store.dispatch = jest.fn(store.dispatch);

      const contextData = {
        course_id: 'test_course_id',
        enrollment_action: 'enroll',
        email_opt_in: true,
        invalid_key_in_context: 'Splash!!!!',
      };
      // Render the AuthnComponent with context and formToRender props
      render(reduxWrapper(<IntlAuthnComponent isOpen close={() => {}} context={contextData} />));

      // Expect dispatch to have been called with getThirdPartyAuthContext action
      expect(store.dispatch).toHaveBeenCalledWith(getThirdPartyAuthContext({
        course_id: 'test_course_id',
        enrollment_action: 'enroll',
        email_opt_in: true,
      }));
    });
  });
});
