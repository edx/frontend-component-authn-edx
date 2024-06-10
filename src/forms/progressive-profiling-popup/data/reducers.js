/**
 * Redux slice for managing progressiveProfiling state.
 * This slice handles the progressiveProfiling process, including the submission state,
 * progressiveProfiling success and progressiveProfiling failure.
 */

import { createSlice } from '@reduxjs/toolkit';

import {
  COMPLETE_STATE,
  DEFAULT_STATE,
  FAILURE_STATE,
  PENDING_STATE,
} from '../../../data/constants';

export const storeName = 'progressiveProfiling';
export const PROGRESSIVE_PROFILING_SLICE_NAME = 'progressiveProfiling';

export const progressiveProfilingInitialState = {
  submitState: DEFAULT_STATE,
  redirectUrl: '',
};

export const progressiveProfilingSlice = createSlice({
  name: PROGRESSIVE_PROFILING_SLICE_NAME,
  initialState: progressiveProfilingInitialState,
  reducers: {
    saveUserProfile: (state) => {
      state.submitState = PENDING_STATE;
    },
    saveUserProfileSuccess: (state) => {
      state.submitState = COMPLETE_STATE;
    },
    saveUserProfileFailure: (state) => {
      state.submitState = FAILURE_STATE;
    },
    setProgressiveProfilingRedirectUrl: (state, { payload: redirectUrl }) => {
      state.redirectUrl = redirectUrl;
    },
  },
});

export const {
  saveUserProfile,
  saveUserProfileSuccess,
  saveUserProfileFailure,
  setProgressiveProfilingRedirectUrl,
} = progressiveProfilingSlice.actions;

export default progressiveProfilingSlice.reducer;
