import { createEventTracker, createPageEventTracker } from '../../data/segment/utils';

export const eventNames = {
  forgotPasswordLinkClicked: 'edx.bi.password-reset_form.toggled',
  loginPageViewed: 'edx.bi.login_page.viewed',
  institutionLoginFormToggled: 'edx.bi.institution_login_form.toggled',
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

// Event tracker for login page view
export const trackLoginPageViewed = () => createEventTracker(
  eventNames.loginPageViewed,
  { category: categories.userEngagement },
)();

// Tracks the login page event.
export const trackLoginPageEvent = () => {
  createPageEventTracker(eventNames.loginAndRegistration, 'login')();
};

// Tracks the event of clicking the institution login link.
export const trackInstitutionLoginLinkClick = () => {
  createEventTracker(eventNames.institutionLoginFormToggled, {
    category: categories.userEngagement,
  })();

  createEventTracker(eventNames.loginAndRegistration, {
    category: categories.userEngagement,
    page_name: 'login',
  })();
};
