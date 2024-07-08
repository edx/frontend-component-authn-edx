/**
 * Redux slice for managing authn component common state i.e, providers, current providers, etc
 */

import { createSlice } from '@reduxjs/toolkit';
import { COMPLETE_STATE, DEFAULT_STATE, FAILURE_STATE, PENDING_STATE } from '../../data/constants';
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
    errorMessage: null
  }
};
export const commonDataSlice = createSlice({
  name: COMMON_DATA_SLICE_NAME,
  initialState: commonDataInitialState,
  reducers: {
    setOnboardingComponentContext: (state, _ref) => {
      let {
        payload: componentContext
      } = _ref;
      state.onboardingComponentContext = componentContext;
    },
    getThirdPartyAuthContext: state => {
      state.thirdPartyAuthApiStatus = PENDING_STATE;
    },
    getThirdPartyAuthContextSuccess: (state, _ref2) => {
      let {
        payload: thirdPartyAuthContextData
      } = _ref2;
      state.thirdPartyAuthApiStatus = COMPLETE_STATE;
      state.thirdPartyAuthContext = thirdPartyAuthContextData;
    },
    getThirdPartyAuthContextFailed: state => {
      state.thirdPartyAuthApiStatus = FAILURE_STATE;
      state.thirdPartyAuthContext.errorMessage = null;
    },
    setCurrentOpenedForm: (state, _ref3) => {
      let {
        payload: currentForm
      } = _ref3;
      state.currentForm = currentForm;
      state.thirdPartyAuthContext.errorMessage = null;
    }
  }
});
export const {
  setOnboardingComponentContext,
  getThirdPartyAuthContext,
  getThirdPartyAuthContextSuccess,
  getThirdPartyAuthContextFailed,
  setCurrentOpenedForm
} = commonDataSlice.actions;
export default commonDataSlice.reducer;
//# sourceMappingURL=reducers.js.map