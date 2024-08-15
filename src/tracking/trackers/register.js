import { createEventTracker, createPageEventTracker } from '../../data/segment/utils';

export const eventNames = {
  loginAndRegistration: 'login_and_registration',
  registrationSuccess: 'edx.bi.user.account.registered.client',
  loginFormToggled: 'edx.bi.login_form.toggled',
};

export const categories = {
  userEngagement: 'user-engagement',
};

// Event tracker for successful registration
export const trackRegistrationSuccess = () => createEventTracker(
  eventNames.registrationSuccess,
  {},
)();

// Tracks the register page event.
export const trackRegistrationPageViewed = () => {
  createPageEventTracker(eventNames.loginAndRegistration, 'register')();
};

// Tracks the event when the login link is clicked on the register form..
export const trackLoginFormToggled = () => {
  createEventTracker(
    eventNames.loginFormToggled,
    { category: categories.userEngagement },
  )();
};
