import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  registerFormHeading: {
    id: 'register.form.heading',
    defaultMessage: 'Create account',
    description: 'Register form main heading',
  },
  registerFormOrText: {
    id: 'register.form.or.message',
    defaultMessage: 'or',
    description: 'Heading that appears between social auth and basic registration form',
  },
  registerFormEmailFieldLabel: {
    id: 'register.form.email.label',
    defaultMessage: 'Email',
    description: 'Label for email input field',
  },
  registerFormFullNameFieldLabel: {
    id: 'register.form.full.name.label',
    defaultMessage: 'Full Name',
    description: 'Label for full name input field',
  },
  registerFormPasswordFieldLabel: {
    id: 'register.form.password.label',
    defaultMessage: 'Password',
    description: 'Label for password input field',
  },
  registerFormOptOutLabel: {
    id: 'register.Form.opt.out.label',
    defaultMessage: 'I don’t want to receive marketing messages from edX',
    description: 'Text for opt out option on register popup.',
  },
  registerFormContinueButton: {
    id: 'register.form.continue.button',
    defaultMessage: 'Continue',
    description: 'Text for submit button',
  },
  registerFormAlreadyHaveAccountText: {
    id: 'register.form.already.have.account.text',
    defaultMessage: 'Already have an account?',
    description: 'Text for already have an account',
  },
  registerFormSignInLink: {
    id: 'register.form.sign.in.link',
    defaultMessage: 'Sign In',
    description: 'Text for signing in',
  },
  registerFormAccountSchoolOrganizationText: {
    id: 'register.form.account.school.organization.text',
    defaultMessage: 'Have an account through school or organization?',
    description: 'Text for having an account through school or organization',
  },
  registerFormSignInWithCredentialsLink: {
    id: 'register.form.sign.in.with.credentials.link',
    defaultMessage: 'Sign in with your credentials',
    description: 'Text for signing in with credentials',
  },
});

export default messages;
