import React from 'react';
import { Provider } from 'react-redux';

import { IntlProvider } from '@edx/frontend-platform/i18n';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import { setCurrentOpenedForm } from '../../../authn-component/data/reducers';
import { PROGRESSIVE_PROFILING_FORM } from '../../../data/constants';
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

  let store = {};

  const reduxWrapper = children => (
    <IntlProvider locale="en">
      <MemoryRouter>
        <Provider store={store}>{children}</Provider>
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
  });

  it('should not redirect if success is false', () => {
    render(reduxWrapper(
      <AuthenticatedRedirection
        finishAuthUrl={mockFinishAuthUrl}
        redirectUrl={mockRedirectUrl}
        success={false}
      />,
    ));

    expect(window.location.href).toBe('');
  });

  it('should redirect to finishAuthUrl if provided and not already included in redirectUrl', () => {
    render(reduxWrapper(
      <AuthenticatedRedirection
        finishAuthUrl={mockFinishAuthUrl}
        redirectUrl={mockRedirectUrl}
        success={mockSuccess}
      />,
    ));

    expect(window.location.href).toBe(`${LMS_BASE_URL_MOCK}${mockFinishAuthUrl}`);
  });

  it('should redirect to redirectUrl if finishAuthUrl is not provided or already included in redirectUrl', () => {
    render(reduxWrapper(
      <AuthenticatedRedirection
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
      <AuthenticatedRedirection
        finishAuthUrl={null}
        redirectUrl={mockRedirectUrl + mockFinishAuthUrl} // finishAuthUrl already included
        success={mockSuccess}
        redirectToProgressiveProfilingForm
      />,
    ));

    expect(store.dispatch).toHaveBeenCalledWith(setCurrentOpenedForm(PROGRESSIVE_PROFILING_FORM));
  });
});
