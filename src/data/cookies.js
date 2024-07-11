import { getConfig } from '@edx/frontend-platform';
import Cookies from 'universal-cookie';

/**
 * Sets a cookie with the specified name, value, and expiry.
 * @param {string} cookieName - The name of the cookie.
 * @param {string|boolean} cookieValue - The value of the cookie.
 * @param {Date} [cookieExpiry] - The expiry date of the cookie.
 */
export function setCookie(cookieName, cookieValue, cookieExpiry) {
  if (cookieName) { // To avoid setting getting exception when setting cookie with undefined names.
    const cookies = new Cookies();
    const options = { domain: getConfig().SESSION_COOKIE_DOMAIN, path: '/' };
    if (cookieExpiry) {
      options.expires = cookieExpiry;
    }
    cookies.set(cookieName, cookieValue, options);
  }
}

/**
 * Gets the value of the specified cookie.
 * @param {string} cookieName - The name of the cookie.
 * @returns {string|null} - The value of the cookie or null if not found.
 */
export function getCookie(cookieName) {
  if (cookieName) {
    const cookies = new Cookies();
    return cookies.get(cookieName);
  }
  return null;
}

/**
 * Removes the specified cookie.
 * @param {string} cookieName - The name of the cookie.
 */
export function removeCookie(cookieName) {
  if (cookieName) {
    const cookies = new Cookies();
    const options = { domain: getConfig().SESSION_COOKIE_DOMAIN, path: '/' };
    cookies.remove(cookieName, options);
  }
}

export const getCountryCookieValue = () => {
  const cookieName = `${getConfig().ONBOARDING_COMPONENT_ENV}-edx-cf-loc`;
  const cookies = new Cookies();
  return cookies.get(cookieName);
};
