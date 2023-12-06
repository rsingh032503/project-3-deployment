import React, { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

/**
 * @typedef {Object} LanguageContextValue
 * @property {string} language - The current language.
 * @property {function} setLanguage - Function to set the language.
 */

/**
 * Context for managing the language state.
 * @type {React.Context<LanguageContextValue>}
 */
const LanguageContext = createContext();

/**
 * Provides the language state to the React component tree.
 * @component
 * @param {Object} props - React component props.
 * @param {React.ReactNode} props.children - The child components to be wrapped by the provider.
 * @returns {React.ReactNode} The wrapped child components with language context.
 */
export const LanguageProvider = ({ children }) => {
  /**
   * State hook for managing the language.
   * @type {[string, function]}
   */
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * Prop types for the LanguageProvider component.
 * @type {Object}
 * @property {React.ReactNode} children - The child components to be wrapped by the provider.
 */
LanguageProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Custom hook to access the language context.
 * @returns {LanguageContextValue} The language context value.
 * @throws {Error} Throws an error if used outside a LanguageProvider.
 */
export const useLanguage = () => {
  /**
   * Context value for language.
   * @type {LanguageContextValue}
   */
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }

  return context;
};
