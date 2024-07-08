import React, { forwardRef, useState } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Alert, Form, Icon } from '@openedx/paragon';
import { Close, Error } from '@openedx/paragon/icons';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import messages from './messages';
import validateEmail from './validator';
import { useDispatch, useSelector } from '../../../data/storeHooks';
import { clearRegistrationBackendError, fetchRealtimeValidations } from '../../registration-popup/data/reducers';
import getValidationMessage from '../../reset-password-popup/forgot-password/data/utils';
import './index.scss';
const EmailField = /*#__PURE__*/forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const {
    formatMessage
  } = useIntl();
  const {
    name,
    value,
    isRegistration = true,
    handleChange,
    floatingLabel,
    errorMessage = '',
    handleErrorChange = () => {},
    validateEmailFromBackend = true
  } = props;
  const validationApiRateLimited = useSelector(state => state.register?.validationApiRateLimited);
  const [emailSuggestion, setEmailSuggestion] = useState({});
  const handleOnBlur = e => {
    const {
      value: fieldValue
    } = e.target;
    if (isRegistration) {
      const {
        fieldError,
        suggestion
      } = validateEmail(fieldValue, formatMessage);
      setEmailSuggestion(suggestion);
      if (fieldError) {
        handleErrorChange('email', fieldError);
      } else if (!validationApiRateLimited && validateEmailFromBackend) {
        dispatch(fetchRealtimeValidations({
          email: fieldValue
        }));
      }
    } else {
      const error = getValidationMessage(fieldValue, formatMessage);
      handleErrorChange('email', error);
    }
  };
  const handleOnFocus = () => {
    handleErrorChange('email', '');
    dispatch(clearRegistrationBackendError('email'));
  };
  const handleSuggestionClick = event => {
    event.preventDefault();
    handleErrorChange('email', '');
    handleChange({
      target: {
        name: 'email',
        value: emailSuggestion.suggestion
      }
    });
    setEmailSuggestion({
      suggestion: '',
      type: ''
    });
  };
  const handleSuggestionClosed = () => setEmailSuggestion({
    suggestion: '',
    type: ''
  });
  const renderEmailFeedback = () => {
    if (emailSuggestion.type === 'error') {
      return /*#__PURE__*/React.createElement(Alert, {
        variant: "danger",
        className: "email-suggestion-alert-error mt-1",
        icon: Error
      }, /*#__PURE__*/React.createElement("span", {
        className: "email-suggestion__text"
      }, formatMessage(messages.didYouMeanAlertText), ' ', /*#__PURE__*/React.createElement(Alert.Link, {
        href: "#",
        name: "email",
        onClick: handleSuggestionClick
      }, emailSuggestion.suggestion), "?", /*#__PURE__*/React.createElement(Icon, {
        src: Close,
        className: "email-suggestion__close",
        onClick: handleSuggestionClosed,
        tabIndex: "0"
      })));
    }
    return /*#__PURE__*/React.createElement("span", {
      id: "email-warning",
      className: "small"
    }, formatMessage(messages.didYouMeanAlertText), ":", ' ', /*#__PURE__*/React.createElement(Alert.Link, {
      href: "#",
      name: "email",
      className: "email-suggestion-alert-warning",
      onClick: handleSuggestionClick
    }, emailSuggestion.suggestion), "?");
  };
  return /*#__PURE__*/React.createElement(Form.Group, {
    controlId: "email",
    className: "w-100 mb-4"
  }, /*#__PURE__*/React.createElement(Form.Control, {
    className: classNames('mr-0', {
      'yellow-border': emailSuggestion.type === 'warning' && isRegistration
    }),
    type: "email",
    name: name,
    value: value,
    onChange: handleChange,
    onBlur: handleOnBlur,
    onFocus: handleOnFocus,
    floatingLabel: floatingLabel,
    ref: ref
  }), errorMessage !== '' && /*#__PURE__*/React.createElement(Form.Control.Feedback, {
    key: "error",
    className: "form-text-size validation-error-margin",
    hasIcon: false,
    "feedback-for": props.name,
    type: "invalid"
  }, errorMessage), emailSuggestion.suggestion && isRegistration ? renderEmailFeedback() : null);
});
EmailField.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleErrorChange: PropTypes.func,
  floatingLabel: PropTypes.string.isRequired,
  errorMessage: PropTypes.string,
  isRegistration: PropTypes.bool,
  validateEmailFromBackend: PropTypes.bool
};
export default EmailField;
//# sourceMappingURL=index.js.map