import {
  COMPLETE_STATE, FAILURE_STATE, PENDING_STATE,
} from '../../../../data/constants';
import loginReducer, {
  loginInitialState, loginUser, loginUserFailed, loginUserSuccess,
} from '../reducers';

describe('loginSlice reducer', () => {
  it('should return the initial state', () => {
    expect(loginReducer(undefined, {})).toEqual(loginInitialState);
  });

  it('should handle loginUser action', () => {
    const nextState = loginReducer(loginInitialState, loginUser());

    expect(nextState.submitState).toEqual(PENDING_STATE);
    expect(nextState.loginError).toEqual({});
  });

  it('should handle loginUserSuccess action', () => {
    const mockPayload = { redirectUrl: 'http://test-url.com', success: true };

    const nextState = loginReducer(loginInitialState, loginUserSuccess(mockPayload));

    expect(nextState.submitState).toEqual(COMPLETE_STATE);
    expect(nextState.loginResult).toEqual(mockPayload);
  });

  it('should handle loginUserFailed action', () => {
    const mockPayload = {
      context: { error: 'test-error' },
      errorCode: 'SOME_ERROR_CODE',
      email: 'john_doe@example.com',
      value: 'Some error message',
    };

    const nextState = loginReducer(loginInitialState, loginUserFailed(mockPayload));

    expect(nextState.submitState).toEqual(FAILURE_STATE);
    expect(nextState.loginError).toEqual({
      errorCode: 'SOME_ERROR_CODE',
      errorContext: {
        ...mockPayload.context,
        email: mockPayload.email,
        errorMessage: mockPayload.value,
      },
    });
    expect(nextState.loginResult).toEqual({});
  });
});
