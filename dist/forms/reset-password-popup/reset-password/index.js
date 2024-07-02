function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Container, Form, Spinner, StatefulButton } from '@openedx/paragon';
import ResetPasswordFailure from './components/ResetPasswordFailure';
import { PASSWORD_RESET, PASSWORD_RESET_ERROR, PASSWORD_VALIDATION_ERROR, SUCCESS, TOKEN_STATE } from './data/constants';
import { resetPassword, validatePassword, validateToken } from './data/reducers';
import { setCurrentOpenedForm } from '../../../authn-component/data/reducers';
import { COMPLETE_STATE, DEFAULT_STATE, FORGOT_PASSWORD_FORM, FORM_SUBMISSION_ERROR, LOGIN_FORM, PENDING_STATE } from '../../../data/constants';
import { useDispatch, useSelector } from '../../../data/storeHooks';
import getAllPossibleQueryParams from '../../../data/utils';
import { trackPasswordResetSuccess, trackResetPasswordPageViewed } from '../../../tracking/trackers/reset-password';
import { PasswordField } from '../../fields';
import messages from '../messages';
import ResetPasswordHeader from '../ResetPasswordHeader';
export const LETTER_REGEX = /[a-zA-Z]/;
export const NUMBER_REGEX = /\d/;

/**
 * ResetPasswordForm component for completing user password reset.
 * This component provides a form for users to reset their password.
 * @returns {string} A message indicating the success or failure of the password reset process.
 */
const ResetPasswordPage = () => {
  const dispatch = useDispatch();
  const queryParams = useMemo(() => getAllPossibleQueryParams(), []);
  const passwordResetToken = queryParams?.password_reset_token;

  // const ResetPasswordPage = ({ errorMsg = null }) => {
  const {
    formatMessage
  } = useIntl();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [errorCode, setErrorCode] = useState(null);
  const newPasswordRef = useRef(null);
  const status = useSelector(state => state.resetPassword.status);
  const tokenValidationState = useSelector(state => state.resetPassword.status);
  const errorMsg = useSelector(state => state.resetPassword?.errorMsg);
  const backendValidationError = useSelector(state => state.resetPassword?.backendValidationError);
  const validatePasswordFromBackend = password => {
    const payload = {
      reset_password_page: true,
      password
    };
    dispatch(validatePassword(payload));
  };
  useEffect(() => {
    if (passwordResetToken) {
      dispatch(validateToken(passwordResetToken));
    }
  }, [dispatch, passwordResetToken]);
  useEffect(() => {
    setFormErrors(preState => _objectSpread(_objectSpread({}, preState), {}, {
      newPassword: backendValidationError || ''
    }));
  }, [backendValidationError]);
  useEffect(() => {
    if (status === TOKEN_STATE.VALID && newPasswordRef.current) {
      newPasswordRef.current.focus();
    }
  }, [status]);
  useEffect(() => {
    if (tokenValidationState === COMPLETE_STATE && status === TOKEN_STATE.VALID) {
      trackResetPasswordPageViewed();
    }
  }, [status, tokenValidationState]);
  const validateInput = function (name, value) {
    let shouldValidateFromBackend = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    switch (name) {
      case 'newPassword':
        if (!value) {
          formErrors.newPassword = formatMessage(messages.passwordRequiredMessage);
        } else if (!LETTER_REGEX.test(value) || !NUMBER_REGEX.test(value) || value.length < 8) {
          formErrors.newPassword = formatMessage(messages.passwordValidationMessage);
        } else if (shouldValidateFromBackend) {
          validatePasswordFromBackend(value);
        }
        break;
      case 'confirmPassword':
        if (!value) {
          formErrors.confirmPassword = formatMessage(messages.confirmYourPassword);
        } else if (value !== newPassword) {
          formErrors.confirmPassword = formatMessage(messages.passwordDoNotMatch);
        } else {
          formErrors.confirmPassword = '';
        }
        break;
      default:
        break;
    }
    setFormErrors(_objectSpread({}, formErrors));
    return !Object.values(formErrors).some(x => x !== '');
  };
  const handleOnBlur = event => {
    const {
      name,
      value
    } = event.target;
    validateInput(name, value);
  };
  const handleOnFocus = e => {
    setFormErrors(_objectSpread(_objectSpread({}, formErrors), {}, {
      [e.target.name]: ''
    }));
  };
  useEffect(() => {
    if (status !== TOKEN_STATE.PENDING && status !== PASSWORD_RESET_ERROR) {
      setErrorCode(status);
    }
    if (status === PASSWORD_VALIDATION_ERROR) {
      setFormErrors({
        newPassword: formatMessage(messages.passwordValidationMessage)
      });
    }
  }, [status, formatMessage]);
  const handleSubmit = e => {
    e.preventDefault();
    const isPasswordValid = validateInput('newPassword', newPassword, false);
    const isPasswordConfirmed = validateInput('confirmPassword', confirmPassword);
    if (isPasswordValid && isPasswordConfirmed) {
      const formPayload = {
        new_password1: newPassword,
        new_password2: confirmPassword
      };
      const params = queryParams;
      dispatch(resetPassword({
        formPayload,
        token: passwordResetToken,
        params
      }));
    } else {
      setErrorCode(FORM_SUBMISSION_ERROR);
    }
  };
  if (!passwordResetToken) {
    dispatch(setCurrentOpenedForm(FORGOT_PASSWORD_FORM));
  }
  if (status === TOKEN_STATE.PENDING || status === PENDING_STATE) {
    return /*#__PURE__*/React.createElement(Container, {
      size: "lg",
      className: "loader-container d-flex flex-column justify-content-center align-items-center my-6 w-100 h-100 text-center"
    }, /*#__PURE__*/React.createElement("h1", {
      className: "loader-heading text-center mb-4"
    }, formatMessage(messages.resetPasswordTokenValidatingHeadingText)), /*#__PURE__*/React.createElement(Spinner, {
      animation: "border",
      variant: "primary",
      className: "spinner--position-centered"
    }), ";");
  }
  if (status === PASSWORD_RESET_ERROR || status === PASSWORD_RESET.INVALID_TOKEN) {
    dispatch(setCurrentOpenedForm(FORGOT_PASSWORD_FORM));
  } else if (status === SUCCESS) {
    trackPasswordResetSuccess();
    dispatch(setCurrentOpenedForm(LOGIN_FORM));
  }
  return /*#__PURE__*/React.createElement(Container, {
    size: "lg",
    className: "authn__popup-container overflow-auto"
  }, /*#__PURE__*/React.createElement(ResetPasswordHeader, null), /*#__PURE__*/React.createElement(ResetPasswordFailure, {
    errorCode: errorCode,
    errorMsg: errorMsg
  }), /*#__PURE__*/React.createElement("div", {
    className: "text-gray-800 mb-4"
  }, formatMessage(messages.enterConfirmPasswordMessage)), /*#__PURE__*/React.createElement(Form, {
    id: "set-reset-password-form",
    name: "set-reset-password-form",
    className: "d-flex flex-column"
  }, /*#__PURE__*/React.createElement(PasswordField, {
    id: "newPassword",
    name: "newPassword",
    dataTestId: "newPassword",
    value: newPassword,
    handleChange: e => setNewPassword(e.target.value),
    handleFocus: handleOnFocus,
    handleBlur: handleOnBlur,
    errorMessage: formErrors.newPassword,
    floatingLabel: formatMessage(messages.newPasswordLabel),
    ref: newPasswordRef
  }), /*#__PURE__*/React.createElement(PasswordField, {
    id: "confirmPassword",
    name: "confirmPassword",
    dataTestId: "confirmPassword",
    value: confirmPassword,
    handleChange: e => setConfirmPassword(e.target.value),
    handleFocus: handleOnFocus,
    handleBlur: handleOnBlur,
    errorMessage: formErrors.confirmPassword,
    floatingLabel: formatMessage(messages.confirmPasswordLabel)
  }), /*#__PURE__*/React.createElement(StatefulButton, {
    id: "reset-password",
    name: "reset-password",
    type: "submit",
    variant: "primary",
    className: "align-self-end authn-btn__pill-shaped",
    state: DEFAULT_STATE,
    labels: {
      default: formatMessage(messages.resetPasswordButton),
      pending: ''
    },
    onClick: e => handleSubmit(e),
    onMouseDown: e => e.preventDefault()
  })));
};
export default ResetPasswordPage;
//# sourceMappingURL=index.js.map