import {
  COMPLETE_STATE,
  DEFAULT_STATE,
  PENDING_STATE,
} from '../../../../data/constants';
import registerReducer, {
  backupRegistrationForm,
  clearAllRegistrationErrors,
  clearRegistrationBackendError,
  fetchRealtimeValidations,
  fetchRealtimeValidationsFailed,
  fetchRealtimeValidationsSuccess,
  registerInitialState,
  registerUser,
  registerUserFailed,
  registerUserSuccess,
  setRegistrationFields,
} from '../reducers';

describe('registerSlice reducer', () => {
  it('should return the initial state', () => {
    expect(registerReducer(undefined, {})).toEqual(registerInitialState);
  });

  it('should handle fetchRealtimeValidations action', () => {
    const nextState = registerReducer(registerInitialState, fetchRealtimeValidations());

    expect(nextState.validationState).toEqual(PENDING_STATE);
    expect(nextState.validations).toBeNull();
  });

  it('should handle fetchRealtimeValidationsSuccess action', () => {
    const mockPayload = {
      validationDecisions: {
        email: 'This email is already associated with an existing or previous edX account',
      },
    };

    const nextState = registerReducer(registerInitialState, fetchRealtimeValidationsSuccess(mockPayload));

    expect(nextState.validationState).toEqual(COMPLETE_STATE);
    expect(nextState.validations).toEqual(mockPayload);
  });

  it('should handle fetchRealtimeValidationsFailed action', () => {
    const nextState = registerReducer(registerInitialState, fetchRealtimeValidationsFailed());

    expect(nextState.validationState).toEqual(DEFAULT_STATE);
    expect(nextState.validationApiRateLimited).toEqual(true);
  });

  it('should handle clearRegistrationBackendError action', () => {
    const initialStateWithErrors = {
      ...registerInitialState,
      registrationError: {
        email: [
          {
            userMessage: 'This email is already associated with an existing or previous edX account',
          },
        ],
        errorCode: 'duplicate-email',
      },
    };

    const nextState = registerReducer(initialStateWithErrors, clearRegistrationBackendError('email'));

    expect(nextState.registrationError).toEqual({ errorCode: 'duplicate-email' });
  });

  it('should handle clearAllRegistrationErrors action', () => {
    const initialStateWithErrors = {
      ...registerInitialState,
      registrationError: {
        email: [
          {
            userMessage: 'This email is already associated with an existing or previous edX account',
          },
        ],
        errorCode: 'duplicate-email',
      },
    };

    const nextState = registerReducer(initialStateWithErrors, clearAllRegistrationErrors());

    expect(nextState.registrationError).toEqual({});
  });

  it('should handle registerUser action', () => {
    const nextState = registerReducer(registerInitialState, registerUser());

    expect(nextState.submitState).toEqual(PENDING_STATE);
    expect(nextState.registrationError).toEqual({});
  });

  it('should handle registerUserSuccess action', () => {
    const mockPayload = { user: 'testUser' };
    const nextState = registerReducer(registerInitialState, registerUserSuccess(mockPayload));

    expect(nextState.submitState).toEqual(COMPLETE_STATE);
    expect(nextState.registrationResult).toEqual(mockPayload);
  });

  it('should handle registerUserFailed action', () => {
    const mockPayload = { error: 'Some error occurred' };
    const nextState = registerReducer(registerInitialState, registerUserFailed(mockPayload));

    expect(nextState.submitState).toEqual(DEFAULT_STATE);
    expect(nextState.registrationError).toEqual(mockPayload);
    expect(nextState.registrationResult).toEqual({});
    expect(nextState.validations).toBeNull();
  });

  it('should handle setRegistrationFields action', () => {
    const mockPayload = { marketingEmailsOptIn: false };
    const nextState = registerReducer(registerInitialState, setRegistrationFields(mockPayload));

    expect(nextState.registrationFields).toEqual(mockPayload);
  });

  it('should handle backupRegistrationForm action', () => {
    const mockPayload = {
      isFormFilled: true,
      formFields: { name: 'John Doe', email: 'john@example.com', password: 'password123' },
      errors: { name: '', email: '', password: '' },
    };
    const nextState = registerReducer(registerInitialState, backupRegistrationForm(mockPayload));

    expect(nextState.registrationFormData).toEqual(mockPayload);
  });
});
