import React from 'react';
import PropTypes from 'prop-types';

const FontSizeIncreaser = ({ onFontSizeChange }) => {
  const increaseFontSize = () => {
    onFontSizeChange((prevSize) => prevSize + 2);
  };

  return (
    <div>
      <button onClick={increaseFontSize}>Increase Font Size</button>
    </div>
  );
};

FontSizeIncreaser.propTypes = {
  onFontSizeChange: PropTypes.func.isRequired,
};

export default FontSizeIncreaser;