import React from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Button, Container, Form, Hyperlink, Icon,
} from '@openedx/paragon';
import { CheckCircleOutline, RemoveRedEye } from '@openedx/paragon/icons';

import messages from './messages';
import SocialAuthButtons from '../../common-ui/SocialAuthButtons';
import './index.scss';

const RegisterForm = () => {
  const { formatMessage } = useIntl();
  return (
    <Container size="lg" className="registration-form overflow-auto">
      <h2 className="font-italic text-center display-1 mb-4">{formatMessage(messages.registerFormHeading)}</h2>
      <hr className="separator mb-3 mt-3" />
      <div className="d-flex mb-4">
        <span className="pt-1">
          <Icon src={CheckCircleOutline} className="mr-2" />
        </span>
        <div className="text-gray-800">
          <span className="font-weight-bold mr-2">Lorem ipsum dolor sit amet</span>
          <br />
          <span className="small">Lorem ipsum dolor sit amet consectetur. Morbi etiam mauris enim est morbi aliquet ipsum iaculis</span>
        </div>
      </div>
      <SocialAuthButtons isLoginPage={false} />
      <div className="text-center mt-4.5 mb-4.5">
        {formatMessage(messages.registerFormOrText)}
      </div>
      <Form>
        <Form.Row className="mb-4">
          <Form.Group controlId="email" className="w-100 mb-0">
            <Form.Control
              type="email"
              floatingLabel={<span>{formatMessage(messages.registerFormEmailFieldLabel)}</span>}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row className="mb-4">
          <Form.Group controlId="fullName" className="w-100 mb-0">
            <Form.Control
              type="text"
              floatingLabel={<span>{formatMessage(messages.registerFormFullNameFieldLabel)}</span>}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row className="mb-4">
          <Form.Group controlId="password" className="w-100 mb-0">
            <Form.Control
              type="password"
              trailingElement={<Icon src={RemoveRedEye} />}
              floatingLabel={<span>{formatMessage(messages.registerFormPasswordFieldLabel)}</span>}
            />
          </Form.Group>
        </Form.Row>
        <Form.Group id="formGridCheckbox">
          <Form.Checkbox className="text-gray-800">{formatMessage(messages.registerFormOptOutLabel)}</Form.Checkbox>
        </Form.Group>
        <div className="d-flex flex-column">
          <Button variant="primary" type="submit" className="align-self-end continue-button">
            {formatMessage(messages.registerFormContinueButton)}
          </Button>
        </div>
      </Form>
      <div>
        <span className="mt-5.5 text-gray-800 mt-1">
          {formatMessage(messages.registerFormAlreadyHaveAccountText)}
          <Hyperlink className="p-2">
            {formatMessage(messages.registerFormSignInLink)}
          </Hyperlink>
        </span>
        <br />
        <span className="font-weight-normal">
          {formatMessage(messages.registerFormAccountSchoolOrganizationText)}
          <Hyperlink className="p-2">
            {formatMessage(messages.registerFormSignInWithCredentialsLink)}
          </Hyperlink>
        </span>
      </div>
    </Container>
  );
};

export default RegisterForm;
