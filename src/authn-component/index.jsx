import React from 'react';

import { AppProvider } from '@edx/frontend-platform/react';
import PropTypes from 'prop-types';

import messages from './messages';
import BaseContainer from '../base-container';
import configureStore from '../data/configureStore';
import { LoginForm, RegisterForm } from '../forms';

/**
 * Main component that holds the logic for conditionally rendering login or registration form.
 *
 * @param {boolean} open - Required. Whether to open the modal window containing login or registration form.
 * @param {function} setOpen - Required. Is used to toggle the modal window's open flag.
 *
 * @returns {JSX.Element} The rendered BaseContainer component containing either login or registration form.
 */
const AuthnComponent = ({ open, setOpen }) => (
  <AppProvider store={configureStore()}>
    <BaseContainer open={open} setOpen={setOpen}>
      <LoginForm />
    </BaseContainer>
    <BaseContainer open={open} setOpen={setOpen} footerText={messages.footerText}>
      <RegisterForm />
    </BaseContainer>
  </AppProvider>
);

AuthnComponent.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default AuthnComponent;
