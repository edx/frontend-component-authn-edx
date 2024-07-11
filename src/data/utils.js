// Utility functions
import { getConfig } from '@edx/frontend-platform';
import QueryString from 'query-string';

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

export const handleURLUpdationOnLoad = formName => {
  const queryParam = getAllPossibleQueryParams();
  if (!Object.prototype.hasOwnProperty.call(queryParam, AUTH_MODE)
    || queryParam?.[AUTH_MODE] !== formName) {
    const url = new URL(window.location.href || getConfig().MARKETING_SITE_BASE_URL);
    url.searchParams.delete(AUTH_MODE);
    url.searchParams.set(AUTH_MODE, formName);
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

export const moveScrollToTop = (ref, block = 'start') => {
  if (ref?.current?.scrollIntoView) {
    ref.current.scrollIntoView({ behavior: 'smooth', block });
  }
};

export default getAllPossibleQueryParams;
