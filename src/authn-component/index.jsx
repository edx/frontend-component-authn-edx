import React from 'react';

import PropTypes from 'prop-types';

import BaseContainer from '../base-container';
import { LoginForm } from '../forms';

/**
 * Main component that holds the logic for conditionally rendering login or registration form.
 *
 * @param {boolean} open - Required. Whether to open the modal window containing login or registration form.
 * @param {function} setOpen - Required. Is used to toggle the modal window's open flag.
 *
 * @returns {JSX.Element} The rendered BaseContainer component containing either login or registration form.
 */

const AuthnComponent = ({
  open, setOpen,
}) => (
  <BaseContainer open={open} setOpen={setOpen}>
    <LoginForm />
  </BaseContainer>
);

AuthnComponent.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default AuthnComponent;
