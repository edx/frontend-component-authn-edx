import messages from './messages';
import { LETTER_REGEX, NUMBER_REGEX } from '../../registration-popup/data/constants';

/**
 * It validates the password field value
 * @param value
 * @param formatMessage
 * @returns {string}
 */
const validatePasswordField = (value, formatMessage) => {
  let fieldError = '';
  if (!value || !LETTER_REGEX.test(value) || !NUMBER_REGEX.test(value) || value.length < 8) {
    fieldError = formatMessage(messages.passwordValidationMessage);
  }
  return fieldError;
};
export default validatePasswordField;
//# sourceMappingURL=validator.js.map