import React from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';

import messages from './messages';

/**
 * Header component for the reset password form.
 * Renders the heading for the reset password form along with a separator.
 * @returns {JSX.Element} The rendered header component.
 */
const ResetPasswordHeader = () => {
  const { formatMessage } = useIntl();

  return (
    <>
      <h2
        className="font-italic text-center display-1 m-0 text-dark-500 pb-0"
        data-testid="forgot-password-heading"
      >
        {formatMessage(messages.resetPasswordFormHeading)}
      </h2>
      <hr className="separator my-3 my-sm-4" />
    </>
  );
};

export default ResetPasswordHeader;
