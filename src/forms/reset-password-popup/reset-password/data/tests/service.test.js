// service.test.js

import formurlencoded from 'form-urlencoded';

import { resetPasswordRequest, validatePasswordRequest, validateTokenRequest } from '../service';

// Mocking getConfig and getHttpClient from @edx/frontend-platform
jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(() => ({ LMS_BASE_URL: 'https://example.com' })),
}));

const mockPost = jest.fn();

// Mocking getHttpClient from @edx/frontend-platform/auth
jest.mock('@edx/frontend-platform/auth', () => ({
  getHttpClient: jest.fn(() => ({
    post: mockPost,
  })),
}));

describe('Service Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mock function calls before each test
  });

  // Test validateTokenRequest function
  describe('validateTokenRequest', () => {
    it('should validate token', async () => {
      const mockData = { };
      const token = 'mockToken';

      mockPost.mockResolvedValueOnce({ data: mockData });

      const result = await validateTokenRequest(token);
      expect(result).toEqual(mockData);
      expect(mockPost).toHaveBeenCalledWith(
        'https://example.com/user_api/v1/account/password_reset/token/validate/',
        'token=mockToken',
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );
    });

    it('should throw error if request fails', async () => {
      const token = 'mockToken';

      // Mocking post method of getHttpClient to simulate error
      mockPost.mockRejectedValueOnce(new Error('Request failed'));

      await expect(validateTokenRequest(token)).rejects.toThrowError('Request failed');
    });
  });

  // Test resetPasswordRequest function
  describe('resetPasswordRequest', () => {
    it('should return data if request is successful', async () => {
      const payload = { password: 'newpassword' };
      const token = 'mockToken';
      const queryParams = { is_account_recovery: true };
      const mockData = { success: true };

      mockPost.mockResolvedValueOnce({ data: mockData });

      const result = await resetPasswordRequest(payload, token, queryParams);
      expect(result).toEqual(mockData);
      expect(mockPost).toHaveBeenCalledWith(
        'https://example.com/password/reset/mockToken/?is_account_recovery=true',
        formurlencoded(payload),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );
    });

    it('should throw error if request fails', async () => {
      const payload = { password: 'newpassword' };
      const token = 'mockToken';
      const queryParams = { is_account_recovery: true };

      mockPost.mockRejectedValueOnce(new Error('Request failed'));

      await expect(resetPasswordRequest(payload, token, queryParams)).rejects.toThrowError('Request failed');
    });
  });

  // Test validatePasswordRequest function
  describe('validatePasswordRequest', () => {
    it('should return error message if password validation fails', async () => {
      const mockPayload = {
        reset_password_page: true,
        password: 'weakpassword',
      };

      const mockErrorResponse = {
        validation_decisions: {
          password: 'Password does not meet requirements.',
        },
      };

      const expectedFormData = formurlencoded(mockPayload);

      mockPost.mockResolvedValueOnce({ data: mockErrorResponse });

      const result = await validatePasswordRequest(mockPayload);
      expect(result).toEqual('Password does not meet requirements.');
      expect(mockPost).toHaveBeenCalledWith(
        'https://example.com/api/user/v1/validation/registration',
        expectedFormData,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );
    });

    it('should return empty string if no password validation message is returned', async () => {
      const mockPayload = {
        reset_password_page: true,
        password: 'weakpassword',
      };
      const mockResponse = { /* mock response with no validation_decisions.password */ };

      // Mocking post method of getHttpClient
      mockPost.mockResolvedValueOnce({ data: mockResponse });

      const result = await validatePasswordRequest(mockPayload);
      expect(result).toEqual('');
      expect(mockPost).toHaveBeenCalledWith(
        'https://example.com/api/user/v1/validation/registration',
        'reset_password_page=true&password=weakpassword',
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );
    });

    it('should throw error if request fails', async () => {
      const mockPayload = {
        reset_password_page: true,
        password: 'weakpassword',
      };

      mockPost.mockRejectedValueOnce(new Error('Request failed'));

      await expect(validatePasswordRequest(mockPayload)).rejects.toThrowError('Request failed');
    });
  });
});
