import {
  COMPLETE_STATE, DEFAULT_STATE, PENDING_STATE,
} from '../../../../data/constants';
import registerReducer, {
  clearRegistrationBackendError, fetchRealtimeValidations,
  fetchRealtimeValidationsFailed,
  fetchRealtimeValidationsSuccess,
  registerInitialState,
} from '../reducers';

describe('registerSlice reducer', () => {
  it('should return the initial state', () => {
    expect(registerReducer(undefined, {})).toEqual(registerInitialState);
  });

  it('should handle fetchRealtimeValidations action', () => {
    const nextState = registerReducer(registerInitialState, fetchRealtimeValidations());

    expect(nextState.validationState).toEqual(PENDING_STATE);
    expect(nextState.validations).toEqual(null);
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
    const nextState = registerReducer({
      ...registerInitialState,
      registrationError: {
        email: [
          {
            userMessage: 'This email is already associated with an existing or previous edX account',
          },
        ],
        errorCode: 'duplicate-email',
      },

    }, clearRegistrationBackendError('email'));

    expect(nextState.registrationError).toEqual({ errorCode: 'duplicate-email' });
  });
});
