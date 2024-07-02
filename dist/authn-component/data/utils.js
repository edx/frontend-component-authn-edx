import { VALID_AUTH_PARAMS } from '../../data/constants';

/**
 * Filters context data to include only keys specified in VALID_AUTH_PARAMS.
 *
 * @param {Object} context - The context object to filter.
 * @returns {Object} A new object containing only the filtered key-value pairs.
 */
const validateContextData = context => {
  if (context) {
    return Object.fromEntries(Object.entries(context).filter(_ref => {
      let [key] = _ref;
      return VALID_AUTH_PARAMS.includes(key);
    }));
  }
  return context;
};
export default validateContextData;
//# sourceMappingURL=utils.js.map