import { defineMessages } from '@edx/frontend-platform/i18n';
const messages = defineMessages({
  showPasswordAlt: {
    id: 'show.password',
    defaultMessage: 'Show password',
    description: 'aria label for show password icon on password field'
  },
  hidePasswordAlt: {
    id: 'hide.password',
    defaultMessage: 'Hide password',
    description: 'aria label for hide password icon on password field'
  },
  oneLetter: {
    id: 'one.letter',
    defaultMessage: '1 letter',
    description: 'password requirement to have 1 letter'
  },
  oneNumber: {
    id: 'one.number',
    defaultMessage: '1 number',
    description: 'password requirement to have 1 number'
  },
  eightCharacters: {
    id: 'eight.characters',
    defaultMessage: '8 characters',
    description: 'password requirement to have a minimum of 8 characters'
  },
  passwordValidationMessage: {
    id: 'password.validation.message',
    defaultMessage: 'Password criteria has not been met',
    description: 'Error message for empty or invalid password'
  }
});
export default messages;
//# sourceMappingURL=messages.js.map