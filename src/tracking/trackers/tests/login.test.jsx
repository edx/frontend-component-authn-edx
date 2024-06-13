import { createEventTracker, createPageEventTracker } from '../../../data/segment/utils';
import {
  categories,
  eventNames,
  trackForgotPasswordLinkClick,
  trackLoginPageEvent,
  trackLoginPageViewed,
} from '../login';

// Mock createEventTracker function
jest.mock('../../../data/segment/utils', () => ({
  createEventTracker: jest.fn().mockImplementation(() => jest.fn()),
  createPageEventTracker: jest.fn().mockImplementation(() => jest.fn()),
}));

describe('Tracking Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('trackForgotPasswordLinkClick function', () => {
    trackForgotPasswordLinkClick();

    expect(createEventTracker).toHaveBeenCalledWith(
      eventNames.forgotPasswordLinkClicked,
      { category: categories.userEngagement },
    );
  });

  it('trackLoginPageViewed function', () => {
    trackLoginPageViewed();

    expect(createEventTracker).toHaveBeenCalledWith(
      eventNames.loginPageViewed,
      { category: categories.userEngagement },
    );
  });

  it('trackLoginPageEvent function', () => {
    trackLoginPageEvent();

    expect(createPageEventTracker).toHaveBeenCalledWith(
      eventNames.loginAndRegistration,
      'login',
    );
  });
});
