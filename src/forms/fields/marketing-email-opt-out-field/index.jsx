import React from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';
import { Form } from '@openedx/paragon';
import PropTypes from 'prop-types';

import messages from './messages';

/**
 * Marketing email opt in field component. It accepts following handler(s)
 * - handleChange for setting value change and
 *
 * It is responsible for
 * - setting value on change (true/false)
 */
const MarketingEmailOptInCheckbox = (props) => {
  const { formatMessage } = useIntl();
  const { name, value, handleChange } = props;

  return (
    <Form.Group controlId="marketingEmailsOptIn" className="mb-4">
      <Form.Checkbox
        name={name}
        className="text-gray-800"
        checked={!!value}
        onChange={handleChange}
      >
        {formatMessage(messages.registrationFormMarketingOptInLabel)}
      </Form.Checkbox>
    </Form.Group>
  );
};

MarketingEmailOptInCheckbox.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default MarketingEmailOptInCheckbox;
