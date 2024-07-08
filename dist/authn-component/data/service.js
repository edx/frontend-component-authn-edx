import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

/**
 * Fetches third-party authentication context data from the specified URL with the given parameters.
 *
 * @param {Object} urlParams - The URL parameters to include in the request.
 * @returns {Object} An object containing the third-party authentication context data.
 * @throws {Error} If the request fails.
 */
async function fetchThirdPartyAuthContext(urlParams) {
  const requestConfig = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    params: urlParams,
    isPublic: true
  };
  const {
    data
  } = await getAuthenticatedHttpClient().get(`${getConfig().LMS_BASE_URL}/api/mfe_context`, requestConfig).catch(e => {
    throw e;
  });
  return {
    thirdPartyAuthContext: data.contextData || {}
  };
}
export default fetchThirdPartyAuthContext;
//# sourceMappingURL=service.js.map