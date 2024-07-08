import messages from './messages';

// regex more focused towards url matching
export const URL_REGEX = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi; // eslint-disable-line no-useless-escape

// regex for html tags
export const HTML_REGEX = /<|>/u;

// regex from backend
export const INVALID_NAME_REGEX = /https?:\/\/(?:[-\w.]|(?:%[\da-fA-F]{2}))*/g;
const validateName = (value, formatMessage) => {
  let fieldError = '';
  if (!value.trim()) {
    fieldError = formatMessage(messages.emptyNameFieldError);
  } else if (URL_REGEX.test(value) || HTML_REGEX.test(value) || INVALID_NAME_REGEX.test(value)) {
    fieldError = formatMessage(messages.nameValidationMessage);
  }
  return fieldError;
};
export default validateName;
//# sourceMappingURL=validator.js.map