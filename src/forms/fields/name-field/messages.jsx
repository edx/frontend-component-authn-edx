import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  emptyNameFieldError: {
    id: 'empty.name.field.error',
    defaultMessage: 'Full name is required',
    description: 'Error message for empty fullname field',
  },
  nameValidationMessage: {
    id: 'name.validation.message',
    defaultMessage: 'Enter a valid name',
    description: 'Validation message that appears when fullname contain URL',
  },
});

export default messages;
