import {
  PENDING_STATE,
} from '../../../../../data/constants';
import { PASSWORD_RESET_ERROR, SUCCESS, TOKEN_STATE } from '../constants';
import resetPasswordReducer, {
  resetPassword,
  resetPasswordInitialState,
  resetPasswordSuccess,
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
});
