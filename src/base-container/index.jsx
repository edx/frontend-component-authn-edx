import React from 'react';

import { ModalDialog } from '@openedx/paragon';
import PropTypes from 'prop-types';

import LargeLayout from './layout/LargeLayout';
import PrivacyPolicy from './PrivacyPolicyFooter';
import './index.scss';

const BaseContainer = ({
  children, open, onClose, isPrivacyPolicy,
}) => (
  <ModalDialog
    isOpen={open}
    onClose={onClose}
    size="fullscreen"
    variant="default"
    hasCloseButton
  >
    <ModalDialog.Body className="modal-body-container overflow-hidden">
      <div className="modal-body-content-layout">
        <div className="w-50 d-flex">
          {children}
        </div>
        <LargeLayout>
          <div className="w-100 h-100 bg-dark-500" />
        </LargeLayout>
      </div>
    </ModalDialog.Body>
    <ModalDialog.Footer className="modal-footer-content">
      {isPrivacyPolicy && (<PrivacyPolicy />)}
    </ModalDialog.Footer>
  </ModalDialog>
);

BaseContainer.defaultProps = {
  isPrivacyPolicy: false,
};

BaseContainer.propTypes = {
  children: PropTypes.node.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isPrivacyPolicy: PropTypes.bool,
};

export default BaseContainer;
