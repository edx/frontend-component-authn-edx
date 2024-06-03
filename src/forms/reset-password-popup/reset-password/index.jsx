import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Container, Form, Spinner, StatefulButton,
} from '@openedx/paragon';

import ResetPasswordFailure from './components/ResetPasswordFailure';
import {
  FORM_SUBMISSION_ERROR, PASSWORD_RESET, PASSWORD_RESET_ERROR,
  PASSWORD_VALIDATION_ERROR, TOKEN_STATE,
} from './data/constants';
import { resetPassword, validateToken } from './data/reducers';
import { validatePasswordRequest } from './data/service';
import { setCurrentOpenedForm } from '../../../authn-component/data/reducers';
import { DEFAULT_STATE, FORGOT_PASSWORD_FORM, LOGIN_FORM } from '../../../data/constants';
import getAllPossibleQueryParams from '../../../data/utils';
import { trackResettPasswordPageEvent } from '../../../tracking/trackers/reset-password';
import { PasswordField } from '../../fields';
import messages from '../messages';
import ResetPasswordHeader from '../ResetPasswordHeader';

export const LETTER_REGEX = /[a-zA-Z]/;
export const NUMBER_REGEX = /\d/;
const passwordResetPathRegex = /^\/password_reset_confirm\/[a-zA-Z0-9-]+(?:\/)?$/;

/**
 * ResetPasswordForm component for completing user password reset.
 * This component provides a form for users to reset their password.
 * @returns {string} A message indicating the success or failure of the password reset process.
 */
const ResetPasswordPage = () => {
  const dispatch = useDispatch();

  const { formatMessage } = useIntl();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [errorCode, setErrorCode] = useState(null);

  const status = useSelector(state => state.resetPassword.status);
  const errorMsg = useSelector(state => state.resetPassword?.errorMsg);

  const urlParams = window.location.pathname.match(passwordResetPathRegex);
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (!token && urlParams && urlParams[0]) {
      setToken(urlParams[0].split('/')[2]);
    }
  }, [urlParams, token]);

  const validatePasswordFromBackend = async (password) => {
    let errorMessage = '';
    try {
      const payload = {
        reset_password_page: true,
        password,
      };
      errorMessage = await validatePasswordRequest(payload);
    } catch (err) {
      errorMessage = '';
    }
    setFormErrors({ ...formErrors, newPassword: errorMessage });
  };

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
      const params = getAllPossibleQueryParams();
      dispatch(resetPassword({ formPayload, token, params }));
    } else {
      setErrorCode(FORM_SUBMISSION_ERROR);
    }
  };

  if (status === TOKEN_STATE.PENDING) {
    if (token) {
      dispatch(validateToken(token));
      return <Spinner animation="border" variant="primary" className="spinner--position-centered" />;
    }
  } else if (status === PASSWORD_RESET_ERROR || status === PASSWORD_RESET.INVALID_TOKEN) {
    dispatch(setCurrentOpenedForm(FORGOT_PASSWORD_FORM));
    window.history.replaceState(window.history.state, '', '/');
  } else if (status === 'success') {
    dispatch(setCurrentOpenedForm(LOGIN_FORM));
    window.history.replaceState(window.history.state, '', '/login');
  }
  return (
    <Container size="lg" className="authn__popup-container overflow-auto">
      <ResetPasswordHeader />
      <ResetPasswordFailure errorCode={errorCode} errorMsg={errorMsg} />
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
