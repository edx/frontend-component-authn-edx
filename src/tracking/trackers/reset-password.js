import { createPageEventTracker } from '../../data/segment/utils';

export const eventNames = {
  loginAndRegistration: 'login_and_registration',
};

export const trackResettPasswordPageEvent = () => {
  createPageEventTracker(eventNames.loginAndRegistration, 'reset-password')();
};
