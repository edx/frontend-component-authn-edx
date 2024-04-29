import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import fetchThirdPartyAuthContext from '../service';

jest.mock('@edx/frontend-platform/auth');
jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(() => ({ LMS_BASE_URL: 'http://example.com' })),
}));

describe('fetchThirdPartyAuthContext', () => {
  const mockGetAuthenticatedHttpClient = jest.fn();
  getAuthenticatedHttpClient.mockReturnValue({ get: mockGetAuthenticatedHttpClient });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch third-party auth context data successfully', async () => {
    const urlParams = { param1: 'value1', param2: 'value2' };
    const expectedUrl = 'http://example.com/api/mfe_context';

    const data = {
      contextData: {
        autoSubmitRegForm: false,
        currentProvider: 'Google',
        finishAuthUrl: 'http://test-finish-auth.com',
        providers: ['Apple', 'Facebook', 'Google', 'Microsoft'],
        secondaryProviders: ['SAML1', 'SAML2'],
        pipelineUserDetails: { name: 'john doe', email: 'john_doe@example.com', username: 'john_doe' },
        errorMessage: null,
      },
    };
    mockGetAuthenticatedHttpClient.mockResolvedValue({ data });

    const result = await fetchThirdPartyAuthContext(urlParams);

    expect(mockGetAuthenticatedHttpClient).toHaveBeenCalled();
    expect(mockGetAuthenticatedHttpClient).toHaveBeenCalledWith(expectedUrl, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      params: urlParams,
      isPublic: true,
    });
    expect(result).toEqual({ thirdPartyAuthContext: data.contextData });
  });

  it('should throw an error if the request fails', async () => {
    const urlParams = { param1: 'value1', param2: 'value2' };
    const expectedUrl = 'http://example.com/api/mfe_context';
    const errorMessage = 'Request failed';

    mockGetAuthenticatedHttpClient.mockRejectedValue(new Error(errorMessage));

    await expect(fetchThirdPartyAuthContext(urlParams)).rejects.toThrow(errorMessage);

    expect(getConfig).toHaveBeenCalled();
    expect(mockGetAuthenticatedHttpClient).toHaveBeenCalled();
    expect(mockGetAuthenticatedHttpClient).toHaveBeenCalledWith(expectedUrl, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      params: urlParams,
      isPublic: true,
    });
  });
});
