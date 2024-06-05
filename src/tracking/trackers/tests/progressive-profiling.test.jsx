import { createEventTracker, createPageEventTracker } from '../../../data/segment/utils';
import {
  eventNames,
  trackProgressiveProfilingPageEvent,
  trackProgressiveProfilingSkipLinkClickEvent,
} from '../progressive-profiling';

// Mock createEventTracker function
jest.mock('../../../data/segment/utils', () => ({
  createEventTracker: jest.fn().mockImplementation(() => jest.fn()),
  createPageEventTracker: jest.fn().mockImplementation(() => jest.fn()),
}));

describe('Tracking Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fire trackProgressiveProfilingSkipLinkClickEvent', () => {
    trackProgressiveProfilingSkipLinkClickEvent();

    expect(createEventTracker).toHaveBeenCalledWith(
      eventNames.ProgressiveProfilingSkipLinkClick,
      {},
    );
  });

  it('should fire trackProgressiveProfilingPageEvent', () => {
    trackProgressiveProfilingPageEvent();

    expect(createPageEventTracker).toHaveBeenCalledWith(
      eventNames.loginAndRegistration,
      'welcome',
    );
  });
});
