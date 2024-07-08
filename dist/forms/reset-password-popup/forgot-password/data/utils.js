import { VALID_EMAIL_REGEX } from '../../../../data/constants';
import messages from '../../messages';

/**
 * Email Validation Function. It checks if the provided email value is either empty or does not match
 * the regular expression for a valid email format. If the value is invalid, it returns
 * a corresponding error message formatted using the provided `formatMessage` function.
 *
 * @param {string} value - The email value to be validated.
 * @param {function} formatMessage - The function to format the error message.
 * @returns {string} - An error message if the email value is invalid, otherwise an empty string.
 */
const getValidationMessage = (value, formatMessage) => {
  const emailRegex = new RegExp(VALID_EMAIL_REGEX, 'i');
  let error = '';
  if (value === undefined || value === '') {
    error = formatMessage(messages.forgotPasswordEmptyEmailFieldError);
  } else if (!emailRegex.test(value)) {
    error = formatMessage(messages.forgotPasswordPageInvalidEmaiMessage);
  }
  return error;
};
export default getValidationMessage;
//# sourceMappingURL=utils.js.map