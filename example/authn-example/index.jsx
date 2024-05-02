import React, { useState } from 'react';

import { useToggle, Button, Container } from '@openedx/paragon';

import SignUpComponent, { SignInComponent } from '../../src/authn-component';

import './index.scss'

/**
 * Main component that holds the logic for conditionally rendering login or registration form.
 *
 *
 * @returns {JSX.Element} The rendered signup or signin component based on user action.
 */
const AuthnExampleContainer = () => {
  
  const [isSignUpOpen, setIsSignupOpen, setIsSignupClose] = useToggle(false) 
  const [isSignInOpen, setIsSigninOpen, setIsSigninClose] = useToggle(false)  

  return (
    <>
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="authn-example__btns-container p-3">
            <Button className="btn btn-tertiary user-link sign-in-link" onClick={() => setIsSigninOpen(!isSignInOpen)}>
                Sign In
            </Button>
            <Button className="btn btn-brand user-link mx-1 register-link" onClick={() => setIsSignupOpen(!isSignUpOpen)}>
                Register for free
            </Button>
        </div>
    </Container>
    <SignInComponent close={setIsSigninClose} isOpen={isSignInOpen} />
    <SignUpComponent close={setIsSignupClose} isOpen={isSignUpOpen} />
    </>
  );
};

AuthnExampleContainer.propTypes = {};

export default AuthnExampleContainer;

