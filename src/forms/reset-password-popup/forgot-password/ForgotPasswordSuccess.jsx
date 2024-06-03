import React from 'react';

import { getConfig } from '@edx/frontend-platform';
import { FormattedMessage, useIntl } from '@edx/frontend-platform/i18n';
import { Alert } from '@openedx/paragon';
import PropTypes from 'prop-types';

import messages from '../messages';

/**
 * Component that renders a confirmation message after successfully sending the password reset email.
 *
 * @returns {JSX.Element} rendered confirmation message component .
 */
const ForgotPasswordSuccess = (props) => {
  const { formatMessage } = useIntl();
  const { email = '' } = props;

  return (
    <div id="forgot-password-success-msg" className="mb-5">
      <div className="text-gray-800 mb-3">
        <span className="font-weight-bold mr-2 h3 text-center d-block">
          {formatMessage(messages.emailSentMessage)}
        </span>
      </div>
      <p>
        <FormattedMessage
          id="forgot.password.confirmation.message"
          defaultMessage="We sent an email to {email} with instructions to reset your password.
          If you do not receive a password reset message after 1 minute, verify that you entered
          the correct email address, or check your spam folder. If you need further assistance,
          visit Help Center contact edX support at {supportLink}."
          description="Forgot password confirmation message"
          values={{
            email: <span className="data-hj-suppress">{email}</span>,
            supportLink: (
              <Alert.Link href={getConfig().INFO_EMAIL} target="_blank">
                {getConfig().INFO_EMAIL}
              </Alert.Link>
            ),
          }}
        />
      </p>
    </div>
  );
};

ForgotPasswordSuccess.propTypes = {
  email: PropTypes.string,
};

export default ForgotPasswordSuccess;
