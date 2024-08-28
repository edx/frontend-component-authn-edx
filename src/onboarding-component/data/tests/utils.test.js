import validateContextData, { objectToQueryString } from '../utils';

describe('validateContextData', () => {
  it('should filter context data based on VALID_AUTH_PARAMS', () => {
    const contextData = {
      course_id: 'test_course_id',
      enrollment_action: 'enroll',
      email_opt_in: true,
      invalid_key_in_context: 'Splash!!!!',
    };

    const filteredContext = validateContextData(contextData);

    expect(filteredContext).toEqual({
      course_id: 'test_course_id',
      enrollment_action: 'enroll',
      email_opt_in: true,
    });
  });

  it('should return the context object if it is falsy', () => {
    expect(validateContextData(null)).toBeNull();
    expect(validateContextData(undefined)).toBeUndefined();
    expect(validateContextData('')).toBe('');
    expect(validateContextData(0)).toBe(0);
  });

  it('should return an empty object if context is an empty object', () => {
    expect(validateContextData({})).toEqual({});
  });

  it('should return an empty object if context does not have any keys in VALID_AUTH_PARAMS', () => {
    const context = {
      invalid_key_in_context: 'Splash!!!!',
      another_invalid_key_in_context: 'Boom!!!!',
    };
    expect(validateContextData(context)).toEqual({});
  });
});

describe('objectToQueryString', () => {
  it('should convert an object to a query string', () => {
    const obj = {
      key1: 'value1',
      key2: 'value2',
    };
    const queryString = objectToQueryString(obj);
    expect(queryString).toBe('key1=value1&key2=value2');
  });

  it('should handle special characters in keys and values', () => {
    const obj = {
      'key with spaces': 'value with spaces',
      'key&special': 'value?special',
    };
    const queryString = objectToQueryString(obj);
    expect(queryString).toBe('key%20with%20spaces=value%20with%20spaces&key%26special=value%3Fspecial');
  });

  it('should return an empty string for an empty object', () => {
    expect(objectToQueryString({})).toBe('');
  });

  it('should handle undefined and null values', () => {
    const obj = {
      key1: undefined,
      key2: null,
    };
    const queryString = objectToQueryString(obj);
    expect(queryString).toBe('key1=undefined&key2=null');
  });
});
