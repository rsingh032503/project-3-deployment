import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { LanguageProvider } from './LanguageContext';

/**
 * Entry point for the React application.
 *
 * @summary Renders the root component and sets up language context.
 * @function
 */
const renderApp = () => {
  /**
   * Root element ID in the HTML document.
   * @type {string}
   */
  const rootElementId = 'root';

  /**
   * The root element to render the React application.
   * @type {HTMLElement}
   */
  const rootElement = document.getElementById(rootElementId);

  if (!rootElement) {
    console.error(`Element with ID '${rootElementId}' not found. Unable to render the application.`);
    return;
  }

  /**
   * The root React element of the application.
   * @type {React.ReactElement}
   */
  const appRootElement = (
    <React.StrictMode>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </React.StrictMode>
  );

  /**
   * The root React renderer.
   * @type {ReactRoot}
   */
  const rootRenderer = ReactDOM.createRoot(rootElement);

  // Render the application
  rootRenderer.render(appRootElement);
};

// Call the renderApp function to render the React application.
renderApp();
