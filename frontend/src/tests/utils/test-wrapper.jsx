import React from 'react';
import { render, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { ChakraProvider, theme } from '@chakra-ui/react';
import createMockStore from '../mocks/mockStore';

// Helper to wait for async operations to complete
const waitForAsync = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Enhanced render function with all providers and better async support
 * @param {React.ReactElement} ui - The component to render
 * @param {Object} options - Configuration options
 * @param {Object} options.initialState - Initial Redux state
 * @param {Array} options.initialEntries - Initial router history entries
 * @param {Boolean} options.withRouter - Whether to include the router
 * @param {Boolean} options.useMemoryRouter - Use MemoryRouter instead of BrowserRouter
 * @param {Boolean} options.withRedux - Whether to include Redux Provider
 * @param {Boolean} options.withChakra - Whether to include ChakraProvider
 * @param {Object} options.renderOptions - Additional options to pass to RTL render
 * @returns {Object} - The enhanced render result
 */
export function renderWithProviders(ui, {
  initialState = {},
  initialEntries = ['/'],
  withRouter = true,
  useMemoryRouter = false,
  withRedux = true,
  withChakra = true,
  ...renderOptions
} = {}) {
  // Create a fresh store for each test
  const store = createMockStore(initialState);
  
  // Build the wrapper with requested providers
  function Wrapper({ children }) {
    let wrappedComponent = children;
    
    // Apply providers in the correct order (from innermost to outermost)
    if (withChakra) {
      wrappedComponent = (
        <ChakraProvider theme={theme}>
          {wrappedComponent}
        </ChakraProvider>
      );
    }
    
    if (withRouter) {
      const RouterComponent = useMemoryRouter ? MemoryRouter : BrowserRouter;
      const routerProps = useMemoryRouter ? { initialEntries } : {};
      
      wrappedComponent = (
        <RouterComponent {...routerProps}>
          {wrappedComponent}
        </RouterComponent>
      );
    }
    
    if (withRedux) {
      wrappedComponent = (
        <Provider store={store}>
          {wrappedComponent}
        </Provider>
      );
    }
    
    return wrappedComponent;
  }
  
  const result = render(ui, { wrapper: Wrapper, ...renderOptions });
  
  // Create an enhanced result object with additional utilities
  return {
    ...result,
    store,
    // Re-export store actions for convenience
    dispatch: store.dispatch,
    getState: store.getState,
    // Helper for async operations
    async waitForAsync(ms = 0) {
      await act(async () => {
        await waitForAsync(ms);
      });
    },
    // Enhanced rerender that maintains the same wrapper context
    rerender: (newUi) => {
      return renderWithProviders(newUi, {
        initialState,
        initialEntries,
        withRouter,
        useMemoryRouter,
        withRedux,
        withChakra,
        container: result.container,
        ...renderOptions
      });
    }
  };
}

/**
 * Helper function for rendering with only Redux provider
 * @param {React.ReactElement} ui - The component to render
 * @param {Object} options - Options for rendering
 * @returns {Object} The rendered result with store
 */
export function renderWithRedux(ui, options = {}) {
  return renderWithProviders(ui, {
    ...options,
    withRouter: false,
    withChakra: false
  });
}

/**
 * Helper function for rendering with Redux and Router
 * @param {React.ReactElement} ui - The component to render
 * @param {Object} options - Options for rendering
 * @returns {Object} The rendered result with store
 */
export function renderWithReduxAndRouter(ui, options = {}) {
  return renderWithProviders(ui, {
    ...options,
    withChakra: false
  });
}

/**
 * Helper function for rendering with Memory Router (useful for testing routes)
 * @param {React.ReactElement} ui - The component to render
 * @param {Array} initialEntries - Initial router entries
 * @param {Object} options - Additional options
 * @returns {Object} The rendered result with all context and utilities
 */
export function renderWithMemoryRouter(ui, initialEntries = ['/'], options = {}) {
  return renderWithProviders(ui, {
    ...options,
    initialEntries,
    useMemoryRouter: true
  });
}

/**
 * Helper function specifically for testing protected routes
 * @param {React.ReactElement} ui - The component to render
 * @param {Boolean} isAuthenticated - Auth state
 * @param {Object} options - Additional options
 * @returns {Object} The rendered result
 */
export function renderProtectedRoute(ui, isAuthenticated = true, options = {}) {
  // Create auth state with appropriate authentication status
  const authState = {
    auth: {
      isAuthenticated,
      user: isAuthenticated ? { id: 'test-user', name: 'Test User' } : null,
      token: isAuthenticated ? 'mock-token' : null,
      error: null,
      isLoading: false,
      authChecked: true
    }
  };
  
  // Merge with any other state passed in options
  const initialState = {
    ...authState,
    ...(options.initialState || {})
  };
  
  // Return with all the providers configured
  return renderWithProviders(ui, {
    ...options,
    initialState,
    useMemoryRouter: true
  });
}

export default renderWithProviders;