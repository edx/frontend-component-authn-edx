import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { snakeCaseObject } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Button, Container, Form, Hyperlink, Icon, IconButton, Stepper,
} from '@openedx/paragon';
import { ArrowBack } from '@openedx/paragon/icons';

import { NUM_OF_STEPS, STEP1, STEP2 } from './data/constants';
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
const RegistrationForm = () => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();

  const [formFields, setFormFields] = useState({
    name: '', email: '', password: '', marketingEmailOptOut: false,
  });
  const [currentStep, setCurrentStep] = useState(STEP1);

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

    dispatch(registerUser(payload));
  };

  const handleNextStep = () => {
    if (currentStep < NUM_OF_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBackStep = () => {
    if (currentStep > STEP1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // JSX for header section
  const Header = (
    <>
      <h2 className="font-italic text-center display-1 mb-4">
        {formatMessage(messages.registrationFormHeading1)}
      </h2>
      {currentStep > STEP1 && (
        <p className="text-center">{formatMessage(messages.registrationFormSubHeading)}</p>
      )}
      <hr className="separator mb-4 mt-4" />
    </>
  );

  // JSX for sign-in link section
  const signInLink = (
    <span className="text-gray-800 mb-2 d-block">
      {formatMessage(messages.registrationFormAlreadyHaveAccountText)}
      <Hyperlink isInline className="p-2" destination="#">
        {formatMessage(messages.registrationFormSignInLink)}
      </Hyperlink>
    </span>
  );

  // JSX for sign-in with credentials link section
  const signInWithCredentialsLink = (
    <span className="font-weight-normal d-block">
      {formatMessage(messages.registrationFormSchoolOrOrganizationLink)}
      <Hyperlink isInline className="p-2" destination="#">
        {formatMessage(messages.registrationFormSignInWithCredentialsLink)}
      </Hyperlink>
    </span>
  );

  return (
    <Stepper activeKey={`step${currentStep}`}>
      <Container size="lg" className="registration-form overflow-auto">
        {Header}

        {currentStep > STEP1 && (
          <div className="back-button-container">
            <IconButton
              key="primary"
              src={ArrowBack}
              iconAs={Icon}
              alt="Back"
              onClick={handleBackStep}
              variant="primary"
              size="inline"
              className="mr-2"
            />
            {formatMessage(messages.registrationFormBackButton)}
          </div>
        )}

        {currentStep === STEP1 && (
          <>
            <SocialAuthButtons isLoginPage={false} />
            <div className="text-center mt-3">{formatMessage(messages.registrationFormHeading2)}</div>
          </>
        )}
        <Form id="registration-form" name="registration-form" className="d-flex flex-column my-4">
          <Stepper.Step eventKey={`step${STEP1}`}>
            <EmailField
              name="email"
              value={formFields.email}
              handleChange={handleOnChange}
            />
            <MarketingEmailOptOutCheckbox
              name="marketingEmailOptOut"
              value={formFields.marketingEmailOptOut}
              handleChange={handleOnChange}
            />
          </Stepper.Step>
          <Stepper.Step title="" eventKey={`step${STEP2}`}>
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
          </Stepper.Step>
          {currentStep < NUM_OF_STEPS && (
            <Button
              id="register-continue"
              name="register-continue"
              variant="primary"
              type="button"
              className="align-self-end"
              onClick={handleNextStep}
              onMouseDown={(e) => e.preventDefault()}
            >
              {formatMessage(messages.registrationFormContinueButton)}
            </Button>
          )}
          {currentStep === NUM_OF_STEPS && (
            <Button
              id="register-user"
              name="register-user"
              variant="primary"
              type="submit"
              className="align-self-end"
              onClick={handleSubmit}
              onMouseDown={(e) => e.preventDefault()}
            >
              {formatMessage(messages.registrationFormCreateAccountButton)}
            </Button>
          )}
        </Form>
        <div>
          {signInLink}
          {signInWithCredentialsLink}
        </div>
      </Container>
    </Stepper>
  );
};

export default RegistrationForm;
