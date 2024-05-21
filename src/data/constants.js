// Forms
export const LOGIN_FORM = 'login';
export const REGISTRATION_FORM = 'registration';
export const FORGOT_PASSWORD_FORM = 'forgot-password';
export const PROGRESSIVE_PROFILING_FORM = 'progressive-profiling';
export const ENTERPRISE_LOGIN = 'enterprise-login';
export const VALID_FORMS = [LOGIN_FORM, REGISTRATION_FORM];

// Common States
export const DEFAULT_STATE = 'default';
export const PENDING_STATE = 'pending';
export const COMPLETE_STATE = 'complete';
export const FAILURE_STATE = 'failure';
export const FORBIDDEN_STATE = 'forbidden';

// Error Codes
export const INTERNAL_SERVER_ERROR = 'internal-server-error';
export const FORBIDDEN_REQUEST = 'forbidden-request';
export const INVALID_FORM = 'invalid-form';
export const TPA_AUTHENTICATION_FAILURE = 'tpa-authentication-failure';
export const TPA_SESSION_EXPIRED = 'tpa-session-expired';

// URL Paths
export const ENTERPRISE_LOGIN_URL = '/enterprise/login';

// Query string parameters that can be passed to LMS to manage
// things like auto-enrollment upon login and registration.
export const VALID_AUTH_PARAMS = [
  'course_id', 'enrollment_action', 'course_mode', 'email_opt_in', 'purchase_workflow', 'next', 'tpa_hint', 'account_activation_status',
];

// Regular expression for validating email addresses.
export const VALID_EMAIL_REGEX = '(^[-!#$%&\'*+/=?^_`{}|~0-9A-Z]+(\\.[-!#$%&\'*+/=?^_`{}|~0-9A-Z]+)*'
                                 + '|^"([\\001-\\010\\013\\014\\016-\\037!#-\\[\\]-\\177]|\\\\[\\001-\\011\\013\\014\\016-\\177])*"'
                                 + ')@((?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\\.)+)(?:[A-Z0-9-]{2,63})'
                                 + '|\\[(25[0-5]|2[0-4]\\d|[0-1]?\\d?\\d)(\\.(25[0-5]|2[0-4]\\d|[0-1]?\\d?\\d)){3}\\]$';
