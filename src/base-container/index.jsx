import React from 'react';

import { ModalDialog } from '@openedx/paragon';
import PropTypes from 'prop-types';

import './index.scss';

/**
 * Base component for registration or login form modals.
 *
 * @param {boolean} isOpen - Required. Whether to open the modal window.
 * @param {function} close - Required. Is used to the modal window.
 * @param {React.node} children - Required. The login or registration form.
 *
 * @returns {JSX.Element} The rendered login or registration form modal.
 */
const BaseContainer = ({
  children, close, hasCloseButton, isOpen, size,
}) => (
  <ModalDialog
    isOpen={isOpen}
    onClose={close}
    size={size}
    variant="default"
    title="authn-component"
    className="bg-light-200 authn-component__modal"
    hasCloseButton={hasCloseButton}
  >
    <ModalDialog.Body className="modal-body-container p-0">
      <div className="d-flex flex-column w-100 h-100 justify-content-center overflow-hidden">
        {children}
      </div>
    </ModalDialog.Body>
  </ModalDialog>
);

BaseContainer.propTypes = {
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  size: PropTypes.string,
  hasCloseButton: PropTypes.bool,
};

BaseContainer.defaultProps = {
  size: 'lg',
  hasCloseButton: true,
};

export default BaseContainer;
