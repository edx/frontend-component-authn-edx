import { createEventTracker, createPageEventTracker } from '../../data/segment/utils';

export const eventNames = {
  forgotPasswordLinkClicked: 'edx.bi.password-reset_form.toggled',
  loginAndRegistration: 'login_and_registration',
};

export const categories = {
  userEngagement: 'user-engagement',
};

// Event tracker for Forgot Password link click
export const trackForgotPasswordLinkClick = () => createEventTracker(
  eventNames.forgotPasswordLinkClicked,
  { category: categories.userEngagement },
)();

// Tracks the login page event.
export const trackLoginPageViewed = () => {
  createPageEventTracker(eventNames.loginAndRegistration, 'login')();
};
