/**
 * Redux slice for managing forgot password state.
 * This slice handles the forgot password process, including the submission state,
 * password reset success, and any errors that may occur.
 */

import { createSlice } from '@reduxjs/toolkit';

import {
  COMPLETE_STATE,
  DEFAULT_STATE,
  FORBIDDEN_STATE,
  INTERNAL_SERVER_ERROR,
  PENDING_STATE,
} from '../../../../data/constants';

export const storeName = 'forgotPassword';
export const FORGOT_PASSWORD_SLICE_NAME = 'forgotPassword';

export const forgotPasswordInitialState = {
  status: DEFAULT_STATE,
};

export const forgotPasswordSlice = createSlice({
  name: FORGOT_PASSWORD_SLICE_NAME,
  initialState: forgotPasswordInitialState,
  reducers: {
    forgotPassword: (state) => {
      state.status = PENDING_STATE;
    },
    forgotPasswordSuccess: (state) => {
      state.status = COMPLETE_STATE;
    },
    forgotPasswordForbidden: (state) => {
      state.status = FORBIDDEN_STATE;
    },
    forgotPasswordFailed: (state) => {
      state.status = INTERNAL_SERVER_ERROR;
    },
    forgotPasswordClearStatus: (state) => {
      state.status = DEFAULT_STATE;
    },
    forgotPassweordTokenInvalidFailure: (state, { payload }) => {
      state.status = payload;
    },
  },
});

export const {
  forgotPassword,
  forgotPasswordSuccess,
  forgotPasswordForbidden,
  forgotPasswordFailed,
  forgotPasswordClearStatus,
  forgotPassweordTokenInvalidFailure,
} = forgotPasswordSlice.actions;

export default forgotPasswordSlice.reducer;
