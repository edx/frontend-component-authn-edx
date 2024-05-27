import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import { getFieldsValidations } from '../service';

jest.mock('@edx/frontend-platform/auth');
jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(() => ({ LMS_BASE_URL: 'http://example.com' })),
}));

describe('getFieldsValidations Tests', () => {
  const mockGetAuthenticatedHttpClient = jest.fn();
  getAuthenticatedHttpClient.mockReturnValue({ post: mockGetAuthenticatedHttpClient });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return backend validation message and success status if request succeeds', async () => {
    const mockCreds = {
      email: 'test@example.com',
    };
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
    const mockCreds = {
      email: 'test@example.com',
    };
    const errorMessage = 'Login request failed';

    mockGetAuthenticatedHttpClient.mockRejectedValue(new Error(errorMessage));

    await expect(getFieldsValidations(mockCreds)).rejects.toThrow(errorMessage);

    expect(getConfig).toHaveBeenCalled();
    expect(mockGetAuthenticatedHttpClient).toHaveBeenCalled();
  });
});
