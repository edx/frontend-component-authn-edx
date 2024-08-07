import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';

import { getConfig, snakeCaseObject } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Container, Form, StatefulButton,
} from '@openedx/paragon';

import AccountActivationMessage from './components/AccountActivationMessage';
import LoginFailureAlert from './components/LoginFailureAlert';
import { NUDGE_PASSWORD_CHANGE, REQUIRE_PASSWORD_CHANGE } from './data/constants';
import useGetActivationMessage from './data/hooks';
import {
  backupLoginForm, loginErrorClear, loginUser, setLoginSSOIntent,
} from './data/reducers';
import messages from './messages';
import { InlineLink, SocialAuthProviders } from '../../common-ui';
import {
  AUTH_MODE_LOGIN,
  COMPLETE_STATE,
  ENTERPRISE_LOGIN_URL,
  FAILURE_STATE,
  FORGOT_PASSWORD_FORM,
  INVALID_FORM,
  REGISTRATION_FORM,
  TPA_AUTHENTICATION_FAILURE,
} from '../../data/constants';
import { getCookie, removeCookie, setCookie } from '../../data/cookies';
import { useDispatch, useSelector } from '../../data/storeHooks';
import getAllPossibleQueryParams, { handleURLUpdationOnLoad, moveScrollToTop } from '../../data/utils';
import { setCurrentOpenedForm } from '../../onboarding-component/data/reducers';
import {
  trackForgotPasswordLinkClick, trackLoginPageViewed, trackLoginSuccess, trackRegisterFormToggled,
} from '../../tracking/trackers/login';
import AuthenticatedRedirection from '../common-components/AuthenticatedRedirection';
import SSOFailureAlert from '../common-components/SSOFailureAlert';
import ThirdPartyAuthAlert from '../common-components/ThirdPartyAuthAlert';
import {
  TextField as EmailOrUsernameField,
  PasswordField,
} from '../fields';
import ResetPasswordSuccess from '../reset-password-popup/reset-password/components/ResetPasswordSuccess';

import './index.scss';

/**
 * Login form component that holds the login form functionality.
 *
 * @returns {JSX.Element} The rendered login component along with social auth buttons.
 */
const LoginForm = () => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const queryParams = useMemo(() => getAllPossibleQueryParams(), []);

  const emailOrUsernameRef = useRef(null);
  const socialAuthButtonRef = useRef(null);
  const errorAlertRef = useRef(null);
  const loginFormHeadingRef = useRef(null);
  const isEditingFieldRef = useRef(false);

  const onboardingComponentContext = useSelector(state => state.commonData.onboardingComponentContext);
  const loginResult = useSelector(state => state.login.loginResult);
  const backedUpFormData = useSelector(state => state.login.loginFormData);
  const loginErrorCode = useSelector(state => state.login.loginError?.errorCode);
  const loginErrorContext = useSelector(state => state.login.loginError?.errorContext);
  const providers = useSelector(state => state.commonData.thirdPartyAuthContext?.providers);
  const thirdPartyAuthApiStatus = useSelector(state => state.commonData.thirdPartyAuthApiStatus);
  const submitState = useSelector(state => state.login.submitState);
  const currentProvider = useSelector(state => state.commonData.thirdPartyAuthContext.currentProvider);
  const thirdPartyAuthErrorMessage = useSelector(state => state.commonData.thirdPartyAuthContext.errorMessage);
  const finishAuthUrl = useSelector(state => state.commonData.thirdPartyAuthContext.finishAuthUrl);
  const showResetPasswordSuccessBanner = useSelector(state => state.login.showResetPasswordSuccessBanner);

  const accountActivation = useGetActivationMessage();

  const [formFields, setFormFields] = useState({ ...backedUpFormData.formFields });

  const [formErrors, setFormErrors] = useState({ ...backedUpFormData.errors });
  const [errorCode, setErrorCode] = useState({ type: '', context: {} });

  useEffect(() => {
    trackLoginPageViewed();
  }, []);

  useEffect(() => {
    if (thirdPartyAuthApiStatus === COMPLETE_STATE && accountActivation === null) {
      if (providers.length > 0 && socialAuthButtonRef.current && !isEditingFieldRef.current) {
        socialAuthButtonRef.current.focus();
      } else if (emailOrUsernameRef.current && !isEditingFieldRef.current) {
        emailOrUsernameRef.current.focus();
      }
    } else if (thirdPartyAuthApiStatus === FAILURE_STATE && accountActivation === null) {
      emailOrUsernameRef.current.focus();
    }
  }, [accountActivation, thirdPartyAuthApiStatus, providers, isEditingFieldRef]);

  useEffect(() => {
    if (moveScrollToTop) {
      moveScrollToTop(loginFormHeadingRef, 'end');
    }
    handleURLUpdationOnLoad(AUTH_MODE_LOGIN);
  }, []);

  useEffect(() => {
    if (loginResult.success) {
      // clear local storage
      trackLoginSuccess();
      removeCookie('ssoPipelineRedirectionDone');
    }
  }, [loginResult]);

  useEffect(() => {
    if (thirdPartyAuthApiStatus === COMPLETE_STATE
      && currentProvider === null
      && getCookie('ssoPipelineRedirectionDone')
    ) {
      removeCookie('ssoPipelineRedirectionDone');
    }
  }, [currentProvider, thirdPartyAuthApiStatus]);

  useEffect(() => {
    if (loginErrorCode) {
      setErrorCode({
        type: loginErrorCode,
        context: { ...loginErrorContext },
      });
      if (loginErrorCode === NUDGE_PASSWORD_CHANGE || loginErrorCode === REQUIRE_PASSWORD_CHANGE) {
        dispatch(setCurrentOpenedForm(FORGOT_PASSWORD_FORM));
      }
      if (errorAlertRef.current) {
        errorAlertRef.current.focus();
      }
    }
  }, [dispatch, loginErrorCode, loginErrorContext]);

  useEffect(() => {
    if (thirdPartyAuthErrorMessage) {
      setErrorCode((prevState) => ({
        type: TPA_AUTHENTICATION_FAILURE,
        count: prevState.count + 1,
        context: {
          errorMessage: thirdPartyAuthErrorMessage,
        },
      }));
    }
  }, [thirdPartyAuthErrorMessage]);

  useEffect(() => {
    if (thirdPartyAuthApiStatus === COMPLETE_STATE && currentProvider) {
      dispatch(setLoginSSOIntent());
      if (!getCookie('ssoPipelineRedirectionDone')) {
        setCookie('ssoPipelineRedirectionDone', true);
      }
    }
  }, [dispatch, currentProvider, thirdPartyAuthApiStatus]);

  const validateFormFields = (payload) => {
    const { emailOrUsername, password } = payload;
    const fieldErrors = { ...formErrors };

    if (emailOrUsername === '') {
      fieldErrors.emailOrUsername = formatMessage(messages.usernameOrEmailValidationMessage);
    } else if (emailOrUsername.length < 2) {
      fieldErrors.emailOrUsername = formatMessage(messages.usernameOrEmailLessCharValidationMessage);
    }
    if (password === '') {
      fieldErrors.password = formatMessage(messages.passwordValidationMessage);
    }

    return { ...fieldErrors };
  };

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setFormFields(prevState => ({ ...prevState, [name]: value }));
    isEditingFieldRef.current = true;
  };

  const handleOnFocus = (event) => {
    const { name } = event.target;
    setFormErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    isEditingFieldRef.current = true;
  };

  const handleBlur = () => {
    isEditingFieldRef.current = false;
  };

  const handleForgotPasswordClick = () => {
    dispatch(setCurrentOpenedForm(FORGOT_PASSWORD_FORM));
    trackForgotPasswordLinkClick();
  };

  const backupFormDataHandler = () => {
    dispatch(backupLoginForm({
      formFields: { ...formFields },
      errors: { ...formErrors },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateFormFields(formFields);

    if (validationErrors.emailOrUsername || validationErrors.password) {
      setFormErrors({ ...validationErrors });
      setErrorCode({ type: INVALID_FORM, context: {} });
      if (moveScrollToTop) {
        moveScrollToTop(errorAlertRef);
      }
      return;
    }

    // add query params to the payload
    const payload = {
      ...onboardingComponentContext,
      ...snakeCaseObject(formFields),
      ...queryParams,
    };
    dispatch(loginUser(payload));
  };

  return (
    <Container size="lg" className="onboarding__popup-container">
      <AuthenticatedRedirection
        success={loginResult.success}
        redirectUrl={loginResult.redirectUrl}
        finishAuthUrl={finishAuthUrl}
      />
      <h1
        className="display-1 font-italic text-center mb-0"
        data-testid="sign-in-heading"
        ref={loginFormHeadingRef}
      >
        {formatMessage(messages.loginFormHeading1)}
      </h1>
      <hr className="heading-separator my-3 my-sm-4" />
      {accountActivation && <AccountActivationMessage messageType={accountActivation} />}
      <SSOFailureAlert
        errorCode={errorCode.type}
        context={errorCode.context}
        alertTitle={formatMessage(messages.loginFailureHeaderTitle)}
      />
      {!currentProvider && (
        <>
          <SocialAuthProviders ref={socialAuthButtonRef} />
          <div className="text-center my-3 my-sm-4">
            {formatMessage(messages.loginFormHeading2)}
          </div>
        </>
      )}
      <div ref={errorAlertRef} tabIndex="-1" aria-live="assertive">
        <LoginFailureAlert
          errorCode={errorCode.type}
          context={errorCode.context}
        />
      </div>
      {showResetPasswordSuccessBanner && <ResetPasswordSuccess />}
      <ThirdPartyAuthAlert
        currentProvider={currentProvider}
      />
      <Form id="login-form" name="login-form" className="my-3 my-sm-4">
        <EmailOrUsernameField
          label="Username or email"
          name="emailOrUsername"
          autoComplete="username"
          value={formFields.emailOrUsername}
          errorMessage={formErrors.emailOrUsername}
          handleChange={handleOnChange}
          handleFocus={handleOnFocus}
          onBlur={handleBlur}
          ref={emailOrUsernameRef}
        />
        <PasswordField
          name="password"
          value={formFields.password}
          errorMessage={formErrors.password}
          handleChange={handleOnChange}
          handleFocus={handleOnFocus}
          onBlur={handleBlur}
          floatingLabel={formatMessage(messages.loginFormPasswordFieldLabel)}
          showPasswordTooltip={false}
        />
        <InlineLink
          className="hyper-link mb-4"
          onClick={handleForgotPasswordClick}
          linkText={formatMessage(messages.loginFormForgotPasswordButton)}
        />
        <div className="d-flex flex-column m-0">
          <StatefulButton
            id="login-user"
            name="login-user"
            type="submit"
            variant="primary"
            className="align-self-end login__btn-width onboarding-btn__pill-shaped"
            state={submitState}
            labels={{
              default: formatMessage(messages.loginFormSignInButton),
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
            trackRegisterFormToggled();
            backupFormDataHandler();
            dispatch(loginErrorClear());
            dispatch(setCurrentOpenedForm(REGISTRATION_FORM));
          }}
          linkHelpText={formatMessage(messages.loginFormRegistrationHelpText)}
          linkText={formatMessage(messages.loginFormRegistrationLink)}
        />
        <InlineLink
          destination={getConfig().LMS_BASE_URL + ENTERPRISE_LOGIN_URL}
          linkHelpText={formatMessage(messages.loginFormSchoolAndOrganizationHelpText)}
          linkText={formatMessage(messages.loginFormSchoolAndOrganizationLink)}
        />
      </div>
    </Container>
  );
};

export default LoginForm;
