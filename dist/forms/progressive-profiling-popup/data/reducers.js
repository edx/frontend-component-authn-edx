/**
 * Redux slice for managing progressiveProfiling state.
 * This slice handles the progressiveProfiling process, including the submission state,
 * progressiveProfiling success and progressiveProfiling failure.
 */

import { createSlice } from '@reduxjs/toolkit';
import { COMPLETE_STATE, DEFAULT_STATE, FAILURE_STATE, PENDING_STATE } from '../../../data/constants';
export const storeName = 'progressiveProfiling';
export const PROGRESSIVE_PROFILING_SLICE_NAME = 'progressiveProfiling';
export const progressiveProfilingInitialState = {
  submitState: DEFAULT_STATE,
  redirectUrl: '',
  subjectsList: {}
};
export const progressiveProfilingSlice = createSlice({
  name: PROGRESSIVE_PROFILING_SLICE_NAME,
  initialState: progressiveProfilingInitialState,
  reducers: {
    saveUserProfile: state => {
      state.submitState = PENDING_STATE;
    },
    saveUserProfileSuccess: state => {
      state.submitState = COMPLETE_STATE;
    },
    saveUserProfileFailure: state => {
      state.submitState = FAILURE_STATE;
    },
    setProgressiveProfilingRedirectUrl: (state, _ref) => {
      let {
        payload: redirectUrl
      } = _ref;
      state.redirectUrl = redirectUrl;
    },
    setSubjectsList: (state, _ref2) => {
      let {
        payload
      } = _ref2;
      state.subjectsList = payload;
    }
  }
});
export const {
  saveUserProfile,
  saveUserProfileSuccess,
  saveUserProfileFailure,
  setProgressiveProfilingRedirectUrl,
  setSubjectsList
} = progressiveProfilingSlice.actions;
export default progressiveProfilingSlice.reducer;
//# sourceMappingURL=reducers.js.map