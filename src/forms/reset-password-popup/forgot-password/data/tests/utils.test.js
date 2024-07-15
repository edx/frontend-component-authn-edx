import messages from '../../../messages';
import getValidationMessage from '../utils';

describe('getValidationMessage', () => {
  const mockFormatMessage = jest.fn((msg) => msg.defaultMessage);

  it('should return an empty string for a valid email', () => {
    const email = 'valid@example.com';
    const validationMessage = getValidationMessage(email, mockFormatMessage);
    expect(validationMessage).toBe('');
  });

  it('should return an error message for an empty email', () => {
    const email = '';
    const validationMessage = getValidationMessage(email, mockFormatMessage);
    expect(validationMessage).toBe(messages.forgotPasswordEmptyEmailFieldError.defaultMessage);
  });

  it('should return an error message for an undefined email', () => {
    const email = undefined;
    const validationMessage = getValidationMessage(email, mockFormatMessage);
    expect(validationMessage).toBe(messages.forgotPasswordEmptyEmailFieldError.defaultMessage);
  });

  it('should return an error message for an invalid email', () => {
    const email = 'invalid-email';
    const validationMessage = getValidationMessage(email, mockFormatMessage);
    expect(validationMessage).toBe(messages.forgotPasswordPageInvalidEmaiMessage.defaultMessage);
  });
});
