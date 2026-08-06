import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import registerRequest, { getFieldsValidations, validateRegistrationInformation } from '../service';

jest.mock('@edx/frontend-platform/auth');
jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(() => ({ LMS_BASE_URL: 'http://example.com' })),
}));

describe('Service Function Tests', () => {
  const mockGetAuthenticatedHttpClient = jest.fn();
  getAuthenticatedHttpClient.mockReturnValue({ post: mockGetAuthenticatedHttpClient });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getFieldsValidations Tests', () => {
    it('should return backend validation message if request succeeds', async () => {
      const mockCreds = { email: 'test@example.com' };
      const mockData = {
        validation_decisions: {
          email: 'This email is already associated with an existing or previous edX account',
        },
      };

      mockGetAuthenticatedHttpClient.mockResolvedValue({ data: mockData });

      const result = await getFieldsValidations(mockCreds);

      expect(result).toEqual({ fieldValidations: mockData });
    });

    it('should throw an error if the request fails', async () => {
      const mockCreds = { email: 'test@example.com' };
      const errorMessage = 'Validation request failed';

      mockGetAuthenticatedHttpClient.mockRejectedValue(new Error(errorMessage));

      await expect(getFieldsValidations(mockCreds)).rejects.toThrow(errorMessage);
      expect(getConfig).toHaveBeenCalled();
      expect(mockGetAuthenticatedHttpClient).toHaveBeenCalled();
    });
  });

  describe('registerRequest Tests', () => {
    it('should return redirect URL, success status, and authenticated user details if request succeeds', async () => {
      const mockRegistrationInfo = {
        email: 'test@example.com',
        password: 'password123',
      };
      const mockData = {
        redirect_url: 'http://example.com/dashboard',
        success: true,
        authenticated_user: {
          username: 'testuser',
        },
      };

      mockGetAuthenticatedHttpClient.mockResolvedValue({ data: mockData });

      const result = await registerRequest(mockRegistrationInfo);

      expect(result).toEqual({
        redirectUrl: mockData.redirect_url,
        success: mockData.success,
        authenticatedUser: mockData.authenticated_user,
      });
    });

    it('should throw an error if the request fails', async () => {
      const mockCreds = {
        email: 'test@example.com',
      };
      const errorMessage = 'Login request failed';

      mockGetAuthenticatedHttpClient.mockRejectedValue(new Error(errorMessage));

      await expect(getFieldsValidations(mockCreds)).rejects.toThrow(errorMessage);

      expect(getConfig).toHaveBeenCalled();
      expect(mockGetAuthenticatedHttpClient).toHaveBeenCalled();
    });

    it('should reject malformed total_registration_time payload before request', async () => {
      const malformedPayload = {
        email: 'test@example.com',
        password: 'password123',
        total_registration_time: '0; DROP TABLE auth_user;--',
      };

      await expect(registerRequest(malformedPayload)).rejects.toThrow('Invalid total_registration_time');
      expect(mockGetAuthenticatedHttpClient).not.toHaveBeenCalled();
    });

    it('should allow finite numeric total_registration_time payload', () => {
      const payload = {
        email: 'test@example.com',
        total_registration_time: 3.2,
      };

      expect(validateRegistrationInformation(payload)).toEqual(payload);
    });
  });
});
