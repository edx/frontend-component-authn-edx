/**
 * Redux slice for managing registration state.
 * This slice handles the registration process, including the submission state,
 * registration result, and any registration errors.
 */

import { createSlice } from '@reduxjs/toolkit';

import { PASSWORD_RESET_ERROR, SUCCESS, TOKEN_STATE } from './constants';
import {
  COMPLETE_STATE, DEFAULT_STATE, FAILURE_STATE, PENDING_STATE,
} from '../../../../data/constants';

export const storeName = 'resetPassword';
export const REGISTER_SLICE_NAME = 'resetPassword';

export const resetPasswordInitialState = {
  tokenState: DEFAULT_STATE,
  submitState: DEFAULT_STATE,
  status: TOKEN_STATE.PENDING,
  token: null,
  errorMsg: null,
  tokenError: null,
};

export const resetPasswordSlice = createSlice({
  name: REGISTER_SLICE_NAME,
  initialState: resetPasswordInitialState,
  reducers: {
    validateToken: (state) => {
      state.tokenState = PENDING_STATE;
      state.status = PENDING_STATE;
    },
    validateTokenSuccess: (state, { payload }) => {
      state.tokenState = COMPLETE_STATE;
      state.status = TOKEN_STATE.VALID;
      state.token = payload;
    },
    validateTokenFailed: (state, { payload }) => {
      state.status = PASSWORD_RESET_ERROR;
      state.tokenState = DEFAULT_STATE;
      state.tokenError = payload;
    },
    resetPassword: (state) => {
      state.status = PENDING_STATE;
      state.tokenState = PENDING_STATE;
    },
    resetPasswordSuccess: (state) => {
      state.status = SUCCESS;
      state.submitState = COMPLETE_STATE;
    },
    resetPasswordFailure: (state, { payload }) => {
      state.status = payload.status;
      state.submitState = FAILURE_STATE;
      state.errorMsg = payload.errorMsg;
    },
  },
});

export const {
  validateToken,
  validateTokenSuccess,
  validateTokenFailed,
  resetPassword,
  resetPasswordSuccess,
  resetPasswordFailure,
} = resetPasswordSlice.actions;

export default resetPasswordSlice.reducer;
