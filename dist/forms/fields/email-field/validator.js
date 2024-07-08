function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import { distance } from 'fastest-levenshtein';
import { COMMON_EMAIL_PROVIDERS, DEFAULT_SERVICE_PROVIDER_DOMAINS, DEFAULT_TOP_LEVEL_DOMAINS } from './constants';
import messages from './messages';
import { VALID_EMAIL_REGEX } from '../../registration-popup/data/constants';
export const emailRegex = new RegExp(VALID_EMAIL_REGEX, 'i');
export const getLevenshteinSuggestion = function (word, knownWords) {
  let similarityThreshold = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 4;
  if (!word) {
    return null;
  }
  let minEditDistance = 100;
  let mostSimilar = word;
  for (let i = 0; i < knownWords.length; i++) {
    const editDistance = distance(knownWords[i].toLowerCase(), word.toLowerCase());
    if (editDistance < minEditDistance) {
      minEditDistance = editDistance;
      mostSimilar = knownWords[i];
    }
  }
  return minEditDistance <= similarityThreshold && word !== mostSimilar ? mostSimilar : null;
};
export const getSuggestionForInvalidEmail = (domain, username) => {
  if (!domain) {
    return '';
  }
  const defaultDomains = ['yahoo', 'aol', 'hotmail', 'live', 'outlook', 'gmail'];
  const suggestion = getLevenshteinSuggestion(domain, COMMON_EMAIL_PROVIDERS);
  if (suggestion) {
    return `${username}@${suggestion}`;
  }
  for (let i = 0; i < defaultDomains.length; i++) {
    if (domain.includes(defaultDomains[i])) {
      return `${username}@${defaultDomains[i]}.com`;
    }
  }
  return '';
};
export const validateEmailAddress = (value, username, domainName) => {
  let suggestion = null;
  const validation = {
    hasError: false,
    suggestion: '',
    type: ''
  };
  const hasMultipleSubdomains = value.match(/\./g).length > 1;
  const [serviceLevelDomain, topLevelDomain] = domainName.split('.');
  const tldSuggestion = !DEFAULT_TOP_LEVEL_DOMAINS.includes(topLevelDomain);
  const serviceSuggestion = getLevenshteinSuggestion(serviceLevelDomain, DEFAULT_SERVICE_PROVIDER_DOMAINS, 2);
  if (DEFAULT_SERVICE_PROVIDER_DOMAINS.includes(serviceSuggestion || serviceLevelDomain)) {
    suggestion = `${username}@${serviceSuggestion || serviceLevelDomain}.com`;
  }
  if (!hasMultipleSubdomains && tldSuggestion) {
    validation.suggestion = suggestion;
    validation.type = 'error';
  } else if (serviceSuggestion) {
    validation.suggestion = suggestion;
    validation.type = 'warning';
  } else {
    suggestion = getLevenshteinSuggestion(domainName, COMMON_EMAIL_PROVIDERS, 3);
    if (suggestion) {
      validation.suggestion = `${username}@${suggestion}`;
      validation.type = 'warning';
    }
  }
  if (!hasMultipleSubdomains && tldSuggestion) {
    validation.hasError = true;
  }
  return validation;
};
const validateEmail = (value, formatMessage) => {
  let fieldError = '';
  let emailSuggestion = {
    suggestion: '',
    type: ''
  };
  if (!value) {
    fieldError = formatMessage(messages.emptyEmailFieldError);
  } else if (value.length <= 2) {
    fieldError = formatMessage(messages.emailInvalidFormaterror);
  } else {
    const [username, domainName] = value.split('@');
    // Check if email address is invalid. If we have a suggestion for invalid email
    // provide that along with the error message.
    if (!emailRegex.test(value)) {
      fieldError = formatMessage(messages.emailInvalidFormaterror);
      emailSuggestion = {
        suggestion: getSuggestionForInvalidEmail(domainName, username),
        type: 'error'
      };
    } else {
      const response = validateEmailAddress(value, username, domainName);
      if (response.hasError) {
        fieldError = formatMessage(messages.emailInvalidFormaterror);
        delete response.hasError;
      }
      emailSuggestion = _objectSpread({}, response);
    }
  }
  return {
    fieldError,
    suggestion: emailSuggestion
  };
};
export default validateEmail;
//# sourceMappingURL=validator.js.map