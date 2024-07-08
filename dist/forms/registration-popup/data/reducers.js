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
  validationState: DEFAULT_STATE,
  registrationError: {},
  registrationResult: {},
  registrationFields: {
    marketingEmailsOptIn: true
  },
  userPipelineDataLoaded: false,
  validationApiRateLimited: false,
  validations: null
};
export const registerSlice = createSlice({
  name: REGISTER_SLICE_NAME,
  initialState: registerInitialState,
  reducers: {
    registerUser: state => {
      state.submitState = PENDING_STATE;
      state.registrationError = {};
    },
    registerUserSuccess: (state, _ref) => {
      let {
        payload
      } = _ref;
      state.submitState = COMPLETE_STATE;
      state.registrationResult = payload;
    },
    registerUserFailed: (state, _ref2) => {
      let {
        payload
      } = _ref2;
      state.registrationError = payload;
      state.registrationResult = {};
      state.validations = null;
      state.submitState = DEFAULT_STATE;
    },
    fetchRealtimeValidations: state => {
      state.validationState = PENDING_STATE;
      state.validations = null;
    },
    fetchRealtimeValidationsSuccess: (state, _ref3) => {
      let {
        payload
      } = _ref3;
      state.validationState = COMPLETE_STATE;
      state.validations = payload;
    },
    fetchRealtimeValidationsFailed: state => {
      state.validationApiRateLimited = true;
      state.validations = null;
      state.validationState = DEFAULT_STATE;
    },
    clearRegistrationBackendError: (state, _ref4) => {
      let {
        payload
      } = _ref4;
      const registrationErrorTemp = state.registrationError;
      delete registrationErrorTemp[payload];
      state.registrationError = registrationErrorTemp;
    },
    clearAllRegistrationErrors: state => {
      state.registrationError = {};
      state.validations = null;
    },
    setRegistrationFields: (state, _ref5) => {
      let {
        payload
      } = _ref5;
      state.registrationFields = payload;
    }
  }
});
export const {
  registerUser,
  registerUserSuccess,
  registerUserFailed,
  setRegistrationFields,
  fetchRealtimeValidations,
  fetchRealtimeValidationsSuccess,
  fetchRealtimeValidationsFailed,
  clearAllRegistrationErrors,
  clearRegistrationBackendError
} = registerSlice.actions;
export default registerSlice.reducer;
//# sourceMappingURL=reducers.js.map