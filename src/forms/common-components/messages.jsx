import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  loginTpaAccountNotLinked: {
    id: 'login.third.party.auth.account.not.linked',
    defaultMessage: 'You have successfully signed into {currentProvider}, but your {currentProvider} '
                    + 'account does not have a linked {platformName} account. To link your accounts, '
                    + 'sign in now using your {platformName} password.',
    description: 'Message that appears on login page if user has successfully authenticated with social '
                  + 'auth but no associated platform account exists',
  },
  registerTpaAccountNotLinked: {
    id: 'register.third.party.auth.account.not.linked',
    defaultMessage: 'You\'ve successfully signed into {currentProvider}! We just need a little more information '
                    + 'before you start learning with {platformName}.',
    description: 'Message that appears on register page if user has successfully authenticated with TPA '
                  + 'but no associated platform account exists',
  },
  TPAAuthenticationFailure: {
    id: 'tpa.authentication.failure',
    defaultMessage: 'We are sorry, you are not authorized to access {platform_name} via this channel. '
        + 'Please contact your learning administrator or manager in order to access {platform_name}.'
        + '{lineBreak}{lineBreak}Error Details:{lineBreak}{errorMessage}',
    description: 'Error message third party authentication pipeline fails',
  },
});

export default messages;
