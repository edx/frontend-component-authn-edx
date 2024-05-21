import React from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';
import { Alert } from '@openedx/paragon';
import PropTypes from 'prop-types';

import {
  INTERNAL_SERVER_ERROR,
  TPA_AUTHENTICATION_FAILURE,
  TPA_SESSION_EXPIRED,
} from '../../../data/constants';
import messages from '../messages';

/**
 * RegisterFailureAlert component that is responsible to show error alert based on error code.
 * It accepts the following props
 * @param context
 * @param errorCode
 */
const RegistrationFailureAlert = ({ context, errorCode }) => {
  const { formatMessage } = useIntl();

  if (!errorCode) {
    return null;
  }

  let errorMessage;
  switch (errorCode) {
    case TPA_SESSION_EXPIRED:
      errorMessage = (
        <span>
          {formatMessage(messages.registrationTpaSessionExpired, {
            provider: context.provider,
          })}
        </span>
      );
      break;
    case TPA_AUTHENTICATION_FAILURE:
      errorMessage = (
        <span>
          {formatMessage(messages.registrationTpaAuthenticationFailure, {
            lineBreak: <br />,
            errorMessage: context.errorMessage,
          })}
        </span>
      );
      break;
    case INTERNAL_SERVER_ERROR:
    default:
      errorMessage = <span>{formatMessage(messages.internalServerErrorMessage)}</span>;
      break;
  }

  return (
    <Alert id="registration-failure-alert" className="mb-5" variant="danger">
      {formatMessage(messages.registrationFailureHeaderTitle)} { errorMessage }
    </Alert>
  );
};

RegistrationFailureAlert.defaultProps = {
  context: {},
};

RegistrationFailureAlert.propTypes = {
  context: PropTypes.shape({
    provider: PropTypes.string,
    errorMessage: PropTypes.string,
  }),
  errorCode: PropTypes.string.isRequired,
};

export default RegistrationFailureAlert;
