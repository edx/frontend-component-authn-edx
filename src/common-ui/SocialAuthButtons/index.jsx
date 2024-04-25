import React from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';
import { Button } from '@openedx/paragon';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import socialLogos from './constants';
import messages from '../messages';
import './index.scss';

/**
 * A reusable button component for social authentication providers (Facebook, Google, etc.).
 *
 * @param {boolean} inverseTextColor - Whether to use inverted text color (white for dark backgrounds).
 * @param {string} providerName - Required. The name of the social authentication provider
 * @param {boolean} showSigninText - Whether to display a sign-in or sign-up text based on the login page context.
 *
 * @returns {JSX.Element} The rendered SocialAuthButton component.
 */
const SocialAuthButton = ({
  inverseTextColor, providerName, showSigninText,
}) => {
  const { formatMessage } = useIntl();

  return (
    <Button
      className={classNames(
        `social-auth-button_${providerName.toLowerCase()} d-flex justify-content-start mt-2 mb-2`,
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
          showSigninText
            ? formatMessage(messages.socialAuthProviderSigninTitle, { providerName })
            : formatMessage(messages.socialAuthProviderSignupTitle, { providerName })
        }
      </span>
    </Button>
  );
};

SocialAuthButton.propTypes = {
  inverseTextColor: PropTypes.bool,
  providerName: PropTypes.string.isRequired,
  showSigninText: PropTypes.bool,
};

SocialAuthButton.defaultProps = {
  inverseTextColor: false,
  showSigninText: true,
};

/**
 * A component that renders a group of SocialAuthButton components for different social authentication providers.
 *
 * @param {boolean} isLoginPage - Whether the component is used on a login page. Affects the displayed text.
 *
 * @returns {JSX.Element} The rendered SocialAuthProviders component.
 */
const SocialAuthProviders = ({ isLoginPage }) => (
  <div className="d-flex flex-column">
    <SocialAuthButton showSigninText={isLoginPage} providerName="Google" />
    <SocialAuthButton showSigninText={isLoginPage} providerName="Apple" inverseTextColor />
    <SocialAuthButton showSigninText={isLoginPage} providerName="Facebook" inverseTextColor />
    <SocialAuthButton showSigninText={isLoginPage} providerName="Microsoft" />
  </div>
);

SocialAuthProviders.propTypes = {
  isLoginPage: PropTypes.bool,
};

SocialAuthProviders.defaultProps = {
  isLoginPage: true,
};

export default SocialAuthProviders;
