import React from 'react';

import { getConfig } from '@edx/frontend-platform';
import { FormattedMessage, useIntl } from '@edx/frontend-platform/i18n';
import { Alert } from '@openedx/paragon';

import messages from '../messages';

/**
 * Component that renders the display confirmation message after sending the password reset email.
 * @returns {JSX.Element} The rendered confirmation message component.
 */
const ForgotPasswordEmailSentConfirmation = () => {
  const { formatMessage } = useIntl();

  return (
    <div className="text-gray-800 mb-5">
      <span className="font-weight-bold mr-2 h3 text-center d-block">
        {formatMessage(messages.emailSentMessage)}
      </span>
      <span>
        <FormattedMessage
          id="forgot.password.confirmation.message"
          defaultMessage="We sent an email to {email} with instructions to reset your password.
          If you do not receive a password reset message after 1 minute, verify that you entered
          the correct email address, or check your spam folder. If you need further assistance, visit Help
          Center contact edX support at {supportLink}."
          description="Forgot password confirmation message"
          values={{
            /* TODO: this email will be replaced with actual email */
            email: <span className="data-hj-suppress">email@email.com</span>,
            supportLink: (
              <Alert.Link href={getConfig().PASSWORD_RESET_SUPPORT_LINK} target="_blank">
                {getConfig().INFO_EMAIL}
              </Alert.Link>
            ),
          }}
        />
      </span>
    </div>

  );
};

export default ForgotPasswordEmailSentConfirmation;
