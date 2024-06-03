import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getConfig, snakeCaseObject } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Container, Form, StatefulButton,
} from '@openedx/paragon';

import AccountActivationMessage from './components/AccountActivationMessage';
import LoginFailureAlert from './components/LoginFailureAlert';
import { NUDGE_PASSWORD_CHANGE, REQUIRE_PASSWORD_CHANGE } from './data/constants';
import useGetActivationMessage from './data/hooks';
import { loginUser } from './data/reducers';
import messages from './messages';
import { setCurrentOpenedForm } from '../../authn-component/data/reducers';
import { InlineLink, SocialAuthProviders } from '../../common-ui';
import {
  ENTERPRISE_LOGIN_URL,
  FORGOT_PASSWORD_FORM,
  INVALID_FORM,
  REGISTRATION_FORM,
  TPA_AUTHENTICATION_FAILURE,
} from '../../data/constants';
import getAllPossibleQueryParams from '../../data/utils';
import {
  trackForgotPasswordLinkClick, trackInstitutionLoginLinkClick, trackLoginPageEvent,
} from '../../tracking/trackers/login';
import AuthenticatedRedirection from '../common-components/AuthenticatedRedirection';
import SSOFailureAlert from '../common-components/SSOFailureAlert';
import ThirdPartyAuthAlert from '../common-components/ThirdPartyAuthAlert';
import {
  TextField as EmailOrUsernameField,
  PasswordField,
} from '../fields';
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

  const loginResult = useSelector(state => state.login.loginResult);
  const loginErrorCode = useSelector(state => state.login.loginError?.errorCode);
  const loginErrorContext = useSelector(state => state.login.loginError?.errorContext);
  const registerIntent = useSelector(state => state.commonData.registerIntent);
  const submitState = useSelector(state => state.login.submitState);
  const currentProvider = useSelector(state => state.commonData.thirdPartyAuthContext.currentProvider);
  const thirdPartyAuthErrorMessage = useSelector(state => state.commonData.thirdPartyAuthContext.errorMessage);
  const finishAuthUrl = useSelector(state => state.commonData.thirdPartyAuthContext.finishAuthUrl);

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
    trackLoginPageEvent();
  }, []);

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
      register_intent: registerIntent,
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
      <SSOFailureAlert
        errorCode={errorCode.type}
        context={errorCode.context}
        alertTitle={messages.loginFailureHeaderTitle}
      />
      <SocialAuthProviders />
      <div className="text-center my-3 my-sm-4">
        {formatMessage(messages.loginFormHeading2)}
      </div>
      <LoginFailureAlert
        errorCode={errorCode.type}
        context={errorCode.context}
      />
      <ThirdPartyAuthAlert
        currentProvider={currentProvider}
      />
      <AccountActivationMessage
        messageType={accountActivation}
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
          onClick={() => dispatch(setCurrentOpenedForm(REGISTRATION_FORM))}
          linkHelpText={formatMessage(messages.loginFormRegistrationHelpText)}
          linkText={formatMessage(messages.loginFormRegistrationLink)}
        />
        <InlineLink
          destination={getConfig().LMS_BASE_URL + ENTERPRISE_LOGIN_URL}
          onClick={trackInstitutionLoginLinkClick}
          linkHelpText={formatMessage(messages.loginFormSchoolAndOrganizationHelpText)}
          linkText={formatMessage(messages.loginFormSchoolAndOrganizationLink)}
        />
      </div>
    </Container>
  );
};

export default LoginForm;
