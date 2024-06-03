import React from 'react';

import { mergeConfig } from '@edx/frontend-platform';
import { injectIntl, IntlProvider } from '@edx/frontend-platform/i18n';
import {
  render, screen,
} from '@testing-library/react';

import LoginFailureAlert from './LoginFailureAlert';
import {
  FORBIDDEN_REQUEST,
  INTERNAL_SERVER_ERROR,
  INVALID_FORM,
  TPA_AUTHENTICATION_FAILURE,
} from '../../../data/constants';
import SSOFailureAlert from '../../common-components/SSOFailureAlert';
import {
  ACCOUNT_LOCKED_OUT,
  ALLOWED_DOMAIN_LOGIN_ERROR,
  FAILED_LOGIN_ATTEMPT,
  INACTIVE_USER,
  INCORRECT_EMAIL_PASSWORD,
  NON_COMPLIANT_PASSWORD_EXCEPTION,
} from '../data/constants';

const IntlLoginFailureAlert = injectIntl(LoginFailureAlert);
const IntlSSOFailureAlert = injectIntl(SSOFailureAlert);

describe('LoginFailureAlert', () => {
  let props = {};

  it('should not render error message if errorCode is not available', () => {
    props = {
      errorCode: '',
    };

    const { container } = render(
      <IntlProvider locale="en">
        <IntlLoginFailureAlert {...props} />
      </IntlProvider>,
    );

    expect(container.querySelector('#login-failure-alert')).toBeFalsy();
  });

  it('should match non compliant password error message', () => {
    props = {
      errorCode: NON_COMPLIANT_PASSWORD_EXCEPTION,
    };

    const { container } = render(
      <IntlProvider locale="en">
        <IntlLoginFailureAlert {...props} />
      </IntlProvider>,
    );

    const expectedMessage = 'We couldn\'t sign you in. We recently changed our password requirements'
                            + 'Your current password does not meet the new security requirements. We just sent a '
                            + 'password-reset message to the email address associated with this account. '
                            + 'Thank you for helping us keep your data safe.';

    expect(container.querySelector('#login-failure-alert').textContent).toBe(expectedMessage);
  });

  it('should match inactive user error message', () => {
    props = {
      context: {
        email: 'text@example.com',
        platformName: 'edX',
        supportLink: 'http://support.edx.org',
      },
      errorCode: INACTIVE_USER,
    };

    const { container } = render(
      <IntlProvider locale="en">
        <IntlLoginFailureAlert {...props} />
      </IntlProvider>,
    );

    const expectedMessage = 'We couldn\'t sign you in. In order to sign in, you need to activate your account.'
                            + 'We just sent an activation link to text@example.com. If you do not receive an email, '
                            + 'check your spam folders or contact edX support.';

    expect(container.querySelector('#login-failure-alert').textContent).toBe(expectedMessage);

    expect(screen.getByRole('link', { name: 'contact edX support' }).getAttribute('href')).toBe('http://support.edx.org');
  });

  it('test match failed login attempt error', () => {
    props = {
      context: {
        email: 'text@example.com',
        remainingAttempts: 3,
        resetLink: '/reset',
      },
      errorCode: FAILED_LOGIN_ATTEMPT,
    };

    const { container } = render(
      <IntlProvider locale="en">
        <IntlLoginFailureAlert {...props} />
      </IntlProvider>,
    );

    const expectedMessage = 'We couldn\'t sign you in. The username, email or password you entered is incorrect. '
                            + 'You have 3 more sign in attempts before your account is temporarily locked.If you\'ve forgotten your password, click here to reset it.';

    expect(container.querySelector('#login-failure-alert').textContent).toBe(expectedMessage);
  });

  it('test match failed login error first attempt', () => {
    props = {
      context: {
        email: 'text@example.com',
        failureCount: 1,
        resetLink: '/reset',
      },
      errorCode: INCORRECT_EMAIL_PASSWORD,
    };

    const { container } = render(
      <IntlProvider locale="en">
        <IntlLoginFailureAlert {...props} />
      </IntlProvider>,
    );

    const expectedMessage = 'We couldn\'t sign you in. The username, email, or password you entered is incorrect. Please try again.';

    expect(container.querySelector('#login-failure-alert').textContent).toBe(expectedMessage);
  });

  it('test match user account locked out', () => {
    props = {
      errorCode: ACCOUNT_LOCKED_OUT,
    };

    const { container } = render(
      <IntlProvider locale="en">
        <IntlLoginFailureAlert {...props} />
      </IntlProvider>,
    );

    const expectedMessage = 'We couldn\'t sign you in. To protect your account, it\'s been temporarily locked. Try again in 30 minutes.To be on the safe side, you can reset your password before trying again.';
    expect(container.querySelector('#login-failure-alert').textContent).toBe(expectedMessage);
  });

  it('test match failed login error second attempt', () => {
    props = {
      context: {
        email: 'text@example.com',
        failureCount: 2,
        resetLink: '/reset',
      },
      errorCode: INCORRECT_EMAIL_PASSWORD,
    };

    const { container } = render(
      <IntlProvider locale="en">
        <IntlLoginFailureAlert {...props} />
      </IntlProvider>,
    );

    const expectedMessage = 'We couldn\'t sign you in. The username, email, or password you entered is incorrect. Please try again or reset your password.';

    expect(container.querySelector('#login-failure-alert').textContent).toBe(expectedMessage);
  });

  it('should match rate limit error message', () => {
    props = {
      errorCode: FORBIDDEN_REQUEST,
    };

    const { container } = render(
      <IntlProvider locale="en">
        <IntlLoginFailureAlert {...props} />
      </IntlProvider>,
    );

    const expectedMessage = 'We couldn\'t sign you in. Too many failed login attempts. Try again later.';

    expect(container.querySelector('#login-failure-alert').textContent).toBe(expectedMessage);
  });

  it('should match internal server error message', () => {
    props = {
      errorCode: INTERNAL_SERVER_ERROR,
    };

    const { container } = render(
      <IntlProvider locale="en">
        <IntlLoginFailureAlert {...props} />
      </IntlProvider>,
    );

    const expectedMessage = 'We couldn\'t sign you in. An error has occurred. Try refreshing the page, or check your internet connection.';

    expect(container.querySelector('#login-failure-alert').textContent).toBe(expectedMessage);
  });

  it('should match invalid form error message', () => {
    props = {
      errorCode: INVALID_FORM,
    };

    const { container } = render(
      <IntlProvider locale="en">
        <IntlLoginFailureAlert {...props} />
      </IntlProvider>,
    );

    const expectedMessage = 'We couldn\'t sign you in. Please fill in the fields below.';
    expect(container.querySelector('#login-failure-alert').textContent).toBe(expectedMessage);
  });

  it('should show message if staff user try to login through password', () => {
    mergeConfig({
      LMS_BASE_URL: 'http://localhost:18000',
    });

    props = {
      context: {
        email: 'text@example.com',
        allowedDomain: 'test.com',
        provider: 'Google',
        tpaHint: 'google-auth2',
      },
      errorCode: ALLOWED_DOMAIN_LOGIN_ERROR,
    };

    const { container } = render(
      <IntlProvider locale="en">
        <IntlLoginFailureAlert {...props} />
      </IntlProvider>,
    );

    const errorMessage = "We couldn't sign you in. As test.com user, You must login with your test.com Google account.";
    const url = 'http://localhost:18000/dashboard/?tpa_hint=google-auth2';

    expect(container.querySelector('#login-failure-alert').textContent).toContain(errorMessage);

    expect(screen.getByRole('link', { name: 'Google account' }).getAttribute('href')).toBe(url);
  });

  it('should show error message if third party authentication failed', () => {
    const lmsBaseUrl = 'http://example.com';
    const platformName = 'edX';
    const errorMsg = 'Error: Third party authenticated failed.';

    mergeConfig({
      LMS_BASE_URL: lmsBaseUrl,
      SITE_NAME: platformName,
    });

    props = {
      context: {
        errorMessage: errorMsg,
      },
      errorCode: TPA_AUTHENTICATION_FAILURE,
    };

    const { container } = render(
      <IntlProvider locale="en">
        <IntlSSOFailureAlert {...props} />
      </IntlProvider>,
    );

    expect(container.querySelector('#SSO-failure-alert').textContent).toContain(errorMsg);
  });
});
