import {
  COMPLETE_STATE,
  DEFAULT_STATE,
  FORBIDDEN_STATE,
  INTERNAL_SERVER_ERROR,
  PENDING_STATE,
} from '../../../../../data/constants';
import forgotPasswordReducer, {
  forgotPassword,
  forgotPasswordClearStatus,
  forgotPasswordFailed,
  forgotPasswordForbidden,
  forgotPasswordInitialState,
  forgotPasswordSuccess,
  forgotPasswordTokenInvalidFailure,
  setForgotPasswordFormData,
} from '../reducers';

describe('forgotPasswordSlice reducer', () => {
  it('should return the initial state', () => {
    expect(forgotPasswordReducer(undefined, {})).toEqual(forgotPasswordInitialState);
  });

  it('should handle forgotPassword action', () => {
    const nextState = forgotPasswordReducer(forgotPasswordInitialState, forgotPassword());
    expect(nextState.status).toEqual(PENDING_STATE);
  });

  it('should handle forgotPasswordSuccess action', () => {
    const nextState = forgotPasswordReducer(forgotPasswordInitialState, forgotPasswordSuccess());
    expect(nextState.status).toEqual(COMPLETE_STATE);
  });

  it('should handle forgotPasswordForbidden action ', () => {
    const nextState = forgotPasswordReducer(forgotPasswordInitialState, forgotPasswordForbidden());
    expect(nextState.status).toEqual(FORBIDDEN_STATE);
  });

  it('should handle forgotPasswordFailed action', () => {
    const nextState = forgotPasswordReducer(forgotPasswordInitialState, forgotPasswordFailed());
    expect(nextState.status).toEqual(INTERNAL_SERVER_ERROR);
  });

  it('should handle forgotPasswordClearStatus action', () => {
    const nextState = forgotPasswordReducer(forgotPasswordInitialState, forgotPasswordClearStatus(PENDING_STATE));
    expect(nextState.status).toEqual(DEFAULT_STATE);
  });

  it('should handle forgotPasswordTokenInvalidFailure action', () => {
    const payload = 'INVALID_TOKEN';
    const nextState = forgotPasswordReducer(forgotPasswordInitialState, forgotPasswordTokenInvalidFailure(payload));
    expect(nextState.status).toEqual(payload);
  });

  it('should handle setForgotPasswordFormData action', () => {
    const payload = { email: 'test@example.com', error: 'Some error' };
    const nextState = forgotPasswordReducer(forgotPasswordInitialState, setForgotPasswordFormData(payload));
    expect(nextState.forgotPasswordFormData).toEqual(payload);
  });
});
