import React from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';
import { Alert } from '@openedx/paragon';
import PropTypes from 'prop-types';

import { FORM_SUBMISSION_ERROR } from '../../../../data/constants';
import { PASSWORD_RESET, PASSWORD_VALIDATION_ERROR } from '../data/constants';
import messages from '../messages';

const ResetPasswordFailure = (props) => {
  const { formatMessage } = useIntl();
  const { errorCode, errorMsg } = props;

  let errorMessage = null;
  switch (errorCode) {
    case PASSWORD_RESET.FORBIDDEN_REQUEST:
      errorMessage = formatMessage(messages.rateLimitError);
      break;
    case PASSWORD_RESET.INTERNAL_SERVER_ERROR:
      errorMessage = formatMessage(messages.internalServerError);
      break;
    case PASSWORD_VALIDATION_ERROR:
      errorMessage = errorMsg;
     break;
    case FORM_SUBMISSION_ERROR:
      errorMessage = formatMessage(messages.resetPasswordFormSubmissionError);
      break;
    default:
      break;
  }

  if (errorMessage) {
    return (
      <Alert id="validation-errors" className="mb-4" variant="danger">
        <p>{errorMessage}</p>
      </Alert>
    );
  }

  return null;
};

ResetPasswordFailure.defaultProps = {
  errorCode: null,
  errorMsg: null,
};

ResetPasswordFailure.propTypes = {
  errorCode: PropTypes.string,
  errorMsg: PropTypes.string,
};

export default ResetPasswordFailure;
