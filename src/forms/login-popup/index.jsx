import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { snakeCaseObject } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Button, Container, Form, Hyperlink,
} from '@openedx/paragon';

import { loginUser } from './data/reducers';
import messages from './messages';
import SocialAuthButtons from '../../common-ui/SocialAuthButtons';

import './index.scss';

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
    <Container size="lg" className="w-100 h-100 overflow-auto form-layout">
      <h1 className="display-1 font-italic text-center mb-4">{formatMessage(messages.loginFormHeading1)}</h1>
      <SocialAuthButtons />
      <div className="text-center mb-4.5 mt-4.5">
        {formatMessage(messages.loginFormHeading2)}
      </div>
      <Form>
        <Form.Row className="mb-4">
          <Form.Group controlId="email" className="w-100 m-0">
            <Form.Control
              as="input"
              type="email"
              name="emailOrUsername"
              value={formFields.emailOrUsername}
              onChange={handleOnChange}
              floatingLabel={formatMessage(messages.loginFormEmailFieldLabel)}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row className="mb-3">
          <Form.Group controlId="password" className="w-100 m-0">
            <Form.Control
              as="input"
              type="password"
              name="password"
              value={formFields.password}
              onChange={handleOnChange}
              floatingLabel={formatMessage(messages.loginFormPasswordFieldLabel)}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          {/* TODO: this destination will be replaced with actual links */}
          <Hyperlink className="hyper-link" destination="#">
            {formatMessage(messages.loginFormForgotPasswordButton)}
          </Hyperlink>
        </Form.Row>
        <Form.Row className="mt-6 mb-4.5">
          <Button
            id="login-user"
            name="login-user"
            variant="primary"
            type="submit"
            className="w-100"
            onClick={handleSubmit}
            onMouseDown={(e) => e.preventDefault()}
          >
            {formatMessage(messages.loginFormSignInButton)}
          </Button>
        </Form.Row>
        <Form.Row>
          <span>
            {formatMessage(messages.loginFormRegistrationHelpText)}&nbsp;
          </span>
          {/* TODO: this destination will be replaced with actual links */}
          <Hyperlink className="hyper-link" destination="#">
            {formatMessage(messages.loginFormRegistrationLink)}
          </Hyperlink>
        </Form.Row>
      </Form>
    </Container>
  );
};

export default LoginForm;
