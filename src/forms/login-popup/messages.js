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
});

export default messages;
