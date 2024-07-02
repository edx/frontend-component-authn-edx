import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';

import { getConfig, snakeCaseObject } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Container, Form, Spinner, StatefulButton,
} from '@openedx/paragon';

import HonorCodeAndPrivacyPolicyMessage from './components/honorCodeAndTOS';
import RegistrationFailureAlert from './components/RegistrationFailureAlert';
import {
  clearAllRegistrationErrors,
  clearRegistrationBackendError,
  registerUser,
  setRegistrationFields,
} from './data/reducers';
import getBackendValidations from './data/selector';
import isFormValid from './data/utils';
import messages from './messages';
import { setCurrentOpenedForm } from '../../authn-component/data/reducers';
import { InlineLink, SocialAuthProviders } from '../../common-ui';
import {
  COMPLETE_STATE,
  ENTERPRISE_LOGIN_URL,
  FAILURE_STATE,
  FORM_SUBMISSION_ERROR,
  LOGIN_FORM,
  REGISTRATION_FORM,
  TPA_AUTHENTICATION_FAILURE,
} from '../../data/constants';
import { useDispatch, useSelector } from '../../data/storeHooks';
import getAllPossibleQueryParams, { getCountryCookieValue, moveScrollToTop, setCookie } from '../../data/utils';
import './index.scss';
import {
  trackLoginFormToggled,
  trackRegistrationPageViewed,
  trackRegistrationSuccess,
} from '../../tracking/trackers/register';
import AuthenticatedRedirection from '../common-components/AuthenticatedRedirection';
import SSOFailureAlert from '../common-components/SSOFailureAlert';
import ThirdPartyAuthAlert from '../common-components/ThirdPartyAuthAlert';
import {
  EmailField,
  MarketingEmailOptInCheckbox,
  NameField,
  PasswordField,
} from '../fields';
import useSubjectsList from '../progressive-profiling-popup/data/hooks/useSubjectList';
import { setSubjectsList } from '../progressive-profiling-popup/data/reducers';

/**
 * RegisterForm component for handling user registration.
 * This component provides a form for users to register with their name, email, password,
 * and a checkbox for opting out of marketing emails.
 */
const RegistrationForm = () => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const [formStartTime, setFormStartTime] = useState(null);

  const [formFields, setFormFields] = useState({
    name: '', email: '', password: '', marketingEmailOptIn: true,
  });
  const [errors, setErrors] = useState({});
  const [errorCode, setErrorCode] = useState({ type: '', count: 0 });
  const [userPipelineDataLoaded, setUserPipelineDataLoaded] = useState(false);

  const emailRef = useRef(null);
  const registerErrorAlertRef = useRef(null);
  const socialAuthnButtonRef = useRef(null);
  const queryParams = useMemo(() => getAllPossibleQueryParams(), []);
  const { subjectsList, subjectsLoading } = useSubjectsList();

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

  const autoSubmitRegForm = (currentProvider
      && thirdPartyAuthApiStatus === COMPLETE_STATE
      && !isLoginSSOIntent
      && queryParams?.authMode === 'Register'
      && !localStorage.getItem('ssoPipelineRedirectionDone')
  );

  /**
   * Set the userPipelineDetails data in formFields for only first time
   */
  useEffect(() => {
    if (!userPipelineDataLoaded && thirdPartyAuthApiStatus === COMPLETE_STATE) {
      if (thirdPartyAuthErrorMessage) {
        setErrorCode(prevState => ({ type: TPA_AUTHENTICATION_FAILURE, count: prevState.count + 1 }));
        localStorage.removeItem('marketingEmailOptIn');
        localStorage.removeItem('ssoPipelineRedirectionDone');
      }
      if (pipelineUserDetails && Object.keys(pipelineUserDetails).length !== 0) {
        const {
          name = '', email = '',
        } = pipelineUserDetails;
        setFormFields(prevState => ({
          ...prevState, name, email,
        }));
        setUserPipelineDataLoaded(true);
      }
    }
  }, [ // eslint-disable-line react-hooks/exhaustive-deps
    thirdPartyAuthApiStatus,
    thirdPartyAuthErrorMessage,
    pipelineUserDetails,
    userPipelineDataLoaded,
  ]);

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
    if (!subjectsLoading) {
      dispatch(setSubjectsList(subjectsList));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, subjectsLoading]);

  const handleOnChange = (event) => {
    const { name } = event.target;
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;

    if (registrationError[name]) {
      dispatch(clearRegistrationBackendError(name));
    }
    // seting marketingEmailOptIn state for SSO authentication flow for register API call
    if (name === 'marketingEmailOptIn') {
      dispatch(setRegistrationFields({ [name]: value }));
    }
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    setFormFields(prevState => ({ ...prevState, [name]: value }));
  };

  useEffect(() => {
    if (thirdPartyAuthApiStatus === COMPLETE_STATE
      && currentProvider === null
      && localStorage.getItem('ssoPipelineRedirectionDone')
    ) {
      localStorage.removeItem('ssoPipelineRedirectionDone');
      localStorage.removeItem('marketingEmailOptIn');
    }
  }, [currentProvider, thirdPartyAuthApiStatus]);

  useEffect(() => {
    if (registrationResult.success) {
      // clear local storage
      localStorage.removeItem('marketingEmailOptIn');
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
      setErrors(prevErrors => ({ ...prevErrors, ...backendValidations }));
    }
  }, [backendValidations]);

  useEffect(() => {
    if (registrationErrorCode) {
      setErrorCode(prevState => ({ type: registrationErrorCode, count: prevState.count + 1 }));
      moveScrollToTop(registerErrorAlertRef);
    }
  }, [registrationErrorCode]);

  const handleErrorChange = (fieldName, error) => {
    setErrors(prevErrors => ({
      ...prevErrors,
      [fieldName]: error,
    }));
  };

  const handleUserRegistration = () => {
    const totalRegistrationTime = (Date.now() - formStartTime) / 1000;
    const userCountryCode = getCountryCookieValue();
    let payload = { ...formFields, honor_code: true, terms_of_service: true };

    if (currentProvider) {
      delete payload.password;
      payload.social_auth_provider = currentProvider;

      if (!isLoginSSOIntent) {
        delete payload.marketingEmailOptIn;
        payload.marketingEmailOptIn = localStorage.getItem('marketingEmailOptIn');
      }
    }

    // add country in payload if country cookie value or mfe_context country exists
    if (userCountryCode) {
      payload.country = userCountryCode;
    } else if (authContextCountryCode) {
      payload.country = authContextCountryCode;
    }

    // Validating form data before submitting
    const { isValid, fieldErrors } = isFormValid(
      payload,
      errors,
      formatMessage,
    );
    setErrors({ ...fieldErrors });

    if (!isValid) {
      setErrorCode(prevState => ({ type: FORM_SUBMISSION_ERROR, count: prevState.count + 1 }));
      moveScrollToTop(registerErrorAlertRef);
      return;
    }

    payload = {
      ...onboardingComponentContext, ...queryParams, ...payload, totalRegistrationTime,
    };
    payload = snakeCaseObject(payload);
    dispatch(registerUser(payload));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUserRegistration();
  };

  useEffect(() => {
    if (autoSubmitRegForm && userPipelineDataLoaded) {
      handleUserRegistration();
    }
  }, [autoSubmitRegForm, userPipelineDataLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex-column">
      <Container size="lg" className="authn__popup-container">
        <AuthenticatedRedirection
          success={registrationResult.success}
          redirectUrl={registrationResult.redirectUrl}
          finishAuthUrl={finishAuthUrl}
          redirectToProgressiveProfilingForm
        />
        <h2
          className="font-italic text-center display-1 mb-0"
          data-testid="sign-up-heading"
        >
          {formatMessage(messages.registrationFormHeading1)}
        </h2>
        <hr className="separator my-3 my-sm-4" />

        <SSOFailureAlert
          errorCode={errorCode.type}
          context={{ errorMessage: thirdPartyAuthErrorMessage }}
        />

        {(autoSubmitRegForm && !errorCode.type) ? (
          <div className="my-6 text-center">
            <Spinner animation="border" variant="primary" id="tpa-spinner" />
          </div>
        ) : (
          <>
            {(!autoSubmitRegForm || errorCode.type) && (!currentProvider) && (
              <>
                <SocialAuthProviders isLoginForm={false} ref={socialAuthnButtonRef} />
                <div className="text-center mb-4 mt-3">
                  {formatMessage(messages.registrationFormHeading2)}
                </div>
              </>
            )}

            <ThirdPartyAuthAlert
              currentProvider={currentProvider}
              referrer={REGISTRATION_FORM}
            />
            <div ref={registerErrorAlertRef}>
              <RegistrationFailureAlert
                errorCode={errorCode.type}
                failureCount={errorCode.count}
                context={{ provider: currentProvider, errorMessage: thirdPartyAuthErrorMessage }}
              />
            </div>
            <Form id="registration-form" name="registration-form" className="d-flex flex-column my-4">
              <EmailField
                name="email"
                value={formFields.email}
                errorMessage={errors.email}
                handleChange={handleOnChange}
                handleErrorChange={handleErrorChange}
                floatingLabel={formatMessage(messages.registrationFormEmailFieldLabel)}
                ref={emailRef}
              />
              <NameField
                label="Full name"
                name="name"
                value={formFields.name}
                errorMessage={errors.name}
                handleChange={handleOnChange}
                handleErrorChange={handleErrorChange}
                handleFocus={() => { }}
              />
              {!currentProvider && (
                <PasswordField
                  name="password"
                  value={formFields.password}
                  errorMessage={errors.password}
                  handleChange={handleOnChange}
                  handleErrorChange={handleErrorChange}
                  handleFocus={() => { }}
                  floatingLabel={formatMessage(messages.registrationFormPasswordFieldLabel)}
                />
              )}
              <MarketingEmailOptInCheckbox
                name="marketingEmailOptIn"
                value={formFields.marketingEmailOptIn}
                handleChange={handleOnChange}
              />
              <div className="d-flex flex-column my-4">
                <StatefulButton
                  id="register-user"
                  name="register-user"
                  type="submit"
                  variant="primary"
                  className="align-self-end registration-form__submit-btn__width authn-btn__pill-shaped"
                  state={submitState}
                  labels={{
                    default: formatMessage(messages.registrationFormCreateAccountButton),
                    pending: '',
                  }}
                  onClick={handleSubmit}
                  onMouseDown={(e) => e.preventDefault()}
                />

              </div>
            </Form>
            <div>
              <InlineLink
                className="mb-2"
                onClick={() => {
                  trackLoginFormToggled();
                  dispatch(clearAllRegistrationErrors());
                  dispatch(setCurrentOpenedForm(LOGIN_FORM));
                }}
                linkHelpText={formatMessage(messages.registrationFormAlreadyHaveAccountText)}
                linkText={formatMessage(messages.registrationFormSignInLink)}
              />
              <InlineLink
                destination={getConfig().LMS_BASE_URL + ENTERPRISE_LOGIN_URL}
                linkHelpText={formatMessage(messages.registrationFormSchoolOrOrganizationLink)}
                linkText={formatMessage(messages.registrationFormSignInWithCredentialsLink)}
              />
            </div>
          </>
        )}
      </Container>
      {!(autoSubmitRegForm && !errorCode.type) && (
        <div className="bg-dark-500">
          <p className="mb-0 text-white m-auto authn-popup__registration-footer">
            <HonorCodeAndPrivacyPolicyMessage />
          </p>
        </div>
      )}
    </div>
  );
};

export default RegistrationForm;
