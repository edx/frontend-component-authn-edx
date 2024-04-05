import React from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Form, Icon, IconButton, useToggle,
} from '@openedx/paragon';
import { Visibility, VisibilityOff } from '@openedx/paragon/icons';
import PropTypes from 'prop-types';

import messages from './messages';

/**
 * Password field component. It accepts following handler(s)
 * - handleChange for setting value change and
 *
 * It is responsible for
 * - setting value on change
 */
const PasswordField = (props) => {
  const { formatMessage } = useIntl();
  const { name, value, handleChange } = props;

  const [isPasswordHidden, setHiddenTrue, setHiddenFalse] = useToggle(true);

  const HideButton = (
    <IconButton
      name="passwordIcon"
      src={VisibilityOff}
      iconAs={Icon}
      onClick={setHiddenTrue}
      size="sm"
      variant="secondary"
      alt={formatMessage(messages.hidePasswordAlt)}
    />
  );

  const ShowButton = (
    <IconButton
      name="passwordIcon"
      src={Visibility}
      iconAs={Icon}
      onClick={setHiddenFalse}
      size="sm"
      variant="secondary"
      alt={formatMessage(messages.showPasswordAlt)}
    />
  );

  return (
    <Form.Group controlId="password" className="w-100 mb-4">
      <Form.Control
        type={isPasswordHidden ? 'password' : 'text'}
        name={name}
        value={value}
        onChange={handleChange}
        trailingElement={isPasswordHidden ? ShowButton : HideButton}
        floatingLabel={formatMessage(messages.registrationFormPasswordFieldLabel)}
      />
    </Form.Group>
  );
};

PasswordField.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default PasswordField;
