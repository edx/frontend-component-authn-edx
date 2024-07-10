// Utility functions
import { getConfig } from '@edx/frontend-platform';
import QueryString from 'query-string';
import Cookies from 'universal-cookie';

import { AUTH_MODE, VALID_AUTH_PARAMS } from './constants';

/**
 * Parses query parameters from a URL string or the current window's location and
 * filters out parameters that are not in the VALID_AUTH_PARAMS list.
 *
 * @param {string|null} locationURl - Optional. The URL string to parse query parameters from.
 *                                    If not provided, the function uses the current window's location.
 * @returns {Object} An object containing only the valid query parameters.
 */
const getAllPossibleQueryParams = (locationURl = null) => {
  const urlParams = locationURl
    ? QueryString.parseUrl(locationURl).query
    : QueryString.parse(window.location.search);

  return Object.fromEntries(
    Object.entries(urlParams).filter(([key]) => VALID_AUTH_PARAMS.includes(key)),
  );
};

export const handleURLUpdationOnLoad = pageName => {
  const queryParam = getAllPossibleQueryParams();
  if (!Object.prototype.hasOwnProperty.call(queryParam, AUTH_MODE)
    || queryParam?.[AUTH_MODE] !== pageName) {
    const url = new URL(window.location.href || process.env.LMS_BASE_URL);
    url.searchParams.delete(AUTH_MODE);
    url.searchParams.set(AUTH_MODE, pageName);
    window.history.replaceState(null, null, url);
  }
};

export const deleteQueryParams = (params) => {
  const queryParams = getAllPossibleQueryParams();
  const url = new URL(window.location.href);

  params.forEach((param) => {
    if (queryParams[param]) {
      url.searchParams.delete(param);
    }
  });

  window.history.replaceState(window.history.state, '', url.href);
};

export const setCookie = (cookieName, cookieValue, cookieExpiry) => {
  if (cookieName) { // To avoid setting getting exception when setting cookie with undefined names.
    const cookies = new Cookies();
    const options = { domain: getConfig().SESSION_COOKIE_DOMAIN, path: '/' };
    if (cookieExpiry) {
      options.expires = cookieExpiry;
    }
    cookies.set(cookieName, cookieValue, options);
  }
};

export const getCountryCookieValue = () => {
  const cookieName = `${getConfig().ONBOARDING_COMPONENT_ENV}-edx-cf-loc`;
  const cookies = new Cookies();
  return cookies.get(cookieName);
};

export const moveScrollToTop = (ref, block = 'start') => {
  if (ref?.current?.scrollIntoView) {
    ref.current.scrollIntoView({ behavior: 'smooth', block });
  }
};

export default getAllPossibleQueryParams;
