import { createEventTracker, createPageEventTracker } from '../../data/segment/utils';

export const eventNames = {
  loginAndRegistration: 'login_and_registration',
  registrationSuccess: 'edx.bi.user.account.registered.client',
};

// Event tracker for successful registration
export const trackRegistrationSuccess = () => createEventTracker(
  eventNames.registrationSuccess,
  {},
)();

// Tracks the progressive profiling page event.
export const trackRegistrationPageViewed = () => {
  createPageEventTracker(eventNames.loginAndRegistration, 'register')();
};
