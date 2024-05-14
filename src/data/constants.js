// Forms
export const LOGIN_FORM = 'login';
export const REGISTRATION_FORM = 'registration';
export const VALID_FORMS = [LOGIN_FORM, REGISTRATION_FORM];

// Common States
export const DEFAULT_STATE = 'default';
export const PENDING_STATE = 'pending';
export const COMPLETE_STATE = 'complete';
export const FAILURE_STATE = 'failure';

// Error Codes
export const INTERNAL_SERVER_ERROR = 'internal-server-error';
export const FORBIDDEN_REQUEST = 'forbidden-request';
export const INVALID_FORM = 'invalid-form';

// URL Paths
export const ENTERPRISE_LOGIN_URL = '/enterprise/login';

// Query string parameters that can be passed to LMS to manage
// things like auto-enrollment upon login and registration.
export const VALID_AUTH_PARAMS = [
  'course_id', 'enrollment_action', 'course_mode', 'email_opt_in', 'purchase_workflow', 'next',
];
