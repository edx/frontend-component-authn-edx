import React from 'react';

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
const EnterpriseSSO = (props) => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const {
    provider = {
      id: '',
      name: '',
      loginUrl: '',
      registerUrl: '',
    },
  } = props;
  const inverseTextColor = WHITE_TEXT_COLOR_PROVIDERS.includes(provider.name);

  const handleClick = (e, url) => {
    e.preventDefault();
    window.location.href = getConfig().LMS_BASE_URL + url;
  };

  const redirectToLogin = (e) => {
    e.preventDefault();
    dispatch(setCurrentOpenedForm(LOGIN_FORM));
  };

  if (provider) {
    return (
      <div className="authn__popup-container d-flex flex-column w-100">
        <p>{formatMessage(messages.enterprisetpaTitleHeading, { providerName: provider.name })}</p>
        {SOCIAL_AUTH_PROVIDERS.includes(provider.name) ? (
          <EnterpriseSSOButton
            provider={provider}
            isLoginForm
            inverseTextColor={inverseTextColor}
          />
        ) : (
          <Button
            id={provider.id}
            name={provider.id}
            variant="inverse-primary"
            className="w-100 text-black-50 d-flex flex-row justify-content-start align-items-center pl-3"
            onClick={(e) => handleClick(e, provider.loginUrl)}
          >
            <div className="btn-tpa__font-container" aria-hidden="true">
              <Icon className="h-75" src={Login} />
            </div>
            <span
              className="pl-2"
              aria-hidden="true"
            >
              {formatMessage(messages.enterpriseTpaProviderSigninTitle, { providerName: provider.name })}
            </span>
          </Button>
        )}
        <div className="mb-4" />
        <Button
          id="other-ways-to-sign-in"
          name="other-ways-to-sign-in"
          variant="primary"
          state="Complete"
          className="w-100"
          onClick={redirectToLogin}
          onMouseDown={(e) => e.preventDefault()}
        >
          {formatMessage(messages.enterprisetpaLoginButtonText)}
        </Button>
      </div>
    );
  }
  return null;
};

EnterpriseSSO.propTypes = {
  provider: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    loginUrl: PropTypes.string,
    registerUrl: PropTypes.string,
  }),
};

export default EnterpriseSSO;
