function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { getConfig, snakeCaseObject } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Container, Form, Spinner, StatefulButton } from '@openedx/paragon';
import HonorCodeAndPrivacyPolicyMessage from './components/honorCodeAndTOS';
import RegistrationFailureAlert from './components/RegistrationFailureAlert';
import { clearAllRegistrationErrors, clearRegistrationBackendError, registerUser, setRegistrationFields } from './data/reducers';
import getBackendValidations from './data/selector';
import isFormValid from './data/utils';
import messages from './messages';
import { setCurrentOpenedForm } from '../../authn-component/data/reducers';
import { InlineLink, SocialAuthProviders } from '../../common-ui';
import { COMPLETE_STATE, ENTERPRISE_LOGIN_URL, FAILURE_STATE, FORM_SUBMISSION_ERROR, LOGIN_FORM, REGISTRATION_FORM, TPA_AUTHENTICATION_FAILURE } from '../../data/constants';
import { useDispatch, useSelector } from '../../data/storeHooks';
import getAllPossibleQueryParams, { getCountryCookieValue, moveScrollToTop, setCookie } from '../../data/utils';
import './index.scss';
import { trackLoginFormToggled, trackRegistrationPageViewed, trackRegistrationSuccess } from '../../tracking/trackers/register';
import AuthenticatedRedirection from '../common-components/AuthenticatedRedirection';
import SSOFailureAlert from '../common-components/SSOFailureAlert';
import ThirdPartyAuthAlert from '../common-components/ThirdPartyAuthAlert';
import { EmailField, MarketingEmailOptInCheckbox, NameField, PasswordField } from '../fields';
import useSubjectsList from '../progressive-profiling-popup/data/hooks/useSubjectList';
import { setSubjectsList } from '../progressive-profiling-popup/data/reducers';

/**
 * RegisterForm component for handling user registration.
 * This component provides a form for users to register with their name, email, password,
 * and a checkbox for opting out of marketing emails.
 */
const RegistrationForm = () => {
  const {
    formatMessage
  } = useIntl();
  const dispatch = useDispatch();
  const [formStartTime, setFormStartTime] = useState(null);
  const [formFields, setFormFields] = useState({
    name: '',
    email: '',
    password: '',
    marketingEmailsOptIn: true
  });
  const [errors, setErrors] = useState({});
  const [errorCode, setErrorCode] = useState({
    type: '',
    count: 0
  });
  const [userPipelineDataLoaded, setUserPipelineDataLoaded] = useState(false);
  const emailRef = useRef(null);
  const registerErrorAlertRef = useRef(null);
  const socialAuthnButtonRef = useRef(null);
  const registerFormHeadingRef = useRef(null);
  const queryParams = useMemo(() => getAllPossibleQueryParams(), []);
  const {
    subjectsList,
    subjectsLoading
  } = useSubjectsList();
  const registrationResult = useSelector(state => state.register.registrationResult);
  const onboardingComponentContext = useSelector(state => state.commonData.onboardingComponentContext);
  const thirdPartyAuthApiStatus = useSelector(state => state.commonData.thirdPartyAuthApiStatus);
  const thirdPartyAuthErrorMessage = useSelector(state => state.commonData.thirdPartyAuthContext.errorMessage);
  const finishAuthUrl = useSelector(state => state.commonData.thirdPartyAuthContext.finishAuthUrl);
  const providers = useSelector(state => state.commonData.thirdPartyAuthContext?.providers);
  const currentProvider = useSelector(state => state.commonData.thirdPartyAuthContext.currentProvider);
  const pipelineUserDetails = useSelector(state => state.commonData.thirdPartyAuthContext.pipelineUserDetails);
  const authContextCountryCode = useSelector(state => state.commonData.thirdPartyAuthContext.countryCode);
  const registrationError = useSelector(state => state.register.registrationError);
  const isLoginSSOIntent = useSelector(state => state.login.isLoginSSOIntent);
  const registrationErrorCode = registrationError?.errorCode;
  const backendValidations = useSelector(getBackendValidations);
  const submitState = useSelector(state => state.register.submitState);
  const autoSubmitRegForm = currentProvider && thirdPartyAuthApiStatus === COMPLETE_STATE && !isLoginSSOIntent && queryParams?.authMode === 'Register' && !localStorage.getItem('ssoPipelineRedirectionDone');

  /**
   * Set the userPipelineDetails data in formFields for only first time
   */
  useEffect(() => {
    if (!userPipelineDataLoaded && thirdPartyAuthApiStatus === COMPLETE_STATE) {
      if (thirdPartyAuthErrorMessage) {
        setErrorCode(prevState => ({
          type: TPA_AUTHENTICATION_FAILURE,
          count: prevState.count + 1
        }));
        localStorage.removeItem('marketingEmailsOptIn');
        localStorage.removeItem('ssoPipelineRedirectionDone');
      }
      if (pipelineUserDetails && Object.keys(pipelineUserDetails).length !== 0) {
        const {
          name = '',
          email = ''
        } = pipelineUserDetails;
        setFormFields(prevState => _objectSpread(_objectSpread({}, prevState), {}, {
          name,
          email
        }));
        setUserPipelineDataLoaded(true);
      }
    }
  }, [
  // eslint-disable-line react-hooks/exhaustive-deps
  thirdPartyAuthApiStatus, thirdPartyAuthErrorMessage, pipelineUserDetails, userPipelineDataLoaded]);
  useEffect(() => {
    if (thirdPartyAuthApiStatus === COMPLETE_STATE) {
      if (providers.length > 0 && socialAuthnButtonRef.current) {
        socialAuthnButtonRef.current.focus();
      } else if (emailRef.current) {
        emailRef.current.focus();
      }
    } else if (thirdPartyAuthApiStatus === FAILURE_STATE) {
      emailRef.current.focus();
    }
  }, [thirdPartyAuthApiStatus, providers]);
  useEffect(() => {
    moveScrollToTop(registerFormHeadingRef, 'end');
  }, []);
  useEffect(() => {
    if (!subjectsLoading) {
      dispatch(setSubjectsList(subjectsList));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, subjectsLoading]);
  const handleOnChange = event => {
    const {
      name
    } = event.target;
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    if (registrationError[name]) {
      dispatch(clearRegistrationBackendError(name));
    }
    // seting marketingEmailsOptIn state for SSO authentication flow for register API call
    if (name === 'marketingEmailsOptIn') {
      dispatch(setRegistrationFields({
        [name]: value
      }));
    }
    setErrors(prevErrors => _objectSpread(_objectSpread({}, prevErrors), {}, {
      [name]: ''
    }));
    setFormFields(prevState => _objectSpread(_objectSpread({}, prevState), {}, {
      [name]: value
    }));
  };
  useEffect(() => {
    if (thirdPartyAuthApiStatus === COMPLETE_STATE && currentProvider === null && localStorage.getItem('ssoPipelineRedirectionDone')) {
      localStorage.removeItem('ssoPipelineRedirectionDone');
      localStorage.removeItem('marketingEmailsOptIn');
    }
  }, [currentProvider, thirdPartyAuthApiStatus]);
  useEffect(() => {
    if (registrationResult.success) {
      // clear local storage
      localStorage.removeItem('marketingEmailsOptIn');
      localStorage.removeItem('ssoPipelineRedirectionDone');

      // This event is used by GTM
      trackRegistrationSuccess();

      // This is used by the "User Retention Rate Event" on GTM
      setCookie(getConfig().USER_RETENTION_COOKIE_NAME, true);
    }
  }, [registrationResult]);
  useEffect(() => {
    if (!formStartTime) {
      trackRegistrationPageViewed();
      setFormStartTime(Date.now());
    }
  }, [formStartTime]);
  useEffect(() => {
    if (backendValidations) {
      setErrors(prevErrors => _objectSpread(_objectSpread({}, prevErrors), backendValidations));
    }
  }, [backendValidations]);
  useEffect(() => {
    if (registrationErrorCode) {
      setErrorCode(prevState => ({
        type: registrationErrorCode,
        count: prevState.count + 1
      }));
      moveScrollToTop(registerErrorAlertRef);
      if (registerErrorAlertRef.current) {
        registerErrorAlertRef.current.focus();
      }
    }
  }, [registrationErrorCode]);
  const handleErrorChange = (fieldName, error) => {
    setErrors(prevErrors => _objectSpread(_objectSpread({}, prevErrors), {}, {
      [fieldName]: error
    }));
  };
  const handleUserRegistration = () => {
    const totalRegistrationTime = (Date.now() - formStartTime) / 1000;
    const userCountryCode = getCountryCookieValue();
    let payload = _objectSpread(_objectSpread({}, formFields), {}, {
      honor_code: true,
      terms_of_service: true,
      app_name: 'onboarding_component'
    });
    if (currentProvider) {
      delete payload.password;
      payload.social_auth_provider = currentProvider;
      if (!isLoginSSOIntent) {
        delete payload.marketingEmailsOptIn;
        payload.marketingEmailsOptIn = localStorage.getItem('marketingEmailsOptIn');
      }
    }

    // add country in payload if country cookie value or mfe_context country exists
    if (userCountryCode) {
      payload.country = userCountryCode;
    } else if (authContextCountryCode) {
      payload.country = authContextCountryCode;
    }

    // Validating form data before submitting
    const {
      isValid,
      fieldErrors
    } = isFormValid(payload, errors, formatMessage);
    setErrors(_objectSpread({}, fieldErrors));
    if (!isValid) {
      setErrorCode(prevState => ({
        type: FORM_SUBMISSION_ERROR,
        count: prevState.count + 1
      }));
      moveScrollToTop(registerErrorAlertRef);
      return;
    }
    payload = _objectSpread(_objectSpread(_objectSpread({}, onboardingComponentContext), queryParams), payload);
    payload = snakeCaseObject(payload);
    payload.totalRegistrationTime = totalRegistrationTime;
    dispatch(registerUser(payload));
  };
  const handleSubmit = e => {
    e.preventDefault();
    handleUserRegistration();
  };
  useEffect(() => {
    if (autoSubmitRegForm && userPipelineDataLoaded) {
      handleUserRegistration();
    }
  }, [autoSubmitRegForm, userPipelineDataLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  return /*#__PURE__*/React.createElement("div", {
    className: "flex-column"
  }, /*#__PURE__*/React.createElement(Container, {
    size: "lg",
    className: "authn__popup-container"
  }, /*#__PURE__*/React.createElement(AuthenticatedRedirection, {
    success: registrationResult.success,
    redirectUrl: registrationResult.redirectUrl,
    finishAuthUrl: finishAuthUrl,
    redirectToProgressiveProfilingForm: true
  }), /*#__PURE__*/React.createElement("h2", {
    className: "font-italic text-center display-1 mb-0",
    "data-testid": "sign-up-heading",
    ref: registerFormHeadingRef
  }, formatMessage(messages.registrationFormHeading1)), /*#__PURE__*/React.createElement("hr", {
    className: "separator my-3 my-sm-4"
  }), /*#__PURE__*/React.createElement(SSOFailureAlert, {
    errorCode: errorCode.type,
    context: {
      errorMessage: thirdPartyAuthErrorMessage
    }
  }), autoSubmitRegForm && !errorCode.type ? /*#__PURE__*/React.createElement("div", {
    className: "my-6 text-center"
  }, /*#__PURE__*/React.createElement(Spinner, {
    animation: "border",
    variant: "primary",
    id: "tpa-spinner"
  })) : /*#__PURE__*/React.createElement(React.Fragment, null, (!autoSubmitRegForm || errorCode.type) && !currentProvider && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SocialAuthProviders, {
    isLoginForm: false,
    ref: socialAuthnButtonRef
  }), /*#__PURE__*/React.createElement("div", {
    className: "text-center mb-4 mt-3"
  }, formatMessage(messages.registrationFormHeading2))), /*#__PURE__*/React.createElement(ThirdPartyAuthAlert, {
    currentProvider: currentProvider,
    referrer: REGISTRATION_FORM
  }), /*#__PURE__*/React.createElement("div", {
    ref: registerErrorAlertRef,
    tabIndex: "-1",
    "aria-live": "assertive"
  }, /*#__PURE__*/React.createElement(RegistrationFailureAlert, {
    errorCode: errorCode.type,
    failureCount: errorCode.count,
    context: {
      provider: currentProvider,
      errorMessage: thirdPartyAuthErrorMessage
    }
  })), /*#__PURE__*/React.createElement(Form, {
    id: "registration-form",
    name: "registration-form",
    className: "d-flex flex-column my-4"
  }, /*#__PURE__*/React.createElement(EmailField, {
    name: "email",
    value: formFields.email,
    errorMessage: errors.email,
    handleChange: handleOnChange,
    handleErrorChange: handleErrorChange,
    floatingLabel: formatMessage(messages.registrationFormEmailFieldLabel),
    ref: emailRef
  }), /*#__PURE__*/React.createElement(NameField, {
    label: "Full name",
    name: "name",
    value: formFields.name,
    errorMessage: errors.name,
    handleChange: handleOnChange,
    handleErrorChange: handleErrorChange,
    handleFocus: () => {}
  }), !currentProvider && /*#__PURE__*/React.createElement(PasswordField, {
    name: "password",
    value: formFields.password,
    errorMessage: errors.password,
    handleChange: handleOnChange,
    handleErrorChange: handleErrorChange,
    handleFocus: () => {},
    floatingLabel: formatMessage(messages.registrationFormPasswordFieldLabel)
  }), /*#__PURE__*/React.createElement(MarketingEmailOptInCheckbox, {
    name: "marketingEmailsOptIn",
    value: formFields.marketingEmailsOptIn,
    handleChange: handleOnChange
  }), /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column my-4"
  }, /*#__PURE__*/React.createElement(StatefulButton, {
    id: "register-user",
    name: "register-user",
    type: "submit",
    variant: "primary",
    className: "align-self-end registration-form__submit-btn__width authn-btn__pill-shaped",
    state: submitState,
    labels: {
      default: formatMessage(messages.registrationFormCreateAccountButton),
      pending: ''
    },
    onClick: handleSubmit,
    onMouseDown: e => e.preventDefault()
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(InlineLink, {
    className: "mb-2",
    onClick: () => {
      trackLoginFormToggled();
      dispatch(clearAllRegistrationErrors());
      dispatch(setCurrentOpenedForm(LOGIN_FORM));
    },
    linkHelpText: formatMessage(messages.registrationFormAlreadyHaveAccountText),
    linkText: formatMessage(messages.registrationFormSignInLink)
  }), /*#__PURE__*/React.createElement(InlineLink, {
    destination: getConfig().LMS_BASE_URL + ENTERPRISE_LOGIN_URL,
    linkHelpText: formatMessage(messages.registrationFormSchoolOrOrganizationLink),
    linkText: formatMessage(messages.registrationFormSignInWithCredentialsLink)
  })))), !(autoSubmitRegForm && !errorCode.type) && /*#__PURE__*/React.createElement("div", {
    className: "bg-dark-500"
  }, /*#__PURE__*/React.createElement("p", {
    className: "mb-0 text-white m-auto authn-popup__registration-footer"
  }, /*#__PURE__*/React.createElement(HonorCodeAndPrivacyPolicyMessage, null))));
};
export default RegistrationForm;
//# sourceMappingURL=index.js.map