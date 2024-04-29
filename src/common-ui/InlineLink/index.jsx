import React from 'react';

import { Hyperlink } from '@openedx/paragon';
import PropTypes from 'prop-types';

const InlineLink = ({
  className, destination, linkHelpText, linkText,
}) => (
  <div className={`d-flex popup-container_inline-link_container ${className}`}>
    <span className="text-gray-800">
      {linkHelpText}
    </span>
    <Hyperlink className="popup-container_inline-link_hyperlink" destination={destination} isInline>
      {linkText}
    </Hyperlink>
  </div>
);

InlineLink.propTypes = {
  className: PropTypes.string,
  destination: PropTypes.string.isRequired,
  linkHelpText: PropTypes.string.isRequired,
  linkText: PropTypes.string.isRequired,
};

InlineLink.defaultProps = {
  className: '',
};

export default InlineLink;
