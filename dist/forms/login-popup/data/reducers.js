function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Redux slice for managing login state.
 * This slice handles the login process, including the submission state,
 * login success, and any login errors.
 */

import { createSlice } from '@reduxjs/toolkit';
import { COMPLETE_STATE, DEFAULT_STATE, FAILURE_STATE, PENDING_STATE } from '../../../data/constants';
export const storeName = 'login';
export const LOGIN_SLICE_NAME = 'login';
export const loginInitialState = {
  submitState: DEFAULT_STATE,
  isLoginSSOIntent: false,
  loginError: {},
  loginResult: {},
  showResetPasswordSuccessBanner: false
};
export const loginSlice = createSlice({
  name: LOGIN_SLICE_NAME,
  initialState: loginInitialState,
  reducers: {
    loginUser: state => {
      state.submitState = PENDING_STATE;
      state.loginError = {};
    },
    loginUserSuccess: (state, _ref) => {
      let {
        payload
      } = _ref;
      state.submitState = COMPLETE_STATE;
      state.loginResult = payload;
    },
    setShowPasswordResetBanner: state => {
      state.showResetPasswordSuccessBanner = true;
    },
    loginUserFailed: (state, _ref2) => {
      let {
        payload
      } = _ref2;
      const {
        context,
        errorCode,
        email,
        value
      } = payload;
      const errorContext = _objectSpread(_objectSpread({}, context), {}, {
        email,
        errorMessage: value
      });
      state.loginError = {
        errorCode,
        errorContext
      };
      state.loginResult = {};
      state.submitState = FAILURE_STATE;
    },
    loginErrorClear: state => {
      state.loginError = {};
      state.submitState = DEFAULT_STATE;
    },
    setLoginSSOIntent: state => {
      state.isLoginSSOIntent = true;
    }
  }
});
export const {
  loginErrorClear,
  loginUser,
  loginUserSuccess,
  loginUserFailed,
  setShowPasswordResetBanner,
  setLoginSSOIntent
} = loginSlice.actions;
export default loginSlice.reducer;
//# sourceMappingURL=reducers.js.map