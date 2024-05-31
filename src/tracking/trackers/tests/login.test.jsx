import { createEventTracker } from '../../../data/segment/utils';
import {
  categories,
  eventNames,
  trackForgotPasswordLinkClick,
  trackInstitutionLoginLinkClick,
  trackLoginPageEvent,
  trackLoginPageViewed,
} from '../login';

// Mock createEventTracker function
jest.mock('../../../data/segment/utils', () => ({
  createEventTracker: jest.fn().mockImplementation(() => jest.fn()),
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

    expect(createEventTracker).toHaveBeenCalledWith(
      eventNames.loginAndRegistration,
      { page_name: 'login' },
    );
  });

  it('trackInstitutionLoginLinkClick function', () => {
    trackInstitutionLoginLinkClick();

    expect(createEventTracker).toHaveBeenCalledWith(
      eventNames.institutionLoginFormToggled,
      { category: categories.userEngagement },
    );
    expect(createEventTracker).toHaveBeenCalledWith(
      eventNames.loginAndRegistration,
      { category: categories.userEngagement, page_name: 'login' },
    );
  });
});
