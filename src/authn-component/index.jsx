import React from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';
import { AppProvider } from '@edx/frontend-platform/react';
import PropTypes from 'prop-types';

import messages from './messages';
import BaseContainer from '../base-container';
import configureStore from '../data/configureStore';
import RegistrationForm from '../forms/registration-popup';

/**
 * Main component that holds the logic for conditionally rendering login or registration form.
 *
 * @param {boolean} open - Required. Whether to open the modal window containing login or registration form.
 * @param {function} setOpen - Required. Is used to toggle the modal window's open flag.
 *
 * @returns {JSX.Element} The rendered BaseContainer component containing either login or registration form.
 */
const AuthnComponent = ({ open, setOpen }) => {
  const { formatMessage } = useIntl();
  const registrationFooterText = formatMessage(messages.footerText);

  return (
    <BaseContainer open={open} setOpen={setOpen} footerText={registrationFooterText}>
      <RegistrationForm />
    </BaseContainer>
  );
};

AuthnComponent.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

/**
 * Higher Order Component that wraps AuthnComponent with AppProvider.
 */
const AuthnComponentWithProvider = (props) => (
  <AppProvider store={configureStore()}>
    <AuthnComponent {...props} />
  </AppProvider>
);

export default AuthnComponentWithProvider;
