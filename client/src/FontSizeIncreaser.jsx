import React from 'react';
import PropTypes from 'prop-types';

/**
 * A React component that provides a button to increase font size.
 *
 * @component
 * @param {object} props - The properties of the component.
 * @param {function} props.onFontSizeChange - A function to handle font size changes.
 */
const FontSizeIncreaser = ({ onFontSizeChange }) => {
  /**
   * Handles the click event to increase the font size.
   *
   * @function
   * @private
   */
  const increaseFontSize = () => {
    onFontSizeChange((prevSize) => prevSize + 2);
  };

  return (
    <div>
      <button onClick={increaseFontSize}>Increase Font Size</button>
    </div>
  );
};

/**
 * PropTypes for FontSizeIncreaser component.
 *
 * @type {object}
 * @property {function} onFontSizeChange - A function to handle font size changes.
 */
FontSizeIncreaser.propTypes = {
  onFontSizeChange: PropTypes.func.isRequired,
};

export default FontSizeIncreaser;
