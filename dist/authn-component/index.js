function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React, { useEffect, useMemo, useState } from 'react';
import { Spinner } from '@openedx/paragon';
import PropTypes from 'prop-types';
import { getThirdPartyAuthContext, setCurrentOpenedForm, setOnboardingComponentContext } from './data/reducers';
import validateContextData from './data/utils';
import BaseContainer from '../base-container';
import AuthnProvider from '../data/authnProvider';
import { ENTERPRISE_LOGIN, FORGOT_PASSWORD_FORM, LOGIN_FORM, PENDING_STATE, PROGRESSIVE_PROFILING_FORM, REGISTRATION_FORM, RESET_PASSWORD_FORM, VALID_FORMS } from '../data/constants';
import { useDispatch, useSelector } from '../data/storeHooks';
import getAllPossibleQueryParams from '../data/utils';
import { ForgotPasswordForm, LoginForm, ProgressiveProfilingForm, RegistrationForm, ResetPasswordForm } from '../forms';
import EnterpriseSSO from '../forms/enterprise-sso-popup';
import { getTpaHint, getTpaProvider } from '../forms/enterprise-sso-popup/data/utils';
import { REQUIRE_PASSWORD_CHANGE } from '../forms/login-popup/data/constants';
import { TOKEN_STATE } from '../forms/reset-password-popup/reset-password/data/constants';
/**
 * Main component that conditionally renders a login or registration form inside a modal window.
 *
 * @param {boolean} isOpen - Required. Whether the modal window is open.
 * @param {function} close - Required. Function to close the modal window.
 * @param {string} formToRender - Optional. Indicates which form to render ('login' or 'register').
 * @param {Object} context - Optional. Additional context needed for authentication, such as enrollment data.
 *
 * @returns {JSX.Element} The rendered component containing the login or registration form.
 */
export const AuthnComponent = _ref => {
  let {
    isOpen,
    close,
    context = null,
    formToRender
  } = _ref;
  const dispatch = useDispatch();
  const queryParams = useMemo(() => getAllPossibleQueryParams(), []);
  const [screenSize, setScreenSize] = useState('lg');
  const [hasCloseButton, setHasCloseButton] = useState(true);
  const currentForm = useSelector(state => state.commonData.currentForm);
  const providers = useSelector(state => state.commonData.thirdPartyAuthContext?.providers);
  const secondaryProviders = useSelector(state => state.commonData.thirdPartyAuthContext?.secondaryProviders);
  const thirdPartyAuthApiStatus = useSelector(state => state.commonData.thirdPartyAuthApiStatus);
  const loginErrorCode = useSelector(state => state.login.loginError?.errorCode);
  const resetPasswordTokenStatus = useSelector(state => state.resetPassword?.status);
  const tpaHint = getTpaHint();
  const {
    provider: tpaProvider
  } = getTpaProvider(tpaHint, providers, secondaryProviders);
  const pendingState = queryParams?.tpa_hint && thirdPartyAuthApiStatus === PENDING_STATE;
  useEffect(() => {
    if (currentForm === PROGRESSIVE_PROFILING_FORM) {
      setHasCloseButton(false);
      setScreenSize('fullscreen');
    }
    if (loginErrorCode === REQUIRE_PASSWORD_CHANGE && currentForm === FORGOT_PASSWORD_FORM) {
      setHasCloseButton(false);
    }
    if (currentForm === RESET_PASSWORD_FORM && resetPasswordTokenStatus === TOKEN_STATE.PENDING) {
      setHasCloseButton(false);
    }
    if (currentForm === RESET_PASSWORD_FORM && resetPasswordTokenStatus !== TOKEN_STATE.PENDING) {
      setHasCloseButton(true);
    }
  }, [currentForm, resetPasswordTokenStatus, loginErrorCode]);
  useEffect(() => {
    if (tpaProvider) {
      dispatch(setCurrentOpenedForm(ENTERPRISE_LOGIN));
    }
    if (!tpaProvider && formToRender) {
      dispatch(setCurrentOpenedForm(formToRender));
    }
  }, [dispatch, formToRender, tpaProvider, queryParams]);
  useEffect(() => {
    let validatedContext = {};
    if (context) {
      validatedContext = validateContextData(context);
    }
    dispatch(setOnboardingComponentContext(validatedContext));
    dispatch(getThirdPartyAuthContext(_objectSpread(_objectSpread({}, validatedContext), queryParams)));
  }, [context, dispatch, queryParams]);
  const getForm = () => {
    if (currentForm === ENTERPRISE_LOGIN) {
      return /*#__PURE__*/React.createElement(EnterpriseSSO, {
        provider: tpaProvider
      });
    }
    if (currentForm === FORGOT_PASSWORD_FORM) {
      return /*#__PURE__*/React.createElement(ForgotPasswordForm, null);
    }
    if (currentForm === LOGIN_FORM) {
      return /*#__PURE__*/React.createElement(LoginForm, null);
    }
    if (currentForm === PROGRESSIVE_PROFILING_FORM) {
      return /*#__PURE__*/React.createElement(ProgressiveProfilingForm, null);
    }
    if (currentForm === REGISTRATION_FORM) {
      return /*#__PURE__*/React.createElement(RegistrationForm, null);
    }
    if (currentForm === RESET_PASSWORD_FORM) {
      return /*#__PURE__*/React.createElement(ResetPasswordForm, null);
    }
    return null;
  };
  const getSpinner = () => /*#__PURE__*/React.createElement("div", {
    className: "w-100 text-center p-5",
    "data-testid": "tpa-spinner"
  }, /*#__PURE__*/React.createElement(Spinner, {
    className: "m-5",
    animation: "border",
    variant: "primary"
  }));
  return /*#__PURE__*/React.createElement(BaseContainer, {
    isOpen: isOpen,
    close: close,
    hasCloseButton: hasCloseButton,
    size: screenSize
  }, pendingState ? getSpinner() : getForm());
};
AuthnComponent.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  context: PropTypes.shape({
    course_id: PropTypes.string,
    enrollment_action: PropTypes.string,
    email_opt_in: PropTypes.bool
  }),
  formToRender: PropTypes.oneOf(VALID_FORMS).isRequired
};

/**
 * Higher Order Component that wraps AuthnComponent with AppProvider.
 */
const AuthnComponentWithProvider = props => {
  if (props.isOpen) {
    return /*#__PURE__*/React.createElement(AuthnProvider, null, /*#__PURE__*/React.createElement(AuthnComponent, props));
  }
  return null;
};
AuthnComponentWithProvider.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  context: PropTypes.shape({
    course_id: PropTypes.string,
    enrollment_action: PropTypes.string,
    email_opt_in: PropTypes.bool
  }),
  formToRender: PropTypes.oneOf(VALID_FORMS),
  locale: PropTypes.string
};

/**
 * Component that renders a sign-in form using AuthnComponentWithProvider.
 *
 * @param {Object} props - Props for the component.
 * @returns {JSX.Element} The rendered sign-in component.
 */
export const SignInComponent = props => /*#__PURE__*/React.createElement(AuthnComponentWithProvider, _extends({}, props, {
  formToRender: LOGIN_FORM
}));

/**
 * Component that renders a sign-up form using AuthnComponentWithProvider.
 *
 * @param {Object} props - Props for the component.
 * @returns {JSX.Element} The rendered sign-up component.
 */
export const SignUpComponent = props => /*#__PURE__*/React.createElement(AuthnComponentWithProvider, _extends({}, props, {
  formToRender: REGISTRATION_FORM
}));

/**
 * Component that renders a reset password form using AuthnComponentWithProvider.
 *
 * @param {Object} props - Props for the component.
 * @returns {JSX.Element} The rendered reset password component.
 */
export const ResetPasswordComponent = props => /*#__PURE__*/React.createElement(AuthnComponentWithProvider, _extends({}, props, {
  formToRender: RESET_PASSWORD_FORM
}));
//# sourceMappingURL=index.js.map