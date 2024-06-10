import { createEventTracker, createPageEventTracker } from '../../../data/segment/utils';
import {
  categories,
  eventNames,
  forgotPasswordPageViewedEvent,
  trackForgotPasswordPageEvent,
} from '../forgotpassword';

// Mock createEventTracker function
jest.mock('../../../data/segment/utils', () => ({
  createEventTracker: jest.fn().mockImplementation(() => jest.fn()),
  createPageEventTracker: jest.fn().mockImplementation(() => jest.fn()),
}));

describe('Tracking Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fire trackForgotPasswordPageEvent', () => {
    trackForgotPasswordPageEvent();

    expect(createPageEventTracker).toHaveBeenCalledWith(
      eventNames.loginAndRegistration,
      'forgot-password',
    );
  });

  it('should fire forgotPasswordPageViewedEvent', () => {
    forgotPasswordPageViewedEvent();

    expect(createEventTracker).toHaveBeenCalledWith(
      eventNames.forgotPasswordPageViewd,
      { category: categories.userEngagement },
    );
  });
});
