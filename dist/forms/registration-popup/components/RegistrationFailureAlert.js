import React from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Alert } from '@openedx/paragon';
import PropTypes from 'prop-types';
import { FORBIDDEN_REQUEST, FORM_SUBMISSION_ERROR, INTERNAL_SERVER_ERROR, TPA_AUTHENTICATION_FAILURE, TPA_SESSION_EXPIRED } from '../../../data/constants';
import messages from '../messages';

/**
 * RegisterFailureAlert component that is responsible to show error alert based on error code.
 * It accepts the following props
 * @param context
 * @param errorCode
 */

const RegistrationFailureMessage = _ref => {
  let {
    context = {
      errorMessage: null
    },
    errorCode
  } = _ref;
  const {
    formatMessage
  } = useIntl();
  if (!errorCode || errorCode === TPA_AUTHENTICATION_FAILURE) {
    return null;
  }
  let errorMessage;
  switch (errorCode) {
    case INTERNAL_SERVER_ERROR:
      errorMessage = formatMessage(messages.registrationRequestServerError);
      break;
    case FORBIDDEN_REQUEST:
      errorMessage = formatMessage(messages.registrationRateLimitError);
      break;
    case TPA_SESSION_EXPIRED:
      errorMessage = formatMessage(messages.registrationTPASessionExpired, {
        provider: context.provider
      });
      break;
    case FORM_SUBMISSION_ERROR:
      errorMessage = formatMessage(messages.registrationFormSubmissionError);
      break;
    default:
      errorMessage = formatMessage(messages.registrationEmptyFormSubmissionError);
      break;
  }
  return /*#__PURE__*/React.createElement(Alert, {
    id: "registration-failure-alert",
    className: "mb-5",
    variant: "danger"
  }, /*#__PURE__*/React.createElement("p", null, errorMessage));
};
RegistrationFailureMessage.propTypes = {
  context: PropTypes.shape({
    provider: PropTypes.string,
    errorMessage: PropTypes.string
  }),
  errorCode: PropTypes.string.isRequired
};
export default RegistrationFailureMessage;
//# sourceMappingURL=RegistrationFailureAlert.js.map