import React from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Button, Container, Form, Hyperlink, Icon,
} from '@openedx/paragon';
import { CheckCircleOutline, RemoveRedEye } from '@openedx/paragon/icons';

import messages from './messages';
import SocialAuthButtons from '../../common-ui/SocialAuthButtons';
import './index.scss';

const RegistrationForm = () => {
  const { formatMessage } = useIntl();
  return (
    <Container size="lg" className="registration-form overflow-auto">
      <h2 className="font-italic text-center display-1 mb-4">{formatMessage(messages.registrationFormHeading1)}</h2>
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
        {formatMessage(messages.registrationFormHeading2)}
      </div>
      <Form>
        <Form.Row className="mb-4">
          <Form.Group controlId="email" className="w-100 mb-0">
            <Form.Control
              type="email"
              floatingLabel={formatMessage(messages.registrationFormEmailFieldLabel)}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row className="mb-4">
          <Form.Group controlId="fullName" className="w-100 mb-0">
            <Form.Control
              type="text"
              floatingLabel={formatMessage(messages.registrationFormFullNameFieldLabel)}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row className="mb-4">
          <Form.Group controlId="password" className="w-100 mb-0">
            <Form.Control
              type="password"
              trailingElement={<Icon src={RemoveRedEye} />}
              floatingLabel={formatMessage(messages.registrationFormPasswordFieldLabel)}
            />
          </Form.Group>
        </Form.Row>
        <Form.Group id="formGridCheckbox">
          <Form.Checkbox className="text-gray-800">{formatMessage(messages.registrationFormOptOutLabel)}</Form.Checkbox>
        </Form.Group>
        <div className="d-flex flex-column">
          <Button variant="primary" type="submit" className="align-self-end">
            {formatMessage(messages.registrationFormCreateAccountButton)}
          </Button>
        </div>
      </Form>
      <div>
        <span className="mt-5.5 text-gray-800 mt-1">
          {formatMessage(messages.registrationFormAlreadyHaveAccountText)}
          <Hyperlink className="p-2">
            {formatMessage(messages.registrationFormSignInLink)}
          </Hyperlink>
        </span>
        <br />
        <span className="font-weight-normal">
          {formatMessage(messages.registrationFormSchoolOrOrganizationLink)}
          <Hyperlink className="p-2">
            {formatMessage(messages.registrationFormSignInWithCredentialsLink)}
          </Hyperlink>
        </span>
      </div>
    </Container>
  );
};

export default RegistrationForm;
