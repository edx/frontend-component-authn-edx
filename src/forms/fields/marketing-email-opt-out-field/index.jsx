import React from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';
import { Form } from '@openedx/paragon';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import messages from './messages';
import './index.scss';

/**
 * Marketing email opt in field component. It accepts following handler(s)
 * - handleChange for setting value change and
 *
 * It is responsible for
 * - setting value on change (true/false)
 */
const MarketingEmailOptInCheckbox = (props) => {
  const { formatMessage } = useIntl();
  const {
    name, value, handleChange, isExtraSmall,
  } = props;

  return (
    <Form.Group controlId="marketingEmailsOptIn" className="mb-4">
      <Form.Checkbox
        name={name}
        className={classNames(
          'text-gray-800',
          {
            marketing_email_opt: isExtraSmall,
          },
        )}
        checked={!!value}
        onChange={handleChange}
      />
      <Form.Label className="registration-form__marketing_opt-in-label">
        {formatMessage(messages.registrationFormMarketingOptInLabel)}
      </Form.Label>
    </Form.Group>
  );
};

MarketingEmailOptInCheckbox.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  isExtraSmall: PropTypes.bool.isRequired,
};

export default MarketingEmailOptInCheckbox;
