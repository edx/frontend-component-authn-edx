import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import QueryString from 'query-string';

const MAX_TOTAL_REGISTRATION_TIME_SECONDS = 86400;

/**
 * Validates and normalizes registration payload values that must follow strict types.
 * Throws before any network call when malformed values are found.
 * @param {object} registrationInformation
 * @returns {object}
 */
export function validateRegistrationInformation(registrationInformation) {
  const normalizedPayload = { ...registrationInformation };
  const totalRegistrationTime = normalizedPayload.total_registration_time;

  if (totalRegistrationTime !== undefined) {
    if (
      typeof totalRegistrationTime !== 'number'
      || !Number.isFinite(totalRegistrationTime)
      || totalRegistrationTime < 0
      || totalRegistrationTime > MAX_TOTAL_REGISTRATION_TIME_SECONDS
    ) {
      throw new TypeError('Invalid total_registration_time. Expected a finite number between 0 and 86400 seconds.');
    }
  }

  return normalizedPayload;
}

/**
 * Function for making a registration request to the server.
 * This function sends a POST request to the registration endpoint with the provided registration information.
 * @param {object} registrationInformation - The registration information to be sent to the server.
 * @returns {object} An object containing the redirect URL, success status, and authenticated user details.
 */
export default async function registerRequest(registrationInformation) {
  const validatedRegistrationInformation = validateRegistrationInformation(registrationInformation);

  const requestConfig = {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    isPublic: true,
  };

  const { data } = await getAuthenticatedHttpClient()
    .post(
      `${getConfig().LMS_BASE_URL}/api/user/v2/account/registration/`,
      QueryString.stringify(validatedRegistrationInformation),
      requestConfig,
    )
    .catch((e) => {
      throw (e);
    });

  return {
    redirectUrl: data.redirect_url || `${getConfig().LMS_BASE_URL}/dashboard`,
    success: data.success || false,
    authenticatedUser: data.authenticated_user,
  };
}

export async function getFieldsValidations(formPayload) {
  const requestConfig = {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    isPublic: true,
  };

  const { data } = await getAuthenticatedHttpClient()
    .post(
      `${getConfig().LMS_BASE_URL}/api/user/v1/validation/registration`,
      QueryString.stringify(formPayload),
      requestConfig,
    )
    .catch((e) => {
      throw (e);
    });

  return {
    fieldValidations: data,
  };
}
