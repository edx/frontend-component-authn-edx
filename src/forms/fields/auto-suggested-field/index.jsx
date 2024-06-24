import React, { useEffect, useState } from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';
import {
  FormAutosuggest,
  FormAutosuggestOption,
  FormControlFeedback,
  FormLabel,
} from '@openedx/paragon';
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
const AutoSuggestField = (props) => {
  const {
    name,
    label = '',
    placeholder,
    feedBack = '',
    errorMessage = '',
    options,
    selectedOption = {
      value: '',
      displayText: '',
    },
    leadingElement = '',
    onChangeHandler,
    onFocusHandler = () => {},
    onBlurHandler = () => {},
  } = props;
  const { formatMessage } = useIntl();
  const [value, setValue] = useState({});

  useEffect(() => {
    if (name === 'country'
      && selectedOption.value !== ''
      && !value.country
    ) {
      setValue({
        ...value,
        [name]: {
          userProvidedText: selectedOption?.displayText,
          selectionValue: selectedOption?.value,
          selectionId: selectedOption?.value,
        },
      });
    }
  }, [name, selectedOption, value]);

  const handleOnChange = (e, fieldName) => {
    setValue({
      ...value,
      [fieldName]: e,
    });
    onChangeHandler({ target: { name, value: e.selectionId, text: e.userProvidedText } });
  };

  const getFieldOptions = (fieldName, fieldOptions) => fieldOptions.map(option => {
    if (fieldName === 'country') {
      return (
        <FormAutosuggestOption id={option.code} key={option.code}>{option.name}</FormAutosuggestOption>
      );
    }
    return (
      <FormAutosuggestOption id={option.label} key={option.label}>
        {
          messages[`${fieldName}.option.${option.label}`]
            ? formatMessage(messages[`${fieldName}.option.${option.label}`])
            : option.label
        }
      </FormAutosuggestOption>
    );
  });

  return (
    <div className="mb-4">
      {name !== 'country' && <FormLabel>{label}</FormLabel>}
      <FormAutosuggest
        placeholder={placeholder}
        aria-label="form autosuggest"
        name={name}
        value={value[name] || {}}
        leadingElement={leadingElement}
        className={classNames({ 'form-field-error': errorMessage })}
        onChange={(e) => { handleOnChange(e, name); }}
        onFocus={() => { onFocusHandler({ target: { name, value: '' } }); }}
        onBlur={() => { onBlurHandler({ target: { name, value: value[name] ? value[name].selectionId : '' } }); }}
      >
        {getFieldOptions(name, options)}
      </FormAutosuggest>
      {(errorMessage !== '' || feedBack !== '') && (
        <FormControlFeedback
          key={errorMessage ? 'error' : 'feedback'}
          hasIcon={false}
          feedback-for={name}
          type={errorMessage ? 'invalid' : 'valid'}
        >
          {errorMessage || feedBack}
        </FormControlFeedback>
      )}
    </div>
  );
};

AutoSuggestField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string,
      displayText: PropTypes.string,
    }),
  ).isRequired,
  errorMessage: PropTypes.string,
  feedBack: PropTypes.string,
  leadingElement: PropTypes.node,
  onChangeHandler: PropTypes.func.isRequired,
  onFocusHandler: PropTypes.func,
  onBlurHandler: PropTypes.func,
  selectedOption: PropTypes.shape({
    displayText: PropTypes.string,
    value: PropTypes.string,
  }),
};

export default AutoSuggestField;
