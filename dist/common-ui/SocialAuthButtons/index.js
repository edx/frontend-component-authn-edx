import React, { forwardRef } from 'react';
import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, Skeleton } from '@openedx/paragon';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import socialLogos from './constants';
import providersSelector from '../../authn-component/data/selectors';
import { PENDING_STATE } from '../../data/constants';
import { useSelector } from '../../data/storeHooks';
import messages from '../messages';
import './index.scss';

/**
 * A reusable button component for social authentication providers (Facebook, Google, etc.).
 *
 * @param {object} provider - Required. The social authentication provider
 * @param {boolean} isLoginForm - Whether to display a sign-in or sign-up text based on the login page context.
 * @param {boolean} inverseTextColor - Whether to use inverted text color (white for dark backgrounds).
 *
 * @returns {JSX.Element} The rendered SocialAuthButton component.
 */
export const SocialAuthButton = /*#__PURE__*/forwardRef((_ref, ref) => {
  let {
    provider = null,
    isLoginForm,
    inverseTextColor = false
  } = _ref;
  const {
    formatMessage
  } = useIntl();
  const registrationFields = useSelector(state => state.register.registrationFields);
  if (!provider) {
    return null;
  }
  const {
    id: providerId,
    name: providerName,
    loginUrl,
    registerUrl
  } = provider;
  const handleSubmit = e => {
    e.preventDefault();

    // setting marketingEmailsOptIn state in local storage to preserve user marketing opt-in
    // choice in case of SSO auto registratioon
    localStorage.setItem('marketingEmailsOptIn', registrationFields?.marketingEmailsOptIn);
    const url = e.currentTarget.dataset.providerUrl;
    window.location.href = getConfig().LMS_BASE_URL + url;
  };
  return /*#__PURE__*/React.createElement(Button, {
    ref: ref,
    id: providerId,
    type: "button",
    "data-provider-url": isLoginForm ? loginUrl : registerUrl,
    onClick: handleSubmit,
    className: classNames(`social-auth-button_${providerName.toLowerCase()} d-flex justify-content-start mb-3 
        authn-sso-btn__pill-shaped`, {
      'text-white': inverseTextColor,
      'text-black-50': !inverseTextColor
    }),
    variant: "tertiary"
  }, socialLogos[providerName], /*#__PURE__*/React.createElement("span", null, isLoginForm ? formatMessage(messages.socialAuthProviderSigninTitle, {
    providerName
  }) : formatMessage(messages.socialAuthProviderSignupTitle, {
    providerName
  })));
});
SocialAuthButton.propTypes = {
  provider: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    loginUrl: PropTypes.string,
    registerUrl: PropTypes.string
  }),
  isLoginForm: PropTypes.bool.isRequired,
  inverseTextColor: PropTypes.bool
};

/**
 * A component that renders a group of SocialAuthButton components for different social authentication providers.
 *
 * @param {boolean} isLoginForm - Whether the component is used on a login page. Affects the displayed text.
 *
 * @returns {JSX.Element} The rendered SocialAuthProviders component.
 */
const SocialAuthProviders = /*#__PURE__*/forwardRef((_ref2, ref) => {
  let {
    isLoginForm = true
  } = _ref2;
  const thirdPartyAuthApiStatus = useSelector(state => state.commonData.thirdPartyAuthApiStatus);
  const providers = useSelector(providersSelector);
  if (thirdPartyAuthApiStatus === PENDING_STATE) {
    return /*#__PURE__*/React.createElement(Skeleton, {
      height: 44,
      count: 4
    });
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column"
  }, /*#__PURE__*/React.createElement(SocialAuthButton, {
    isLoginForm: isLoginForm,
    provider: providers?.Google,
    ref: ref
  }), /*#__PURE__*/React.createElement(SocialAuthButton, {
    isLoginForm: isLoginForm,
    provider: providers?.Apple,
    inverseTextColor: true
  }), /*#__PURE__*/React.createElement(SocialAuthButton, {
    isLoginForm: isLoginForm,
    provider: providers?.Facebook,
    inverseTextColor: true
  }), /*#__PURE__*/React.createElement(SocialAuthButton, {
    isLoginForm: isLoginForm,
    provider: providers?.Microsoft
  }));
});
SocialAuthProviders.propTypes = {
  isLoginForm: PropTypes.bool
};
export default SocialAuthProviders;
//# sourceMappingURL=index.js.map