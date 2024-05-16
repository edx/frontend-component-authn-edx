import React from 'react';

import { Hyperlink } from '@openedx/paragon';
import PropTypes from 'prop-types';

/**
 * A component that serves two purposes:
 * 1. External redirection with `destination`.
 * 2. Internal redirection with `onClick`.
 *
 * When `destination` is provided, clicking the link will navigate to the specified URL.
 * If `onClick` is provided, clicking the link will trigger the `onClick` function instead of navigating externally.
 *
 * @param {string} className - Additional class name for styling.
 * @param {string} destination - The URL to redirect to when clicked. Only used if `onClick` is `null`.
 * @param {string} linkHelpText - The help text displayed alongside the link.
 * @param {string} linkText - The text displayed for the link.
 * @param {Function} onClick - The function to call when the link is clicked. If provided, `destination` is ignored.
 */
const InlineLink = ({
  className, destination, linkHelpText, linkText, onClick,
}) => {
  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div className={`d-flex popup-container_inline-link_container ${className}`}>
      {linkHelpText && (
        <span className="text-gray-800">
          {linkHelpText}
        </span>
      )}
      <Hyperlink
        className="popup-container_inline-link_hyperlink"
        destination={destination}
        onClick={handleClick}
        isInline
      >
        {linkText}
      </Hyperlink>
    </div>
  );
};

InlineLink.propTypes = {
  className: PropTypes.string,
  destination: PropTypes.string,
  onClick: PropTypes.func,
  linkHelpText: PropTypes.string,
  linkText: PropTypes.string.isRequired,
};

InlineLink.defaultProps = {
  linkHelpText: '',
  className: '',
  destination: '',
  onClick: null,
};

export default InlineLink;
