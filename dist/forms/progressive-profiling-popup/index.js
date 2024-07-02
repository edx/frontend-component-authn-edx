function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { getConfig, snakeCaseObject } from '@edx/frontend-platform';
import { identifyAuthenticatedUser } from '@edx/frontend-platform/analytics';
import { AxiosJwtAuthService, configure as configureAuth } from '@edx/frontend-platform/auth';
import { getCountryList, getLocale, useIntl } from '@edx/frontend-platform/i18n';
import { getLoggingService } from '@edx/frontend-platform/logging';
import { Container, Form, Icon, StatefulButton } from '@openedx/paragon';
import { Language } from '@openedx/paragon/icons';
import { extendedProfileFields, optionalFieldsData } from './data/constants';
import { saveUserProfile } from './data/reducers';
import messages from './messages';
import { setCurrentOpenedForm } from '../../authn-component/data/reducers';
import { COMPLETE_STATE, DEFAULT_STATE, FAILURE_STATE, LOGIN_FORM, PENDING_STATE } from '../../data/constants';
import { useDispatch, useSelector } from '../../data/storeHooks';
import { getCountryCookieValue, moveScrollToTop } from '../../data/utils';
import { trackProgressiveProfilingPageViewed, trackProgressiveProfilingSkipLinkClick, trackProgressiveProfilingSubmitClick } from '../../tracking/trackers/progressive-profiling';
import AuthenticatedRedirection from '../common-components/AuthenticatedRedirection';
import AutoSuggestField from '../fields/auto-suggested-field';
import './index.scss';

/**
 * Progressive profiling form component. This component holds the logic to render optional demographic
 * form fields and infor users about the auto-generated country field.
 *
 * @returns {JSX.Element} Progressive profiling form rendered inside BaseContainer component.
 */
const ProgressiveProfilingForm = () => {
  const {
    formatMessage
  } = useIntl();
  const dispatch = useDispatch();
  const countryFieldRef = useRef(null);
  const countryCookieValue = getCountryCookieValue();
  const countryList = useMemo(() => getCountryList(getLocale()), []);
  const submitState = useSelector(state => state.progressiveProfiling.submitState);
  const subjectsList = useSelector(state => state.progressiveProfiling.subjectsList);
  const redirectUrl = useSelector(state => state.progressiveProfiling.redirectUrl);
  const authContextCountryCode = useSelector(state => state.commonData.thirdPartyAuthContext.countryCode);
  const finishAuthUrl = useSelector(state => state.commonData.thirdPartyAuthContext.finishAuthUrl);
  const authenticatedUser = useSelector(state => state.register.registrationResult.authenticatedUser);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [autoFilledCountry, setAutoFilledCountry] = useState({
    value: '',
    displayText: ''
  });
  const [skipButtonState, setSkipButtonState] = useState(DEFAULT_STATE);
  useEffect(() => {
    let countryCode = null;
    if (countryCookieValue) {
      countryCode = countryCookieValue;
    } else if (authContextCountryCode) {
      countryCode = authContextCountryCode;
    }
    if (!countryCode) {
      return;
    }
    const userCountry = countryList.find(country => country.code === countryCode);
    if (userCountry?.code !== '' && autoFilledCountry.value === '') {
      setAutoFilledCountry({
        value: userCountry?.code,
        displayText: userCountry?.name
      });
      // set formData state for auto populated country field to pass into payload
      setFormData({
        country: userCountry?.code
      });
    }
  }, [authContextCountryCode, autoFilledCountry, countryCookieValue, countryList, formatMessage]);
  useEffect(() => {
    if (authenticatedUser === null) {
      dispatch(setCurrentOpenedForm(LOGIN_FORM));
    }
    if (authenticatedUser?.userId) {
      identifyAuthenticatedUser(authenticatedUser?.userId);
      configureAuth(AxiosJwtAuthService, {
        loggingService: getLoggingService(),
        config: getConfig()
      });
      trackProgressiveProfilingPageViewed();
    }
  }, [authenticatedUser, dispatch]);
  const hasFormErrors = () => {
    let error = false;
    if (!('country' in formData) || formData?.country === '') {
      setFormErrors(_objectSpread(_objectSpread({}, formErrors), {}, {
        country: formatMessage(messages.progressiveProfilingCountryFieldErrorMessage)
      }));
      error = true;
    }
    return error;
  };
  const handleSelect = e => {
    const {
      name,
      value,
      text
    } = e.target;
    if (text === '') {
      setFormErrors(_objectSpread(_objectSpread({}, formErrors), {}, {
        [name]: formatMessage(messages.progressiveProfilingCountryFieldErrorMessage)
      }));
    } else if (value) {
      setFormErrors(_objectSpread(_objectSpread({}, formErrors), {}, {
        [name]: ''
      }));
    }
    setFormData(_objectSpread(_objectSpread({}, formData), {}, {
      [name]: value
    }));
  };
  const radioButtonOnChangeHandler = e => {
    const {
      name,
      value
    } = e.target;
    setFormData(_objectSpread(_objectSpread({}, formData), {}, {
      [name]: value
    }));
  };
  const onFieldFocus = e => {
    const {
      name,
      value
    } = e.target;
    setFormErrors(_objectSpread(_objectSpread({}, formErrors), {}, {
      [name]: value
    }));
  };
  const onFieldBlur = e => {
    const {
      name,
      value
    } = e.target;
    if (value === '') {
      setFormErrors(_objectSpread(_objectSpread({}, formErrors), {}, {
        [name]: formatMessage(messages.progressiveProfilingCountryFieldErrorMessage)
      }));
    }
  };
  const handleSubmit = e => {
    e.preventDefault();
    if (hasFormErrors()) {
      moveScrollToTop(countryFieldRef);
      return;
    }
    const eventProperties = {
      isGenderSelected: !!formData.gender,
      isLevelOfEducationSelected: !!formData.levelOfEducation,
      isWorkExperienceSelected: !!formData.workExperience,
      isSubjectSelected: !!formData.subject,
      isLearningTypeSelected: !!formData.learningType
    };
    const extendedProfile = [];
    if (Object.keys(formData).length > 0) {
      Object.keys(formData).forEach(fieldName => {
        if (extendedProfileFields.includes(fieldName)) {
          extendedProfile.push({
            fieldName,
            fieldValue: formData[fieldName]
          });
          delete formData[fieldName];
        }
      });
    }
    const payload = {
      username: authenticatedUser?.username,
      data: _objectSpread({
        extendedProfile
      }, formData)
    };
    trackProgressiveProfilingSubmitClick(eventProperties);
    dispatch(saveUserProfile(snakeCaseObject(payload)));
  };
  const handleSkip = e => {
    e.preventDefault();
    setSkipButtonState(PENDING_STATE);
    const hasCountry = !!countryCookieValue || !!authContextCountryCode;
    if (hasFormErrors() && !hasCountry) {
      setFormErrors(_objectSpread(_objectSpread({}, formErrors), {}, {
        country: formatMessage(messages.progressiveProfilingCountryFieldErrorMessage)
      }));
      setSkipButtonState(FAILURE_STATE);
      moveScrollToTop(countryFieldRef);
    } else if (!hasFormErrors() && !hasCountry) {
      setFormErrors(_objectSpread(_objectSpread({}, formErrors), {}, {
        country: formatMessage(messages.progressiveProfilingCountryFieldBlockingErrorMessage)
      }));
      setSkipButtonState(FAILURE_STATE);
      moveScrollToTop(countryFieldRef);
    } else if (hasCountry) {
      // link tracker
      trackProgressiveProfilingSkipLinkClick(redirectUrl)(e);
    }
  };
  return /*#__PURE__*/React.createElement(Container, {
    size: "lg",
    className: "authn__popup-progressive-profiling-container m-0 overflow-auto"
  }, /*#__PURE__*/React.createElement(AuthenticatedRedirection, {
    success: submitState === COMPLETE_STATE,
    redirectUrl: redirectUrl,
    finishAuthUrl: finishAuthUrl,
    isLinkTracked: true
  }), /*#__PURE__*/React.createElement("h1", {
    className: "display-1 font-italic text-center mb-4",
    "data-testid": "progressive-profiling-heading"
  }, formatMessage(messages.progressiveProfilingFormHeading)), /*#__PURE__*/React.createElement("p", {
    className: "text-center"
  }, formatMessage(messages.progressiveProfilingCompletionSkipMessage)), /*#__PURE__*/React.createElement("hr", {
    className: "heading-separator mb-3 mt-3"
  }), /*#__PURE__*/React.createElement(Form, {
    id: "progressive-profiling",
    name: "progressive-profiling"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "mb-2.5 mt-2"
  }, formatMessage(messages.progressiveProfilingCountryFieldTitle)), /*#__PURE__*/React.createElement("p", {
    className: "x-small",
    ref: countryFieldRef
  }, formatMessage(messages.progressiveProfilingCountryFieldInfoMessage)), /*#__PURE__*/React.createElement(Form.Group, {
    controlId: "country",
    className: "mb-4.5"
  }, /*#__PURE__*/React.createElement(AutoSuggestField, {
    name: "country",
    leadingElement: /*#__PURE__*/React.createElement(Icon, {
      src: Language
    }),
    feedBack: formatMessage(messages.progressiveProfilingCountryFieldHelpText),
    placeholder: formatMessage(messages.useProfileCountryFieldUndetected),
    options: countryList,
    selectedOption: autoFilledCountry,
    errorMessage: formErrors?.country,
    onChangeHandler: handleSelect,
    onFocusHandler: onFieldFocus,
    onBlurHandler: onFieldBlur
  })), /*#__PURE__*/React.createElement("h3", {
    className: "mb-2.5"
  }, formatMessage(messages.progressiveProfilingDataCollectionTitle)), /*#__PURE__*/React.createElement(Form.Group, {
    controlId: "subject",
    className: "mb-4"
  }, /*#__PURE__*/React.createElement(AutoSuggestField, {
    name: "subject",
    placeholder: formatMessage(messages.progressiveProfilingSubjectFieldPlaceholder),
    label: formatMessage(messages.progressiveProfilingSubjectFieldLabel),
    options: subjectsList?.options,
    onChangeHandler: handleSelect
  })), /*#__PURE__*/React.createElement(Form.Group, {
    controlId: "levelOfEducation",
    className: "mb-4"
  }, /*#__PURE__*/React.createElement(AutoSuggestField, {
    name: "levelOfEducation",
    placeholder: formatMessage(messages.progressiveProfilingLevelOfEducationFieldPlaceholder),
    label: formatMessage(messages.progressiveProfilingLevelOfEducationFieldLabel),
    options: optionalFieldsData.levelOfEducation.options,
    onChangeHandler: handleSelect
  })), /*#__PURE__*/React.createElement(Form.Group, {
    controlId: "workExperience",
    className: "mb-4"
  }, /*#__PURE__*/React.createElement(AutoSuggestField, {
    name: "workExperience",
    placeholder: formatMessage(messages.progressiveProfilingWorkExperienceFieldPlaceholder),
    label: formatMessage(messages.progressiveProfilingWorkExperienceFieldLabel),
    options: optionalFieldsData.workExperience.options,
    onChangeHandler: handleSelect
  })), /*#__PURE__*/React.createElement(Form.Group, {
    controlId: "learningType",
    className: "mb-4"
  }, /*#__PURE__*/React.createElement(AutoSuggestField, {
    name: "learningType",
    placeholder: formatMessage(messages.progressiveProfilingLearningTypeFieldPlaceholder),
    label: formatMessage(messages.progressiveProfilingLearningTypeFieldLabel),
    options: optionalFieldsData.learningType.options,
    onChangeHandler: handleSelect
  })), /*#__PURE__*/React.createElement(Form.Group, {
    controlId: "gender",
    className: "mb-4"
  }, /*#__PURE__*/React.createElement(Form.Label, null, formatMessage(messages.progressiveProfilingGenderFieldLabel)), /*#__PURE__*/React.createElement(Form.RadioSet, {
    value: formData.gender,
    name: "gender",
    onChange: radioButtonOnChangeHandler,
    isInline: true
  }, optionalFieldsData.gender.options.map(option => /*#__PURE__*/React.createElement(Form.Radio, {
    value: option.label,
    key: option.label
  }, formatMessage(messages[`gender.option.${option.label}`]))))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex my-4 justify-content-end progressive-profiling__cta-btn-container"
  }, /*#__PURE__*/React.createElement(StatefulButton, {
    id: "skip-optional-fields",
    name: "skip-optional-fields",
    className: "authn-progressive-profiling-skip-button authn-btn__pill-shaped",
    type: "submit",
    variant: "outline-dark",
    state: skipButtonState,
    labels: {
      default: formatMessage(messages.progressiveProfilingSkipForNowButtonText),
      pending: ''
    },
    onClick: handleSkip,
    onMouseDown: e => e.preventDefault()
  }), /*#__PURE__*/React.createElement(StatefulButton, {
    id: "submit-optional-fields",
    name: "submit-optional-fields",
    className: "authn-progressive-profiling-submit-button authn-btn__pill-shaped",
    type: "submit",
    state: submitState,
    labels: {
      default: formatMessage(messages.progressiveProfilingSubmitButtonText),
      pending: ''
    },
    onClick: handleSubmit,
    onMouseDown: e => e.preventDefault()
  }))));
};
export default ProgressiveProfilingForm;
//# sourceMappingURL=index.js.map