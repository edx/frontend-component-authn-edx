import React from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';
import { Alert } from '@openedx/paragon';
import PropTypes from 'prop-types';

import { FORBIDDEN_STATE, INTERNAL_SERVER_ERROR } from '../../../data/constants';
import messages from '../messages';
import { PASSWORD_RESET } from '../reset-password/data/constants';

/**
 * Component responsible for showing error alert based on forgot password request status.
 * @param {string} emailError
 * @param {string} status
 */
const ForgotPasswordFailureAlert = ({ emailError, status }) => {
  const { formatMessage } = useIntl();
  let message = '';

  if (emailError) {
    message = formatMessage(messages.forgotPasswordExtendFieldErrors, { emailError });
  }

  switch (status) {
    case INTERNAL_SERVER_ERROR:
      message = formatMessage(messages.forgotPasswordInternalServerError);
      break;
    case PASSWORD_RESET.INVALID_TOKEN:
      message = formatMessage(messages['invalid.token.error.message']);
      break;
    case FORBIDDEN_STATE:
      message = formatMessage(messages.forgotPasswordRequestInProgressMessage);
      break;
    default:
      break;
  }

  return message ? (
    <Alert id="forgot-password-failure-alert" className="mb-4" variant="danger">
      <p>{message}</p>
    </Alert>
  ) : null;
};

ForgotPasswordFailureAlert.defaultProps = {
  emailError: '',
  status: '',
};

ForgotPasswordFailureAlert.propTypes = {
  emailError: PropTypes.string,
  status: PropTypes.string,
};

export default ForgotPasswordFailureAlert;
