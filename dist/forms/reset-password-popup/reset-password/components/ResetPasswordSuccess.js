import React from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Alert } from '@openedx/paragon';
import messages from '../messages';
const ResetPasswordSuccess = () => {
  const {
    formatMessage
  } = useIntl();
  return /*#__PURE__*/React.createElement(Alert, {
    id: "reset-password-success",
    variant: "success",
    className: "mb-5"
  }, /*#__PURE__*/React.createElement("p", null, formatMessage(messages.resetPassowrdSuccess)));
};
export default ResetPasswordSuccess;
//# sourceMappingURL=ResetPasswordSuccess.js.map