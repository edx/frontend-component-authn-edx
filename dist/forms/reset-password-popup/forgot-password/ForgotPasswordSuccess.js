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
const ForgotPasswordSuccess = props => {
  const {
    formatMessage
  } = useIntl();
  const {
    email = ''
  } = props;
  return /*#__PURE__*/React.createElement("div", {
    id: "forgot-password-success-msg",
    className: "mb-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-gray-800 mb-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-weight-bold mr-2 h3 text-center d-block"
  }, formatMessage(messages.emailSentMessage))), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement(FormattedMessage, {
    id: "forgot.password.confirmation.message",
    defaultMessage: "We sent an email to {email} with instructions to reset your password. If you do not receive a password reset message after 1 minute, verify that you entered the correct email address, or check your spam folder. If you need further assistance, visit {helpCenter}.",
    description: "Forgot password confirmation message",
    values: {
      email: /*#__PURE__*/React.createElement("span", {
        className: "data-hj-suppress"
      }, email),
      helpCenter: /*#__PURE__*/React.createElement(Alert.Link, {
        href: getConfig().PASSWORD_RESET_SUPPORT_LINK,
        target: "_blank"
      }, formatMessage(messages.helpCenter))
    }
  })));
};
ForgotPasswordSuccess.propTypes = {
  email: PropTypes.string
};
export default ForgotPasswordSuccess;
//# sourceMappingURL=ForgotPasswordSuccess.js.map