import React, { forwardRef } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Form } from '@openedx/paragon';
import PropTypes from 'prop-types';
import messages from './messages';
import './index.scss';
/**
 * Text field component. It accepts following handler(s)
 * - handleChange for setting value on change
 * - handleFocus for clearing the error state
 *
 * It is responsible for
 * - setting value on change
 * - clearing error on focus
 */
const TextField = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    formatMessage
  } = useIntl();
  const {
    errorMessage,
    label,
    name,
    value,
    handleChange,
    handleBlur = null,
    handleFocus,
    autoComplete = ''
  } = props;
  return /*#__PURE__*/React.createElement(Form.Group, {
    controlId: name,
    className: "w-100 mb-4"
  }, /*#__PURE__*/React.createElement(Form.Control, {
    as: "input",
    type: "text",
    className: "mr-0",
    name: name,
    value: value,
    onChange: handleChange,
    onFocus: handleFocus,
    onBlur: handleBlur,
    autoComplete: autoComplete,
    floatingLabel: formatMessage(messages.fieldLabel, {
      label
    }),
    ref: ref
  }), errorMessage !== '' && /*#__PURE__*/React.createElement(Form.Control.Feedback, {
    key: "error",
    className: "form-text-size validation-error-margin",
    hasIcon: false,
    "feedback-for": name,
    type: "invalid"
  }, errorMessage));
});
TextField.propTypes = {
  errorMessage: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleFocus: PropTypes.func.isRequired,
  handleBlur: PropTypes.func,
  autoComplete: PropTypes.string
};
export default TextField;
//# sourceMappingURL=index.js.map