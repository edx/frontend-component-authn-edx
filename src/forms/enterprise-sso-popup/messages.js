import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  enterprisetpaTitleHeading: {
    id: 'enterprisetpa.title.heading',
    defaultMessage: 'Would you like to sign in using your {providerName} credentials?',
    description: 'Header text used in enterprise third party authentication',
  },
  enterprisetpaLoginButtonText: {
    id: 'enterprisetpa.login.button.text',
    defaultMessage: 'Show me other ways to sign in or register',
    description: 'Button text for login',
  },
  enterpriseTpaProviderSigninTitle: {
    id: 'social.auth.provide.signin.title',
    defaultMessage: 'Sign in with {providerName}',
    description: 'Title that appears on the TPA provider buttons i.e Sign in with Google',
  },
});

export default messages;
