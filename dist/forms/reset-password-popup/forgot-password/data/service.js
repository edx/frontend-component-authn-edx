import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import formurlencoded from 'form-urlencoded';

/**
 * Function to handle forgot password requests.
 * This function sends a POST request to the LMS backend to initiate a password reset for the provided email.
 *
 * @param {string} email - The email address for which the password reset is requested.
 * @returns {Promise<Object>} - A promise that resolves with the response data from the LMS backend.
 * @throws {Error} - Throws an error if the HTTP request fails.
 */
export default async function forgotPasswordService(email) {
  const requestConfig = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    isPublic: true
  };
  const {
    data
  } = await getAuthenticatedHttpClient().post(`${getConfig().LMS_BASE_URL}/account/password`, formurlencoded({
    email
  }), requestConfig).catch(e => {
    throw e;
  });
  return data;
}
//# sourceMappingURL=service.js.map