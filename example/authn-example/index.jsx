import React, { useEffect } from 'react';

import { Button, Container, useToggle } from '@openedx/paragon';

import SignUpComponent, { SignInComponent } from '../../src/authn-component';

import './index.scss';

/**
 * Demonstrates the usage of the Authn Component as a host component.
 * This component serves as an example of how the Authn Component can be used in an application.
 */
const AuthnExampleContainer = () => {
  const [isSignUpFormOpen, setSignUpFormOpen, setSignUpFormClose] = useToggle(false);
  const [isSignInFormOpen, setSignInFormOpen, setSignInFormClose] = useToggle(false);

  useEffect(() => {
    if (window.location.pathname === '/login') {
      setSignInFormOpen();
    } else if (window.location.pathname === '/register') {
      setSignUpFormOpen();
    }
  }, [setSignInFormOpen, setSignUpFormOpen]);

  return (
    <>
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="authn-example__btns-container p-3">
          <Button
            className="btn btn-tertiary user-link sign-in-link"
            onClick={() => setSignInFormOpen()}
          >
            Sign In
          </Button>
          <Button
            className="btn btn-brand user-link mx-1 register-link"
            onClick={() => setSignUpFormOpen()}
          >
            Register for free
          </Button>
        </div>
      </Container>
      <SignUpComponent
        close={setSignUpFormClose}
        isOpen={isSignUpFormOpen}
      />
      <SignInComponent
        close={setSignInFormClose}
        isOpen={isSignInFormOpen}
        context={{}}
      />
    </>
  );
};

AuthnExampleContainer.propTypes = {};

export default AuthnExampleContainer;
