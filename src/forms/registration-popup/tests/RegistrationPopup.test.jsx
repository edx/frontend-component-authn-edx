import React from 'react';
import { Provider } from 'react-redux';

import { injectIntl, IntlProvider } from '@edx/frontend-platform/i18n';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

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

  beforeEach(() => {
    store = mockStore({});
  });

  // ******** test registration form elements ********
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
});
