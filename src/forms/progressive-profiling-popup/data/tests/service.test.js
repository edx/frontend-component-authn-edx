import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import saveUserProfile from '../services';

jest.mock('@edx/frontend-platform/auth');
jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(() => ({ LMS_BASE_URL: 'http://example.com' })),
}));

describe('saveUserProfile Tests', () => {
  const mockGetAuthenticatedHttpClient = jest.fn();
  getAuthenticatedHttpClient.mockReturnValue({ patch: mockGetAuthenticatedHttpClient });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return profile data if request succeeds', async () => {
    const username = 'edX';
    const mockParams = {
      extendedProfile: [
        { field_name: 'subject', field_value: 'Science' },
      ],
      gender: 'm',
      country: 'USA',
      level_of_education: 'none',
    };

    mockGetAuthenticatedHttpClient.mockResolvedValue({ status: 200 });

    const result = await saveUserProfile(username, mockParams);

    expect(result).toEqual({
      status: 200,
    });
  });

  it('should throw an error if the request fails', async () => {
    const username = 'edX';
    const mockParams = {
      extendedProfile: [
        { field_name: 'subject', field_value: 'Business & Management' },
      ],
      gender: 'm',
      level_of_education: 'none',
    };
    const errorMessage = 'request failed';

    mockGetAuthenticatedHttpClient.mockRejectedValue(new Error(errorMessage));

    await expect(saveUserProfile(username, mockParams)).rejects.toThrow(errorMessage);

    expect(getConfig).toHaveBeenCalled();
    expect(mockGetAuthenticatedHttpClient).toHaveBeenCalled();
  });
});
