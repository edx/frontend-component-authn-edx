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
