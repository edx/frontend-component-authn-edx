import React from 'react';
import { useDispatch } from 'react-redux';

import { useIntl } from '@edx/frontend-platform/i18n';
import PropTypes from 'prop-types';

import validateName from './validator';
import { clearRegistrationBackendError } from '../../registration-popup/data/reducers';
import TextField from '../text-field';

/**
 * Name field wrapper. It accepts following handlers
 * - handleChange for setting value change and
 * - handleErrorChange for setting error
 *
 * It is responsible for
 * - Performing name field validations
 * - Clearing error on focus
 * - Setting value on change
 */
const NameField = (props) => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();

  const {
    handleErrorChange,
  } = props;

  const handleOnBlur = (e) => {
    const { value } = e.target;

    const fieldError = validateName(value, formatMessage);
    if (fieldError) {
      handleErrorChange('name', fieldError);
    }
  };

  const handleOnFocus = () => {
    handleErrorChange('name', '');
    dispatch(clearRegistrationBackendError('name'));
  };

  return (
    <TextField
      {...props}
      handleBlur={handleOnBlur}
      handleFocus={handleOnFocus}
    />
  );
};

NameField.defaultProps = {
  errorMessage: '',
};

NameField.propTypes = {
  errorMessage: PropTypes.string,
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleErrorChange: PropTypes.func.isRequired,
};

export default NameField;
