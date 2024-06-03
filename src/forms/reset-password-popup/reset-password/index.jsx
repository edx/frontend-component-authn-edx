import React, { useEffect, useState } from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Container, Form, StatefulButton,
} from '@openedx/paragon';
import PropTypes from 'prop-types';

import ResetPasswordFailure from './ResetPasswordFailure';
import { DEFAULT_STATE } from '../../../data/constants';
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
const ResetPasswordPage = ({ errorMsg = null }) => {
  const { formatMessage } = useIntl();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});

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
         // will add backend validation message
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

  return (
    <Container size="lg" className="authn__popup-container overflow-auto">
      <ResetPasswordHeader />
      <ResetPasswordFailure errorMsg={errorMsg} />
      <div className="text-gray-800 mb-4">{formatMessage(messages.enterConfirmPasswordMessage)}</div>
      <Form id="set-reset-password-form" name="set-reset-password-form" className="d-flex flex-column">
        <PasswordField
          id="newPassword"
          name="newPassword"
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
          onMouseDown={(e) => e.preventDefault()}
        />
      </Form>
    </Container>
  );
};

ResetPasswordPage.propTypes = {
  errorMsg: PropTypes.string,
};

export default ResetPasswordPage;
