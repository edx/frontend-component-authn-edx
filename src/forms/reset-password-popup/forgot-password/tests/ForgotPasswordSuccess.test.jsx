import React from 'react';

import { mergeConfig } from '@edx/frontend-platform';
import { injectIntl, IntlProvider } from '@edx/frontend-platform/i18n';
import { render } from '@testing-library/react';

import ForgotPasswordSuccess from '../ForgotPasswordSuccess';

const IntlForgotPasswordSuccess = injectIntl(ForgotPasswordSuccess);

describe('ForgotPasswordFailureAlert Component', () => {
  let props = {};

  it('renders success message with provided email', () => {
    mergeConfig({
      INFO_EMAIL: 'info@edx.org',
    });
    props = {
      email: 'test@example.com',
    };
    const { container } = render(
      <IntlProvider locale="en">
        <IntlForgotPasswordSuccess {...props} />
      </IntlProvider>,
    );

    const expectedMessage = 'Email has been sentWe sent an email to test@example.com '
    + 'with instructions to reset your password. If you do not receive a password reset '
    + 'message after 1 minute, verify that you entered the correct email address, or '
    + 'check your spam folder. If you need further assistance, '
    + 'visit Help Center.';
    expect(container.querySelector('#forgot-password-success-msg').textContent).toBe(expectedMessage);
  });
});
