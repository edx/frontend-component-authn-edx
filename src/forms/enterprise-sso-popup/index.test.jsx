import React from 'react';
import { Provider } from 'react-redux';

import { injectIntl, IntlProvider } from '@edx/frontend-platform/i18n';
import { fireEvent, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import { LOGIN_FORM } from '../../data/constants';
import { OnboardingComponentContext } from '../../data/storeHooks';
import { setCurrentOpenedForm } from '../../onboarding-component/data/reducers';

import EnterpriseSSO from './index';

const IntlEnterpriseSSO = injectIntl(EnterpriseSSO);
const mockStore = configureStore();

describe('EnterpriseSSO', () => {
  let provider = null;
  const initialState = {
    register: {
      registrationFields: {},
    },
  };
  const store = mockStore(initialState);

  const reduxWrapper = children => (
    <IntlProvider locale="en">
      <MemoryRouter>
        <Provider context={OnboardingComponentContext} store={store}>{children}</Provider>
      </MemoryRouter>
    </IntlProvider>
  );

  it('renders Google TPA for Sign In with black text', () => {
    provider = {
      id: 'oa2-google-oauth2',
      name: 'Google',
      loginUrl: '/auth/login/google-oauth2',
      registerUrl: '/auth/login/google-oauth2',
    };
    const { container, getByText } = render(reduxWrapper(
      <IntlEnterpriseSSO provider={provider} />,
    ));
    expect(getByText('Sign in with Google')).toBeTruthy();
    const button = container.querySelector('.social-auth-button_google');
    expect(button.getAttribute('class')).toContain('text-black-50');
  });

  it('renders Apple TPA for Sign in with white text', () => {
    provider = {
      id: 'oa2-apple-id',
      name: 'Apple',
      loginUrl: '/auth/login/oa2-apple-id',
      registerUrl: '/auth/login/oa2-apple-id',
    };
    const { container, getByText } = render(reduxWrapper(
      <IntlEnterpriseSSO provider={provider} />,
    ));
    expect(getByText('Sign in with Apple')).toBeTruthy();
    const button = container.querySelector('.social-auth-button_apple');
    expect(button.getAttribute('class')).toContain('text-white');
  });

  it('renders SAML provider for Sign in with black text', () => {
    provider = {
      id: 'saml-id',
      name: 'SAML',
      loginUrl: '/auth/login/saml-id',
      registerUrl: '/auth/login/saml-id',
    };
    const { container, getByText } = render(reduxWrapper(
      <IntlEnterpriseSSO provider={provider} isLoginForm />,
    ));
    expect(getByText('Sign in with SAML')).toBeTruthy();
    expect(getByText('Show me other ways to sign in or register')).toBeTruthy();
    const SsoButton = container.querySelector(`#${provider.id}`);
    expect(SsoButton.getAttribute('class')).toContain('text-black-50');
  });

  it('should dispatch setCurrentOpenedForm action on "Show me other ways to sign in or register" button click', () => {
    store.dispatch = jest.fn(store.dispatch);
    const { container } = render(reduxWrapper(
      <IntlEnterpriseSSO provider={provider} isLoginForm />,
    ));
    const button = container.querySelector('#other-ways-to-sign-in');
    fireEvent.click(button);

    expect(store.dispatch).toHaveBeenCalledWith(setCurrentOpenedForm(LOGIN_FORM));
  });

  it('should prevent default behavior on mouse down for "Show me other ways to sign in or register" button', () => {
    const { container } = render(reduxWrapper(<IntlEnterpriseSSO provider={provider} isLoginForm />));

    const button = container.querySelector('#other-ways-to-sign-in');

    const preventDefaultMock = jest.fn();
    button.onmousedown = preventDefaultMock;
    fireEvent.mouseDown(button);
    expect(preventDefaultMock).toHaveBeenCalledTimes(1);
  });
});
