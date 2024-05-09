import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useIntl } from '@edx/frontend-platform/i18n';
import { AppProvider } from '@edx/frontend-platform/react';
import PropTypes from 'prop-types';

import { getThirdPartyAuthContext, setCurrentOpenedForm } from './data/reducers';
import validateContextData from './data/utils';
import messages from './messages';
import BaseContainer from '../base-container';
import configureStore from '../data/configureStore';
import {
  FORGOT_PASSWORD_FORM,
  LOGIN_FORM, PROGRESSIVE_PROFILING_FORM, REGISTRATION_FORM, VALID_FORMS,
} from '../data/constants';
import getAllPossibleQueryParams from '../data/utils';
import { LoginForm, RegistrationForm } from '../forms';
import ProgressiveProfilingForm from '../forms/progressive-profiling-popup';
import ForgotPasswordForm from '../forms/reset-password-popup/forgot-password/ForgotPasswordForm';

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
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const queryParams = useMemo(() => getAllPossibleQueryParams(), []);
  const currentForm = useSelector(state => state.commonData.currentForm);

  const registrationFooterText = currentForm === REGISTRATION_FORM ? formatMessage(messages.footerText) : null;

  useEffect(() => {
    if (formToRender) {
      dispatch(setCurrentOpenedForm(formToRender));
    }
  }, [dispatch, formToRender]);

  useEffect(() => {
    let validatedContext = {};
    if (context) {
      validatedContext = validateContextData(context);
    }
    dispatch(getThirdPartyAuthContext({ ...validatedContext, ...queryParams }));
  }, [context, dispatch, queryParams]);

  const getForm = () => {
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

  return (
    <BaseContainer isOpen={isOpen} close={close} footerText={registrationFooterText}>
      {getForm()}
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
      <AppProvider store={configureStore()}>
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
