import React, { useEffect, useRef, useState } from 'react';

import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Button, Container, Form, StatefulButton,
} from '@openedx/paragon';

import { forgotPassword, forgotPasswordClearStatus, setForgotPasswordFormData } from './data/reducers';
import getValidationMessage from './data/utils';
import ForgotPasswordFailureAlert from './ForgotPasswordFailureAlert';
import ForgotPasswordSuccess from './ForgotPasswordSuccess';
import { InlineLink } from '../../../common-ui';
import { COMPLETE_STATE, DEFAULT_STATE, LOGIN_FORM } from '../../../data/constants';
import { useDispatch, useSelector } from '../../../data/storeHooks';
import { setCurrentOpenedForm } from '../../../onboarding-component/data/reducers';
import { trackForgotPasswordPageEvent, trackForgotPasswordPageViewed } from '../../../tracking/trackers/forgotpassword';
import EmailField from '../../fields/email-field';
import { NUDGE_PASSWORD_CHANGE, REQUIRE_PASSWORD_CHANGE } from '../../login-popup/data/constants';
import { loginErrorClear } from '../../login-popup/data/reducers';
import messages from '../messages';
import ResetPasswordHeader from '../ResetPasswordHeader';
import '../index.scss';

const ForgotPasswordForm = () => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();

  const status = useSelector(state => state.forgotPassword?.status);
  const backedUpFormData = useSelector(state => state.forgotPassword?.forgotPasswordFormData);
  const loginErrorCode = useSelector(state => state.login.loginError?.errorCode);

  const [formErrors, setFormErrors] = useState(backedUpFormData.error);
  const [formFields, setFormFields] = useState({ email: backedUpFormData.email });
  const [isSuccess, setIsSuccess] = useState(false);

  const emailRef = useRef(null);
  const nudgePasswordChangeRef = useRef(null);
  const requirePasswordChangeRef = useRef(null);

  useEffect(() => {
    trackForgotPasswordPageViewed();
    trackForgotPasswordPageEvent();
  }, []);

  const handleOnChange = (event) => {
    const { name } = event.target;
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormFields(prevState => ({ ...prevState, [name]: value }));
  };
  const handleErrorChange = (fieldName, error) => {
    setFormErrors(error);
  };
  const backupFormDataHandler = () => {
    dispatch(setForgotPasswordFormData({
      email: formFields.email,
      error: formErrors,
    }));
  };
  const backToLogin = (e) => {
    e.preventDefault();
    backupFormDataHandler();
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
    if (loginErrorCode === NUDGE_PASSWORD_CHANGE && nudgePasswordChangeRef.current) {
      nudgePasswordChangeRef.current.focus();
    } else if (loginErrorCode === REQUIRE_PASSWORD_CHANGE && requirePasswordChangeRef.current) {
      requirePasswordChangeRef.current.focus();
    } else {
      emailRef.current.focus();
    }
  }, [loginErrorCode]);

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
    <Container size="lg" className="onboarding__popup-container overflow-auto">
      <ResetPasswordHeader />
      <ForgotPasswordFailureAlert emailError={formErrors} status={status} />
      {status === DEFAULT_STATE && loginErrorCode === REQUIRE_PASSWORD_CHANGE && (
        <p
          aria-live="assertive"
          tabIndex="-1"
          ref={requirePasswordChangeRef}
          data-testid="require-password-change-message"
        >
          {formatMessage(messages.vulnerablePasswordBlockedMessage)}
        </p>
      )}
      {status === DEFAULT_STATE && loginErrorCode === NUDGE_PASSWORD_CHANGE && (
        <p
          tabIndex="-1"
          aria-live="assertive"
          ref={nudgePasswordChangeRef}
          data-testid="nudge-password-change-message"
        >
          {formatMessage(messages.vulnerablePasswordWarnedMessage)}
        </p>
      )}
      {!isSuccess && (
        <Form id="forgot-password-form" name="reset-password-form" className="d-flex flex-column">
          <EmailField
            name="email"
            value={formFields.email}
            handleChange={handleOnChange}
            handleErrorChange={handleErrorChange}
            autoComplete="email"
            errorMessage={formErrors}
            floatingLabel={formatMessage(messages.forgotPasswordFormEmailFieldLabel)}
            isRegistration={false}
            validateEmailFromBackend={false}
            ref={emailRef}
          />
          <StatefulButton
            id="reset-password-user"
            name="reset-password-user"
            type="submit"
            variant="primary"
            className="align-self-end forgot-password-form__submit-btn__width onboarding-btn__pill-shaped"
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
              targetBlank
            />
            <InlineLink
              className="font-weight-normal small"
              destination={`mailto:${getConfig().INFO_EMAIL}`}
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
        {loginErrorCode !== REQUIRE_PASSWORD_CHANGE
        && loginErrorCode !== NUDGE_PASSWORD_CHANGE && (
          <Button
            id="reset-password-back-to-login"
            name="reset-password-back-to-login"
            variant="tertiary"
            type="submit"
            className="align-self-center back-to-login__button onboarding-btn__pill-shaped"
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
