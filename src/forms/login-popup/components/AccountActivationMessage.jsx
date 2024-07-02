import React, { useEffect, useRef } from 'react';

import { getConfig } from '@edx/frontend-platform';
import { FormattedMessage, useIntl } from '@edx/frontend-platform/i18n';
import { Alert } from '@openedx/paragon';
import { CheckCircle, Error } from '@openedx/paragon/icons';
import PropTypes from 'prop-types';

import { ACCOUNT_ACTIVATION_MESSAGE } from '../data/constants';
import messages from '../messages';

/**
 * Account activation component that holds account activation/confirmation banner logic.
 *
 * @param {string} messageType - The type of message either its success, info or error.
 *
 * @returns {JSX.Element} The rendered the account activation banner component.
 */
const AccountActivationMessage = ({ messageType = null }) => {
  const { formatMessage } = useIntl();

  const alertRef = useRef(null);
  const variant = messageType === ACCOUNT_ACTIVATION_MESSAGE.ERROR ? 'danger' : messageType;
  const iconMapping = {
    [ACCOUNT_ACTIVATION_MESSAGE.SUCCESS]: CheckCircle,
    [ACCOUNT_ACTIVATION_MESSAGE.ERROR]: Error,
  };

  let activationMessage;
  let heading;
  switch (messageType) {
    case ACCOUNT_ACTIVATION_MESSAGE.SUCCESS: {
      heading = formatMessage(messages.accountConfirmationSuccessMessageTitle);
      activationMessage = <span>{formatMessage(messages.accountConfirmationSuccessMessage)}</span>;
      break;
    }
    case ACCOUNT_ACTIVATION_MESSAGE.INFO: {
      activationMessage = formatMessage(messages.accountConfirmationInfoMessage);
      break;
    }
    case ACCOUNT_ACTIVATION_MESSAGE.ERROR: {
      const supportLink = (
        <Alert.Link href={`mailto:${getConfig().ACTIVATION_EMAIL_SUPPORT_LINK}`}>
          {formatMessage(messages.accountConfirmationSupportLink)}
        </Alert.Link>
      );

      heading = formatMessage(messages.accountConfirmationErrorMessageTitle);
      activationMessage = (
        <FormattedMessage
          id="account.activation.error.message"
          defaultMessage="Something went wrong, please {supportLink} to resolve this issue."
          description="Account activation error message"
          values={{ supportLink }}
        />
      );
      break;
    }
    default:
      break;
  }

  useEffect(() => {
    if (alertRef.current) {
      alertRef.current.focus();
    }
  }, []);

  return activationMessage ? (
    <Alert
      id="account-activation-message"
      className="mb-5"
      variant={variant}
      icon={iconMapping[messageType]}
      ref={alertRef}
      tabIndex="0"
    >
      {heading && <Alert.Heading>{heading}</Alert.Heading>}
      {activationMessage}
    </Alert>
  ) : null;
};

AccountActivationMessage.propTypes = {
  messageType: PropTypes.string,
};

export default AccountActivationMessage;
