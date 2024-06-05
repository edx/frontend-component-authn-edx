import React from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';
import { Alert } from '@openedx/paragon';
import PropTypes from 'prop-types';

import messages from './messages';
import { TPA_AUTHENTICATION_FAILURE } from '../../data/constants';

/**
 * SSOFailureAlert component displays an error alert based on the provided error code.
 * It accepts the following props:
 * - errorCode: The error code indicating the type of error.
 * - context: Additional context for the error, such as error message.
 * - alertTitle: Optional title for the alert.
 */
const SSOFailureAlert = (props) => {
  const { formatMessage } = useIntl();
  const { context = {}, errorCode, alertTitle = null } = props;

  if (!errorCode || errorCode !== TPA_AUTHENTICATION_FAILURE) {
    return null;
  }
  const errorMessage = errorCode === TPA_AUTHENTICATION_FAILURE
    ? (
      <span>
        {formatMessage(messages.TPAAuthenticationFailure, {
          lineBreak: <br />,
          errorMessage: context.errorMessage,
        })}
      </span>
    )
    : null;

  return (
    <Alert id="SSO-failure-alert" className="mb-4" variant="danger">
      {alertTitle && <span>{alertTitle}</span>} {errorMessage}
    </Alert>
  );
};

SSOFailureAlert.propTypes = {
  context: PropTypes.shape({
    errorMessage: PropTypes.string,
  }),
  errorCode: PropTypes.string.isRequired,
  alertTitle: PropTypes.node,
};

export default SSOFailureAlert;
