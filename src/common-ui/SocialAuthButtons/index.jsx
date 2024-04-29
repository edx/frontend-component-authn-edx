import React from 'react';
import { useSelector } from 'react-redux';

import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, Skeleton } from '@openedx/paragon';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import socialLogos from './constants';
import providersSelector from '../../authn-component/data/selectors';
import { PENDING_STATE } from '../../data/constants';
import messages from '../messages';

import './index.scss';

/**
 * A reusable button component for social authentication providers (Facebook, Google, etc.).
 *
 * @param {string} provider - Required. The social authentication provider
 * @param {boolean} isLoginForm - Whether to display a sign-in or sign-up text based on the login page context.
 * @param {boolean} inverseTextColor - Whether to use inverted text color (white for dark backgrounds).
 *
 * @returns {JSX.Element} The rendered SocialAuthButton component.
 */
export const SocialAuthButton = ({ provider, isLoginForm, inverseTextColor }) => {
  const { formatMessage } = useIntl();

  if (!provider) {
    return null;
  }

  const {
    id: providerId,
    name: providerName,
    loginUrl,
    registerUrl,
  } = provider;

  const handleSubmit = (e) => {
    e.preventDefault();

    const url = e.currentTarget.dataset.providerUrl;
    window.location.href = getConfig().LMS_BASE_URL + url;
  };

  return (
    <Button
      id={providerId}
      type="button"
      data-provider-url={isLoginForm ? loginUrl : registerUrl}
      onClick={handleSubmit}
      className={classNames(
        `social-auth-button_${providerName.toLowerCase()} d-flex justify-content-start mb-3`,
        {
          'text-white': inverseTextColor,
          'text-black-50': !inverseTextColor,
        },
      )}
      variant="tertiary"
    >
      {socialLogos[providerName]}
      <span>
        {
          isLoginForm
            ? formatMessage(messages.socialAuthProviderSigninTitle, { providerName })
            : formatMessage(messages.socialAuthProviderSignupTitle, { providerName })
        }
      </span>
    </Button>
  );
};

SocialAuthButton.propTypes = {
  provider: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    loginUrl: PropTypes.string,
    registerUrl: PropTypes.string,
  }),
  isLoginForm: PropTypes.bool.isRequired,
  inverseTextColor: PropTypes.bool,
};

SocialAuthButton.defaultProps = {
  inverseTextColor: false,
  provider: null,
};

/**
 * A component that renders a group of SocialAuthButton components for different social authentication providers.
 *
 * @param {boolean} isLoginForm - Whether the component is used on a login page. Affects the displayed text.
 *
 * @returns {JSX.Element} The rendered SocialAuthProviders component.
 */
const SocialAuthProviders = ({ isLoginForm }) => {
  const thirdPartyAuthApiStatus = useSelector(state => state.commonData.thirdPartyAuthApiStatus);
  const providers = useSelector(providersSelector);

  if (thirdPartyAuthApiStatus === PENDING_STATE) {
    return (
      <Skeleton height={36} count={4} />
    );
  }
  return (
    <div className="d-flex flex-column">
      <SocialAuthButton isLoginForm={isLoginForm} provider={providers?.Google} />
      <SocialAuthButton isLoginForm={isLoginForm} provider={providers?.Apple} inverseTextColor />
      <SocialAuthButton isLoginForm={isLoginForm} provider={providers?.Facebook} inverseTextColor />
      <SocialAuthButton isLoginForm={isLoginForm} provider={providers?.Microsoft} />
    </div>
  );
};

SocialAuthProviders.propTypes = {
  isLoginForm: PropTypes.bool,
};

SocialAuthProviders.defaultProps = {
  isLoginForm: true,
};

export default SocialAuthProviders;
