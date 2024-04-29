import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { snakeCaseObject } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Button, Container, Form, Icon, IconButton, Stepper,
} from '@openedx/paragon';
import { ArrowBack } from '@openedx/paragon/icons';

import { NUM_OF_STEPS, STEP1, STEP2 } from './data/constants';
import { registerUser } from './data/reducers';
import messages from './messages';
import { InlineLink, SocialAuthProviders } from '../../common-ui';
import './index.scss';
import EmailField from '../fields/email-field';
import MarketingEmailOptInCheckbox from '../fields/marketing-email-opt-out-field';
import PasswordField from '../fields/password-field';
import NameField from '../fields/text-field';
/**
 * RegisterForm component for handling user registration.
 * This component provides a form for users to register with their name, email, password,
 * and a checkbox for opting out of marketing emails.
 */

const RegistrationForm = () => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();

  const [formFields, setFormFields] = useState({
    name: '', email: '', password: '', marketingEmailOptIn: true,
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
      {currentStep === STEP1 ? (
        <h2
          className="font-italic text-center display-1 mb-4"
          data-testid="sign-up-heading"
        >
          {formatMessage(messages.registrationFormHeading1)}
        </h2>
      ) : (
        <>
          <h2 className="font-italic text-center display-1 mb-4">
            {formatMessage(messages.registrationFormHeading3)}
          </h2>
          <p className="text-center mt-4">{formatMessage(messages.registrationFormSubHeading)}</p>
        </>
      )}
      <hr className="separator mb-4 mt-4" />
    </>
  );

  return (
    <Stepper activeKey={`step${currentStep}`}>
      <Container size="lg" className="authn__popup-container overflow-auto">
        {Header}
        {currentStep > STEP1 && (
          <div className="back-button-container mb-4">
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
            <SocialAuthProviders isLoginForm={false} />
            <div className="text-center mb-4 mt-3">
              {formatMessage(messages.registrationFormHeading2)}
            </div>
          </>
        )}
        <Form id="registration-form" name="registration-form" className="d-flex flex-column my-4">
          <Stepper.Step title={`step${STEP1}`} eventKey={`step${STEP1}`}>
            <EmailField
              name="email"
              value={formFields.email}
              handleChange={handleOnChange}
            />
            <MarketingEmailOptInCheckbox
              name="marketingEmailOptIn"
              value={formFields.marketingEmailOptIn}
              handleChange={handleOnChange}
            />
          </Stepper.Step>
          <Stepper.Step title={`step${STEP2}`} eventKey={`step${STEP2}`}>
            <NameField
              label="Full Name"
              name="name"
              value={formFields.name}
              errorMessage=""
              handleChange={handleOnChange}
              handleFocus={() => { }}
            />
            <PasswordField
              name="password"
              value={formFields.password}
              errorMessage=""
              handleChange={handleOnChange}
              handleFocus={() => { }}
            />
          </Stepper.Step>
          <div className="d-flex flex-column my-4">
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
          </div>
        </Form>
        <div>
          <InlineLink
            className="mb-2"
            destination="#"
            linkHelpText={formatMessage(messages.registrationFormAlreadyHaveAccountText)}
            linkText={formatMessage(messages.registrationFormSignInLink)}
          />
          <InlineLink
            destination="#"
            linkHelpText={formatMessage(messages.registrationFormSchoolOrOrganizationLink)}
            linkText={formatMessage(messages.registrationFormSignInWithCredentialsLink)}
          />
        </div>
      </Container>
    </Stepper>
  );
};

export default RegistrationForm;
