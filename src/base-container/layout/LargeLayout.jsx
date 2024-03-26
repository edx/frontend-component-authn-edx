import React from 'react';

import PropTypes from 'prop-types';

const LargeLayout = ({ children }) => (
  <div className="w-50 d-flex">
    {children}
  </div>
);

LargeLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default LargeLayout;
