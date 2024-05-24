import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getConfig, snakeCaseObject } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Button, Container, Form,
} from '@openedx/paragon';

import { registerUser } from './data/reducers';
import HonorCodeAndPrivacyPolicyMessage from './honorCodeAndTOS';
import messages from './messages';
import { setCurrentOpenedForm } from '../../authn-component/data/reducers';
import { InlineLink, SocialAuthProviders } from '../../common-ui';
import { ENTERPRISE_LOGIN_URL, LOGIN_FORM } from '../../data/constants';
import './index.scss';
import AuthenticatedRedirection from '../common-components/AuthenticatedRedirection';
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

  const registrationResult = useSelector(state => state.register.registrationResult);
  const finishAuthUrl = useSelector(state => state.commonData.thirdPartyAuthContext.finishAuthUrl);

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

  return (
    <>
      <Container size="lg" className="authn__popup-container overflow-auto">
        <AuthenticatedRedirection
          success={registrationResult.success}
          redirectUrl={registrationResult.redirectUrl}
          finishAuthUrl={finishAuthUrl}
        />
        <h2
          className="font-italic text-center display-1 mb-4"
          data-testid="sign-up-heading"
        >
          {formatMessage(messages.registrationFormHeading1)}
        </h2>
        <hr className="separator mb-4 mt-4" />

        <>
          <SocialAuthProviders isLoginForm={false} />
          <div className="text-center mb-4 mt-3">
            {formatMessage(messages.registrationFormHeading2)}
          </div>
        </>

        <Form id="registration-form" name="registration-form" className="d-flex flex-column my-4">
          <EmailField
            name="email"
            value={formFields.email}
            handleChange={handleOnChange}
            floatingLabel={formatMessage(messages.registrationFormEmailFieldLabel)}
          />
          <NameField
            label="Full name"
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
            floatingLabel={formatMessage(messages.registrationFormPasswordFieldLabel)}
          />
          <MarketingEmailOptInCheckbox
            name="marketingEmailOptIn"
            value={formFields.marketingEmailOptIn}
            handleChange={handleOnChange}
          />
          <div className="d-flex flex-column my-4">
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
          </div>
        </Form>
        <div>
          <InlineLink
            className="mb-2"
            onClick={() => dispatch(setCurrentOpenedForm(LOGIN_FORM))}
            linkHelpText={formatMessage(messages.registrationFormAlreadyHaveAccountText)}
            linkText={formatMessage(messages.registrationFormSignInLink)}
          />
          <InlineLink
            destination={getConfig().LMS_BASE_URL + ENTERPRISE_LOGIN_URL}
            linkHelpText={formatMessage(messages.registrationFormSchoolOrOrganizationLink)}
            linkText={formatMessage(messages.registrationFormSignInWithCredentialsLink)}
          />
        </div>
      </Container>
      <div className="bg-dark-500">
        <p className="mb-0 text-white m-auto authn-popup__registration-footer">
          <HonorCodeAndPrivacyPolicyMessage />
        </p>
      </div>
    </>
  );
};

export default RegistrationForm;
