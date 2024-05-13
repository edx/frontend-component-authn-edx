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
      <h2 className="font-italic text-center display-1 mb-4 text-dark-500">
        {formatMessage(messages.resetPasswordFormHeading)}
      </h2>
      <hr className="separator mb-3 mt-3" />
    </>
  );
};

export default ResetPasswordHeader;
