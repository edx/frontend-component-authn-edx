import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  loginFormHeading1: {
    id: 'login.form.heading.1',
    defaultMessage: 'Sign in',
    description: 'Login form main heading',
  },
  loginFormSignInButton: {
    id: 'login.form.signin.button.text',
    defaultMessage: 'Sign in',
    description: 'Sign in button label that appears on login page',
  },
  loginFormForgotPasswordButton: {
    id: 'login.form.forgot.password.button.text',
    defaultMessage: 'Forgot Password?',
    description: 'Button text for forgot password',
  },
  loginFormRegistrationHelpText: {
    id: 'login.form.sign.up.help.text',
    defaultMessage: 'Don’t have an account yet?',
    description: 'Sign up link help text',
  },
  loginFormRegistrationLink: {
    id: 'login.form.sign.up.link.text',
    defaultMessage: 'Create account',
    description: 'Text that appears on the registration button',
  },
  loginFormSchoolAndOrganizationHelpText: {
    id: 'login.form.school.and.organization.help.text',
    defaultMessage: 'Have an account through school or organization?',
    description: 'Label for school and organization login link',
  },
  loginFormSchoolAndOrganizationLink: {
    id: 'login.form.school.and.organization.link',
    defaultMessage: 'Sign in with your credentials',
    description: 'Text that appears on school and organization login link',
  },
  loginFormEmailFieldLabel: {
    id: 'login.form.email.field.label',
    defaultMessage: 'Email',
    description: 'Email field label',
  },
  loginFormPasswordFieldLabel: {
    id: 'login.form.password.field.label',
    defaultMessage: 'Password',
    description: 'Password field label',
  },
  loginFormHeading2: {
    id: 'login.form.heading.2',
    defaultMessage: 'or',
    description: 'Heading that appears between social auth and basic login form',
  },
  // error messages
  loginFailureHeaderTitle: {
    id: 'login.failure.header.title',
    defaultMessage: 'We couldn\'t sign you in.',
    description: 'Login failure header message.',
  },
  loginIncorrectCredentialsErrorResetLinkText: {
    id: 'login.incorrect.credentials.error.reset.link.text',
    defaultMessage: 'reset your password',
    description: 'Reset password link text for incorrect email or password credentials',
  },
  loginRateLimitReachedMessage: {
    id: 'login.rate.limit.reached.message',
    defaultMessage: 'Too many failed login attempts. Try again later.',
    description: 'Error message that appears when an anonymous user has made too many failed login attempts',
  },
  contactSupportLink: {
    id: 'contact.support.link',
    defaultMessage: 'contact {platformName} support',
    description: 'Link text used in inactive user error message to go to learner help center',
  },
  loginInactiveUserError: {
    id: 'login.inactive.user.error',
    defaultMessage: 'In order to sign in, you need to activate your account.{lineBreak}{lineBreak}We just sent an activation link to {email}. If you do not receive an email, check your spam folders or {supportLink}.',
    description: 'Activation account message for inactive account',
  },
  tpaAccountLink: {
    id: 'tpa.account.link',
    defaultMessage: '{provider} account',
    description: 'Link text error message used to go to SSO when staff user try to login through password.',
  },
  allowedDomainLoginError: {
    id: 'allowed.domain.login.error',
    defaultMessage: 'As {allowedDomain} user, You must login with your {allowedDomain} {tpaLink}.',
    description: 'Display this error message when staff user try to login through password',
  },
  loginFormInvalidErrorMessage: {
    id: 'login.form.invalid.error.message',
    defaultMessage: 'Please fill in the fields below.',
    description: 'Login form empty input user message',
  },
  loginIncorrectCredentialsErrorAttemptsText1: {
    id: 'login.incorrect.credentials.error.attempts.text.1',
    defaultMessage: 'The username, email or password you entered is incorrect. You have {remainingAttempts} more sign in attempts before your account is temporarily locked.',
    description: 'Error message for incorrect email or password',
  },
  loginIncorrectCredentialsErrorAttemptsText2: {
    id: 'login.incorrect.credentials.error.attempts.text.2',
    defaultMessage: "If you've forgotten your password, {resetLink}",
    description: 'Part of error message for incorrect email or password',
  },
  accountLockedOutMessage1: {
    id: 'account.locked.out.message.1',
    defaultMessage: 'To protect your account, it\'s been temporarily locked. Try again in 30 minutes.',
    description: 'Part of message for when user account has been locked out after multiple failed login attempts',
  },
  accountLockedOutMessage2: {
    id: 'account.locked.out.message.2',
    defaultMessage: 'To be on the safe side, you can {resetLink} before trying again.',
    description: 'Part of message for when user account has been locked out after multiple failed login attempts',
  },
  loginIncorrectCredentialsError: {
    id: 'login.incorrect.credentials.error',
    defaultMessage: 'The username, email, or password you entered is incorrect. Please try again.',
    description: 'Error message for incorrect email or password',
  },
  loginIncorrectCredentialsErrorWithResetLink: {
    id: 'login.incorrect.credentials.error.with.reset.link',
    defaultMessage: 'The username, email, or password you entered is incorrect. Please try again or {resetLink}.',
    description: 'Error message for incorrect email or password with multiple failure count',
  },
  internalServerErrorMessage: {
    id: 'internal.server.error.message',
    defaultMessage: 'An error has occurred. Try refreshing the page, or check your internet connection.',
    description: 'Error message that appears when server responds with 500 error code',
  },
  loginIncorrectCredentialsErrorBeforeAccountBlockedText: {
    id: 'login.incorrect.credentials.error.before.account.blocked.text',
    defaultMessage: 'click here to reset it.',
    description: 'Reset password link text for incorrect email or password credentials before blocking account',
  },
  usernameOrEmailLessCharValidationMessage: {
    id: 'username.or.email.format.validation.less.chars.message',
    defaultMessage: 'Username or email must have at least 2 characters.',
    description: 'Validation message that appears when username or email address is less than 2 characters',
  },
  usernameOrEmailValidationMessage: {
    id: 'email.validation.message',
    defaultMessage: 'Enter your username or email',
    description: 'Validation message that appears when email is empty',
  },
  passwordValidationMessage: {
    id: 'password.validation.message',
    defaultMessage: 'Enter your password',
    description: 'Validation message that appears when password is empty',
  },
  nonCompliantPasswordTitle: {
    id: 'non.compliant.password.title',
    defaultMessage: 'We recently changed our password requirements',
    description: 'A title that appears in bold before error message for non-compliant password',
  },
  nonCompliantPasswordMessage: {
    id: 'non.compliant.password.message',
    defaultMessage: 'Your current password does not meet the new security requirements. '
                    + 'We just sent a password-reset message to the email address associated with this account. '
                    + 'Thank you for helping us keep your data safe.',
    description: 'Error message for non-compliant password',
  },
  // Account Activation Strings
  accountActivationSuccessMessageTitle: {
    id: 'account.activation.success.message.title',
    defaultMessage: 'Success! You have activated your account.',
    description: 'Account Activation success message title',
  },
  accountActivationSuccessMessage: {
    id: 'account.activation.success.message',
    defaultMessage: 'You will now receive email updates and alerts from us related to the courses you are enrolled in. Sign in to continue.',
    description: 'Message show to learners when their account has been activated successfully',
  },
  accountActivationInfoMessage: {
    id: 'account.activation.info.message',
    defaultMessage: 'This account has already been activated.',
    description: 'Message shown when learner account has already been activated',
  },
  accountActivationErrorMessageTitle: {
    id: 'account.activation.error.message.title',
    defaultMessage: 'Your account could not be activated',
    description: 'Account Activation error message title',
  },
  accountActivationSupportLink: {
    id: 'account.activation.support.link',
    defaultMessage: 'contact support',
    description: 'Link text used in account activation error message to go to learner help center',
  },
  // Email Confirmation Strings
  accountConfirmationSuccessMessageTitle: {
    id: 'account.confirmation.success.message.title',
    defaultMessage: 'Success! You have confirmed your email.',
    description: 'Account verification success message title',
  },
  accountConfirmationSuccessMessage: {
    id: 'account.confirmation.success.message',
    defaultMessage: 'Sign in to continue.',
    description: 'Message show to learners when their account has been activated successfully',
  },
  accountConfirmationInfoMessage: {
    id: 'account.confirmation.info.message',
    defaultMessage: 'This email has already been confirmed.',
    description: 'Message shown when learner account has already been verified',
  },
  accountConfirmationErrorMessageTitle: {
    id: 'account.confirmation.error.message.title',
    defaultMessage: 'Your email could not be confirmed',
    description: 'Account verification error message title',
  },
});

export default messages;
