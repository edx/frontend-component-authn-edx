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
  tokenValidationState: DEFAULT_STATE,
  resetPasswordsubmitState: DEFAULT_STATE,
  status: TOKEN_STATE.PENDING,
  token: null,
  errorMsg: null,
  tokenError: null,
  backendValidationError: null,
};

export const resetPasswordSlice = createSlice({
  name: REGISTER_SLICE_NAME,
  initialState: resetPasswordInitialState,
  reducers: {
    validateToken: (state) => {
      state.tokenValidationState = PENDING_STATE;
      state.status = PENDING_STATE;
    },
    validateTokenSuccess: (state, { payload }) => {
      state.tokenValidationState = COMPLETE_STATE;
      state.status = TOKEN_STATE.VALID;
      state.token = payload;
    },
    validateTokenFailed: (state, { payload }) => {
      state.status = PASSWORD_RESET_ERROR;
      state.tokenValidationState = DEFAULT_STATE;
      state.tokenError = payload;
    },
    resetPassword: (state) => {
      state.status = PENDING_STATE;
      state.resetPasswordsubmitState = PENDING_STATE;
    },
    resetPasswordSuccess: (state) => {
      state.status = SUCCESS;
      state.resetPasswordsubmitState = COMPLETE_STATE;
    },
    resetPasswordFailure: (state, { payload }) => {
      state.status = payload.status;
      state.resetPasswordsubmitState = FAILURE_STATE;
      state.errorMsg = payload.errorMsg;
    },
    validatePassword: (state) => {
      state.backendValidationError = null;
    },
    validatePasswordSuccess: (state, { payload }) => {
      state.backendValidationError = payload;
    },
    validatePasswordFailure: (state) => {
      state.backendValidationError = null;
    },
  },
});

export const {
  validateToken,
  validatePassword,
  validateTokenSuccess,
  validateTokenFailed,
  resetPassword,
  resetPasswordSuccess,
  resetPasswordFailure,
  validatePasswordSuccess,
  validatePasswordFailure,
} = resetPasswordSlice.actions;

export default resetPasswordSlice.reducer;
