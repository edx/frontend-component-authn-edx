import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { snakeCaseObject } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Button, Container, Form, Hyperlink,
} from '@openedx/paragon';

import { loginUser } from './data/reducers';
import messages from './messages';
import { InlineLink, SocialAuthButtons } from '../../common-ui';

/**
 * Login form component that holds the login form functionality.
 *
 * @returns {JSX.Element} The rendered login component along with social auth buttons.
 */
const LoginForm = () => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();

  const [formFields, setFormFields] = useState({
    emailOrUsername: '',
    password: '',
  });

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setFormFields(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

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
      <Form id="login-form" name="login-form">
        <Form.Group controlId="email" className="w-100 mb-4">
          <Form.Control
            as="input"
            type="email"
            name="emailOrUsername"
            value={formFields.emailOrUsername}
            onChange={handleOnChange}
            floatingLabel={formatMessage(messages.loginFormEmailFieldLabel)}
          />
        </Form.Group>
        <Form.Group controlId="password" className="w-100 mb-2">
          <Form.Control
            as="input"
            type="password"
            name="password"
            value={formFields.password}
            onChange={handleOnChange}
            floatingLabel={formatMessage(messages.loginFormPasswordFieldLabel)}
          />
        </Form.Group>
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
          destination="#"
          linkHelpText={formatMessage(messages.loginFormSchoolAndOrganizationHelpText)}
          linkText={formatMessage(messages.loginFormSchoolAndOrganizationLink)}
        />
      </Form>
    </Container>
  );
};

export default LoginForm;
