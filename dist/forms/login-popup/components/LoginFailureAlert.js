import React from 'react';
import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Alert, Hyperlink } from '@openedx/paragon';
import PropTypes from 'prop-types';
import { setCurrentOpenedForm } from '../../../authn-component/data/reducers';
import { FORBIDDEN_REQUEST, FORGOT_PASSWORD_FORM, INTERNAL_SERVER_ERROR, INVALID_FORM, TPA_AUTHENTICATION_FAILURE } from '../../../data/constants';
import { useDispatch } from '../../../data/storeHooks';
import { ACCOUNT_LOCKED_OUT, ALLOWED_DOMAIN_LOGIN_ERROR, FAILED_LOGIN_ATTEMPT, INACTIVE_USER, INCORRECT_EMAIL_PASSWORD, NON_COMPLIANT_PASSWORD_EXCEPTION } from '../data/constants';
import messages from '../messages';

/**
 * LoginFailureAlert component that is responsible to show error alert based on error code.
 * It accepts the following props
 * - errorCode
 * - context
 */

const LoginFailureAlert = props => {
  const dispatch = useDispatch();
  const {
    formatMessage
  } = useIntl();
  const {
    context = {},
    errorCode
  } = props;
  const handleResetPasswordLinkClick = event => {
    event.preventDefault();
    dispatch(setCurrentOpenedForm(FORGOT_PASSWORD_FORM));
  };
  if (!errorCode || errorCode === TPA_AUTHENTICATION_FAILURE) {
    return null;
  }
  let resetLink = /*#__PURE__*/React.createElement(Hyperlink, {
    destination: "reset",
    isInline: true
  }, formatMessage(messages.loginIncorrectCredentialsErrorResetLinkText));
  let errorMessage;
  switch (errorCode) {
    case NON_COMPLIANT_PASSWORD_EXCEPTION:
      {
        errorMessage = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("strong", null, formatMessage(messages.nonCompliantPasswordTitle)), /*#__PURE__*/React.createElement("p", null, formatMessage(messages.nonCompliantPasswordMessage)));
        break;
      }
    case FORBIDDEN_REQUEST:
      errorMessage = /*#__PURE__*/React.createElement("span", null, formatMessage(messages.loginRateLimitReachedMessage));
      break;
    case INACTIVE_USER:
      {
        const supportLink = /*#__PURE__*/React.createElement("a", {
          href: context.supportLink
        }, formatMessage(messages.contactSupportLink, {
          platformName: context.platformName
        }));
        errorMessage = /*#__PURE__*/React.createElement("span", null, formatMessage(messages.loginInactiveUserError, {
          lineBreak: /*#__PURE__*/React.createElement("br", null),
          email: /*#__PURE__*/React.createElement("strong", {
            className: "data-hj-suppress"
          }, context.email),
          supportLink
        }));
        break;
      }
    case ALLOWED_DOMAIN_LOGIN_ERROR:
      {
        const url = `${getConfig().LMS_BASE_URL}/dashboard/?tpa_hint=${context.tpaHint}`;
        const tpaLink = /*#__PURE__*/React.createElement("a", {
          href: url
        }, formatMessage(messages.tpaAccountLink, {
          provider: context.provider
        }));
        errorMessage = /*#__PURE__*/React.createElement("span", null, formatMessage(messages.allowedDomainLoginError, {
          allowedDomain: context.allowedDomain,
          tpaLink
        }));
        break;
      }
    case INVALID_FORM:
      errorMessage = /*#__PURE__*/React.createElement("span", null, formatMessage(messages.loginFormInvalidErrorMessage));
      break;
    case FAILED_LOGIN_ATTEMPT:
      {
        resetLink = /*#__PURE__*/React.createElement(Hyperlink, {
          className: "popup_login_form__inline_link-cursor",
          onClick: handleResetPasswordLinkClick,
          isInline: true
        }, formatMessage(messages.loginIncorrectCredentialsErrorBeforeAccountBlockedText));
        errorMessage = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", null, formatMessage(messages.loginIncorrectCredentialsErrorAttemptsText1, {
          remainingAttempts: context.remainingAttempts
        })), /*#__PURE__*/React.createElement("p", null, formatMessage(messages.loginIncorrectCredentialsErrorAttemptsText2, {
          resetLink
        })));
        break;
      }
    case ACCOUNT_LOCKED_OUT:
      {
        errorMessage = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", null, formatMessage(messages.accountLockedOutMessage1)), /*#__PURE__*/React.createElement("p", null, formatMessage(messages.accountLockedOutMessage2, {
          resetLink
        })));
        break;
      }
    case INCORRECT_EMAIL_PASSWORD:
      if (context.failureCount <= 1) {
        errorMessage = /*#__PURE__*/React.createElement("span", null, formatMessage(messages.loginIncorrectCredentialsError));
      } else if (context.failureCount === 2) {
        errorMessage = /*#__PURE__*/React.createElement("span", null, formatMessage(messages.loginIncorrectCredentialsErrorWithResetLink, {
          resetLink
        }));
      }
      break;
    case INTERNAL_SERVER_ERROR:
    default:
      errorMessage = /*#__PURE__*/React.createElement("span", null, formatMessage(messages.internalServerErrorMessage));
      break;
  }
  return /*#__PURE__*/React.createElement(Alert, {
    id: "login-failure-alert",
    className: "mb-4",
    variant: "danger"
  }, formatMessage(messages.loginFailureHeaderTitle), " ", errorMessage);
};
LoginFailureAlert.propTypes = {
  context: PropTypes.shape({
    supportLink: PropTypes.string,
    platformName: PropTypes.string,
    tpaHint: PropTypes.string,
    provider: PropTypes.string,
    allowedDomain: PropTypes.string,
    remainingAttempts: PropTypes.number,
    failureCount: PropTypes.number,
    errorMessage: PropTypes.string,
    email: PropTypes.string
  }),
  errorCode: PropTypes.string.isRequired
};
export default LoginFailureAlert;
//# sourceMappingURL=LoginFailureAlert.js.map