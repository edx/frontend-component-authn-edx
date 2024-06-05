import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

/**
 * Function for making a account request to the server.
 * This function sends a PATCH request to the account endpoint with the provided payload.
 * @param {object} payload - The payload to be sent to the server.
 * @param {string} username - username will be used to prepare the accounts URL
 * @returns {object} An object containing the response status.
 */
export default async function patchAccount(username, payload) {
  const requestConfig = {
    headers: { 'Content-Type': 'application/merge-patch+json' },
  };

  const { status } = await getAuthenticatedHttpClient()
    .patch(
      `${getConfig().LMS_BASE_URL}/api/user/v1/accounts/${username}`,
      payload,
      requestConfig,
    )
    .catch((error) => {
      throw (error);
    });
  return { status };
}
