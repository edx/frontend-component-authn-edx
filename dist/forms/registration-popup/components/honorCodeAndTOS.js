import React from 'react';
import { getConfig } from '@edx/frontend-platform';
import { FormattedMessage, useIntl } from '@edx/frontend-platform/i18n';
import { Hyperlink } from '@openedx/paragon';
import messages from '../messages';
const HonorCodeAndPrivacyPolicyMessage = () => {
  const {
    formatMessage
  } = useIntl();
  return /*#__PURE__*/React.createElement(FormattedMessage, {
    id: "register.page.terms.of.service.and.honor.code",
    defaultMessage: "By creating an account, you agree to the {TOSAndHonorCode} and you acknowledge that edX and each Member process your personal data in accordance with the {privacyPolicy}.",
    description: "Text that appears on registration form stating edX's honor code and privacy policy",
    values: {
      TOSAndHonorCode: /*#__PURE__*/React.createElement(Hyperlink, {
        className: "text-white registration-form__tos-and-privacy-policy__link",
        destination: getConfig().TOS_AND_HONOR_CODE,
        target: "_blank",
        showLaunchIcon: false,
        isInline: true
      }, formatMessage(messages.registrationFormTermsOfServiceAndHonorCodeLabel)),
      privacyPolicy: /*#__PURE__*/React.createElement(Hyperlink, {
        className: "text-white registration-form__tos-and-privacy-policy__link",
        destination: getConfig().PRIVACY_POLICY,
        target: "_blank",
        showLaunchIcon: false,
        isInline: true
      }, formatMessage(messages.registrationFormPrivacyPolicyLabel))
    }
  });
};
export default HonorCodeAndPrivacyPolicyMessage;
//# sourceMappingURL=honorCodeAndTOS.js.map