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
 * - handleChange for setting value change
 * - handleFocus for clearing the error state
 *
 * It is responsible for
 * - setting value on change
 * - clearing the error state
 */
const PasswordField = (props) => {
  const { formatMessage } = useIntl();
  const {
    errorMessage,
    name,
    value,
    handleChange,
    handleFocus,
    floatingLabel,
    showPasswordTooltip,
  } = props;

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
        {formatMessage(messages.eightCharacters)}
      </span>
    </Tooltip>
  );

  return (
    <Form.Group controlId="password" className="w-100 mb-4">
      <OverlayTrigger key="tooltip" placement={placement} overlay={tooltip} show={showPasswordTooltip}>
        <Form.Control
          as="input"
          className="mr-0"
          type={isPasswordHidden ? 'password' : 'text'}
          name={name}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          trailingElement={isPasswordHidden ? ShowButton : HideButton}
          floatingLabel={floatingLabel}
        />
      </OverlayTrigger>
      {errorMessage !== '' && (
        <Form.Control.Feedback
          key="error"
          className="form-text-size"
          hasIcon={false}
          feedback-for={name}
          type="invalid"
        >
          {errorMessage}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

PasswordField.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleFocus: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  floatingLabel: PropTypes.string.isRequired,
  showPasswordTooltip: PropTypes.bool,
};

PasswordField.defaultProps = {
  errorMessage: '',
  showPasswordTooltip: true,
};

export default PasswordField;
