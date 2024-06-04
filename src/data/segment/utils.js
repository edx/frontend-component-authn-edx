/* eslint-disable import/prefer-default-export */
import { sendPageEvent, sendTrackEvent } from '@edx/frontend-platform/analytics';

/**
 * Creates an event tracker function that sends a tracking event with the given name and options.
 *
 * @param {string} name - The name of the event to be tracked.
 * @param {object} [options={}] - Additional options to be included with the event.
 * @returns {function} - A function that, when called, sends the tracking event.
 */
export const createEventTracker = (name, options = {}) => () => sendTrackEvent(
  name,
  { ...options, app_name: 'onboarding_component' },
);

/**
 * Creates an event tracker function that sends a tracking event with the given name and options.
 *
 * @param {string} name - The name of the event to be tracked.
 * @param {object} [options={}] - Additional options to be included with the event.
 * @returns {function} - A function that, when called, sends the tracking event.
 */
export const createPageEventTracker = (name, options = null) => () => sendPageEvent(
  name,
  options,
  { app_name: 'onboarding_component' },
);
