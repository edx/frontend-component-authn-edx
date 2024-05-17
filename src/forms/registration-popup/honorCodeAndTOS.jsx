import React from 'react';

import { getConfig } from '@edx/frontend-platform';
import { FormattedMessage, useIntl } from '@edx/frontend-platform/i18n';
import { Hyperlink } from '@openedx/paragon';

import messages from './messages';

const HonorCodeAndPrivacyPolicyMessage = () => {
  const { formatMessage } = useIntl();

  return (
    <FormattedMessage
      id="register.page.terms.of.service.and.honor.code"
      defaultMessage="By creating an account, you agree to the {TOSAndHonorCode} and you acknowledge
                      that edX and each Member process your personal data in accordance with the
                      {privacyPolicy}."
      description="Text that appears on registration form stating edX's honor code and privacy policy"
      values={{
        TOSAndHonorCode: (
          <Hyperlink
            className="text-white registration-form__tos-and-privacy-policy__link"
            destination={getConfig().AUTHN_TOS_AND_HONOR_CODE_LINK}
            target="_blank"
            showLaunchIcon={false}
            isInline
          >
            {formatMessage(messages.registrationFormTermsOfServiceAndHonorCodeLabel)}
          </Hyperlink>
        ),
        privacyPolicy: (
          <Hyperlink
            className="text-white registration-form__tos-and-privacy-policy__link"
            destination={getConfig().AUTHN_PRIVACY_POLICY_LINK}
            target="_blank"
            showLaunchIcon={false}
            isInline
          >
            {formatMessage(messages.registrationFormPrivacyPolicyLabel)}
          </Hyperlink>
        ),
      }}
    />
  );
};

export default HonorCodeAndPrivacyPolicyMessage;
