import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppProvider } from '@edx/frontend-platform/react';
import { Spinner } from '@openedx/paragon';
import PropTypes from 'prop-types';

import { getThirdPartyAuthContext, setCurrentOpenedForm } from './data/reducers';
import validateContextData from './data/utils';
import BaseContainer from '../base-container';
import store from '../data/configureStore';
import {
  ENTERPRISE_LOGIN,
  FORGOT_PASSWORD_FORM,
  LOGIN_FORM,
  PENDING_STATE,
  PROGRESSIVE_PROFILING_FORM,
  REGISTRATION_FORM,
  VALID_FORMS,
} from '../data/constants';
import getAllPossibleQueryParams from '../data/utils';
import { ForgotPasswordForm, LoginForm, RegistrationForm } from '../forms';
import EnterpriseSSO from '../forms/enterprise-sso-popup';
import { getTpaHint, getTpaProvider } from '../forms/enterprise-sso-popup/data/utils';
import ProgressiveProfilingForm from '../forms/progressive-profiling-popup';

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
  isOpen, close, context, formToRender,
}) => {
  const dispatch = useDispatch();
  const queryParams = useMemo(() => getAllPossibleQueryParams(), []);

  const [screenSize, setScreenSize] = useState('lg');
  const [hasCloseButton, setHasCloseButton] = useState(true);

  const currentForm = useSelector(state => state.commonData.currentForm);
  const providers = useSelector(state => state.commonData.thirdPartyAuthContext?.providers);
  const secondaryProviders = useSelector(state => state.commonData.thirdPartyAuthContext?.secondaryProviders);
  const thirdPartyAuthApiStatus = useSelector(state => state.commonData.thirdPartyAuthApiStatus);

  const tpaHint = getTpaHint();
  const { provider: tpaProvider } = getTpaProvider(tpaHint, providers, secondaryProviders);
  const pendingState = queryParams?.tpa_hint && thirdPartyAuthApiStatus === PENDING_STATE;

  useEffect(() => {
    if (currentForm === PROGRESSIVE_PROFILING_FORM) {
      setHasCloseButton(false);
      setScreenSize('fullscreen');
    }
  }, [currentForm]);

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
    dispatch(getThirdPartyAuthContext({ ...validatedContext, ...queryParams }));
  }, [context, dispatch, queryParams]);

  const getForm = () => {
    if (currentForm === ENTERPRISE_LOGIN) {
      return <EnterpriseSSO provider={tpaProvider} />;
    }
    if (currentForm === REGISTRATION_FORM) {
      return <RegistrationForm />;
    }
    if (currentForm === LOGIN_FORM) {
      return <LoginForm />;
    }
    if (currentForm === PROGRESSIVE_PROFILING_FORM) {
      return <ProgressiveProfilingForm />;
    }
    if (currentForm === FORGOT_PASSWORD_FORM) {
      return <ForgotPasswordForm />;
    }
    return <RegistrationForm />;
  };

  const getSpinner = (
    <div className="w-100 text-center">
      <Spinner animation="border" variant="primary" />
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
        ? getSpinner
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
  formToRender: PropTypes.oneOf(VALID_FORMS),
};

AuthnComponent.defaultProps = {
  context: null,
  formToRender: REGISTRATION_FORM,
};

/**
 * Higher Order Component that wraps AuthnComponent with AppProvider.
 */
const AuthnComponentWithProvider = (props) => {
  const { isOpen } = props;
  if (isOpen) {
    return (
      <AppProvider store={store}>
        <AuthnComponent {...props} />
      </AppProvider>
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
};

AuthnComponentWithProvider.defaultProps = {
  context: null,
  formToRender: REGISTRATION_FORM,
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
const SignUpComponent = (props) => (
  <AuthnComponentWithProvider {...props} />
);

export default SignUpComponent;
