/**
 * Redux slice for managing login state.
 * This slice handles the login process, including the submission state,
 * login success, and any login errors.
 */

import { createSlice } from '@reduxjs/toolkit';

import {
  COMPLETE_STATE,
  DEFAULT_STATE,
  FAILURE_STATE,
  PENDING_STATE,
} from '../../../data/constants';

export const storeName = 'login';
export const LOGIN_SLICE_NAME = 'login';

export const loginInitialState = {
  submitState: DEFAULT_STATE,
  loginError: {},
  loginResult: {},
};

export const loginSlice = createSlice({
  name: LOGIN_SLICE_NAME,
  initialState: loginInitialState,
  reducers: {
    loginUser: (state) => {
      state.submitState = PENDING_STATE;
      state.loginError = {};
    },
    loginUserSuccess: (state, { payload }) => {
      state.submitState = COMPLETE_STATE;
      state.loginResult = payload;
    },
    loginUserFailed: (state, { payload }) => {
      const {
        context,
        errorCode,
        email,
        value,
      } = payload;

      const errorContext = { ...context, email, errorMessage: value };
      state.loginError = { errorCode, errorContext };
      state.loginResult = {};
      state.submitState = FAILURE_STATE;
    },
  },
});

export const {
  loginUser,
  loginUserSuccess,
  loginUserFailed,
} = loginSlice.actions;

export default loginSlice.reducer;
