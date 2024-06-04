import { createEventTracker, createPageEventTracker } from '../../data/segment/utils';

export const eventNames = {
  loginAndRegistration: 'login_and_registration',
  RegistrationSuccess: 'edx.bi.user.account.registered.client',
};

// Event tracker for successful registration
export const registrationSuccessEvent = () => createEventTracker(
  eventNames.RegistrationSuccess,
  {},
)();

// Tracks the progressive profiling page event.
export const trackRegistrationPageEvent = () => {
  createPageEventTracker(eventNames.loginAndRegistration, 'register')();
};
