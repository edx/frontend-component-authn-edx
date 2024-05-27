/**
 * Redux slice for managing registration state.
 * This slice handles the registration process, including the submission state,
 * registration result, and any registration errors.
 */

import { createSlice } from '@reduxjs/toolkit';

import { COMPLETE_STATE, DEFAULT_STATE, PENDING_STATE } from '../../../data/constants';

export const storeName = 'register';
export const REGISTER_SLICE_NAME = 'register';

export const registerInitialState = {
  submitState: DEFAULT_STATE,
  registrationError: {},
  registrationResult: {},
  userPipelineDataLoaded: false,
};

export const registerSlice = createSlice({
  name: REGISTER_SLICE_NAME,
  initialState: registerInitialState,
  reducers: {
    registerUser: (state) => {
      state.submitState = PENDING_STATE;
      state.registrationError = {};
    },
    registerUserSuccess: (state, { payload }) => {
      state.submitState = COMPLETE_STATE;
      state.registrationResult = payload;
    },
    registerUserFailed: (state, { payload }) => {
      state.registrationError = payload;
      state.registrationResult = {};
      state.submitState = DEFAULT_STATE;
    },
    setUserPipelineDataLoaded: (state, { payload }) => {
      state.userPipelineDataLoaded = payload;
    },
  },
});

export const {
  registerUser,
  registerUserSuccess,
  registerUserFailed,
  setUserPipelineDataLoaded,
} = registerSlice.actions;

export default registerSlice.reducer;
