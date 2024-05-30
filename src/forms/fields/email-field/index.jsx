import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useIntl } from '@edx/frontend-platform/i18n';
import { Alert, Form, Icon } from '@openedx/paragon';
import { Close, Error } from '@openedx/paragon/icons';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import messages from './messages';
import validateEmail from './validator';
import { clearRegistrationBackendError, fetchRealtimeValidations } from '../../registration-popup/data/reducers';

import './index.scss';

/**
 * Email field component. It accepts following handler(s)
 * - handleChange for setting value change and
 *
 * It is responsible for
 * - setting value on change
 */
const EmailField = (props) => {
  const dispatch = useDispatch();

  const { formatMessage } = useIntl();
  const {
    name, value, isRegistration,
    handleChange, floatingLabel, errorMessage, handleErrorChange,
  } = props;

  const validationApiRateLimited = useSelector(state => state.register?.validationApiRateLimited);

  const [emailSuggestion, setEmailSuggestion] = useState({ });
  const handleOnBlur = (e) => {
    const { value: fieldValue } = e.target;
    const { fieldError, suggestion } = validateEmail(fieldValue, formatMessage);

    setEmailSuggestion(suggestion);

    if (fieldError) {
      handleErrorChange('email', fieldError);
    } else if (!validationApiRateLimited) {
      dispatch(fetchRealtimeValidations({ email: fieldValue }));
    }
  };

  const handleOnFocus = () => {
    handleErrorChange('email', '');
    dispatch(clearRegistrationBackendError('email'));
  };

  const handleSuggestionClick = (event) => {
    event.preventDefault();
    handleErrorChange('email', '');
    handleChange({ target: { name: 'email', value: emailSuggestion.suggestion } });
    setEmailSuggestion({ suggestion: '', type: '' });
  };

  const handleSuggestionClosed = () => setEmailSuggestion({ suggestion: '', type: '' });

  const renderEmailFeedback = () => {
    if (emailSuggestion.type === 'error') {
      return (
        <Alert variant="danger" className="email-suggestion-alert-error mt-1" icon={Error}>
          <span className="email-suggestion__text">
            {formatMessage(messages.didYouMeanAlertText)}{' '}
            <Alert.Link
              href="#"
              name="email"
              onClick={handleSuggestionClick}
            >
              {emailSuggestion.suggestion}
            </Alert.Link>?
            <Icon src={Close} className="email-suggestion__close" onClick={handleSuggestionClosed} tabIndex="0" />
          </span>
        </Alert>
      );
    }
    return (
      <span id="email-warning" className="small">
        {formatMessage(messages.didYouMeanAlertText)}:{' '}
        <Alert.Link
          href="#"
          name="email"
          className="email-suggestion-alert-warning"
          onClick={handleSuggestionClick}
        >
          {emailSuggestion.suggestion}
        </Alert.Link>?
      </span>
    );
  };

  return (
    <Form.Group
      controlId="email"
      className="w-100 mb-4"
    >
      <Form.Control
        className={classNames(
          'mr-0',
          {
            'yellow-border': emailSuggestion.type === 'warning' && isRegistration,
          },
        )}
        type="email"
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={handleOnBlur}
        onFocus={handleOnFocus}
        floatingLabel={floatingLabel}
      />

      {errorMessage !== '' && (
        <Form.Control.Feedback key="error" className="form-text-size validation-error-margin" hasIcon={false} feedback-for={props.name} type="invalid">
          {errorMessage}
        </Form.Control.Feedback>
      )}
      {emailSuggestion.suggestion && isRegistration ? renderEmailFeedback() : null}
    </Form.Group>
  );
};

EmailField.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleErrorChange: PropTypes.func,
  floatingLabel: PropTypes.string.isRequired,
  errorMessage: PropTypes.string,
  isRegistration: PropTypes.bool,
};

EmailField.defaultProps = {
  errorMessage: '',
  isRegistration: true,
  handleErrorChange: () => {},
};

export default EmailField;
