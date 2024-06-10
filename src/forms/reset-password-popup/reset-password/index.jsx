import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Container, Form, Spinner, StatefulButton,
} from '@openedx/paragon';

import ResetPasswordFailure from './components/ResetPasswordFailure';
import {
  PASSWORD_RESET, PASSWORD_RESET_ERROR,
  PASSWORD_VALIDATION_ERROR, SUCCESS, TOKEN_STATE,
} from './data/constants';
import useGetAuthModeParam from './data/hooks';
import { resetPassword, validatePassword, validateToken } from './data/reducers';
import { setCurrentOpenedForm } from '../../../authn-component/data/reducers';
import {
  DEFAULT_STATE, FORGOT_PASSWORD_FORM, FORM_SUBMISSION_ERROR, LOGIN_FORM,
} from '../../../data/constants';
import { useDispatch, useSelector } from '../../../data/storeHooks';
import getAllPossibleQueryParams from '../../../data/utils';
import { trackResettPasswordPageEvent } from '../../../tracking/trackers/reset-password';
import { PasswordField } from '../../fields';
import messages from '../messages';
import ResetPasswordHeader from '../ResetPasswordHeader';

export const LETTER_REGEX = /[a-zA-Z]/;
export const NUMBER_REGEX = /\d/;

/**
 * ResetPasswordForm component for completing user password reset.
 * This component provides a form for users to reset their password.
 * @returns {string} A message indicating the success or failure of the password reset process.
 */
const ResetPasswordPage = () => {
  const dispatch = useDispatch();

  const queryParams = useMemo(() => getAllPossibleQueryParams(), []);
  const authModeToken = useGetAuthModeParam();

  // const ResetPasswordPage = ({ errorMsg = null }) => {
  const { formatMessage } = useIntl();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [errorCode, setErrorCode] = useState(null);

  const newPasswordRef = useRef(null);
  const errorRef = useRef(null);

  const status = useSelector(state => state.resetPassword.status);
  const errorMsg = useSelector(state => state.resetPassword?.errorMsg);
  const backendValidationError = useSelector(state => state.resetPassword?.backendValidationError);

  const validatePasswordFromBackend = async (password) => {
    const payload = {
      reset_password_page: true,
      password,
    };
    dispatch(validatePassword(payload));
  };

  useEffect(() => {
    setFormErrors((preState) => ({
      ...preState,
      newPassword: backendValidationError || '',
    }));
  }, [backendValidationError]);

  useEffect(() => {
    if (newPasswordRef.current) {
      newPasswordRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (formErrors && Object.keys(formErrors).length > 0 && errorRef.current) {
      setTimeout(() => {
        errorRef.current.focus();
      }, 100);
    }
  }, [formErrors]);

  useEffect(() => {
    trackResettPasswordPageEvent();
  }, []);

  const validateInput = (name, value) => {
    switch (name) {
      case 'newPassword':
       if (!value) {
         formErrors.newPassword = formatMessage(messages.passwordRequiredMessage);
       } else if (!LETTER_REGEX.test(value) || !NUMBER_REGEX.test(value) || value.length < 8) {
         formErrors.newPassword = formatMessage(messages.passwordValidationMessage);
       } else {
         validatePasswordFromBackend(value);
       }
        break;
      case 'confirmPassword':
        if (!value) {
          formErrors.confirmPassword = formatMessage(messages.confirmYourPassword);
        } else if (value !== newPassword) {
          formErrors.confirmPassword = formatMessage(messages.passwordDoNotMatch);
        } else {
          formErrors.confirmPassword = '';
        }
        break;
      default:
        break;
    }
    setFormErrors({ ...formErrors });
    return !Object.values(formErrors).some(x => (x !== ''));
  };

  const handleOnBlur = (event) => {
    const { name, value } = event.target;
    validateInput(name, value);
  };

  const handleOnFocus = (e) => {
    setFormErrors({ ...formErrors, [e.target.name]: '' });
  };

  useEffect(() => {
    if (status !== TOKEN_STATE.PENDING && status !== PASSWORD_RESET_ERROR) {
      setErrorCode(status);
    }
    if (status === PASSWORD_VALIDATION_ERROR) {
      setFormErrors({ newPassword: formatMessage(messages.passwordValidationMessage) });
    }
  }, [status, formatMessage]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const isPasswordValid = validateInput('newPassword', newPassword);
    const isPasswordConfirmed = validateInput('confirmPassword', confirmPassword);
    if (isPasswordValid && isPasswordConfirmed) {
      const formPayload = {
        new_password1: newPassword,
        new_password2: confirmPassword,
      };
      const params = queryParams;
      dispatch(resetPassword({ formPayload, token: authModeToken, params }));
    } else {
      setErrorCode(FORM_SUBMISSION_ERROR);
    }
  };

  if (status === TOKEN_STATE.PENDING) {
    if (authModeToken) {
      dispatch(validateToken(authModeToken));
      return (
        <Container
          size="lg"
          className="loader-container d-flex flex-column justify-content-center align-items-center my-6 w-100 h-100 text-center"
        >
          <h1 className="loader-heading text-center mb-4">{formatMessage(messages.resetPasswordTokenValidatingHeadingText)}</h1>
          <Spinner animation="border" variant="primary" className="spinner--position-centered" />;
        </Container>
      );
    }
  } else if (status === PASSWORD_RESET_ERROR || status === PASSWORD_RESET.INVALID_TOKEN) {
    dispatch(setCurrentOpenedForm(FORGOT_PASSWORD_FORM));
  } else if (status === SUCCESS) {
    dispatch(setCurrentOpenedForm(LOGIN_FORM));
  }
  return (
    <Container size="lg" className="authn__popup-container overflow-auto">
      <ResetPasswordHeader />
      <div ref={errorRef} tabIndex="-1" aria-live="assertive">
        <ResetPasswordFailure errorCode={errorCode} errorMsg={errorMsg} />
      </div>
      <div className="text-gray-800 mb-4">{formatMessage(messages.enterConfirmPasswordMessage)}</div>
      <Form id="set-reset-password-form" name="set-reset-password-form" className="d-flex flex-column">
        <PasswordField
          id="newPassword"
          name="newPassword"
          dataTestId="newPassword"
          value={newPassword}
          handleChange={(e) => setNewPassword(e.target.value)}
          handleFocus={handleOnFocus}
          handleBlur={handleOnBlur}
          errorMessage={formErrors.newPassword}
          floatingLabel={formatMessage(messages.newPasswordLabel)}
          ref={newPasswordRef}
        />
        <PasswordField
          id="confirmPassword"
          name="confirmPassword"
          dataTestId="confirmPassword"
          value={confirmPassword}
          handleChange={(e) => setConfirmPassword(e.target.value)}
          handleFocus={handleOnFocus}
          handleBlur={handleOnBlur}
          errorMessage={formErrors.confirmPassword}
          floatingLabel={formatMessage(messages.confirmPasswordLabel)}
        />
        <StatefulButton
          id="reset-password"
          name="reset-password"
          type="submit"
          variant="primary"
          className="align-self-end"
          state={DEFAULT_STATE}
          labels={{
            default: formatMessage(messages.resetPasswordButton),
            pending: '',
          }}
          onClick={e => handleSubmit(e)}
          onMouseDown={(e) => e.preventDefault()}
        />
      </Form>
    </Container>
  );
};

export default ResetPasswordPage;
