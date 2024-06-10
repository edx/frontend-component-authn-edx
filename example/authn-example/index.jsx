import React, { useEffect } from 'react';

import { Button, Container, useToggle } from '@openedx/paragon';

import {
  ResetPasswordComponent, SignInComponent, SignUpComponent,
} from '../../src/authn-component';
import getAllPossibleQueryParams from '../../src/data/utils';

import './index.scss';

/**
 * Demonstrates the usage of the Authn Component as a host component.
 * This component serves as an example of how the Authn Component can be used in an application.
 */
const AuthnExampleContainer = () => {
  const [isSignUpFormOpen, setSignUpFormOpen, setSignUpFormClose] = useToggle(false);
  const [isSignInFormOpen, setSignInFormOpen, setSignInFormClose] = useToggle(false);
  const [isResetPasswordFormOpen, setResetPasswordFormOpen, setResetPasswordFormClose] = useToggle(false);

  const queryParam = getAllPossibleQueryParams();

  useEffect(() => {
    if (queryParam?.authMode === 'Login') {
      setSignInFormOpen();
    } else if (queryParam?.authMode === 'Register') {
      setSignUpFormOpen();
    } else if (queryParam?.authMode === 'PasswordResetConfirm') {
      setResetPasswordFormOpen();
    }
  }, [setSignInFormOpen, setSignUpFormOpen, setResetPasswordFormOpen, queryParam?.authMode]);

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
      <ResetPasswordComponent
        close={setResetPasswordFormClose}
        isOpen={isResetPasswordFormOpen}
      />
    </>
  );
};

AuthnExampleContainer.propTypes = {};

export default AuthnExampleContainer;
