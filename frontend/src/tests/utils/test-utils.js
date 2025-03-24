// Comprehensive test utilities for React component testing
import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';

// Import the mock store or create a new one
import createMockStore from '../mocks/mockStore';

/**
 * Custom render function with all providers needed for most components
 * @param {React.ReactElement} ui - The React component to render
 * @param {Object} options - Options for rendering
 * @param {Object} [options.initialState] - Initial state for the Redux store
 * @param {Object} [options.renderOptions] - Options to pass to RTL's render function
 * @param {Boolean} [options.withRouter=true] - Whether to wrap with BrowserRouter
 * @param {Boolean} [options.withRedux=true] - Whether to wrap with Redux Provider
 * @param {Boolean} [options.withChakra=true] - Whether to wrap with ChakraProvider
 * @returns {Object} The rendered component with added queries and store
 */
function renderWithProviders(
  ui,
  {
    initialState = {},
    renderOptions = {},
    withRouter = true,
    withRedux = true,
    withChakra = true
  } = {}
) {
  // Create a fresh store for each test
  const store = createMockStore(initialState);
  
  // Create wrapper based on requested providers
  const Wrapper = ({ children }) => {
    let wrappedChildren = children;
    
    // Apply providers in the correct order
    if (withChakra) {
      wrappedChildren = <ChakraProvider>{wrappedChildren}</ChakraProvider>;
    }
    
    if (withRedux) {
      wrappedChildren = <Provider store={store}>{wrappedChildren}</Provider>;
    }
    
    if (withRouter) {
      wrappedChildren = <BrowserRouter>{wrappedChildren}</BrowserRouter>;
    }
    
    return wrappedChildren;
  };

  // Return rendered component with additional testing utilities
  const renderResult = render(ui, { wrapper: Wrapper, ...renderOptions });
  
  // Add store to returned object for easier access in tests
  return {
    ...renderResult,
    store,
    // Helper to re-render with same store
    rerender: (ui) => renderWithProviders(ui, {
      initialState,
      renderOptions,
      withRouter,
      withRedux,
      withChakra,
      container: renderResult.container
    })
  };
}

/**
 * Helper to wait for async operations to complete
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} Promise that resolves after the specified delay
 */
const waitForAsync = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Helper to simulate API responses in tests
 * @param {Object} mockData - The data to include in the response
 * @param {number} status - HTTP status code
 * @returns {Object} A mock response object
 */
const mockApiResponse = (mockData = {}, status = 200) => ({
  data: mockData,
  status,
  statusText: status >= 200 && status < 300 ? 'OK' : 'Error'
});

/**
 * Helper to create a custom error for testing error handling
 * @param {string} message - Error message
 * @param {number} status - HTTP status code
 * @returns {Error} Custom error object
 */
const createApiError = (message = 'API Error', status = 400) => {
  const error = new Error(message);
  error.response = {
    data: { message },
    status,
    statusText: 'Error'
  };
  error.isAxiosError = true;
  return error;
};

/**
 * Helper that wraps a component render in act() and handles async updates
 * @param {Function} renderFn - Function that renders the component
 * @param {Object} options - Options for rendering
 * @returns {Promise<Object>} The rendered component
 */
const renderAsync = async (renderFn, options = {}) => {
  const result = renderFn(options);
  // Wait for any state updates to propagate
  await waitForAsync(0);
  return result;
};

export {
  renderWithProviders,
  waitForAsync,
  mockApiResponse,
  createApiError,
  renderAsync
};

// Export the custom render as the default
export default renderWithProviders;