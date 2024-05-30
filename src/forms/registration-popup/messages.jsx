import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  registrationFormHeading1: {
    id: 'registration.form.heading.1',
    defaultMessage: 'Create account',
    description: 'registration form main heading',
  },
  registrationFormHeading2: {
    id: 'registration.form.or.heading.2',
    defaultMessage: 'or',
    description: 'Heading that appears between social auth and basic registration form',
  },
  registrationFormCreateAccountButton: {
    id: 'registration.form.continue.button',
    defaultMessage: 'Create an account for free',
    description: 'Text for submit button on registration form',
  },
  registrationFormAlreadyHaveAccountText: {
    id: 'registration.form.already.have.account.text',
    defaultMessage: 'Already have an account?',
    description: 'Login button help text',
  },
  registrationFormSignInLink: {
    id: 'registration.form.sign.in.link',
    defaultMessage: 'Sign In',
    description: 'Text for sign in link',
  },
  registrationFormSchoolOrOrganizationLink: {
    id: 'registration.form.account.school.organization.text',
    defaultMessage: 'Have an account through school or organization?',
    description: 'Label for link that leads learners to the institution login page',
  },
  registrationFormSignInWithCredentialsLink: {
    id: 'registration.form.sign.in.with.credentials.link',
    defaultMessage: 'Sign in with your credentials',
    description: 'Text for signing in with credentials',
  },
  registrationFormPasswordFieldLabel: {
    id: 'registration.form.password.label',
    defaultMessage: 'Password',
    description: 'Label for password input field',
  },
  registrationFormEmailFieldLabel: {
    id: 'registration.form.email.label',
    defaultMessage: 'Email',
    description: 'Label for email input field',
  },
  registrationFormTermsOfServiceAndHonorCodeLabel: {
    id: 'registration.form.terms.of.service.and.honor.code.label',
    defaultMessage: 'Terms of Service and Honor Code',
    description: 'Label for terms of service and honor code link',
  },
  registrationFormPrivacyPolicyLabel: {
    id: 'registration.form.privacy.policy.label',
    defaultMessage: 'Privacy Policy',
    description: 'Label for edX privacy policy link',
  },
  // error messages
  registrationFailureHeaderTitle: {
    id: 'register.failure.header.title',
    defaultMessage: 'We couldn\'t create your account.',
    description: 'Login failure header message.',
  },
  // Error messages
  registrationEmptyFormSubmissionError: {
    id: 'registration.empty.form.submission.error',
    defaultMessage: 'Please check your responses and try again.',
    description: 'Error message that appears on top of the form when empty form is submitted',
  },
  registrationRequestServerError: {
    id: 'registration.request.server.error',
    defaultMessage: 'An error has occurred. Try refreshing the page, or check your internet connection.',
    description: 'Error message for internal server error.',
  },
  registrationRateLimitError: {
    id: 'registration.rate.limit.error',
    defaultMessage: 'Too many failed registration attempts. Try again later.',
    description: 'Error message that appears when an anonymous user has made too many failed registration attempts',
  },
  registrationTPASessionExpired: {
    id: 'registration.tpa.session.expired',
    defaultMessage: 'We couldn’t create your account. Registration using {provider} has timed out.',
    description: '',
  },
  internalServerErrorMessage: {
    id: 'internal.server.error.message',
    defaultMessage: 'An error has occurred. Try refreshing the page, or check your internet connection.',
    description: 'Error message that appears when server responds with 500 error code',
  },
  registrationTPAAuthenticationFailure: {
    id: 'registration.tpa.authentication.failure',
    defaultMessage: 'We are sorry, you are not authorized to access {platform_name} via this channel. '
        + 'Please contact your learning administrator or manager in order to access {platform_name}.'
        + '{lineBreak}{lineBreak}Error Details:{lineBreak}{errorMessage}',
    description: 'Error message third party authentication pipeline fails',
  },
  registrationFormSubmissionError: {
    id: 'registration.form.submission.error',
    defaultMessage: 'We couldn’t create your account. Please correct the errors below.',
    description: 'Error message that appears when form submit with errors',
  },
});

export default messages;
