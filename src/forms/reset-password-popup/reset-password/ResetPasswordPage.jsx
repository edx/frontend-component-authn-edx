import React, { useState } from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Button, Container, Form,
} from '@openedx/paragon';
import PropTypes from 'prop-types';

import ResetPasswordFailure from './ResetPasswordFailure';
import PasswordField from '../../fields/password-field';
import messages from '../messages';
import ResetPasswordHeader from '../ResetPasswordHeader';

export const LETTER_REGEX = /[a-zA-Z]/;
export const NUMBER_REGEX = /\d/;

/**
 * ResetPasswordForm component for completing user password reset.
 * This component provides a form for users to reset their password.
 * @param {string} newPassword - The new password entered by the user.
 * @param {string} confirmNewPassword - The confirmation of the new password entered by the user.
 * @returns {string} A message indicating the success or failure of the password reset process.
 */
const ResetPasswordPage = (props) => {
  const { formatMessage } = useIntl();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});

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
    <Container size="lg" className="authn__popup-container p-5 overflow-auto">
      <ResetPasswordHeader />
      <ResetPasswordFailure errorMsg={props.errorMsg} />

      <div className="text-gray-800 mb-4">{formatMessage(messages.enterConfirmPasswordMessage)}</div>
      <Form id="set-reset-password-form" name="set-reset-password-form" className="d-flex flex-column my-4.5">
        <PasswordField
          id="newPassword"
          name="newPassword"
          className="mb-4"
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
          className="mb-4"
          value={confirmPassword}
          handleChange={(e) => setConfirmPassword(e.target.value)}
          handleFocus={handleOnFocus}
          handleBlur={handleOnBlur}
          errorMessage={formErrors.confirmPassword}
          floatingLabel={formatMessage(messages.confirmPasswordLabel)}
        />
        <Button
          id="reset-password-user"
          name="reset-password-user"
          variant="primary"
          type="submit"
          className="align-self-end"
        >
          {formatMessage(messages.resetPasswordButton)}
        </Button>
      </Form>
    </Container>
  );
};

ResetPasswordPage.defaultProps = {
  errorMsg: null,
};

ResetPasswordPage.propTypes = {
  errorMsg: PropTypes.string,
};

export default ResetPasswordPage;
