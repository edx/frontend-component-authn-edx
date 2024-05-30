import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

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
