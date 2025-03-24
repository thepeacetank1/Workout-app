// Import all mocks first to ensure they're available
import './setupJestMocks';

// Import jest-dom for DOM assertions
import '@testing-library/jest-dom';

// The import above should automatically extend Jest's expect
// No need for manual extension which might be causing issues
// If we need explicit extension, use the proper import:
// import * as matchers from '@testing-library/jest-dom/matchers';
// expect.extend(matchers);

// Import and setup browser mocks
import { setupBrowserMocks } from './utils/browser-mocks';
setupBrowserMocks();

// Configure Jest timeout for all tests
jest.setTimeout(30000);

// Silence specific warnings
const filterConsoleMessage = (message) => 
  message.includes('Warning: ReactDOM.render is no longer supported') ||
  message.includes('Warning: An update to') ||
  message.includes('Warning: The current testing environment is not configured') ||
  message.includes('act(...) is not supported in production') ||
  message.includes('forwardRef render functions accept exactly two parameters') ||
  message.includes('Inside StrictMode') ||
  message.includes('Warning: useLayoutEffect does nothing on the server') ||
  message.includes('module is not defined');

// Suppress specific console errors and warnings
const originalConsoleError = console.error;
console.error = (...args) => {
  if (args[0] && typeof args[0] === 'string' && filterConsoleMessage(args[0])) {
    return;
  }
  originalConsoleError(...args);
};

const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  if (args[0] && typeof args[0] === 'string' && filterConsoleMessage(args[0])) {
    return;
  }
  originalConsoleWarn(...args);
};

// Configure JSDOM
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    ok: true,
    status: 200,
    headers: new Headers(),
  })
);

// Add a simple test for react-test-renderer
global.ReactTestRenderer = {
  create: jest.fn()
};

// Mock localStorage
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    key: jest.fn(index => Object.keys(store)[index]),
    get length() { return Object.keys(store).length }
  };
})();

// Override localStorage and sessionStorage global objects
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});

Object.defineProperty(window, 'sessionStorage', {
  value: localStorageMock,
  writable: true
});