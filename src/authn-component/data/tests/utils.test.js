import validateContextData from '../utils';

describe('validateContextData', () => {
  it('should filter context data based on POST_AUTH_PARAMS', () => {
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

  it('should return an empty object if context does not have any keys in POST_AUTH_PARAMS', () => {
    const context = {
      invalid_key_in_context: 'Splash!!!!',
      another_invalid_key_in_context: 'Boom!!!!',
    };
    expect(validateContextData(context)).toEqual({});
  });
});
