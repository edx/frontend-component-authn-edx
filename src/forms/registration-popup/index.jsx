import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getConfig, snakeCaseObject } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Button, Container, Form, Spinner,
} from '@openedx/paragon';

import HonorCodeAndPrivacyPolicyMessage from './components/honorCodeAndTOS';
import RegistrationFailureAlert from './components/RegistrationFailureAlert';
import { clearRegistrationBackendError, registerUser, setUserPipelineDataLoaded } from './data/reducers';
import getBackendValidations from './data/selector';
import isFormValid from './data/utils';
import messages from './messages';
import { setCurrentOpenedForm } from '../../authn-component/data/reducers';
import { InlineLink, SocialAuthProviders } from '../../common-ui';
import {
  COMPLETE_STATE,
  ENTERPRISE_LOGIN_URL, FORM_SUBMISSION_ERROR, LOGIN_FORM, TPA_AUTHENTICATION_FAILURE,
} from '../../data/constants';
import './index.scss';
import AuthenticatedRedirection from '../common-components/AuthenticatedRedirection';
import ThirdPartyAuthAlert from '../common-components/ThirdPartyAuthAlert';
import {
  EmailField,
  MarketingEmailOptInCheckbox,
  NameField,
  PasswordField,
} from '../fields';

/**
 * RegisterForm component for handling user registration.
 * This component provides a form for users to register with their name, email, password,
 * and a checkbox for opting out of marketing emails.
 */
const RegistrationForm = () => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();

  const [formFields, setFormFields] = useState({
    name: '', email: '', password: '', marketingEmailOptIn: true,
  });
  const [errors, setErrors] = useState({});
  const [errorCode, setErrorCode] = useState({ type: '', count: 0 });

  const registrationResult = useSelector(state => state.register.registrationResult);
  const userPipelineDataLoaded = useSelector(state => state.register.userPipelineDataLoaded);

  const thirdPartyAuthApiStatus = useSelector(state => state.commonData.thirdPartyAuthApiStatus);
  const thirdPartyAuthErrorMessage = useSelector(state => state.commonData.thirdPartyAuthContext.errorMessage);
  const finishAuthUrl = useSelector(state => state.commonData.thirdPartyAuthContext.finishAuthUrl);
  const currentProvider = useSelector(state => state.commonData.thirdPartyAuthContext.currentProvider);
  const pipelineUserDetails = useSelector(state => state.commonData.thirdPartyAuthContext.pipelineUserDetails);
  const registrationError = useSelector(state => state.register.registrationError);
  const registrationErrorCode = registrationError?.errorCode;
  const backendValidations = useSelector(getBackendValidations);

  // TODO: this value will be decided later based on from where the SSO flow was initiated.
  const autoSubmitRegForm = currentProvider && thirdPartyAuthApiStatus === COMPLETE_STATE;

  /**
   * Set the userPipelineDetails data in formFields for only first time
   */
  useEffect(() => {
    if (!userPipelineDataLoaded && thirdPartyAuthApiStatus === COMPLETE_STATE) {
      if (thirdPartyAuthErrorMessage) {
        setErrorCode(prevState => ({ type: TPA_AUTHENTICATION_FAILURE, count: prevState.count + 1 }));
      }
      if (pipelineUserDetails && Object.keys(pipelineUserDetails).length !== 0) {
        const {
          name = '', email = '',
        } = pipelineUserDetails;
        setFormFields(prevState => ({
          ...prevState, name, email,
        }));
        dispatch(setUserPipelineDataLoaded(true));
      }
    }
  }, [ // eslint-disable-line react-hooks/exhaustive-deps
    thirdPartyAuthApiStatus,
    thirdPartyAuthErrorMessage,
    pipelineUserDetails,
    userPipelineDataLoaded,
  ]);

  const handleOnChange = (event) => {
    const { name } = event.target;
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;

    if (registrationError[name]) {
      dispatch(clearRegistrationBackendError(name));
    }
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    setFormFields(prevState => ({ ...prevState, [name]: value }));
  };

  useEffect(() => {
    if (backendValidations) {
      setErrors(prevErrors => ({ ...prevErrors, ...backendValidations }));
    }
  }, [backendValidations]);

  useEffect(() => {
    if (registrationErrorCode) {
      setErrorCode(prevState => ({ type: registrationErrorCode, count: prevState.count + 1 }));
    }
  }, [registrationErrorCode]);

  const handleErrorChange = (fieldName, error) => {
    setErrors(prevErrors => ({
      ...prevErrors,
      [fieldName]: error,
    }));
  };

  const handleUserRegistration = () => {
    let payload = { ...formFields, honor_code: true, terms_of_service: true };

    if (currentProvider) {
      delete payload.password;
      payload.social_auth_provider = currentProvider;
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
      return;
    }
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
    <>
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
        {(autoSubmitRegForm && !errorCode.type) ? (
          <div className="my-6 text-center">
            <Spinner animation="border" variant="primary" id="tpa-spinner" />
          </div>
        ) : (
          <>
            {(!autoSubmitRegForm || errorCode.type) && (
              <>
                <SocialAuthProviders isLoginForm={false} />
                <div className="text-center mb-4 mt-3">
                  {formatMessage(messages.registrationFormHeading2)}
                </div>
              </>
            )}
            <ThirdPartyAuthAlert
              currentProvider={currentProvider}
            />
            <RegistrationFailureAlert
              errorCode={errorCode.type}
              failureCount={errorCode.count}
              context={{ provider: currentProvider, errorMessage: thirdPartyAuthErrorMessage }}
            />
            <Form id="registration-form" name="registration-form" className="d-flex flex-column my-4">
              <EmailField
                name="email"
                value={formFields.email}
                errorMessage={errors.email}
                handleChange={handleOnChange}
                handleErrorChange={handleErrorChange}
                floatingLabel={formatMessage(messages.registrationFormEmailFieldLabel)}
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
              <PasswordField
                name="password"
                value={formFields.password}
                errorMessage={errors.password}
                handleChange={handleOnChange}
                handleErrorChange={handleErrorChange}
                handleFocus={() => { }}
                floatingLabel={formatMessage(messages.registrationFormPasswordFieldLabel)}
              />
              <MarketingEmailOptInCheckbox
                name="marketingEmailOptIn"
                value={formFields.marketingEmailOptIn}
                handleChange={handleOnChange}
              />
              <div className="d-flex flex-column my-4">
                <Button
                  id="register-user"
                  name="register-user"
                  variant="primary"
                  type="submit"
                  className="align-self-end"
                  onClick={handleSubmit}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {formatMessage(messages.registrationFormCreateAccountButton)}
                </Button>
              </div>
            </Form>
            <div>
              <InlineLink
                className="mb-2"
                onClick={() => dispatch(setCurrentOpenedForm(LOGIN_FORM))}
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
      <div className="bg-dark-500">
        <p className="mb-0 text-white m-auto authn-popup__registration-footer">
          <HonorCodeAndPrivacyPolicyMessage />
        </p>
      </div>
    </>
  );
};

export default RegistrationForm;
