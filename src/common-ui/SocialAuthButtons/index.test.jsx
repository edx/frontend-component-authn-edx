import React from 'react';
import { Provider } from 'react-redux';

import { injectIntl, IntlProvider } from '@edx/frontend-platform/i18n';
import { fireEvent, render } from '@testing-library/react';
import configureStore from 'redux-mock-store';

import { COMPLETE_STATE, PENDING_STATE } from '../../data/constants';
import { AuthnContext } from '../../data/storeHooks';

import SocialAuthProviders, { SocialAuthButton } from './index';

jest.mock('@edx/frontend-platform', () => ({
  ...jest.requireActual('@edx/frontend-platform'),
  getConfig: () => ({
    LMS_BASE_URL: 'http://example.com',
  }),
}));

const mockStore = configureStore();

describe('SocialAuthButton', () => {
  let store = {};

  const IntlSocialAuthButton = injectIntl(SocialAuthButton);
  const reduxWrapper = children => (
    <IntlProvider locale="en">
      <Provider context={AuthnContext} store={store}>{children}</Provider>
    </IntlProvider>
  );

  const initialState = {
    register: {
      registrationFields: {},
    },
  };
  beforeEach(() => {
    store = mockStore(initialState);
  });

  const provider = {
    id: 'google',
    name: 'Google',
    loginUrl: '/login/google',
    registerUrl: '/register/google',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default props for Sign In', () => {
    const { getByText } = render(reduxWrapper(
      <IntlSocialAuthButton provider={provider} isLoginForm />,
    ));
    expect(getByText('Sign in with Google')).toBeTruthy();
  });

  it('renders with default props for Sign Up', () => {
    const { getByText } = render(reduxWrapper(
      <IntlSocialAuthButton provider={provider} isLoginForm={false} />,
    ));
    expect(getByText('Sign up with Google')).toBeTruthy();
  });

  it('renders with inverse text color', () => {
    const { container } = render(reduxWrapper(
      <IntlSocialAuthButton provider={provider} isLoginForm inverseTextColor />,
    ));
    const button = container.querySelector('.social-auth-button_google');
    expect(button.getAttribute('class')).toContain('text-white');
  });

  it('calls handleSubmit on button click', () => {
    const { getByText } = render(reduxWrapper(
      <IntlSocialAuthButton provider={provider} isLoginForm />,
    ));

    delete window.location;
    window.location = { href: 'http://base-url.com' };

    const button = getByText('Sign in with Google');
    fireEvent.click(button);

    expect(window.location.href).toEqual('http://example.com/login/google');
  });
});

describe('SocialAuthProviders', () => {
  let store = {};
  const IntlSocialAuthProviders = injectIntl(SocialAuthProviders);

  const reduxWrapper = children => (
    <IntlProvider locale="en">
      <Provider context={AuthnContext} store={store}>{children}</Provider>
    </IntlProvider>
  );

  const initialState = {
    commonData: {
      thirdPartyAuthApiStatus: COMPLETE_STATE,
      thirdPartyAuthContext: {
        providers: [
          {
            id: 'google',
            name: 'Google',
            loginUrl: '/login/google',
            registerUrl: '/register/google',
          },
          {
            id: 'apple',
            name: 'Apple',
            loginUrl: '/login/apple',
            registerUrl: '/register/apple',
          },
          {
            id: 'facebook',
            name: 'Facebook',
            loginUrl: '/login/facebook',
            registerUrl: '/register/facebook',
          },
          {
            id: 'microsoft',
            name: 'Microsoft',
            loginUrl: '/login/microsoft',
            registerUrl: '/register/microsoft',
          },
        ],
      },
    },
    register: {
      registrationFields: {},
    },
  };

  beforeEach(() => {
    store = mockStore(initialState);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders all social auth buttons when thirdPartyAuthContext call is complete', () => {
    const { getByText } = render(reduxWrapper(
      <IntlSocialAuthProviders />,
    ));
    expect(getByText('Sign in with Google')).toBeTruthy();
    expect(getByText('Sign in with Apple')).toBeTruthy();
    expect(getByText('Sign in with Facebook')).toBeTruthy();
    expect(getByText('Sign in with Microsoft')).toBeTruthy();
  });

  it('does not render social auth buttons when thirdPartyAuthContext call is pending', () => {
    store = mockStore({
      ...initialState,
      commonData: {
        ...initialState.commonData,
        thirdPartyAuthApiStatus: PENDING_STATE,
      },
    });

    const { container } = render(reduxWrapper(
      <IntlSocialAuthProviders />,
    ));

    expect(container.querySelector('.react-loading-skeleton')).toBeTruthy();
  });
});
