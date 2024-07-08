function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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
const isFormValid = (payload, errors, formatMessage) => {
  const fieldErrors = _objectSpread({}, errors);
  let isValid = true;
  let emailSuggestion = {
    suggestion: '',
    type: ''
  };
  Object.keys(payload).forEach(key => {
    switch (key) {
      case 'name':
        fieldErrors.name = validateName(payload.name, formatMessage);
        if (fieldErrors.name) {
          isValid = false;
        }
        break;
      case 'email':
        {
          const {
            fieldError,
            suggestion
          } = validateEmail(payload.email, formatMessage);
          if (fieldError) {
            fieldErrors.email = fieldError;
            isValid = false;
          }
          emailSuggestion = suggestion;
          if (fieldErrors.email) {
            isValid = false;
          }
          break;
        }
      case 'password':
        fieldErrors.password = validatePasswordField(payload.password, formatMessage);
        if (fieldErrors.password) {
          isValid = false;
        }
        break;
      default:
        break;
    }
  });
  return {
    isValid,
    fieldErrors,
    emailSuggestion
  };
};
export default isFormValid;
//# sourceMappingURL=utils.js.map