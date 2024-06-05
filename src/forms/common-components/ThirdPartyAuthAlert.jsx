import React from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';
import { Alert } from '@openedx/paragon';
import PropTypes from 'prop-types';

import messages from './messages';
import { LOGIN_FORM } from '../../data/constants';

/**
 * Component for displaying an alert related to third-party authentication.
 *
 * @param {string} currentProvider - The name of the current authentication provider.
 * @param {string} referrer - The referrer (either 'login' or 'register') to determine the message and styling.
 *
 * @returns {JSX.Element} The rendered alert component.
 */
const ThirdPartyAuthAlert = ({
  currentProvider = '',
  referrer = LOGIN_FORM,
}) => {
  const { formatMessage } = useIntl();
  const platformName = 'edX';

  if (!currentProvider) {
    return null;
  }

  const message = referrer === LOGIN_FORM
    ? formatMessage(messages.loginTpaAccountNotLinked, { currentProvider, platformName })
    : formatMessage(messages.registerTpaAccountNotLinked, { currentProvider, platformName });
  const alertClassName = referrer === LOGIN_FORM ? 'alert-warning mt-n2 mb-5' : 'alert-success mt-n2 mb-5';

  return (
    <Alert id="tpa-alert" className={alertClassName}>
      <p>{ message }</p>
    </Alert>
  );
};

ThirdPartyAuthAlert.propTypes = {
  currentProvider: PropTypes.string,
  referrer: PropTypes.string,
};

export default ThirdPartyAuthAlert;
