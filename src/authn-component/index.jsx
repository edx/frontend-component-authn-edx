import React from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';
import PropTypes from 'prop-types';

import messages from './messages';
import BaseContainer from '../base-container';
import { LoginForm } from '../forms';
import RegisterForm from '../forms/register';

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
    <>
      <BaseContainer open={open} setOpen={setOpen}>
        <LoginForm />
      </BaseContainer>
      <BaseContainer open={open} setOpen={setOpen} footerText={registrationFooterText}>
        <RegisterForm />
      </BaseContainer>
    </>
  );
};

AuthnComponent.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default AuthnComponent;
