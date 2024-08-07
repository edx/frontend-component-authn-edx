import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';

import { getConfig, snakeCaseObject } from '@edx/frontend-platform';
import {
  AxiosJwtAuthService,
  configure as configureAuth,
} from '@edx/frontend-platform/auth';
import { getCountryList, getLocale, useIntl } from '@edx/frontend-platform/i18n';
import { getLoggingService } from '@edx/frontend-platform/logging';
import {
  Container, Form, Icon, StatefulButton,
} from '@openedx/paragon';
import { Language } from '@openedx/paragon/icons';

import { extendedProfileFields, optionalFieldsData } from './data/constants';
import { saveUserProfile } from './data/reducers';
import messages from './messages';
import {
  COMPLETE_STATE,
  DEFAULT_STATE,
  FAILURE_STATE,
  LOGIN_FORM,
  PENDING_STATE,
} from '../../data/constants';
import { getCountryCookieValue } from '../../data/cookies';
import { useDispatch, useSelector } from '../../data/storeHooks';
import { moveScrollToTop } from '../../data/utils';
import { setCurrentOpenedForm } from '../../onboarding-component/data/reducers';
import {
  trackProgressiveProfilingPageViewed,
  trackProgressiveProfilingSkipLinkClick,
  trackProgressiveProfilingSubmitClick,
} from '../../tracking/trackers/progressive-profiling';
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
  const { formatMessage } = useIntl();
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
  const [autoFilledCountry, setAutoFilledCountry] = useState({ value: '', displayText: '' });
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
    const userCountry = countryList.find((country) => country.code === countryCode);
    if (userCountry?.code !== '' && autoFilledCountry.value === '') {
      setAutoFilledCountry({ value: userCountry?.code, displayText: userCountry?.name });
      // set formData state for auto populated country field to pass into payload
      setFormData({ country: userCountry?.code });
    }
  }, [authContextCountryCode, autoFilledCountry, countryCookieValue, countryList, formatMessage]);

  useEffect(() => {
    if (authenticatedUser === null) {
      dispatch(setCurrentOpenedForm(LOGIN_FORM));
    }
    if (authenticatedUser?.userId) {
      configureAuth(AxiosJwtAuthService, { loggingService: getLoggingService(), config: getConfig() });
      trackProgressiveProfilingPageViewed();
    }
  }, [authenticatedUser, dispatch]);

  const hasFormErrors = () => {
    let error = false;
    if (!('country' in formData) || (formData?.country === '')) {
      setFormErrors({ ...formErrors, country: formatMessage(messages.progressiveProfilingCountryFieldErrorMessage) });
      error = true;
    }
    return error;
  };

  const handleSelect = (e) => {
    const { name, value, text } = e.target;

    if (text === '') {
      setFormErrors({ ...formErrors, [name]: formatMessage(messages.progressiveProfilingCountryFieldErrorMessage) });
    } else if (value) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
    setFormData({ ...formData, [name]: value });
  };

  const radioButtonOnChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const onFieldFocus = (e) => {
    const { name, value } = e.target;
    setFormErrors({ ...formErrors, [name]: value });
  };

  const onFieldBlur = (e) => {
    const { name, value } = e.target;

    if (value === '') {
      setFormErrors({ ...formErrors, [name]: formatMessage(messages.progressiveProfilingCountryFieldErrorMessage) });
    }
  };

  const handleSubmit = (e) => {
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
      isLearningTypeSelected: !!formData.learningType,
    };

    const extendedProfile = [];
    if (Object.keys(formData).length > 0) {
      Object.keys(formData).forEach(fieldName => {
        if (extendedProfileFields.includes(fieldName)) {
          extendedProfile.push({ fieldName, fieldValue: formData[fieldName] });
          delete formData[fieldName];
        }
      });
    }
    const payload = {
      username: authenticatedUser?.username,
      data: {
        extendedProfile,
        ...formData,
      },
    };
    trackProgressiveProfilingSubmitClick(eventProperties);
    dispatch(saveUserProfile(snakeCaseObject(payload)));
  };

  const handleSkip = (e) => {
    e.preventDefault();

    setSkipButtonState(PENDING_STATE);
    const hasCountry = !!countryCookieValue || !!authContextCountryCode;

    if (hasFormErrors() && !hasCountry) {
      setFormErrors({ ...formErrors, country: formatMessage(messages.progressiveProfilingCountryFieldErrorMessage) });
      setSkipButtonState(FAILURE_STATE);
      moveScrollToTop(countryFieldRef);
    } else if (!hasFormErrors() && !hasCountry) {
      setFormErrors({
        ...formErrors,
        country: formatMessage(messages.progressiveProfilingCountryFieldBlockingErrorMessage),
      });
      setSkipButtonState(FAILURE_STATE);
      moveScrollToTop(countryFieldRef);
    } else if (hasCountry) {
      // link tracker
      trackProgressiveProfilingSkipLinkClick(redirectUrl)(e);
    }
  };

  return (
    <Container size="lg" className="onboarding__popup-progressive-profiling-container m-0 overflow-auto">
      <AuthenticatedRedirection
        success={submitState === COMPLETE_STATE}
        redirectUrl={redirectUrl}
        finishAuthUrl={finishAuthUrl}
        isLinkTracked
      />
      <h1
        className="display-1 font-italic text-center mb-4"
        data-testid="progressive-profiling-heading"
      >
        {formatMessage(messages.progressiveProfilingFormHeading)}
      </h1>
      <p className="text-center">
        {formatMessage(messages.progressiveProfilingCompletionSkipMessage)}
      </p>
      <hr className="heading-separator mb-3 mt-3" />
      <Form id="progressive-profiling" name="progressive-profiling">
        <h3 className="mb-2.5 mt-2">
          {formatMessage(messages.progressiveProfilingCountryFieldTitle)}
        </h3>
        <p
          className="x-small"
          ref={countryFieldRef}
        >
          {formatMessage(messages.progressiveProfilingCountryFieldInfoMessage)}
        </p>
        <Form.Group controlId="country" className="mb-4.5">
          <AutoSuggestField
            name="country"
            leadingElement={<Icon src={Language} />}
            feedBack={formatMessage(messages.progressiveProfilingCountryFieldHelpText)}
            placeholder={formatMessage(messages.useProfileCountryFieldUndetected)}
            options={countryList}
            selectedOption={autoFilledCountry}
            errorMessage={formErrors?.country}
            onChangeHandler={handleSelect}
            onFocusHandler={onFieldFocus}
            onBlurHandler={onFieldBlur}
          />
        </Form.Group>
        <h3 className="mb-2.5">
          {formatMessage(messages.progressiveProfilingDataCollectionTitle)}
        </h3>
        <Form.Group controlId="subject" className="mb-4">
          <AutoSuggestField
            name="subject"
            placeholder={formatMessage(messages.progressiveProfilingSubjectFieldPlaceholder)}
            label={formatMessage(messages.progressiveProfilingSubjectFieldLabel)}
            options={subjectsList?.options}
            onChangeHandler={handleSelect}
          />
        </Form.Group>
        <Form.Group controlId="levelOfEducation" className="mb-4">
          <AutoSuggestField
            name="levelOfEducation"
            placeholder={formatMessage(messages.progressiveProfilingLevelOfEducationFieldPlaceholder)}
            label={formatMessage(messages.progressiveProfilingLevelOfEducationFieldLabel)}
            options={optionalFieldsData.levelOfEducation.options}
            onChangeHandler={handleSelect}
          />
        </Form.Group>
        <Form.Group controlId="workExperience" className="mb-4">
          <AutoSuggestField
            name="workExperience"
            placeholder={formatMessage(messages.progressiveProfilingWorkExperienceFieldPlaceholder)}
            label={formatMessage(messages.progressiveProfilingWorkExperienceFieldLabel)}
            options={optionalFieldsData.workExperience.options}
            onChangeHandler={handleSelect}
          />
        </Form.Group>
        <Form.Group controlId="learningType" className="mb-4">
          <AutoSuggestField
            name="learningType"
            placeholder={formatMessage(messages.progressiveProfilingLearningTypeFieldPlaceholder)}
            label={formatMessage(messages.progressiveProfilingLearningTypeFieldLabel)}
            options={optionalFieldsData.learningType.options}
            onChangeHandler={handleSelect}
          />
        </Form.Group>
        <Form.Group controlId="gender" className="mb-4">
          <Form.Label>
            {formatMessage(messages.progressiveProfilingGenderFieldLabel)}
          </Form.Label>
          <Form.RadioSet
            value={formData.gender}
            name="gender"
            onChange={radioButtonOnChangeHandler}
            isInline
          >
            {optionalFieldsData.gender.options.map(option => (
              <Form.Radio value={option.label} key={option.label}>
                {formatMessage(messages[`gender.option.${option.label}`])}
              </Form.Radio>
            ))}
          </Form.RadioSet>
        </Form.Group>
        <div className="d-flex my-4 justify-content-end progressive-profiling__cta-btn-container">
          <StatefulButton
            id="skip-optional-fields"
            name="skip-optional-fields"
            className="onboarding-progressive-profiling-skip-button onboarding-btn__pill-shaped"
            type="submit"
            variant="outline-dark"
            state={skipButtonState}
            labels={{
              default: formatMessage(messages.progressiveProfilingSkipForNowButtonText),
              pending: '',
            }}
            onClick={handleSkip}
            onMouseDown={(e) => e.preventDefault()}
          />
          <StatefulButton
            id="submit-optional-fields"
            name="submit-optional-fields"
            className="onboarding-progressive-profiling-submit-button onboarding-btn__pill-shaped"
            type="submit"
            state={submitState}
            labels={{
              default: formatMessage(messages.progressiveProfilingSubmitButtonText),
              pending: '',
            }}
            onClick={handleSubmit}
            onMouseDown={(e) => e.preventDefault()}
          />
        </div>
      </Form>
    </Container>
  );
};

export default ProgressiveProfilingForm;
