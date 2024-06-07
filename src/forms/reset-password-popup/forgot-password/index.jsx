import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Button, Container, Form, StatefulButton,
} from '@openedx/paragon';

import { forgotPassword, forgotPasswordClearStatus } from './data/reducers';
import getValidationMessage from './data/utils';
import ForgotPasswordFailureAlert from './ForgotPasswordFailureAlert';
import ForgotPasswordSuccess from './ForgotPasswordSuccess';
import { setCurrentOpenedForm } from '../../../authn-component/data/reducers';
import { InlineLink } from '../../../common-ui';
import { COMPLETE_STATE, LOGIN_FORM } from '../../../data/constants';
import {
  forgotPasswordPageViewedEvent,
  trackForgotPasswordPageEvent,
} from '../../../tracking/trackers/forgotpassword';
import EmailField from '../../fields/email-field';
import { NUDGE_PASSWORD_CHANGE, REQUIRE_PASSWORD_CHANGE } from '../../login-popup/data/constants';
import { loginErrorClear } from '../../login-popup/data/reducers';
import messages from '../messages';
import ResetPasswordHeader from '../ResetPasswordHeader';
import '../index.scss';

/**
 * ForgotPasswordForm component for handling user password reset.
 * This component provides a form for users to reset their password by entering their email.
 */
const ForgotPasswordForm = () => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const status = useSelector(state => state.forgotPassword?.status);
  const loginErrorCode = useSelector(state => state.login.loginError?.errorCode);

  const [formErrors, setFormErrors] = useState('');
  const [formFields, setFormFields] = useState({ email: '' });
  const [isSuccess, setIsSuccess] = useState(false);

  const emailRef = useRef(null);
  const errorRef = useRef(null);

  useEffect(() => {
    forgotPasswordPageViewedEvent();
    trackForgotPasswordPageEvent();
  }, []);

  const handleOnChange = (event) => {
    const { name } = event.target;
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormFields(prevState => ({ ...prevState, [name]: value }));
  };

  const backToLogin = (e) => {
    e.preventDefault();
    dispatch(forgotPasswordClearStatus());
    dispatch(loginErrorClear());
    dispatch(setCurrentOpenedForm(LOGIN_FORM));
  };

  useEffect(() => {
    if (status === COMPLETE_STATE) {
      setFormErrors('');
      setIsSuccess(true);
    }
  }, [status]);

  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (formErrors && errorRef.current) {
      setTimeout(() => {
        errorRef.current.focus();
      }, 100);
    }
  }, [formErrors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors('');

    const error = getValidationMessage(formFields.email, formatMessage);
    if (error) {
      setFormErrors(error);
    } else {
      dispatch(forgotPassword(formFields.email));
    }
  };

  return (
    <Container size="lg" className="authn__popup-container overflow-auto">
      <ResetPasswordHeader />
      <div ref={errorRef} tabIndex="-1" aria-live="assertive">
        <ForgotPasswordFailureAlert emailError={formErrors} status={status} />
      </div>
      {loginErrorCode === REQUIRE_PASSWORD_CHANGE && (
        <p data-testid="require-password-change-message">{formatMessage(messages.vulnerablePasswordBlockedMessage)}</p>
      )}
      {loginErrorCode === NUDGE_PASSWORD_CHANGE && (
        <p data-testid="nudge-password-change-message">{formatMessage(messages.vulnerablePasswordWarnedMessage)}</p>
      )}
      {!isSuccess && (
        <Form id="forgot-password-form" name="reset-password-form" className="d-flex flex-column">
          <EmailField
            name="email"
            value={formFields.email}
            handleChange={handleOnChange}
            autoComplete="email"
            errorMessage={formErrors}
            floatingLabel={formatMessage(messages.forgotPasswordFormEmailFieldLabel)}
            isRegistration={false}
            ref={emailRef}
          />
          <StatefulButton
            id="reset-password-user"
            name="reset-password-user"
            type="submit"
            variant="primary"
            className="align-self-end"
            state={status}
            labels={{
              default: formatMessage(messages.resetPasswordFormSubmitButton),
              pending: '',
            }}
            onClick={handleSubmit}
            onMouseDown={(e) => e.preventDefault()}
          />

          <div className="my-4">
            <InlineLink
              className="mb-2"
              destination={getConfig().LOGIN_ISSUE_SUPPORT_LINK}
              linkHelpText={formatMessage(messages.resetPasswordFormNeedHelpText)}
              linkText={formatMessage(messages.resetPasswordFormHelpCenterLink)}
            />
            <InlineLink
              className="font-weight-normal small"
              destination={getConfig().INFO_EMAIL}
              linkHelpText={formatMessage(messages.resetPasswordFormAdditionalHelpText)}
              linkText={getConfig().INFO_EMAIL}
            />
          </div>
        </Form>
      )}
      {isSuccess && (
        <ForgotPasswordSuccess email={formFields.email} />
      )}
      <div className="text-center mt-4.5">
        {(loginErrorCode !== REQUIRE_PASSWORD_CHANGE) && (
          <Button
            id="reset-password-back-to-login"
            name="reset-password-back-to-login"
            variant="tertiary"
            type="submit"
            className="align-self-center back-to-login__button"
            onClick={backToLogin}
            onMouseDown={(e) => e.preventDefault()}
          >
            {formatMessage(messages.resetPasswordBackToLoginButton)}
          </Button>
        )}
      </div>
    </Container>
  );
};

export default ForgotPasswordForm;
