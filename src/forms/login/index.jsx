import React from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Button, Container, Form, Hyperlink,
} from '@openedx/paragon';

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
              type="email"
              floatingLabel={formatMessage(messages.loginFormEmailFieldLabel)}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row className="mb-3">
          <Form.Group controlId="password" className="w-100 m-0">
            <Form.Control
              type="password"
              floatingLabel={formatMessage(messages.loginFormPasswordFieldLabel)}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Hyperlink className="hyper-link" destination="#">
            {formatMessage(messages.loginFormForgotPasswordButton)}
          </Hyperlink>
        </Form.Row>
        <Form.Row className="mt-6 mb-4.5">
          <Button className="w-100" variant="primary">{formatMessage(messages.loginFormSignInButton)}</Button>
        </Form.Row>
        <Form.Row>
          <span>
            {formatMessage(messages.loginFormRegistrationHelpText)}&nbsp;
          </span>
          <Hyperlink className="hyper-link" destination="#">
            {formatMessage(messages.loginFormRegistrationLink)}
          </Hyperlink>
        </Form.Row>
      </Form>
    </Container>
  );
};

export default LoginForm;
