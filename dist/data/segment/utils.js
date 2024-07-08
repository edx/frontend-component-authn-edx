function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/* eslint-disable import/prefer-default-export */
import { sendPageEvent, sendTrackEvent } from '@edx/frontend-platform/analytics';
export const LINK_TIMEOUT = 300;

/**
 * Creates an event tracker function that sends a tracking event with the given name and options.
 *
 * @param {string} name - The name of the event to be tracked.
 * @param {object} [options={}] - Additional options to be included with the event.
 * @returns {function} - A function that, when called, sends the tracking event.
 */
export const createEventTracker = function (name) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return () => sendTrackEvent(name, _objectSpread(_objectSpread({}, options), {}, {
    app_name: 'onboarding_component'
  }));
};

/**
 * Creates an event tracker function that sends a tracking event with the given name and options.
 *
 * @param {string} name - The name of the event to be tracked.
 * @param {object} [options={}] - Additional options to be included with the event.
 * @returns {function} - A function that, when called, sends the tracking event.
 */
export const createPageEventTracker = function (name) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  return () => sendPageEvent(name, options, {
    app_name: 'onboarding_component'
  });
};
export const createLinkTracker = (tracker, href) => e => {
  e.preventDefault();
  tracker();
  return setTimeout(() => {
    window.location.href = href;
  }, LINK_TIMEOUT);
};
//# sourceMappingURL=utils.js.map