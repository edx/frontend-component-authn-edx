import React, { useEffect } from 'react';

import { Button, Container, useToggle } from '@openedx/paragon';

import getAllPossibleQueryParams from '../../src/data/utils';
import {
  ResetPasswordComponent, SignInComponent, SignUpComponent,
} from '../../src/onboarding-component';

import './index.scss';

/**
 * Demonstrates the usage of the On boarding Component as a host component.
 * This component serves as an example of how the On boarding Component can be used in an application.
 */
const OnBoardingExampleContainer = () => {
  const [isSignUpFormOpen, setSignUpFormOpen, setSignUpFormClose] = useToggle(false);
  const [isSignInFormOpen, setSignInFormOpen, setSignInFormClose] = useToggle(false);
  const [isResetPasswordFormOpen, setResetPasswordFormOpen, setResetPasswordFormClose] = useToggle(false);

  const queryParam = getAllPossibleQueryParams();

  useEffect(() => {
    const url = new URL(window.location.href);
    const path = url.pathname;

    if (path === '/login' || path === '/register' || path.startsWith('/password_reset_confirm')) {
      const searchParams = new URLSearchParams(url.search);

      if (path === '/login') {
        searchParams.set('authMode', 'Login');
      } else if (path === '/register') {
        searchParams.set('authMode', 'Register');
      } else if (path.startsWith('/password_reset_confirm')) {
        searchParams.set('authMode', 'PasswordResetConfirm');

        const trimmedPath = window.location.pathname.replace(/\/$/, '');
        const token = trimmedPath.split('/').pop();
        searchParams.set('password_reset_token', token);
      }

      const redirectUrl = new URL(window.location.origin);
      redirectUrl.search = searchParams.toString();
      window.location.href = redirectUrl.toString();
    }
  }, []);

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
        <div className="onboarding-example__btns-container p-3">
          <Button
            className="btn btn-tertiary user-link sign-in-link onboarding-btn__pill-shaped"
            onClick={() => setSignInFormOpen()}
          >
            Sign In
          </Button>
          <Button
            className="btn btn-brand user-link mx-1 register-link onboarding-btn__pill-shaped"
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

OnBoardingExampleContainer.propTypes = {};

export default OnBoardingExampleContainer;
