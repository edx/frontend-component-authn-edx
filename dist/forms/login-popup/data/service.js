import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import QueryString from 'query-string';

/**
 * Function for making a login request to the server.
 * This function sends a POST request to the login endpoint with the provided credentials.
 * @param {object} creds - The login credentials to be sent to the server.
 * @returns {object} An object containing the redirect URL and success status.
 */
export default async function loginRequest(creds) {
  const requestConfig = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    isPublic: true
  };
  const {
    data
  } = await getAuthenticatedHttpClient().post(`${getConfig().LMS_BASE_URL}/api/user/v2/account/login_session/`, QueryString.stringify(creds), requestConfig).catch(e => {
    throw e;
  });
  return {
    redirectUrl: data.redirect_url || `${getConfig().LMS_BASE_URL}/dashboard`,
    success: data.success || false
  };
}
//# sourceMappingURL=service.js.map