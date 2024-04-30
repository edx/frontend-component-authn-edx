import React from 'react';

import { Form } from '@openedx/paragon';
import PropTypes from 'prop-types';

/**
 * Email field component. It accepts following handler(s)
 * - handleChange for setting value change and
 *
 * It is responsible for
 * - setting value on change
 */
const EmailField = (props) => {
  const {
    name, value, handleChange, floatingLabel, errorMessage,
  } = props;

  return (
    <Form.Group controlId="email" className="w-100 mb-4">
      <Form.Control
        className="mr-0"
        type="email"
        name={name}
        value={value}
        onChange={handleChange}
        floatingLabel={floatingLabel}
      />
      {errorMessage !== '' && (
        <Form.Control.Feedback key="error" className="form-text-size" hasIcon={false} feedback-for={props.name} type="invalid">
          {errorMessage}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

EmailField.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  floatingLabel: PropTypes.string.isRequired,
  errorMessage: PropTypes.string,
};

EmailField.defaultProps = {
  errorMessage: '',
};

export default EmailField;
