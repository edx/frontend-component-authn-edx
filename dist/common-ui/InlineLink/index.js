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
 * @param {boolean} targetBlank - Tells whether to open the link in a new tab or not
 */
const InlineLink = _ref => {
  let {
    className = '',
    destination = '',
    linkHelpText = '',
    linkText,
    onClick = null,
    targetBlank = false
  } = _ref;
  const handleClick = e => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: `popup-container_inline-link_container ${className}`
  }, linkHelpText && /*#__PURE__*/React.createElement("span", {
    className: "text-gray-800"
  }, linkHelpText), /*#__PURE__*/React.createElement(Hyperlink, {
    target: targetBlank ? '_blank' : '_self',
    className: "pl-1 popup-container_inline-link_hyperlink",
    destination: destination,
    onClick: handleClick,
    isInline: true,
    showLaunchIcon: false
  }, linkText));
};
InlineLink.propTypes = {
  className: PropTypes.string,
  destination: PropTypes.string,
  onClick: PropTypes.func,
  linkHelpText: PropTypes.string,
  linkText: PropTypes.string.isRequired,
  targetBlank: PropTypes.bool
};
export default InlineLink;
//# sourceMappingURL=index.js.map