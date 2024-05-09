import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Button, Container, Form,
} from '@openedx/paragon';

import ForgotPasswordEmailSentConfirmation from './ForgotPasswordEmailSentConfirmation';
import { setCurrentOpenedForm } from '../../../authn-component/data/reducers';
import { InlineLink } from '../../../common-ui';
import { LOGIN_FORM } from '../../../data/constants';
import EmailField from '../../fields/email-field';
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

  const [formFields, setFormFields] = useState({ email: '' });
  const [isSuccess, setIsSuccess] = useState(false);

  const handleOnChange = (event) => {
    const { name } = event.target;
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormFields(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSuccess(true);
    dispatch(setCurrentOpenedForm(LOGIN_FORM));
  };

  return (
    <Container size="lg" className="authn__popup-container p-5 overflow-auto">
      <ResetPasswordHeader />
      {!isSuccess && (
        <Form id="forgot-password-form" name="reset-password-form" className="d-flex flex-column my-4.5">
          <EmailField
            name="email"
            value={formFields.email}
            handleChange={handleOnChange}
            floatingLabel={formatMessage(messages.forgotPasswordFormEmailFieldLabel)}
          />
          <Button
            id="reset-password-user"
            name="reset-password-user"
            variant="primary"
            type="submit"
            className="align-self-end"
            onClick={handleSubmit}
            onMouseDown={(e) => e.preventDefault()}
          >
            {formatMessage(messages.resetPasswordFormSubmitButton)}
          </Button>
          <div>
            <InlineLink
              className="mb-2"
              destination={getConfig().LOGIN_ISSUE_SUPPORT_LINK}
              linkHelpText={formatMessage(messages.resetPasswordFormNeedHelpText)}
              linkText={formatMessage(messages.resetPasswordFormHelpCenterLink)}
            />
            <InlineLink
              className="mb-2 font-weight-normal small"
              destination={getConfig().INFO_EMAIL}
              linkHelpText={formatMessage(messages.resetPasswordFormAdditionalHelpText)}
              linkText={getConfig().INFO_EMAIL}
            />
          </div>
        </Form>
      )}
      {isSuccess && (
        <ForgotPasswordEmailSentConfirmation />
      )}
      <form className="text-center">
        <Button
          id="reset-password-back-to-login"
          name="reset-password-back-to-login"
          variant="tertiary"
          type="submit"
          className="align-self-center back-to-login__button"
          onClick={handleSubmit}
          onMouseDown={(e) => e.preventDefault()}
        >
          {formatMessage(messages.resetPasswordBackToLoginButton)}
        </Button>
      </form>
    </Container>
  );
};

export default ForgotPasswordForm;
