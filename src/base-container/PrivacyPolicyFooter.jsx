import React from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';

import messages from './messages';

const PrivacyPolicy = () => {
  const { formatMessage } = useIntl();
  return (
    <p className="bg-dark-500 p-4 text-light-100 privacy-policy-content">
      {formatMessage(messages.privacyPolicyLabel)}
    </p>
  );
};
export default PrivacyPolicy;
