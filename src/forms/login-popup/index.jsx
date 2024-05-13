import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getConfig, snakeCaseObject } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Button, Container, Form, Hyperlink,
} from '@openedx/paragon';

import { loginUser } from './data/reducers';
import LoginFailureAlert from './LoginFailureAlert';
import messages from './messages';
import { InlineLink, SocialAuthButtons } from '../../common-ui';
import { ENTERPRISE_LOGIN_URL, INVALID_FORM } from '../../data/constants';
import PasswordField from '../fields/password-field';
import EmailOrUsernameField from '../fields/text-field';

/**
 * Login form component that holds the login form functionality.
 *
 * @returns {JSX.Element} The rendered login component along with social auth buttons.
 */
const LoginForm = () => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();

  const loginErrorCode = useSelector(state => state.login.loginError?.errorCode);
  const loginErrorContext = useSelector(state => state.login.loginError?.errorContext);

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
    if (loginErrorCode) {
      setErrorCode({
        type: loginErrorCode,
        context: { ...loginErrorContext },
      });
    }
  }, [loginErrorCode, loginErrorContext]);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateFormFields(formFields);

    if (validationErrors.emailOrUsername || validationErrors.password) {
      setFormErrors({ ...validationErrors });
      setErrorCode({ type: INVALID_FORM, context: {} });
      return;
    }

    const payload = snakeCaseObject(formFields);
    dispatch(loginUser(payload));
  };

  return (
    <Container size="lg" className="authn__popup-container overflow-auto">
      <h1 className="display-1 font-italic text-center mb-0">{formatMessage(messages.loginFormHeading1)}</h1>
      <hr className="heading-separator mb-4 mt-4" />
      <SocialAuthButtons />
      <div className="text-center mb-4 mt-3">
        {formatMessage(messages.loginFormHeading2)}
      </div>
      <LoginFailureAlert
        errorCode={errorCode.type}
        context={errorCode.context}
      />
      <Form id="login-form" name="login-form">
        <EmailOrUsernameField
          label="Username or email"
          name="emailOrUsername"
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
        />
        {/* TODO: this destination will be replaced with actual links */}
        <Hyperlink className="hyper-link" destination="#" isInline>
          {formatMessage(messages.loginFormForgotPasswordButton)}
        </Hyperlink>
        <div className="d-flex flex-column my-4">
          <Button
            id="login-user"
            name="login-user"
            variant="primary"
            type="submit"
            className="align-self-end"
            onClick={handleSubmit}
            onMouseDown={(e) => e.preventDefault()}
          >
            {formatMessage(messages.loginFormSignInButton)}
          </Button>
        </div>
        <InlineLink
          className="mb-2"
          destination="#"
          linkHelpText={formatMessage(messages.loginFormRegistrationHelpText)}
          linkText={formatMessage(messages.loginFormRegistrationLink)}
        />
        <InlineLink
          destination={getConfig().LMS_BASE_URL + ENTERPRISE_LOGIN_URL}
          linkHelpText={formatMessage(messages.loginFormSchoolAndOrganizationHelpText)}
          linkText={formatMessage(messages.loginFormSchoolAndOrganizationLink)}
        />
      </Form>
    </Container>
  );
};

export default LoginForm;
