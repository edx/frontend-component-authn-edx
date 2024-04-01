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
  registrationFormEmailFieldLabel: {
    id: 'registration.form.email.label',
    defaultMessage: 'Email',
    description: 'Label for email input field',
  },
  registrationFormFullNameFieldLabel: {
    id: 'registration.form.full.name.label',
    defaultMessage: 'Full Name',
    description: 'Label for full name input field',
  },
  registrationFormPasswordFieldLabel: {
    id: 'registration.form.password.label',
    defaultMessage: 'Password',
    description: 'Label for password input field',
  },
  registrationFormOptOutLabel: {
    id: 'registration.Form.opt.out.label',
    defaultMessage: 'I don’t want to receive marketing messages from edX',
    description: 'Label marketing email opt out option on registration form',
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
});

export default messages;
