/**
 * Redux slice for managing on boarding component common state i.e, providers, current providers, etc
 */

import { createSlice } from '@reduxjs/toolkit';

import {
  COMPLETE_STATE, DEFAULT_STATE, FAILURE_STATE, PENDING_STATE,
} from '../../data/constants';

export const commonDataStoreName = 'commonData';
export const COMMON_DATA_SLICE_NAME = 'commonData';

export const commonDataInitialState = {
  onboardingComponentContext: {},
  currentForm: null,
  thirdPartyAuthApiStatus: DEFAULT_STATE,
  thirdPartyAuthContext: {
    autoSubmitRegForm: false,
    currentProvider: null,
    countryCode: null,
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
    setOnboardingComponentContext: (state, { payload: componentContext }) => {
      state.onboardingComponentContext = componentContext;
    },
    getThirdPartyAuthContext: (state) => {
      state.thirdPartyAuthApiStatus = PENDING_STATE;
    },
    getThirdPartyAuthContextSuccess: (state, { payload: thirdPartyAuthContextData }) => {
      state.thirdPartyAuthApiStatus = COMPLETE_STATE;
      state.thirdPartyAuthContext = thirdPartyAuthContextData;
    },
    getThirdPartyAuthContextFailed: (state) => {
      state.thirdPartyAuthApiStatus = FAILURE_STATE;
      state.thirdPartyAuthContext.errorMessage = null;
    },
    setCurrentOpenedForm: (state, { payload: currentForm }) => {
      state.currentForm = currentForm;
      state.thirdPartyAuthContext.errorMessage = null;
    },
  },
});

export const {
  setOnboardingComponentContext,
  getThirdPartyAuthContext,
  getThirdPartyAuthContextSuccess,
  getThirdPartyAuthContextFailed,
  setCurrentOpenedForm,
} = commonDataSlice.actions;

export default commonDataSlice.reducer;
