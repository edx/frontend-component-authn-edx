import validateEmail from '../../fields/email-field/validator';
import validateName from '../../fields/name-field/validator';
import validatePasswordField from '../../fields/password-field/validator';

/**
 * It accepts complete registration data as payload and checks if the form is valid.
 * @param payload
 * @param errors
 * @param configurableFormFields
 * @param fieldDescriptions
 * @param formatMessage
 * @returns {{fieldErrors, isValid: boolean}}
 */
const isFormValid = (
  payload,
  errors,
  formatMessage,
) => {
  const fieldErrors = { ...errors };
  let isValid = true;
  let emailSuggestion = { suggestion: '', type: '' };

  Object.keys(payload).forEach(key => {
    switch (key) {
    case 'name':
      fieldErrors.name = validateName(payload.name, formatMessage);
      if (fieldErrors.name) { isValid = false; }
      break;
    case 'email': {
      const {
        fieldError, suggestion,
      } = validateEmail(payload.email, formatMessage);
      if (fieldError) {
        fieldErrors.email = fieldError;
        isValid = false;
      }
      emailSuggestion = suggestion;
      if (fieldErrors.email) { isValid = false; }
      break;
    }
    case 'password':
      fieldErrors.password = validatePasswordField(payload.password, formatMessage);
      if (fieldErrors.password) { isValid = false; }
      break;
    default:
      break;
    }
  });

  return { isValid, fieldErrors, emailSuggestion };
};

// const preparePayload = (formFields, totalRegistrationTime, currentProvider, isLoginSSOIntent, backendCountryCode, ) => {
//
// }
export default isFormValid;
