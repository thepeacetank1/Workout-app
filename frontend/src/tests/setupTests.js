// Import jest-dom for DOM assertions
require('@testing-library/jest-dom');

// Import and setup browser mocks
require('./utils/browser-mocks').setupBrowserMocks();

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
  message.includes('Warning: useLayoutEffect does nothing on the server');

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