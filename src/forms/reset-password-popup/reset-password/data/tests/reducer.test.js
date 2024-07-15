import {
  FAILURE_STATE,
  PENDING_STATE,
} from '../../../../../data/constants';
import { PASSWORD_RESET_ERROR, SUCCESS, TOKEN_STATE } from '../constants';
import resetPasswordReducer, {
  resetPassword,
  resetPasswordFailure,
  resetPasswordInitialState,
  resetPasswordSuccess,
  validatePassword,
  validatePasswordFailure,
  validatePasswordSuccess,
  validateToken,
  validateTokenFailed,
  validateTokenSuccess,
} from '../reducers';

describe('resetPasswordSlice reducer', () => {
  it('should return the initial state', () => {
    expect(resetPasswordReducer(undefined, {})).toEqual(resetPasswordInitialState);
  });

  it('should handle validateToken action', () => {
    const nextState = resetPasswordReducer(resetPasswordInitialState, validateToken());
    expect(nextState.status).toEqual(PENDING_STATE);
  });

  it('should handle validateTokenSuccess action', () => {
    const nextState = resetPasswordReducer(resetPasswordInitialState, validateTokenSuccess());
    expect(nextState.status).toEqual(TOKEN_STATE.VALID);
  });

  it('should handle validateTokenFailed action ', () => {
    const nextState = resetPasswordReducer(resetPasswordInitialState, validateTokenFailed());
    expect(nextState.status).toEqual(PASSWORD_RESET_ERROR);
  });

  it('should handle resetPassword action', () => {
    const nextState = resetPasswordReducer(resetPasswordInitialState, resetPassword());
    expect(nextState.status).toEqual(PENDING_STATE);
  });

  it('should handle resetPasswordSuccess action', () => {
    const nextState = resetPasswordReducer(resetPasswordInitialState, resetPasswordSuccess());
    expect(nextState.status).toEqual(SUCCESS);
  });

  it('should handle resetPasswordFailure action', () => {
    const payload = { status: FAILURE_STATE, errorMsg: 'Error message' };
    const nextState = resetPasswordReducer(resetPasswordInitialState, resetPasswordFailure(payload));
    expect(nextState.status).toEqual(FAILURE_STATE);
    expect(nextState.resetPasswordSubmitState).toEqual(FAILURE_STATE);
    expect(nextState.errorMsg).toEqual('Error message');
  });

  it('should handle validatePassword action', () => {
    const nextState = resetPasswordReducer(resetPasswordInitialState, validatePassword());
    expect(nextState.backendValidationError).toEqual(null);
  });

  it('should handle validatePasswordSuccess action', () => {
    const payload = 'Password validation success';
    const nextState = resetPasswordReducer(resetPasswordInitialState, validatePasswordSuccess(payload));
    expect(nextState.backendValidationError).toEqual(payload);
  });

  it('should handle validatePasswordFailure action', () => {
    const nextState = resetPasswordReducer(resetPasswordInitialState, validatePasswordFailure());
    expect(nextState.backendValidationError).toEqual(null);
  });
});
