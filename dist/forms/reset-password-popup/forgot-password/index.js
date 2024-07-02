function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React, { useEffect, useRef, useState } from 'react';
import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, Container, Form, StatefulButton } from '@openedx/paragon';
import { forgotPassword, forgotPasswordClearStatus } from './data/reducers';
import getValidationMessage from './data/utils';
import ForgotPasswordFailureAlert from './ForgotPasswordFailureAlert';
import ForgotPasswordSuccess from './ForgotPasswordSuccess';
import { setCurrentOpenedForm } from '../../../authn-component/data/reducers';
import { InlineLink } from '../../../common-ui';
import { COMPLETE_STATE, DEFAULT_STATE, LOGIN_FORM } from '../../../data/constants';
import { useDispatch, useSelector } from '../../../data/storeHooks';
import { trackForgotPasswordPageEvent, trackForgotPasswordPageViewed } from '../../../tracking/trackers/forgotpassword';
import EmailField from '../../fields/email-field';
import { NUDGE_PASSWORD_CHANGE, REQUIRE_PASSWORD_CHANGE } from '../../login-popup/data/constants';
import { loginErrorClear } from '../../login-popup/data/reducers';
import messages from '../messages';
import ResetPasswordHeader from '../ResetPasswordHeader';
import '../index.scss';
const ForgotPasswordForm = () => {
  const {
    formatMessage
  } = useIntl();
  const dispatch = useDispatch();
  const status = useSelector(state => state.forgotPassword?.status);
  const loginErrorCode = useSelector(state => state.login.loginError?.errorCode);
  const [formErrors, setFormErrors] = useState('');
  const [formFields, setFormFields] = useState({
    email: ''
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const emailRef = useRef(null);
  const nudgePasswordChangeRef = useRef(null);
  const requirePasswordChangeRef = useRef(null);
  useEffect(() => {
    trackForgotPasswordPageViewed();
    trackForgotPasswordPageEvent();
  }, []);
  const handleOnChange = event => {
    const {
      name
    } = event.target;
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormFields(prevState => _objectSpread(_objectSpread({}, prevState), {}, {
      [name]: value
    }));
  };
  const handleErrorChange = (fieldName, error) => {
    setFormErrors(error);
  };
  const backToLogin = e => {
    e.preventDefault();
    dispatch(forgotPasswordClearStatus());
    dispatch(loginErrorClear());
    dispatch(setCurrentOpenedForm(LOGIN_FORM));
  };
  useEffect(() => {
    if (status === COMPLETE_STATE) {
      setFormErrors('');
      setIsSuccess(true);
    }
  }, [status]);
  useEffect(() => {
    if (loginErrorCode === NUDGE_PASSWORD_CHANGE && nudgePasswordChangeRef.current) {
      nudgePasswordChangeRef.current.focus();
    } else if (loginErrorCode === REQUIRE_PASSWORD_CHANGE && requirePasswordChangeRef.current) {
      requirePasswordChangeRef.current.focus();
    } else {
      emailRef.current.focus();
    }
  }, [loginErrorCode]);
  const handleSubmit = e => {
    e.preventDefault();
    setFormErrors('');
    const error = getValidationMessage(formFields.email, formatMessage);
    if (error) {
      setFormErrors(error);
    } else {
      dispatch(forgotPassword(formFields.email));
    }
  };
  return /*#__PURE__*/React.createElement(Container, {
    size: "lg",
    className: "authn__popup-container overflow-auto"
  }, /*#__PURE__*/React.createElement(ResetPasswordHeader, null), /*#__PURE__*/React.createElement(ForgotPasswordFailureAlert, {
    emailError: formErrors,
    status: status
  }), status === DEFAULT_STATE && loginErrorCode === REQUIRE_PASSWORD_CHANGE && /*#__PURE__*/React.createElement("p", {
    "aria-live": "assertive",
    tabIndex: "-1",
    ref: requirePasswordChangeRef,
    "data-testid": "require-password-change-message"
  }, formatMessage(messages.vulnerablePasswordBlockedMessage)), status === DEFAULT_STATE && loginErrorCode === NUDGE_PASSWORD_CHANGE && /*#__PURE__*/React.createElement("p", {
    tabIndex: "-1",
    "aria-live": "assertive",
    ref: nudgePasswordChangeRef,
    "data-testid": "nudge-password-change-message"
  }, formatMessage(messages.vulnerablePasswordWarnedMessage)), !isSuccess && /*#__PURE__*/React.createElement(Form, {
    id: "forgot-password-form",
    name: "reset-password-form",
    className: "d-flex flex-column"
  }, /*#__PURE__*/React.createElement(EmailField, {
    name: "email",
    value: formFields.email,
    handleChange: handleOnChange,
    handleErrorChange: handleErrorChange,
    autoComplete: "email",
    errorMessage: formErrors,
    floatingLabel: formatMessage(messages.forgotPasswordFormEmailFieldLabel),
    isRegistration: false,
    validateEmailFromBackend: false,
    ref: emailRef
  }), /*#__PURE__*/React.createElement(StatefulButton, {
    id: "reset-password-user",
    name: "reset-password-user",
    type: "submit",
    variant: "primary",
    className: "align-self-end forgot-password-form__submit-btn__width authn-btn__pill-shaped",
    state: status,
    labels: {
      default: formatMessage(messages.resetPasswordFormSubmitButton),
      pending: ''
    },
    onClick: handleSubmit,
    onMouseDown: e => e.preventDefault()
  }), /*#__PURE__*/React.createElement("div", {
    className: "my-4"
  }, /*#__PURE__*/React.createElement(InlineLink, {
    className: "mb-2",
    destination: getConfig().LOGIN_ISSUE_SUPPORT_LINK,
    linkHelpText: formatMessage(messages.resetPasswordFormNeedHelpText),
    linkText: formatMessage(messages.resetPasswordFormHelpCenterLink),
    targetBlank: true
  }), /*#__PURE__*/React.createElement(InlineLink, {
    className: "font-weight-normal small",
    destination: `mailto:${getConfig().INFO_EMAIL}`,
    linkHelpText: formatMessage(messages.resetPasswordFormAdditionalHelpText),
    linkText: getConfig().INFO_EMAIL
  }))), isSuccess && /*#__PURE__*/React.createElement(ForgotPasswordSuccess, {
    email: formFields.email
  }), /*#__PURE__*/React.createElement("div", {
    className: "text-center mt-4.5"
  }, loginErrorCode !== REQUIRE_PASSWORD_CHANGE && /*#__PURE__*/React.createElement(Button, {
    id: "reset-password-back-to-login",
    name: "reset-password-back-to-login",
    variant: "tertiary",
    type: "submit",
    className: "align-self-center back-to-login__button authn-btn__pill-shaped",
    onClick: backToLogin,
    onMouseDown: e => e.preventDefault()
  }, formatMessage(messages.resetPasswordBackToLoginButton))));
};
export default ForgotPasswordForm;
//# sourceMappingURL=index.js.map