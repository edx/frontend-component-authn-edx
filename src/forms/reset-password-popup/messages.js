import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  resetPasswordFormHeading: {
    id: 'reset.password.form.heading',
    defaultMessage: 'Reset Password',
    description: 'Reset password form main heading',
  },
  resetPasswordFormSubmitButton: {
    id: 'reset.password.form.submit.button',
    defaultMessage: 'Submit',
    description: 'Text for submit button on reset password form',
  },
  resetPasswordFormNeedHelpText: {
    id: 'reset.password.form.need.help.text',
    defaultMessage: 'Need help signing in?',
    description: 'reset Password help text',
  },
  resetPasswordFormHelpCenterLink: {
    id: 'reset.password.form.help.center.link',
    defaultMessage: 'Help center',
    description: 'Text for help center link',
  },
  resetPasswordFormAdditionalHelpText: {
    id: 'reset.password.form.additional.help.text',
    defaultMessage: 'For additional help, contact edX support at',
    description: 'Label for link that leads learners to the email page',
  },
  resetPasswordBackToLoginButton: {
    id: 'reset.password.back.to.login.button',
    defaultMessage: 'Back to login',
    description: 'Text for back to login button on reset password form',
  },
  newPasswordLabel: {
    id: 'new.password.label',
    defaultMessage: 'New password',
    description: 'New password field label for the reset password page.',
  },
  confirmPasswordLabel: {
    id: 'confirm.password.label',
    defaultMessage: 'Confirm password',
    description: 'Confirm password field label for the reset password page.',
  },
  resetPasswordButton: {
    id: 'reset.password.button',
    defaultMessage: 'Reset password',
    description: 'Button text for reset password popup.',
  },
  enterConfirmPasswordMessage: {
    id: 'enter.confirm.password.message',
    defaultMessage: 'Enter and confirm the new password',
    description: 'Message for entering and confirming the new password',
  },
  // email sent messages
  emailSentMessage: {
    id: 'email.sent.message',
    defaultMessage: 'Email has been sent',
    description: 'Notification message indicating that an email has been sent',
  },
  // validation errors
  passwordRequiredMessage: {
    id: 'password.required.message',
    defaultMessage: 'Password is a required field',
    description: 'Error message for empty password',
  },
  passwordValidationMessage: {
    id: 'password.validation.message',
    defaultMessage: 'Password criteria has not been met',
    description: 'Error message for invalid password',
  },
  passwordDoNotMatch: {
    id: 'passwords.do.not.match',
    defaultMessage: 'Passwords do not match',
    description: 'Password format error.',
  },
  confirmYourPassword: {
    id: 'confirm.your.password',
    defaultMessage: 'Confirm your password',
    description: 'Field validation message when confirm password is empty',
  },
  // alert banner strings
  resetPasswordFailureHeading: {
    id: 'reset.password.failure.heading',
    defaultMessage: 'We couldn\'t reset your password.',
    description: 'Heading for reset password request failure',
  },
  forgotPasswordFormEmailFieldLabel: {
    id: 'forgot.Password.form.email.label',
    defaultMessage: 'Email',
    description: 'Label for email input field',
  },
  forgotPasswordEmptyEmailFieldError: {
    id: 'forgot.password.empty.email.field.error',
    defaultMessage: 'Email is required',
    description: 'Error message that appears when user tries to submit empty email field',
  },
  forgotPasswordPageInvalidEmaiMessage: {
    id: 'forgot.password.page.invalid.email.message',
    defaultMessage: 'Enter a valid email address',
    description: 'Invalid email address message for input field.',
  },
  forgotPasswordInternalServerError: {
    id: 'forgot.password.internal.server.error',
    defaultMessage: 'An error has occurred. Try refreshing the page, or check your internet connection.',
    description: 'Error message that appears when server responds with 500 error code',
  },
  forgotPasswordErrorAlertTitle: {
    id: 'forgot.password.error.alert.title.',
    defaultMessage: 'We were unable to contact you.',
    description: 'Failed to send password recovery email.',
  },
  forgotPasswordExtendFieldErrors: {
    id: 'forgot.password.extend.field.errors',
    defaultMessage: '{emailError} below.',
    description: 'extends the field error for alert message',
  },
  forgotPasswordRequestInProgressMessage: {
    id: 'forgot.password.request.in.progress.message',
    defaultMessage: 'Your previous request is in progress, please try again in a few moments.',
    description: 'Message displayed when previous password reset request is still in progress.',
  },

});

export default messages;
