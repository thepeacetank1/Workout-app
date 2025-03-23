/**
 * Utility to mock browser APIs for testing
 * Creates mocks for:
 * - ResizeObserver
 * - IntersectionObserver
 * - MatchMedia
 * - localStorage
 * - sessionStorage
 * - window methods and properties
 */

// Create mock for localStorage
const createLocalStorageMock = () => {
  const storage = {};
  return {
    getItem: jest.fn(key => storage[key] || null),
    setItem: jest.fn((key, value) => {
      storage[key] = String(value);
    }),
    removeItem: jest.fn(key => {
      delete storage[key];
    }),
    clear: jest.fn(() => {
      Object.keys(storage).forEach(key => {
        delete storage[key];
      });
    }),
    key: jest.fn(index => {
      return Object.keys(storage)[index] || null;
    }),
    get length() {
      return Object.keys(storage).length;
    }
  };
};

// Create mock for ResizeObserver
class ResizeObserverMock {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Create mock for IntersectionObserver
class IntersectionObserverMock {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Create mock for DOMRect
class DOMRectMock {
  constructor(x = 0, y = 0, width = 0, height = 0) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.top = y;
    this.right = x + width;
    this.bottom = y + height;
    this.left = x;
  }
  toJSON() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      top: this.top,
      right: this.right,
      bottom: this.bottom,
      left: this.left
    };
  }
}

// Setup all mocks
export const setupBrowserMocks = () => {
  // LocalStorage and SessionStorage
  Object.defineProperty(window, 'localStorage', {
    value: createLocalStorageMock()
  });
  
  Object.defineProperty(window, 'sessionStorage', {
    value: createLocalStorageMock()
  });
  
  // Browser APIs
  global.ResizeObserver = ResizeObserverMock;
  global.IntersectionObserver = IntersectionObserverMock;
  global.DOMRect = DOMRectMock;
  
  // Match Media
  window.matchMedia = window.matchMedia || function() {
    return {
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn()
    };
  };
  
  // Window location
  delete window.location;
  window.location = {
    href: 'http://localhost/',
    pathname: '/',
    search: '',
    hash: '',
    assign: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn()
  };
  
  // Suppress React 18 console errors about act()
  const originalConsoleError = console.error;
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' && 
      (args[0].includes('Warning: ReactDOM.render is no longer supported') || 
       args[0].includes('act(...) is not supported in production builds') ||
       args[0].includes('forwardRef render functions accept exactly two parameters') ||
       args[0].includes('Inside StrictMode'))
    ) {
      return;
    }
    originalConsoleError(...args);
  };
};

export default setupBrowserMocks;