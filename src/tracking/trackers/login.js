import { createEventTracker, createPageEventTracker } from '../../data/segment/utils';

export const eventNames = {
  forgotPasswordLinkClicked: 'edx.bi.password-reset_form.toggled',
  loginAndRegistration: 'login_and_registration',
  registerFormToggled: 'edx.bi.register_form.toggled',
  loginSuccess: 'edx.bi.user.account.authenticated.client',
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

// Tracks the event when the register link is clicked on the login form.
export const trackRegisterFormToggled = () => {
  createEventTracker(
    eventNames.registerFormToggled,
    { category: categories.userEngagement },
  )();
};

// Tracks the login success event.
export const trackLoginSuccess = () => createEventTracker(
  eventNames.loginSuccess,
  {},
)();
