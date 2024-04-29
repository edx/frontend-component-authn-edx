/**
 * Redux slice for managing authn component common state i.e, providers, current providers, etc
 */

import { createSlice } from '@reduxjs/toolkit';

import { COMPLETE_STATE, DEFAULT_STATE, PENDING_STATE } from '../../data/constants';

export const commonDataStoreName = 'commonData';
export const COMMON_DATA_SLICE_NAME = 'commonData';

export const commonDataInitialState = {
  thirdPartyAuthApiStatus: DEFAULT_STATE,
  thirdPartyAuthContext: {
    autoSubmitRegForm: false,
    currentProvider: null,
    finishAuthUrl: null,
    providers: [],
    secondaryProviders: [],
    pipelineUserDetails: null,
    errorMessage: null,
  },
};

export const commonDataSlice = createSlice({
  name: COMMON_DATA_SLICE_NAME,
  initialState: commonDataInitialState,
  reducers: {
    getThirdPartyAuthContext: (state) => {
      state.thirdPartyAuthApiStatus = PENDING_STATE;
    },
    getThirdPartyAuthContextSuccess: (state, { payload: thirdPartyAuthContextData }) => {
      state.thirdPartyAuthApiStatus = COMPLETE_STATE;
      state.thirdPartyAuthContext = thirdPartyAuthContextData;
    },
    getThirdPartyAuthContextFailed: (state) => {
      state.thirdPartyAuthApiStatus = DEFAULT_STATE;
      state.thirdPartyAuthContext.errorMessage = null;
    },
    clearThirdPartyAuthContextErrorMessage: (state) => {
      state.thirdPartyAuthContext.errorMessage = null;
    },
  },
});

export const {
  getThirdPartyAuthContext,
  getThirdPartyAuthContextSuccess,
  getThirdPartyAuthContextFailed,
  clearThirdPartyAuthContextErrorMessage,
} = commonDataSlice.actions;

export default commonDataSlice.reducer;
