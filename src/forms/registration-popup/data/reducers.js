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
  registrationFormData: {
    isFormFilled: false,
    formFields: {
      name: '', email: '', password: '', marketingEmailsOptIn: true,
    },
    errors: {
      name: '', email: '', password: '',
    },
  },
  registrationFields: { marketingEmailsOptIn: true },
  userPipelineDataLoaded: false,
  validationApiRateLimited: false,
  validations: null,
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
      state.validations = null;
      state.submitState = DEFAULT_STATE;
    },
    fetchRealtimeValidations: (state) => {
      state.validationState = PENDING_STATE;
      state.validations = null;
    },
    fetchRealtimeValidationsSuccess: (state, { payload }) => {
      state.validationState = COMPLETE_STATE;
      state.validations = payload;
    },
    fetchRealtimeValidationsFailed: (state) => {
      state.validationApiRateLimited = true;
      state.validations = null;
      state.validationState = DEFAULT_STATE;
    },
    clearRegistrationBackendError: (state, { payload }) => {
      const registrationErrorTemp = state.registrationError;
      delete registrationErrorTemp[payload];
      state.registrationError = registrationErrorTemp;
    },
    clearAllRegistrationErrors: (state) => {
      state.registrationError = {};
      state.validations = null;
    },
    setRegistrationFields: (state, { payload }) => {
      state.registrationFields = payload;
    },
    backupRegistrationForm: (state, { payload }) => {
      state.registrationFormData = payload;
    },
  },
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
  clearRegistrationBackendError,
  backupRegistrationForm,
} = registerSlice.actions;

export default registerSlice.reducer;
