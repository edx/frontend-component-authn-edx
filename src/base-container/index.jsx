import React from 'react';

import { ModalDialog } from '@openedx/paragon';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { FORGOT_PASSWORD_FORM } from '../data/constants';
import { useDispatch, useSelector } from '../data/storeHooks';
import { deleteQueryParams } from '../data/utils';
import { NUDGE_PASSWORD_CHANGE } from '../forms/login-popup/data/constants';
import { loginErrorClear } from '../forms/login-popup/data/reducers';
import { clearAllRegistrationErrors } from '../forms/registration-popup/data/reducers';
import { forgotPasswordClearStatus } from '../forms/reset-password-popup/forgot-password/data/reducers';
import { setCurrentOpenedForm } from '../onboarding-component/data/reducers';

import './index.scss';

/**
 * Base component for registration or login form modals.
 *
 * @param {boolean} isOpen - Required. Whether to open the modal window.
 * @param {function} close - Required. Is used to the modal window.
 * @param {React.node} children - Required. The login or registration form.
 * @param {boolean} hasCloseButton - Optional. Denotes whether modal should have close button or not.
 * @param {string} size - Optional. Specifies size of modal.
 * @param currentForm - Denotes the current opened form
 *
 * @returns {JSX.Element} The rendered login or registration form modal.
 */
const BaseContainer = ({
  children = null,
  close,
  hasCloseButton = true,
  isOpen,
  size = 'lg',
  currentForm = null,
}) => {
  const dispatch = useDispatch();

  const loginErrorResult = useSelector(state => state.login.loginError);
  const loginErrorCode = useSelector(state => state.login.loginError?.errorCode);

  const handleOnClose = () => {
    if (loginErrorCode === NUDGE_PASSWORD_CHANGE
      && loginErrorResult.redirectUrl
      && currentForm === FORGOT_PASSWORD_FORM) {
      window.location.href = loginErrorResult.redirectUrl;
    }
    deleteQueryParams(['authMode', 'tpa_hint', 'password_reset_token', 'track']);
    dispatch(forgotPasswordClearStatus());
    dispatch(loginErrorClear());
    dispatch(clearAllRegistrationErrors());
    dispatch(setCurrentOpenedForm(null));
    close();
  };

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={handleOnClose}
      size={size}
      isBlocking
      variant="default"
      title="onboarding-component"
      className={classNames(
        'bg-light-200 onboarding-component__modal',
        {
          'onboarding-component__modal-full-height': size === 'fullscreen',
        },
      )}
      hasCloseButton={hasCloseButton}
    >
      <ModalDialog.Body className="modal-body-container p-0">
        <div className="d-flex w-100 h-100 justify-content-center overflow-hidden">
          {children}
        </div>
      </ModalDialog.Body>
    </ModalDialog>
  );
};

BaseContainer.propTypes = {
  children: PropTypes.node,
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  size: PropTypes.string,
  hasCloseButton: PropTypes.bool,
  currentForm: PropTypes.string,
};

export default BaseContainer;
