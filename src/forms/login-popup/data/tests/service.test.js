import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import loginRequest from '../service';

jest.mock('@edx/frontend-platform/auth');
jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(() => ({ LMS_BASE_URL: 'http://example.com' })),
}));

describe('loginRequest Tests', () => {
  const mockGetAuthenticatedHttpClient = jest.fn();
  getAuthenticatedHttpClient.mockReturnValue({ post: mockGetAuthenticatedHttpClient });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return redirect URL and success status if request succeeds', async () => {
    const mockCreds = { username: 'testuser', password: 'testpassword' };
    const mockData = {
      redirectUrl: 'http://example.com/dashboard',
      success: true,
    };

    mockGetAuthenticatedHttpClient.mockResolvedValue({ data: mockData });

    const result = await loginRequest(mockCreds);

    expect(result).toEqual({
      redirectUrl: mockData.redirectUrl,
      success: mockData.success,
    });
  });

  it('should throw an error if the request fails', async () => {
    const mockCreds = { username: 'testuser', password: 'testpassword' };
    const errorMessage = 'Login request failed';

    mockGetAuthenticatedHttpClient.mockRejectedValue(new Error(errorMessage));

    await expect(loginRequest(mockCreds)).rejects.toThrow(errorMessage);

    expect(getConfig).toHaveBeenCalled();
    expect(mockGetAuthenticatedHttpClient).toHaveBeenCalled();
  });
});
