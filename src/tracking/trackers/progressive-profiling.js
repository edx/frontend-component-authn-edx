import { createEventTracker, createPageEventTracker } from '../../data/segment/utils';

export const eventNames = {
  ProgressiveProfilinSubmitClick: 'edx.bi.welcome.page.submit.clicked',
  ProgressiveProfilingSkipLinkClick: 'edx.bi.welcome.page.skip.link.clicked',
  loginAndRegistration: 'login_and_registration',
};

// Event tracker for Progressive profiling skip button click
export const trackProgressiveProfilingSkipLinkClickEvent = () => createEventTracker(
  eventNames.ProgressiveProfilingSkipLinkClick,
  {},
)();

// Event tracker for progressive profiling submit button click
export const trackProgressiveProfilinSubmitClickEvent = (evenProperties) => createEventTracker(
  eventNames.ProgressiveProfilinSubmitClick,
  { ...evenProperties },
)();

// Tracks the progressive profiling page event.
export const trackProgressiveProfilingPageEvent = () => {
  createPageEventTracker(eventNames.loginAndRegistration, 'welcome')();
};
