import React from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';
import { AppProvider } from '@edx/frontend-platform/react';
import PropTypes from 'prop-types';

import messages from './messages';
import BaseContainer from '../base-container';
import configureStore from '../data/configureStore';
import LoginForm from '../forms/login-popup';
import RegistrationForm from '../forms/registration-popup';

/**
 * Main component that holds the logic for conditionally rendering login or registration form.
 *
 * @param {boolean} isOpen - Required. Whether to open the modal window containing login or registration form.
 * @param {function} close - Required. Is used to toggle the modal window's open flag.
 *
 * @returns {JSX.Element} The rendered BaseContainer component containing either login or registration form.
 */
const AuthnComponent = ({
  isOpen, close, isSignUp, isSignIn,
}) => {
  const { formatMessage } = useIntl();
  const registrationFooterText = formatMessage(messages.footerText);

  return (
    <BaseContainer isOpen={isOpen} close={close} footerText={registrationFooterText}>
      {isSignUp && <RegistrationForm /> }
      {isSignIn && <LoginForm /> }
    </BaseContainer>
  );
};

AuthnComponent.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  isSignUp: PropTypes.bool,
  isSignIn: PropTypes.bool,
};

AuthnComponent.defaultProps = {
  isSignIn: false,
  isSignUp: false,
};

/**
 * Higher Order Component that wraps AuthnComponent with AppProvider.
 */
const AuthnComponentWithProvider = (props) => (
  <AppProvider store={configureStore()}>
    <AuthnComponent {...props} />
  </AppProvider>
);

export const SignInComponent = (props) => (<AuthnComponentWithProvider {...props} isSignIn />);

const SignUpComponent = (props) => (<AuthnComponentWithProvider {...props} isSignUp />);

export default SignUpComponent;
