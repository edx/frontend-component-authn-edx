import { createEventTracker, createPageEventTracker } from '../../../data/segment/utils';
import {
  eventNames,
  registrationSuccessEvent,
  trackRegistrationPageEvent,
} from '../register';

// Mock createEventTracker function
jest.mock('../../../data/segment/utils', () => ({
  createEventTracker: jest.fn().mockImplementation(() => jest.fn()),
  createPageEventTracker: jest.fn().mockImplementation(() => jest.fn()),
}));

describe('Tracking Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fire registrationSuccessEvent', () => {
    registrationSuccessEvent();

    expect(createEventTracker).toHaveBeenCalledWith(
      eventNames.RegistrationSuccess,
      {},
    );
  });

  it('should fire trackRegistrationPageEvent', () => {
    trackRegistrationPageEvent();

    expect(createPageEventTracker).toHaveBeenCalledWith(
      eventNames.loginAndRegistration,
      'register',
    );
  });
});
