import React from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';
import { Alert } from '@openedx/paragon';

import messages from '../messages';

/**
 * Component to display reset password failure message.
 * @returns {JSX.Element | null} The rendered failure message component or null if no error.
 */
const ResetPasswordFailure = () => {
  const { formatMessage } = useIntl();

  const errorMessage = ' ';
  const heading = formatMessage(messages.resetPasswordFailureHeading);

  if (errorMessage) {
    return (
      <Alert id="validation-errors" className="mb-4" variant="danger">
        {heading}
      </Alert>
    );
  }

  return null;
};

export default ResetPasswordFailure;
