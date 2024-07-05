import React, { useEffect, useMemo, useState } from 'react';

import { breakpoints, Spinner, useMediaQuery } from '@openedx/paragon';
import PropTypes from 'prop-types';

import { getThirdPartyAuthContext, setCurrentOpenedForm, setOnboardingComponentContext } from './data/reducers';
import validateContextData from './data/utils';
import BaseContainer from '../base-container';
import AuthnProvider from '../data/authnProvider';
import {
  ENTERPRISE_LOGIN,
  FORGOT_PASSWORD_FORM,
  LOGIN_FORM,
  PENDING_STATE,
  PROGRESSIVE_PROFILING_FORM,
  REGISTRATION_FORM,
  RESET_PASSWORD_FORM,
  VALID_FORMS,
} from '../data/constants';
import { useDispatch, useSelector } from '../data/storeHooks';
import getAllPossibleQueryParams from '../data/utils';
import {
  ForgotPasswordForm,
  LoginForm,
  ProgressiveProfilingForm,
  RegistrationForm,
  ResetPasswordForm,
} from '../forms';
import EnterpriseSSO from '../forms/enterprise-sso-popup';
import { getTpaHint, getTpaProvider } from '../forms/enterprise-sso-popup/data/utils';
import { REQUIRE_PASSWORD_CHANGE } from '../forms/login-popup/data/constants';
import { TOKEN_STATE } from '../forms/reset-password-popup/reset-password/data/constants';
/**
 * Main component that conditionally renders a login or registration form inside a modal window.
 *
 * @param {boolean} isOpen - Required. Whether the modal window is open.
 * @param {function} close - Required. Function to close the modal window.
 * @param {string} formToRender - Optional. Indicates which form to render ('login' or 'register').
 * @param {Object} context - Optional. Additional context needed for authentication, such as enrollment data.
 *
 * @returns {JSX.Element} The rendered component containing the login or registration form.
 */
export const AuthnComponent = ({
  isOpen, close, context = null, formToRender,
}) => {
  const dispatch = useDispatch();
  const queryParams = useMemo(() => getAllPossibleQueryParams(), []);

  const isExtraSmall = useMediaQuery({ maxWidth: breakpoints.extraSmall.maxWidth - 1 });

  const [screenSize, setScreenSize] = useState('lg');
  const [hasCloseButton, setHasCloseButton] = useState(true);

  const currentForm = useSelector(state => state.commonData.currentForm);
  const providers = useSelector(state => state.commonData.thirdPartyAuthContext?.providers);
  const secondaryProviders = useSelector(state => state.commonData.thirdPartyAuthContext?.secondaryProviders);
  const thirdPartyAuthApiStatus = useSelector(state => state.commonData.thirdPartyAuthApiStatus);
  const loginErrorCode = useSelector(state => state.login.loginError?.errorCode);
  const resetPasswordTokenStatus = useSelector(state => state.resetPassword?.status);

  const tpaHint = getTpaHint();
  const { provider: tpaProvider } = getTpaProvider(tpaHint, providers, secondaryProviders);
  const pendingState = queryParams?.tpa_hint && thirdPartyAuthApiStatus === PENDING_STATE;

  useEffect(() => {
    if (isExtraSmall) {
      setScreenSize('fullscreen');
    }
    if (!isExtraSmall && currentForm !== PROGRESSIVE_PROFILING_FORM) {
      setScreenSize('lg');
    }
  }, [isExtraSmall, currentForm]);

  useEffect(() => {
    if (currentForm === PROGRESSIVE_PROFILING_FORM) {
      setHasCloseButton(false);
      setScreenSize('fullscreen');
    }
    if (loginErrorCode === REQUIRE_PASSWORD_CHANGE
      && currentForm === FORGOT_PASSWORD_FORM
    ) {
      setHasCloseButton(false);
    }
    if (currentForm === RESET_PASSWORD_FORM && resetPasswordTokenStatus === TOKEN_STATE.PENDING) {
      setHasCloseButton(false);
    }
    if (currentForm === RESET_PASSWORD_FORM && resetPasswordTokenStatus !== TOKEN_STATE.PENDING) {
      setHasCloseButton(true);
    }
  }, [currentForm, resetPasswordTokenStatus, loginErrorCode]);

  useEffect(() => {
    if (tpaProvider) {
      dispatch(setCurrentOpenedForm(ENTERPRISE_LOGIN));
    }
    if (!tpaProvider && formToRender) {
      dispatch(setCurrentOpenedForm(formToRender));
    }
  }, [dispatch, formToRender, tpaProvider, queryParams]);

  useEffect(() => {
    let validatedContext = {};
    if (context) {
      validatedContext = validateContextData(context);
    }
    dispatch(setOnboardingComponentContext(validatedContext));
    dispatch(getThirdPartyAuthContext({ ...validatedContext, ...queryParams }));
  }, [context, dispatch, queryParams]);

  const getForm = () => {
    if (currentForm === ENTERPRISE_LOGIN) {
      return <EnterpriseSSO provider={tpaProvider} />;
    }
    if (currentForm === FORGOT_PASSWORD_FORM) {
      return <ForgotPasswordForm />;
    }
    if (currentForm === LOGIN_FORM) {
      return <LoginForm />;
    }
    if (currentForm === PROGRESSIVE_PROFILING_FORM) {
      return <ProgressiveProfilingForm />;
    }
    if (currentForm === REGISTRATION_FORM) {
      return <RegistrationForm />;
    }
    if (currentForm === RESET_PASSWORD_FORM) {
      return <ResetPasswordForm />;
    }
    return null;
  };

  const getSpinner = () => (
    <div className="w-100 text-center p-5" data-testid="tpa-spinner">
      <Spinner className="m-5" animation="border" variant="primary" />
    </div>
  );

  return (
    <BaseContainer
      isOpen={isOpen}
      close={close}
      hasCloseButton={hasCloseButton}
      size={screenSize}
    >
      {pendingState
        ? getSpinner()
        : getForm()}
    </BaseContainer>
  );
};

AuthnComponent.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  context: PropTypes.shape({
    course_id: PropTypes.string,
    enrollment_action: PropTypes.string,
    email_opt_in: PropTypes.bool,
  }),
  formToRender: PropTypes.oneOf(VALID_FORMS).isRequired,
};

/**
 * Higher Order Component that wraps AuthnComponent with AppProvider.
 */
const AuthnComponentWithProvider = (props) => {
  if (props.isOpen) {
    return (
      <AuthnProvider>
        <AuthnComponent {...props} />
      </AuthnProvider>
    );
  }

  return null;
};

AuthnComponentWithProvider.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  context: PropTypes.shape({
    course_id: PropTypes.string,
    enrollment_action: PropTypes.string,
    email_opt_in: PropTypes.bool,
  }),
  formToRender: PropTypes.oneOf(VALID_FORMS),
  locale: PropTypes.string,
};

/**
 * Component that renders a sign-in form using AuthnComponentWithProvider.
 *
 * @param {Object} props - Props for the component.
 * @returns {JSX.Element} The rendered sign-in component.
 */
export const SignInComponent = (props) => (
  <AuthnComponentWithProvider {...props} formToRender={LOGIN_FORM} />
);

/**
 * Component that renders a sign-up form using AuthnComponentWithProvider.
 *
 * @param {Object} props - Props for the component.
 * @returns {JSX.Element} The rendered sign-up component.
 */
export const SignUpComponent = (props) => (
  <AuthnComponentWithProvider {...props} formToRender={REGISTRATION_FORM} />
);

/**
 * Component that renders a reset password form using AuthnComponentWithProvider.
 *
 * @param {Object} props - Props for the component.
 * @returns {JSX.Element} The rendered reset password component.
 */
export const ResetPasswordComponent = (props) => (
  <AuthnComponentWithProvider {...props} formToRender={RESET_PASSWORD_FORM} />
);
