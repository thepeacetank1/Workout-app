import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import createMockStore from '../mocks/mockStore';

/**
 * Custom render function that includes common providers for testing
 * - Redux Provider with mockStore
 * - React Router BrowserRouter
 * - Chakra UI ChakraProvider
 * 
 * @param {React.ReactElement} ui - The component to render
 * @param {Object} options - Additional options
 * @param {Object} options.customState - Custom redux state to override defaults
 * @param {Object} options.renderOptions - Additional render options
 * @returns {Object} - The render result
 */
export function renderWithProviders(ui, {
  customState = {},
  ...renderOptions
} = {}) {
  const store = createMockStore(customState);
  
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <ChakraProvider>
            {children}
          </ChakraProvider>
        </BrowserRouter>
      </Provider>
    );
  }
  
  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

/**
 * Custom render function with only redux provider
 * Useful when other providers are not needed or are being independently mocked
 * 
 * @param {React.ReactElement} ui - The component to render
 * @param {Object} options - Additional options
 * @param {Object} options.customState - Custom redux state to override defaults
 * @param {Object} options.renderOptions - Additional render options
 * @returns {Object} - The render result
 */
export function renderWithRedux(ui, {
  customState = {},
  ...renderOptions
} = {}) {
  const store = createMockStore(customState);
  
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        {children}
      </Provider>
    );
  }
  
  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

/**
 * Custom render function with redux and router providers
 * 
 * @param {React.ReactElement} ui - The component to render
 * @param {Object} options - Additional options
 * @param {Object} options.customState - Custom redux state to override defaults
 * @param {Object} options.renderOptions - Additional render options
 * @returns {Object} - The render result
 */
export function renderWithReduxAndRouter(ui, {
  customState = {},
  ...renderOptions
} = {}) {
  const store = createMockStore(customState);
  
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </Provider>
    );
  }
  
  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

export default renderWithProviders;