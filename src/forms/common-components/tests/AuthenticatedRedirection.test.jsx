import React from 'react';
import { Provider } from 'react-redux';

import { injectIntl, IntlProvider } from '@edx/frontend-platform/i18n';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import { PROGRESSIVE_PROFILING_FORM } from '../../../data/constants';
import { LINK_TIMEOUT } from '../../../data/segment/utils';
import { OnboardingComponentContext } from '../../../data/storeHooks';
import { setCurrentOpenedForm } from '../../../onboarding-component/data/reducers';
import AuthenticatedRedirection from '../AuthenticatedRedirection';

const mockStore = configureStore();

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(() => ({ LMS_BASE_URL: 'http://example.com' })),
}));

describe('AuthenticatedRedirection', () => {
  const LMS_BASE_URL_MOCK = 'http://example.com';
  const mockFinishAuthUrl = '/finishAuth';
  const mockRedirectUrl = 'http://example.com/redirect';
  const mockSuccess = true;
  const IntlAuthenticatedRedirection = injectIntl(AuthenticatedRedirection);

  let store = {};

  const reduxWrapper = children => (
    <IntlProvider locale="en">
      <MemoryRouter>
        <Provider context={OnboardingComponentContext} store={store}>{children}</Provider>
      </MemoryRouter>
    </IntlProvider>
  );

  const initialState = {
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
    delete window.location;
    window.location = { href: '' };
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('should not redirect if success is false', () => {
    render(reduxWrapper(
      <IntlAuthenticatedRedirection
        finishAuthUrl={mockFinishAuthUrl}
        redirectUrl={mockRedirectUrl}
        success={false}
      />,
    ));

    expect(window.location.href).toBe('');
  });

  it('should redirect to finishAuthUrl if provided and not already included in redirectUrl', () => {
    render(reduxWrapper(
      <IntlAuthenticatedRedirection
        finishAuthUrl={mockFinishAuthUrl}
        redirectUrl={mockRedirectUrl}
        success={mockSuccess}
      />,
    ));

    expect(window.location.href).toBe(`${LMS_BASE_URL_MOCK}${mockFinishAuthUrl}`);
  });

  it('should redirect to redirectUrl if finishAuthUrl is not provided or already included in redirectUrl', () => {
    render(reduxWrapper(
      <IntlAuthenticatedRedirection
        finishAuthUrl={null}
        redirectUrl={mockRedirectUrl + mockFinishAuthUrl} // finishAuthUrl already included
        success={mockSuccess}
      />,
    ));

    expect(window.location.href).toBe(`${mockRedirectUrl + mockFinishAuthUrl}`);
  });

  it('should redirect to progressive profiling if redirectToProgressiveProfilingForm is true', () => {
    store.dispatch = jest.fn(store.dispatch);
    render(reduxWrapper(
      <IntlAuthenticatedRedirection
        finishAuthUrl={null}
        redirectUrl={mockRedirectUrl + mockFinishAuthUrl} // finishAuthUrl already included
        success={mockSuccess}
        redirectToProgressiveProfilingForm
      />,
    ));

    expect(store.dispatch).toHaveBeenCalledWith(setCurrentOpenedForm(PROGRESSIVE_PROFILING_FORM));
  });

  it('should redirect after a delay if isLinkTracked is true', () => {
    render(reduxWrapper(
      <IntlAuthenticatedRedirection
        finishAuthUrl={null}
        redirectUrl={mockRedirectUrl}
        success={mockSuccess}
        isLinkTracked
      />,
    ));

    expect(window.location.href).toBe(''); // Shouldn't redirect immediately

    jest.advanceTimersByTime(LINK_TIMEOUT); // Fast-forward time by LINK_TIMEOUT

    expect(window.location.href).toBe(mockRedirectUrl); // Should have redirected after timeout
  });
});
