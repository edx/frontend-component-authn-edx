import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import formurlencoded from 'form-urlencoded';

import forgotPasswordService from '../service';

jest.mock('@edx/frontend-platform/auth');
jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(() => ({ LMS_BASE_URL: 'http://example.com' })),
}));

describe('forgotPasswordService Tests', () => {
  const mockGetAuthenticatedHttpClient = jest.fn();
  getAuthenticatedHttpClient.mockReturnValue({ post: mockGetAuthenticatedHttpClient });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send a POST request with the provided email', async () => {
    const mockEmail = 'test@example.com';
    const mockResponseData = { message: 'Password reset email sent' };

    mockGetAuthenticatedHttpClient.mockResolvedValue({ data: mockResponseData });

    await forgotPasswordService(mockEmail);

    expect(getAuthenticatedHttpClient).toHaveBeenCalled();
    expect(mockGetAuthenticatedHttpClient).toHaveBeenCalledWith(
      'http://example.com/account/password',
      formurlencoded({ email: mockEmail }),
      expect.any(Object),
    );
  });

  it('should throw an error if the request fails', async () => {
    const mockEmail = 'test@example.com';
    const errorMessage = 'Forgot password request failed';

    mockGetAuthenticatedHttpClient.mockRejectedValue(new Error(errorMessage));

    await expect(forgotPasswordService(mockEmail)).rejects.toThrow(errorMessage);

    expect(getAuthenticatedHttpClient).toHaveBeenCalled();
    expect(mockGetAuthenticatedHttpClient).toHaveBeenCalledWith(
      'http://example.com/account/password',
      formurlencoded({ email: mockEmail }),
      expect.any(Object),
    );
  });
});
