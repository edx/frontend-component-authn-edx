import React from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';
import { Form } from '@openedx/paragon';
import PropTypes from 'prop-types';

import messages from './messages';

/**
 * Email field component. It accepts following handler(s)
 * - handleChange for setting value change and
 *
 * It is responsible for
 * - setting value on change
 */
const EmailField = (props) => {
  const { formatMessage } = useIntl();
  const { name, value, handleChange } = props;

  return (
    <Form.Group controlId="email" className="w-100 mb-4">
      <Form.Control
        type="email"
        name={name}
        value={value}
        onChange={handleChange}
        floatingLabel={formatMessage(messages.registrationFormEmailFieldLabel)}
      />
    </Form.Group>
  );
};

EmailField.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default EmailField;
