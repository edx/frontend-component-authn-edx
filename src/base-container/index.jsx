import React from 'react';

import { ModalDialog } from '@openedx/paragon';
import PropTypes from 'prop-types';

import { deleteQueryParams } from '../data/utils';
import './index.scss';

/**
 * Base component for registration or login form modals.
 *
 * @param {boolean} isOpen - Required. Whether to open the modal window.
 * @param {function} close - Required. Is used to the modal window.
 * @param {React.node} children - Required. The login or registration form.
 * @param {boolean} hasCloseButton - Optional. Denotes whether modal should have close button or not.
 * @param {string} size - Optional. Specifies size of modal.
 *
 * @returns {JSX.Element} The rendered login or registration form modal.
 */
const BaseContainer = ({
  children,
  close,
  hasCloseButton = true,
  isOpen,
  size = 'lg',
}) => {
  const handleOnClose = () => {
    deleteQueryParams(['authMode', 'tpa_hint']);
    close();
  };

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={handleOnClose}
      size={size}
      variant="default"
      title="authn-component"
      className="bg-light-200 authn-component__modal"
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
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  size: PropTypes.string,
  hasCloseButton: PropTypes.bool,
};

export default BaseContainer;
