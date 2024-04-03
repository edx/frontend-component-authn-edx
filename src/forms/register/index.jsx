import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { snakeCaseObject } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Button, Container, Form, Hyperlink, Icon,
} from '@openedx/paragon';
import { CheckCircleOutline } from '@openedx/paragon/icons';

import { registerUser } from './data/reducers';
import messages from './messages';
import SocialAuthButtons from '../../common-ui/SocialAuthButtons';
import './index.scss';
import EmailField from '../fields/email-field';
import MarketingEmailOptOutCheckbox from '../fields/marketing-email-opt-out-field';
import NameField from '../fields/name-field';
import PasswordField from '../fields/password-field';

/**
 * RegisterForm component for handling user registration.
 * This component provides a form for users to register with their name, email, password,
 * and a checkbox for opting out of marketing emails.
 */
const RegisterForm = () => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();

  const [formFields, setFormFields] = useState({
    name: '', email: '', password: '', marketingEmailOptOut: false,
  });

  const handleOnChange = (event) => {
    const { name } = event.target;
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormFields(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let payload = { ...formFields };
    payload.marketingEmailOptIn = !payload.marketingEmailOptOut;
    delete payload.marketingEmailOptOut;

    payload = snakeCaseObject(payload);
    // making register call
    dispatch(registerUser(payload));
  };

  // JSX for header section
  const Header = (
    <>
      <h2 className="font-italic text-center display-1 mb-4">
        {formatMessage(messages.registerFormHeading)}
      </h2>
      <hr className="separator mb-3 mt-3" />
    </>
  );

  // JSX for marketing text section
  const MarketingText = (
    <div className="d-flex mb-4">
      <span className="pt-1">
        <Icon src={CheckCircleOutline} className="mr-2" />
      </span>
      <div className="text-gray-800">
        <span className="font-weight-bold mr-2">
          Lorem ipsum dolor sit amet
        </span>
        <br />
        <span className="small">
          Lorem ipsum dolor sit amet consectetur. Morbi etiam mauris enim est morbi aliquet ipsum iaculis
        </span>
      </div>
    </div>
  );

  // JSX for sign-in link section
  const signInLink = (
    <span className="mt-5.5 text-gray-800 mt-1">
      {formatMessage(messages.registerFormAlreadyHaveAccountText)}
      <Hyperlink className="p-2" destination="#">
        {formatMessage(messages.registerFormSignInLink)}
      </Hyperlink>
    </span>
  );

  // JSX for sign-in with credentials link section
  const signInWithCredentialsLink = (
    <span className="font-weight-normal">
      {formatMessage(messages.registerFormAccountSchoolOrganizationText)}
      <Hyperlink className="p-2" destination="#">
        {formatMessage(messages.registerFormSignInWithCredentialsLink)}
      </Hyperlink>
    </span>
  );

  return (
    <Container size="lg" className="registration-form overflow-auto">
      {Header}
      {MarketingText}
      <SocialAuthButtons isLoginPage={false} />
      <div className="text-center mt-4.5">{formatMessage(messages.registerFormOrText)}</div>
      <Form id="registration-form" name="registration-form" className="d-flex flex-column my-4.5">
        <EmailField
          name="email"
          value={formFields.email}
          handleChange={handleOnChange}
        />
        <NameField
          name="name"
          value={formFields.name}
          handleChange={handleOnChange}
        />
        <PasswordField
          name="password"
          value={formFields.password}
          handleChange={handleOnChange}
        />
        <MarketingEmailOptOutCheckbox
          name="marketingEmailOptOut"
          value={formFields.marketingEmailOptOut}
          handleChange={handleOnChange}
        />
        <Button
          id="register-user"
          name="register-user"
          variant="primary"
          type="submit"
          className="align-self-end"
          onClick={handleSubmit}
          onMouseDown={(e) => e.preventDefault()}
        >
          {formatMessage(messages.registerFormContinueButton)}
        </Button>
      </Form>
      <div>
        {signInLink}
        <br />
        {signInWithCredentialsLink}
      </div>
    </Container>
  );
};

export default RegisterForm;
