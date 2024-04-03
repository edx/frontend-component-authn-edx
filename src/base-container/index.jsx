import React from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';
import { ModalDialog } from '@openedx/paragon';
import PropTypes from 'prop-types';

import './index.scss';

/**
 * Base component for registration or login form modals.
 *
 * @param {boolean} open - Required. Whether to open the modal window.
 * @param {function} setOpen - Required. Is used to toggle the modal window's open flag.
 * @param {string} footerText - Optional. The text for the modal footer.
 * @param {React.node} children - Required. The login or registration form.
 *
 * @returns {JSX.Element} The rendered login or registration form modal.
 */
const BaseContainer = ({
  children, footerText, open, setOpen,
}) => {
  const { formatMessage } = useIntl();
  return (
    <ModalDialog
      isOpen={open}
      onClose={setOpen}
      size="fullscreen"
      variant="default"
      className="bg-light-400"
      title="authn-component"
      hasCloseButton
    >
      <ModalDialog.Body className="modal-body-container overflow-hidden">
        <div className="d-flex w-100 h-100">
          <div className="w-50 d-flex">
            {children}
          </div>
          <div className="w-50 d-flex">
            <div className="w-100 h-100 bg-dark-500" />
          </div>
        </div>
      </ModalDialog.Body>
      {footerText && (
        <ModalDialog.Footer className="bg-dark-500 p-4.5">
          <p className="mb-0 text-white m-auto">{formatMessage(footerText)}</p>
        </ModalDialog.Footer>
      )}
    </ModalDialog>
  );
};

BaseContainer.propTypes = {
  children: PropTypes.node.isRequired,
  footerText: PropTypes.objectOf(PropTypes.node),
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

BaseContainer.defaultProps = {
  footerText: '',
};

export default BaseContainer;
