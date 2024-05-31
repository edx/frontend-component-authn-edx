import { createEventTracker } from '../../data/segment/utils';

export const eventNames = {
  forgotPasswordPageViewd: 'edx.bi.password_reset_form.viewed',
};

export const categories = {
    userEngagement: 'user-engagement',
};

// Event tracker for forgot password page viewed
export const forgotPasswordPageViewedEvent = () => createEventTracker(
    eventNames.forgotPasswordPageViewd,
    {
        category: categories.userEngagement,
    },
  )();