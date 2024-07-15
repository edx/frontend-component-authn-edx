import React from 'react';

import { injectIntl, IntlProvider } from '@edx/frontend-platform/i18n';
import { render } from '@testing-library/react';

import { FORBIDDEN_STATE, INTERNAL_SERVER_ERROR } from '../../../../data/constants';
import messages from '../../messages';
import { PASSWORD_RESET } from '../../reset-password/data/constants';
import ForgotPasswordFailureAlert from '../ForgotPasswordFailureAlert';

const IntlForgotPasswordFailureAlert = injectIntl(ForgotPasswordFailureAlert);

describe('ForgotPasswordFailureAlert', () => {
  let props = {};

  it('should not render error message if status is not available', () => {
    props = {
      status: '',
      emailError: '',
    };

    const { container } = render(
      <IntlProvider locale="en">
        <IntlForgotPasswordFailureAlert {...props} />
      </IntlProvider>,
    );
    expect(container.querySelector('#forgot-password-failure-alert')).toBeFalsy();
  });

  it('should match internal server error message', () => {
    props = {
      status: INTERNAL_SERVER_ERROR,
      emailError: '',
    };

    const { container } = render(
      <IntlProvider locale="en">
        <IntlForgotPasswordFailureAlert {...props} />
      </IntlProvider>,
    );

    const expectedMessage = messages.forgotPasswordInternalServerError.defaultMessage;

    expect(container.querySelector('#forgot-password-failure-alert').textContent).toBe(expectedMessage);
  });

  it('should match rate limit error message', () => {
    props = {
      status: FORBIDDEN_STATE,
      emailError: '',
    };

    const { container } = render(
      <IntlProvider locale="en">
        <IntlForgotPasswordFailureAlert {...props} />
      </IntlProvider>,
    );

    const expectedMessage = messages.forgotPasswordRequestInProgressMessage.defaultMessage;

    expect(container.querySelector('#forgot-password-failure-alert').textContent).toBe(expectedMessage);
  });

  it('should render empty email field error message', () => {
    props = {
      emailError: 'Email is required',
      status: '',
    };

    const { container } = render(
      <IntlProvider locale="en">
        <IntlForgotPasswordFailureAlert {...props} />
      </IntlProvider>,
    );

    const expectedMessage = messages.forgotPasswordExtendFieldErrors.defaultMessage.replace('{emailError}', 'Email is required');

    expect(container.querySelector('#forgot-password-failure-alert').textContent).toBe(expectedMessage);
  });

  it('should render invalid email field error message', () => {
    props = {
      emailError: 'Enter a valid email address',
      status: '',
    };

    const { container } = render(
      <IntlProvider locale="en">
        <IntlForgotPasswordFailureAlert {...props} />
      </IntlProvider>,
    );

    const expectedMessage = messages.forgotPasswordExtendFieldErrors.defaultMessage.replace('{emailError}', 'Enter a valid email address');

    expect(container.querySelector('#forgot-password-failure-alert').textContent).toBe(expectedMessage);
  });

  it('should match invalid token error message', () => {
    props = {
      status: PASSWORD_RESET.INVALID_TOKEN,
      emailError: '',
    };

    const { container } = render(
      <IntlProvider locale="en">
        <IntlForgotPasswordFailureAlert {...props} />
      </IntlProvider>,
    );

    const expectedMessage = messages['invalid.token.error.message'].defaultMessage;

    expect(container.querySelector('#forgot-password-failure-alert').textContent).toBe(expectedMessage);
  });
});
