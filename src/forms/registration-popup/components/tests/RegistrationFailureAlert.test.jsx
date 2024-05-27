import React from 'react';

import { mergeConfig } from '@edx/frontend-platform';
import { injectIntl, IntlProvider } from '@edx/frontend-platform/i18n';
import { render } from '@testing-library/react';

import { INTERNAL_SERVER_ERROR, TPA_AUTHENTICATION_FAILURE, TPA_SESSION_EXPIRED } from '../../../../data/constants';
import RegistrationFailureAlert from '../RegistrationFailureAlert';

const IntlRegistrationFailureAlert = injectIntl(RegistrationFailureAlert);

describe('RegistrationFailureAlert tests', () => {
  let props = {};

  it('should not render error message if errorCode is not available', () => {
    props = {
      errorCode: '',
    };

    const { container } = render(
      <IntlProvider locale="en">
        <IntlRegistrationFailureAlert {...props} />
      </IntlProvider>,
    );

    expect(container.querySelector('#registration-failure-alert')).toBeFalsy();
  });

  it('should match internal server error message', () => {
    props = {
      errorCode: INTERNAL_SERVER_ERROR,
    };

    const { container } = render(
      <IntlProvider locale="en">
        <IntlRegistrationFailureAlert {...props} />
      </IntlProvider>,
    );

    const expectedMessage = 'We couldn\'t create your account. An error has occurred. '
        + 'Try refreshing the page, or check your internet connection.';

    expect(container.querySelector('#registration-failure-alert').textContent).toBe(expectedMessage);
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
        <IntlRegistrationFailureAlert {...props} />
      </IntlProvider>,
    );

    expect(container.querySelector('#registration-failure-alert').textContent).toContain(errorMsg);
  });

  it('should match tpa session expired error message', () => {
    props = {
      context: {
        provider: 'Google',
      },
      errorCode: TPA_SESSION_EXPIRED,
      failureCount: 0,
    };
    const errorMsg = 'We couldn\'t create your account. Registration using Google has timed out.';

    const { container } = render(
      <IntlProvider locale="en">
        <IntlRegistrationFailureAlert {...props} />
      </IntlProvider>,
    );

    expect(container.querySelector('#registration-failure-alert').textContent).toContain(errorMsg);
  });
});
