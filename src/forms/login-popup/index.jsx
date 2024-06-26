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
import { loginUser, setLoginSSOIntent } from './data/reducers';
import messages from './messages';
import { setCurrentOpenedForm } from '../../authn-component/data/reducers';
import { InlineLink, SocialAuthProviders } from '../../common-ui';
import {
  COMPLETE_STATE,
  ENTERPRISE_LOGIN_URL,
  FAILURE_STATE,
  FORGOT_PASSWORD_FORM,
  INVALID_FORM,
  REGISTRATION_FORM,
  TPA_AUTHENTICATION_FAILURE,
} from '../../data/constants';
import { useDispatch, useSelector } from '../../data/storeHooks';
import getAllPossibleQueryParams from '../../data/utils';
import {
  trackForgotPasswordLinkClick, trackLoginPageViewed, trackRegisterFormToggled,
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
  const socialAuthnButtonRef = useRef(null);

  const loginResult = useSelector(state => state.login.loginResult);
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

  const [formFields, setFormFields] = useState({
    emailOrUsername: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState({
    emailOrUsername: '',
    password: '',
  });
  const [errorCode, setErrorCode] = useState({ type: '', context: {} });

  useEffect(() => {
    trackLoginPageViewed();
  }, []);

  useEffect(() => {
    if (thirdPartyAuthApiStatus === COMPLETE_STATE && accountActivation === null) {
      if (providers.length > 0 && socialAuthnButtonRef.current) {
        socialAuthnButtonRef.current.focus();
      } else if (emailOrUsernameRef.current) {
        emailOrUsernameRef.current.focus();
      }
    } else if (thirdPartyAuthApiStatus === FAILURE_STATE && accountActivation === null) {
      emailOrUsernameRef.current.focus();
    }
  }, [accountActivation, thirdPartyAuthApiStatus, providers]);

  useEffect(() => {
    if (loginResult.success) {
      // clear local storage
      localStorage.removeItem('ssoPipelineRedirectionDone');
    }
  }, [loginResult]);

  useEffect(() => {
    if (thirdPartyAuthApiStatus === COMPLETE_STATE
      && currentProvider === null
      && localStorage.getItem('ssoPipelineRedirectionDone')
    ) {
      localStorage.removeItem('ssoPipelineRedirectionDone');
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
      if (!localStorage.getItem('ssoPipelineRedirectionDone')) {
        localStorage.setItem('ssoPipelineRedirectionDone', true);
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
  };

  const handleOnFocus = (event) => {
    const { name } = event.target;
    setFormErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  };

  const handleForgotPasswordClick = () => {
    dispatch(setCurrentOpenedForm(FORGOT_PASSWORD_FORM));
    trackForgotPasswordLinkClick();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateFormFields(formFields);

    if (validationErrors.emailOrUsername || validationErrors.password) {
      setFormErrors({ ...validationErrors });
      setErrorCode({ type: INVALID_FORM, context: {} });
      return;
    }

    // add query params to the payload
    const payload = {
      ...snakeCaseObject(formFields),
      ...queryParams,
    };
    dispatch(loginUser(payload));
  };

  return (
    <Container size="lg" className="authn__popup-container">
      <AuthenticatedRedirection
        success={loginResult.success}
        redirectUrl={loginResult.redirectUrl}
        finishAuthUrl={finishAuthUrl}
      />
      <h1
        className="display-1 font-italic text-center mb-0"
        data-testid="sign-in-heading"
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
          <SocialAuthProviders ref={socialAuthnButtonRef} />
          <div className="text-center my-3 my-sm-4">
            {formatMessage(messages.loginFormHeading2)}
          </div>
        </>
      )}
      <LoginFailureAlert
        errorCode={errorCode.type}
        context={errorCode.context}
      />
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
          ref={emailOrUsernameRef}
        />
        <PasswordField
          name="password"
          value={formFields.password}
          errorMessage={formErrors.password}
          handleChange={handleOnChange}
          handleFocus={handleOnFocus}
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
            className="align-self-end login__btn-width"
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
