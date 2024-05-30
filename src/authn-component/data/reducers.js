/**
 * Redux slice for managing authn component common state i.e, providers, current providers, etc
 */

import { createSlice } from '@reduxjs/toolkit';

import {
  COMPLETE_STATE, DEFAULT_STATE, FAILURE_STATE, PENDING_STATE, REGISTRATION_FORM,
} from '../../data/constants';

export const commonDataStoreName = 'commonData';
export const COMMON_DATA_SLICE_NAME = 'commonData';

export const commonDataInitialState = {
  currentForm: REGISTRATION_FORM,
  thirdPartyAuthApiStatus: DEFAULT_STATE,
  registerIntent: false,
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
    setRegisterIntent: (state) => {
      state.registerIntent = true;
    },
  },
});

export const {
  getThirdPartyAuthContext,
  getThirdPartyAuthContextSuccess,
  getThirdPartyAuthContextFailed,
  setCurrentOpenedForm,
  setRegisterIntent,
} = commonDataSlice.actions;

export default commonDataSlice.reducer;
