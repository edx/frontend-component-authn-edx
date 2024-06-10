import React, { forwardRef, useState } from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Form, Icon, IconButton, OverlayTrigger, Tooltip, useToggle,
} from '@openedx/paragon';
import {
  Check, Remove, Visibility, VisibilityOff,
} from '@openedx/paragon/icons';
import PropTypes from 'prop-types';

import messages from './messages';
import validatePasswordField from './validator';
import { useDispatch, useSelector } from '../../../data/storeHooks';
import { LETTER_REGEX, NUMBER_REGEX } from '../../registration-popup/data/constants';
import { clearRegistrationBackendError, fetchRealtimeValidations } from '../../registration-popup/data/reducers';
import './index.scss';

/**
 * Password field component. It accepts following handler(s)
 * - handleChange for setting value change
 * - handleFocus for clearing the error state
 *
 * It is responsible for
 * - setting value on change
 * - clearing the error state
 */
const PasswordField = forwardRef((props, ref) => {
  const { formatMessage } = useIntl();

  const dispatch = useDispatch();

  const validationApiRateLimited = useSelector(state => state.register?.validationApiRateLimited);
  const {
    errorMessage = '',
    name,
    dataTestId,
    value,
    handleChange,
    handleErrorChange = null,
    floatingLabel,
    handleBlur = () => {},
    showPasswordTooltip = true,
  } = props;

  const [isPasswordHidden, setHiddenTrue, setHiddenFalse] = useToggle(true);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

  const handleOnBlur = (e) => {
    const { name: fieldName, value: fieldValue } = e.target;
    if (fieldName === props.name && e.relatedTarget?.name === 'passwordIcon') {
      return; // Do not run validations on password icon click
    }

    let passwordValue = fieldValue;
    if (fieldName === 'passwordIcon') {
      // To validate actual password value when onBlur is triggered by focusing out the password icon
      passwordValue = props.value;
    }

    if (handleBlur) {
      handleBlur({
        target: {
          name: props.name,
          value: passwordValue,
        },
      });
    }

    setShowPasswordRequirements(showPasswordTooltip && false);
    if (handleErrorChange) { // If rendering from register page
      const fieldError = validatePasswordField(passwordValue, formatMessage);
      if (fieldError) {
        handleErrorChange('password', fieldError);
      } else if (!validationApiRateLimited) {
        dispatch(fetchRealtimeValidations({ password: passwordValue }));
      }
    }
  };

  const handleFocus = (e) => {
    if (e.target?.name === 'passwordIcon') {
      return; // Do not clear error on password icon focus
    }

    if (props.handleFocus) {
      props.handleFocus(e);
    }
    if (handleErrorChange) {
      handleErrorChange('password', '');
      dispatch(clearRegistrationBackendError('password'));
    }
    setShowPasswordRequirements(showPasswordTooltip && true);
  };

  const HideButton = (
    <IconButton
      name="passwordIcon"
      src={VisibilityOff}
      onFocus={handleFocus}
      onBlur={handleOnBlur}
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
      onFocus={handleFocus}
      onBlur={handleOnBlur}
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
    <Form.Group key={name} controlId="password" className="w-100 mb-4">
      <OverlayTrigger key="tooltip" placement={placement} overlay={tooltip} show={showPasswordRequirements}>
        <Form.Control
          ref={ref}
          as="input"
          data-testid={dataTestId}
          className="mr-0"
          type={isPasswordHidden ? 'password' : 'text'}
          name={name}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleOnBlur}
          autoComplete="current-password"
          trailingElement={isPasswordHidden ? ShowButton : HideButton}
          floatingLabel={floatingLabel}
        />
      </OverlayTrigger>
      {errorMessage !== '' && (
        <Form.Control.Feedback
          key="error"
          className="form-text-size validation-error-margin"
          hasIcon={false}
          feedback-for={name}
          type="invalid"
        >
          {errorMessage}
        </Form.Control.Feedback>
      )}
      {errorMessage && showPasswordTooltip && (
        <>
          <Form.Control.Feedback
            key="letter-check"
            className="form-text-size"
            hasIcon
            feedback-for={name}
            type={LETTER_REGEX.test(props.value) ? 'valid' : 'invalid'}
          >
            {formatMessage(messages.oneLetter)}
          </Form.Control.Feedback>
          <Form.Control.Feedback
            key="number-check"
            className="form-text-size"
            hasIcon
            feedback-for={name}
            type={NUMBER_REGEX.test(props.value) ? 'valid' : 'invalid'}
          >
            {formatMessage(messages.oneNumber)}
          </Form.Control.Feedback>
          <Form.Control.Feedback
            key="characters-check"
            className="form-text-size"
            hasIcon
            feedback-for={name}
            type={props.value.length >= 8 ? 'valid' : 'invalid'}
          >
            {formatMessage(messages.eightCharacters)}
          </Form.Control.Feedback>
        </>
      )}
    </Form.Group>
  );
});

PasswordField.propTypes = {
  name: PropTypes.string.isRequired,
  dataTestId: PropTypes.string,
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func,
  handleErrorChange: PropTypes.func,
  handleFocus: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  floatingLabel: PropTypes.string.isRequired,
  showPasswordTooltip: PropTypes.bool,
};

export default PasswordField;
