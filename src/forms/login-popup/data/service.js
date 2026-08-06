import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import QueryString from 'query-string';

const LOGIN_IDENTIFIER_MAX_LENGTH = 320;
const LOGIN_IDENTIFIER_REGEX = /^(?:[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}|[A-Za-z0-9_.@-]+)$/;
const INVALID_INPUT_PLACEHOLDER = '[invalid input]';

/**
 * Returns a trimmed login identifier value.
 * @param {string} value
 * @returns {string}
 */
export function normalizeLoginIdentifier(value) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim();
}

/**
 * Validates login identifiers (username or email) against safe expected patterns.
 * @param {string} value
 * @returns {boolean}
 */
export function isValidLoginIdentifier(value) {
  const normalizedValue = normalizeLoginIdentifier(value);

  return (
    normalizedValue.length >= 2
    && normalizedValue.length <= LOGIN_IDENTIFIER_MAX_LENGTH
    && LOGIN_IDENTIFIER_REGEX.test(normalizedValue)
  );
}

/**
 * Ensures reflected login identifiers in UI context are safe and normalized.
 * @param {string} value
 * @returns {string}
 */
export function sanitizeReflectedLoginIdentifier(value) {
  const normalizedValue = normalizeLoginIdentifier(value);
  return isValidLoginIdentifier(normalizedValue) ? normalizedValue : INVALID_INPUT_PLACEHOLDER;
}

/**
 * Validates and normalizes login request payload.
 * Throws before any network call when malformed values are found.
 * @param {object} creds
 * @returns {object}
 */
export function validateLoginCredentials(creds) {
  const normalizedCreds = { ...creds };
  const identifier = normalizeLoginIdentifier(normalizedCreds.email_or_username);

  if (!isValidLoginIdentifier(identifier)) {
    throw new TypeError('Invalid email_or_username. Expected a valid username or email format.');
  }

  normalizedCreds.email_or_username = identifier;
  return normalizedCreds;
}

/**
 * Function for making a login request to the server.
 * This function sends a POST request to the login endpoint with the provided credentials.
 * @param {object} creds - The login credentials to be sent to the server.
 * @returns {object} An object containing the redirect URL and success status.
 */
export default async function loginRequest(creds) {
  const validatedCreds = validateLoginCredentials(creds);

  const requestConfig = {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    isPublic: true,
  };

  const { data } = await getAuthenticatedHttpClient()
    .post(
      `${getConfig().LMS_BASE_URL}/api/user/v2/account/login_session/`,
      QueryString.stringify(validatedCreds),
      requestConfig,
    )
    .catch((e) => {
      throw (e);
    });

  return {
    redirectUrl: data.redirect_url || `${getConfig().LMS_BASE_URL}/dashboard`,
    success: data.success || false,
  };
}
