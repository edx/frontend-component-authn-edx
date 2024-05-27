const LETTER_REGEX = /[a-zA-Z]/;
const NUMBER_REGEX = /\d/;

// Registration Error Codes
export const FORBIDDEN_REQUEST = 'forbidden-request';
export const FORM_SUBMISSION_ERROR = 'form-submission-error';
export const INTERNAL_SERVER_ERROR = 'internal-server-error';
export const TPA_AUTHENTICATION_FAILURE = 'tpa-authentication-failure';
export const TPA_SESSION_EXPIRED = 'tpa-session-expired';

export const VALID_EMAIL_REGEX = '(^[-!#$%&\'*+/=?^_`{}|~0-9A-Z]+(\\.[-!#$%&\'*+/=?^_`{}|~0-9A-Z]+)*'
                                 + '|^"([\\001-\\010\\013\\014\\016-\\037!#-\\[\\]-\\177]|\\\\[\\001-\\011\\013\\014\\016-\\177])*"'
                                 + ')@((?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\\.)+)(?:[A-Z0-9-]{2,63})'
                                 + '|\\[(25[0-5]|2[0-4]\\d|[0-1]?\\d?\\d)(\\.(25[0-5]|2[0-4]\\d|[0-1]?\\d?\\d)){3}\\]$';

export {
  LETTER_REGEX, NUMBER_REGEX,
};
