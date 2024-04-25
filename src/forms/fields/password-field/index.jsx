import React from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Form, Icon, IconButton, OverlayTrigger, Tooltip, useToggle,
} from '@openedx/paragon';
import {
  Check, Remove, Visibility, VisibilityOff,
} from '@openedx/paragon/icons';
import PropTypes from 'prop-types';

import messages from './messages';
import { LETTER_REGEX, NUMBER_REGEX } from '../../registration-popup/data/constants';

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

  const placement = 'bottom-start';
  const tooltip = (
    <Tooltip id={`password-requirement-${placement}`}>
      <span id="letter-check" className="d-flex align-items-center">
        {LETTER_REGEX.test(props.value)
          ? <Icon className="text-success mr-1" src={Check} />
          : <Icon className="mr-1 text-light-700" src={Remove} />}
        {formatMessage(messages.oneLetter)}
      </span>
      <span id="number-check" className="d-flex align-items-center">
        {NUMBER_REGEX.test(props.value)
          ? <Icon className="text-success mr-1" src={Check} />
          : <Icon className="mr-1 text-light-700" src={Remove} />}
        {formatMessage(messages.oneNumber)}
      </span>
      <span id="characters-check" className="d-flex align-items-center">
        {props.value.length >= 8
          ? <Icon className="text-success mr-1" src={Check} />
          : <Icon className="mr-1 text-light-700" src={Remove} />}
        {formatMessage(messages.eightCharcters)}
      </span>
    </Tooltip>
  );

  return (
    <Form.Group controlId="password" className="w-100 mb-4">
      <OverlayTrigger key="tooltip" placement={placement} overlay={tooltip} show>
        <Form.Control
          type={isPasswordHidden ? 'password' : 'text'}
          name={name}
          value={value}
          onChange={handleChange}
          trailingElement={isPasswordHidden ? ShowButton : HideButton}
          floatingLabel={formatMessage(messages.registrationFormPasswordFieldLabel)}
        />
      </OverlayTrigger>
    </Form.Group>
  );
};

PasswordField.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default PasswordField;
