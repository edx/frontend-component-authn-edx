function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React, { useEffect, useState } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { FormAutosuggest, FormAutosuggestOption, FormControlFeedback, FormLabel } from '@openedx/paragon';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import messages from '../../progressive-profiling-popup/messages';
import './index.scss';

/**
 * Auto Suggest field wrapper. It accepts following handlers
 * - handleChange for setting value on change
 * - onFocusHandler for clearing error state
 * - onBlurHandler for setting error on null value
 *
 * It is responsible for
 * - Auto populating progressive profiling fields
 * - setting value on change and selection
 */
const AutoSuggestField = props => {
  const {
    name,
    label = '',
    placeholder,
    feedBack = '',
    errorMessage = '',
    options,
    selectedOption = {
      value: '',
      displayText: ''
    },
    leadingElement = '',
    onChangeHandler,
    onFocusHandler = () => {},
    onBlurHandler = () => {}
  } = props;
  const {
    formatMessage
  } = useIntl();
  const [value, setValue] = useState({});
  useEffect(() => {
    if (name === 'country' && selectedOption.value !== '' && !value.country) {
      setValue(_objectSpread(_objectSpread({}, value), {}, {
        [name]: {
          userProvidedText: selectedOption?.displayText,
          selectionValue: selectedOption?.value,
          selectionId: selectedOption?.value
        }
      }));
    }
  }, [name, selectedOption, value]);
  const handleOnChange = (e, fieldName) => {
    setValue(_objectSpread(_objectSpread({}, value), {}, {
      [fieldName]: e
    }));
    onChangeHandler({
      target: {
        name,
        value: e.selectionId,
        text: e.userProvidedText
      }
    });
  };
  const getFieldOptions = (fieldName, fieldOptions) => fieldOptions.map(option => {
    if (fieldName === 'country') {
      return /*#__PURE__*/React.createElement(FormAutosuggestOption, {
        id: option.code,
        key: option.code
      }, option.name);
    }
    return /*#__PURE__*/React.createElement(FormAutosuggestOption, {
      id: option.label,
      key: option.label
    }, messages[`${fieldName}.option.${option.label}`] ? formatMessage(messages[`${fieldName}.option.${option.label}`]) : option.label);
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "mb-4"
  }, name !== 'country' && /*#__PURE__*/React.createElement(FormLabel, null, label), /*#__PURE__*/React.createElement(FormAutosuggest, {
    placeholder: placeholder,
    "aria-label": "form autosuggest",
    name: name,
    value: value[name] || {},
    leadingElement: leadingElement,
    className: classNames({
      'form-field-error': errorMessage
    }),
    onChange: e => {
      handleOnChange(e, name);
    },
    onFocus: () => {
      onFocusHandler({
        target: {
          name,
          value: ''
        }
      });
    },
    onBlur: () => {
      onBlurHandler({
        target: {
          name,
          value: value[name] ? value[name].selectionId : ''
        }
      });
    }
  }, getFieldOptions(name, options)), (errorMessage !== '' || feedBack !== '') && /*#__PURE__*/React.createElement(FormControlFeedback, {
    key: errorMessage ? 'error' : 'feedback',
    hasIcon: false,
    "feedback-for": name,
    type: errorMessage ? 'invalid' : 'valid'
  }, errorMessage || feedBack));
};
AutoSuggestField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    code: PropTypes.string,
    displayText: PropTypes.string
  })).isRequired,
  errorMessage: PropTypes.string,
  feedBack: PropTypes.string,
  leadingElement: PropTypes.node,
  onChangeHandler: PropTypes.func.isRequired,
  onFocusHandler: PropTypes.func,
  onBlurHandler: PropTypes.func,
  selectedOption: PropTypes.shape({
    displayText: PropTypes.string,
    value: PropTypes.string
  })
};
export default AutoSuggestField;
//# sourceMappingURL=index.js.map