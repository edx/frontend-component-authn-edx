import { createEventTracker } from '../../data/segment/utils';

export const eventNames = {
//   forgotPasswordLinkClicked: 'edx.bi.password-reset_form.toggled',
//   loginPageViewed: 'edx.bi.login_page.viewed',
//   institutionLoginFormToggled: 'edx.bi.institution_login_form.toggled',
//   loginAndRegistration: 'login_and_registration',
  RegistrationSuccess: 'edx.bi.user.account.registered.client',
};

// Event tracker for successful registration
export const registrationSuccessEvent = () => createEventTracker(
    eventNames.RegistrationSuccess,
    {},
  )();