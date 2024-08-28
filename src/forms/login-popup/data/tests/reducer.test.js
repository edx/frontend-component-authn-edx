import {
  COMPLETE_STATE,
  DEFAULT_STATE,
  FAILURE_STATE,
  PENDING_STATE,
} from '../../../../data/constants';
import loginReducer, {
  backupLoginForm,
  loginErrorClear,
  loginInitialState,
  loginUser,
  loginUserFailed,
  loginUserSuccess,
  setLoginSSOIntent,
  setShowPasswordResetBanner,
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

  it('should handle setShowPasswordResetBanner action', () => {
    const nextState = loginReducer(loginInitialState, setShowPasswordResetBanner());

    expect(nextState.showResetPasswordSuccessBanner).toEqual(true);
  });

  it('should handle loginErrorClear action', () => {
    const stateWithErrors = {
      ...loginInitialState,
      loginError: { errorCode: 'SOME_ERROR_CODE', errorContext: {} },
      submitState: FAILURE_STATE,
    };

    const nextState = loginReducer(stateWithErrors, loginErrorClear());

    expect(nextState.loginError).toEqual({});
    expect(nextState.submitState).toEqual(DEFAULT_STATE);
  });

  it('should handle setLoginSSOIntent action', () => {
    const nextState = loginReducer(loginInitialState, setLoginSSOIntent());

    expect(nextState.isLoginSSOIntent).toEqual(true);
  });

  it('should handle backupLoginForm action', () => {
    const mockPayload = {
      formFields: {
        emailOrUsername: 'john_doe@example.com',
        password: 'password123',
      },
      errors: {
        emailOrUsername: '',
        password: '',
      },
    };

    const nextState = loginReducer(loginInitialState, backupLoginForm(mockPayload));

    expect(nextState.loginFormData).toEqual(mockPayload);
  });
});
