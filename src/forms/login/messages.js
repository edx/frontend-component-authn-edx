import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  loginFormHeading1: {
    id: 'login.form.heading.1',
    defaultMessage: 'Login',
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
    id: 'login.form.sign.up.helping.text',
    defaultMessage: 'Don’t have an account yet?',
    description: 'Sign up link help text',
  },
  loginFormRegistrationLink: {
    id: 'login.form.sign.up.link.text',
    defaultMessage: 'Create an account',
    description: 'Text that appears on the registration button',
  },
  loginFormEmailFieldLabel: {
    id: 'login.form.email.field.text',
    defaultMessage: 'Email',
    description: 'Email field label',
  },
  loginFormPasswordFieldLabel: {
    id: 'login.form.password.field.text',
    defaultMessage: 'Password',
    description: 'Password field label',
  },
  loginFormHeading2: {
    id: 'login.form.or.message',
    defaultMessage: 'or',
    description: 'Heading that appears between social auth and basic login form',
  },
});

export default messages;
