// Mock for react-router-dom
const React = require('react');

const useLocation = jest.fn().mockImplementation(() => {
  return {
    pathname: '/',
    search: '',
    hash: '',
    state: { 
      from: { pathname: '/app' },
      message: null,
      redirectPath: null,
      email: '',
      formData: {},
      // Add any other properties needed by tests
      rememberedEmail: 'test@example.com',
      rememberedCredentials: JSON.stringify({
        email: 'test@example.com', 
        password: 'password123'
      })
    },
    key: '5nvxpbdafa'
  };
});

const useNavigate = jest.fn().mockReturnValue(jest.fn());

const useParams = jest.fn().mockReturnValue({});

const useSearchParams = jest.fn().mockReturnValue([
  {
    get: jest.fn(key => null),
    getAll: jest.fn(() => []),
    has: jest.fn(() => false),
    forEach: jest.fn()
  },
  jest.fn()
]);

// Create a PublicComponent for testing redirection
const PublicComponent = () => React.createElement('div', {}, 'Public Content');

// Customize Navigate for better testing
const Navigate = jest.fn().mockImplementation(({ to, state, replace }) => {
  if (to === '/login') {
    return React.createElement(PublicComponent);
  }
  return React.createElement('div', { 
    'data-testid': 'mock-navigate', 
    'data-to': to,
    'data-state': JSON.stringify(state),
    'data-replace': replace ? 'true' : 'false'
  }, `Navigate: ${to}`);
});

// Create Link component mock
const Link = jest.fn().mockImplementation(({ to, children, ...rest }) => {
  return React.createElement(
    'a', 
    { 
      href: to, 
      'data-testid': 'mock-link', 
      'data-to': to,
      ...rest
    },
    children
  );
});

// Create NavLink component mock
const NavLink = jest.fn().mockImplementation(({ to, children, ...rest }) => {
  return React.createElement(
    'a', 
    { 
      href: to, 
      'data-testid': 'mock-navlink', 
      'data-to': to,
      ...rest
    },
    children
  );
});

// Create Outlet component mock
const Outlet = jest.fn().mockImplementation(() => {
  return React.createElement('div', { 'data-testid': 'mock-outlet' }, 'Outlet Content');
});

// Create Routes component mock
const Routes = jest.fn().mockImplementation(({ children }) => {
  return React.createElement('div', { 'data-testid': 'mock-routes' }, children);
});

// Create Route component mock
const Route = jest.fn().mockImplementation(({ path, element }) => {
  return React.createElement(
    'div', 
    { 
      'data-testid': 'mock-route', 
      'data-path': path 
    }, 
    element
  );
});

// Create BrowserRouter component mock
const BrowserRouter = jest.fn().mockImplementation(({ children }) => {
  return React.createElement('div', { 'data-testid': 'mock-browser-router' }, children);
});

// Create Router component mock
const Router = jest.fn().mockImplementation(({ children }) => {
  return React.createElement('div', { 'data-testid': 'mock-router' }, children);
});

// Create useRoutes hook mock
const useRoutes = jest.fn().mockReturnValue(null);

// Create MemoryRouter component mock
const MemoryRouter = jest.fn().mockImplementation(({ children, initialEntries }) => {
  return React.createElement(
    'div', 
    { 
      'data-testid': 'mock-memory-router', 
      'data-initial-entries': JSON.stringify(initialEntries) 
    }, 
    children
  );
});

// Export all mocked components and hooks
module.exports = {
  // Components
  BrowserRouter,
  Routes,
  Route,
  Router,
  Navigate,
  Link,
  NavLink,
  Outlet,
  MemoryRouter,
  PublicComponent,
  
  // Hooks
  useLocation,
  useNavigate,
  useParams,
  useRoutes,
  useSearchParams
};