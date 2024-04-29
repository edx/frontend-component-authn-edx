// Utility functions
import QueryString from 'query-string';

import { VALID_AUTH_PARAMS } from './constants';

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

export default getAllPossibleQueryParams;
