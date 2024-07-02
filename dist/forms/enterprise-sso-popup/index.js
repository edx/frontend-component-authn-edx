import React, { useEffect, useRef } from 'react';
import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, Icon } from '@openedx/paragon';
import { Login } from '@openedx/paragon/icons';
import PropTypes from 'prop-types';
import './index.scss';
import { SOCIAL_AUTH_PROVIDERS, WHITE_TEXT_COLOR_PROVIDERS } from './data/constants';
import messages from './messages';
import { setCurrentOpenedForm } from '../../authn-component/data/reducers';
import { SocialAuthButton as EnterpriseSSOButton } from '../../common-ui/SocialAuthButtons';
import { LOGIN_FORM } from '../../data/constants';
import { useDispatch } from '../../data/storeHooks';
/**
 * This component renders the Single sign-on (SSO) button only for the tpa provider passed
 *
 * @returns {JSX.Element} rendered EnterpriseSSO component.
 */
const EnterpriseSSO = props => {
  const {
    formatMessage
  } = useIntl();
  const dispatch = useDispatch();
  const {
    provider = {
      id: '',
      name: '',
      loginUrl: '',
      registerUrl: ''
    }
  } = props;
  const inverseTextColor = WHITE_TEXT_COLOR_PROVIDERS.includes(provider.name);
  const buttonRef = useRef(null);
  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.focus();
    }
  }, []);
  const handleClick = (e, url) => {
    e.preventDefault();
    window.location.href = getConfig().LMS_BASE_URL + url;
  };
  const redirectToLogin = e => {
    e.preventDefault();
    dispatch(setCurrentOpenedForm(LOGIN_FORM));
  };
  if (provider) {
    return /*#__PURE__*/React.createElement("div", {
      className: "authn__popup-container d-flex flex-column w-100"
    }, /*#__PURE__*/React.createElement("p", null, formatMessage(messages.enterprisetpaTitleHeading, {
      providerName: provider.name
    })), SOCIAL_AUTH_PROVIDERS.includes(provider.name) ? /*#__PURE__*/React.createElement(EnterpriseSSOButton, {
      provider: provider,
      isLoginForm: true,
      inverseTextColor: inverseTextColor,
      ref: buttonRef
    }) : /*#__PURE__*/React.createElement(Button, {
      id: provider.id,
      name: provider.id,
      variant: "inverse-primary",
      className: "w-100 text-black-50 d-flex flex-row justify-content-start align-items-center pl-3 authn-sso-btn__pill-shaped",
      onClick: e => handleClick(e, provider.loginUrl),
      ref: buttonRef
    }, /*#__PURE__*/React.createElement("div", {
      className: "btn-tpa__font-container",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement(Icon, {
      className: "h-75",
      src: Login
    })), /*#__PURE__*/React.createElement("span", {
      className: "pl-2",
      "aria-hidden": "true"
    }, formatMessage(messages.enterpriseTpaProviderSigninTitle, {
      providerName: provider.name
    }))), /*#__PURE__*/React.createElement("div", {
      className: "mb-4"
    }), /*#__PURE__*/React.createElement(Button, {
      id: "other-ways-to-sign-in",
      name: "other-ways-to-sign-in",
      variant: "primary",
      state: "Complete",
      className: "w-100 authn-btn__pill-shaped",
      onClick: redirectToLogin,
      onMouseDown: e => e.preventDefault()
    }, formatMessage(messages.enterprisetpaLoginButtonText)));
  }
  return null;
};
EnterpriseSSO.propTypes = {
  provider: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    loginUrl: PropTypes.string,
    registerUrl: PropTypes.string
  })
};
export default EnterpriseSSO;
//# sourceMappingURL=index.js.map