import React from 'react';

import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Alert, Hyperlink } from '@openedx/paragon';
import PropTypes from 'prop-types';

import {
  FORBIDDEN_REQUEST,
  INTERNAL_SERVER_ERROR,
  INVALID_FORM,
} from '../../../data/constants';
import {
  ACCOUNT_LOCKED_OUT,
  ALLOWED_DOMAIN_LOGIN_ERROR,
  FAILED_LOGIN_ATTEMPT,
  INACTIVE_USER,
  INCORRECT_EMAIL_PASSWORD,
  NON_COMPLIANT_PASSWORD_EXCEPTION,
  TPA_AUTHENTICATION_FAILURE,
} from '../data/constants';
import messages from '../messages';

/**
 * LoginFailureAlert component that is responsible to show error alert based on error code.
 * It accepts the following props
 * - errorCode
 * - context
 */

const LoginFailureAlert = (props) => {
  const { formatMessage } = useIntl();
  const { context, errorCode } = props;

  if (!errorCode) {
    return null;
  }

  let resetLink = (
    <Hyperlink destination="reset" isInline>
      {formatMessage(messages.loginIncorrectCredentialsErrorResetLinkText)}
    </Hyperlink>
  );

  let errorMessage;
  switch (errorCode) {
    case NON_COMPLIANT_PASSWORD_EXCEPTION: {
      errorMessage = (
        <>
          <strong>{formatMessage(messages.nonCompliantPasswordTitle)}</strong>
          <p>{formatMessage(messages.nonCompliantPasswordMessage)}</p>
        </>
      );
      break;
    }
    case FORBIDDEN_REQUEST:
      errorMessage = <span>{formatMessage(messages.loginRateLimitReachedMessage)}</span>;
      break;
    case INACTIVE_USER: {
      const supportLink = (
        <a href={context.supportLink}>
          {formatMessage(messages.contactSupportLink, { platformName: context.platformName })}
        </a>
      );
      errorMessage = (
        <span>
          {formatMessage(messages.loginInactiveUserError, {
            lineBreak: <br />,
            email: <strong className="data-hj-suppress">{context.email}</strong>,
            supportLink,
          })}
        </span>
      );
      break;
    }
    case ALLOWED_DOMAIN_LOGIN_ERROR: {
      const url = `${getConfig().LMS_BASE_URL}/dashboard/?tpa_hint=${context.tpaHint}`;
      const tpaLink = (
        <a href={url}>
          {formatMessage(messages.tpaAccountLink, { provider: context.provider })}
        </a>
      );
      errorMessage = (
        <span>
          {formatMessage(messages.allowedDomainLoginError, { allowedDomain: context.allowedDomain, tpaLink })}
        </span>
      );
      break;
    }
    case INVALID_FORM:
      errorMessage = <span>{formatMessage(messages.loginFormInvalidErrorMessage)}</span>;
      break;
    case FAILED_LOGIN_ATTEMPT: {
      resetLink = (
        <Hyperlink destination="reset" isInline>
          {formatMessage(messages.loginIncorrectCredentialsErrorBeforeAccountBlockedText)}
        </Hyperlink>
      );
      errorMessage = (
        <>
          <span>
            {formatMessage(messages.loginIncorrectCredentialsErrorAttemptsText1, {
              remainingAttempts: context.remainingAttempts,
            })}
          </span>
          <p>
            {formatMessage(messages.loginIncorrectCredentialsErrorAttemptsText2, { resetLink })}
          </p>
        </>
      );
      break;
    }
    case ACCOUNT_LOCKED_OUT: {
      errorMessage = (
        <>
          <span>{formatMessage(messages.accountLockedOutMessage1)}</span>
          <p>{formatMessage(messages.accountLockedOutMessage2, { resetLink })}</p>
        </>
      );
      break;
    }
    case INCORRECT_EMAIL_PASSWORD:
      if (context.failureCount <= 1) {
        errorMessage = <span>{formatMessage(messages.loginIncorrectCredentialsError)}</span>;
      } else if (context.failureCount === 2) {
        errorMessage = (
          <span>
            {formatMessage(messages.loginIncorrectCredentialsErrorWithResetLink, { resetLink })}
          </span>
        );
      }
      break;
    case TPA_AUTHENTICATION_FAILURE:
      errorMessage = (
        <span>
          {formatMessage(messages.loginTpaAuthenticationFailure, {
            platform_name: getConfig().SITE_NAME,
            lineBreak: <br />,
            errorMessage: context.errorMessage,
          })}
        </span>
      );
      break;
    case INTERNAL_SERVER_ERROR:
    default:
      errorMessage = <span>{formatMessage(messages.internalServerErrorMessage)}</span>;
      break;
  }

  return (
    <Alert id="login-failure-alert" className="mb-5" variant="danger">
      {formatMessage(messages.loginFailureHeaderTitle)} { errorMessage }
    </Alert>
  );
};

LoginFailureAlert.defaultProps = {
  context: {},
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
    email: PropTypes.string,
  }),
  errorCode: PropTypes.string.isRequired,
};

export default LoginFailureAlert;
