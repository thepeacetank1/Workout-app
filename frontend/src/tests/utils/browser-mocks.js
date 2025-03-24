/**
 * Comprehensive utilities to mock browser APIs for testing
 * Creates enhanced mocks for:
 * - ResizeObserver
 * - IntersectionObserver
 * - MatchMedia
 * - localStorage and sessionStorage
 * - window methods and properties
 * - clipboard API
 * - fetch API
 * - animation frames
 * - media elements
 */

// Create mock for localStorage/sessionStorage with complete implementation
const createStorageMock = () => {
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
    },
    // Allow inspection of the storage contents in tests
    __getAll: () => ({...storage}),
    // Reset mocks between tests
    __resetMocks: () => {
      Object.keys(storage).forEach(key => {
        delete storage[key];
      });
    }
  };
};

// Enhanced ResizeObserver mock with callback invocation capability
class ResizeObserverMock {
  constructor(callback) {
    this.callback = callback;
    this.observationTargets = [];
  }
  
  observe(target) {
    this.observationTargets.push(target);
  }
  
  unobserve(target) {
    this.observationTargets = this.observationTargets.filter(t => t !== target);
  }
  
  disconnect() {
    this.observationTargets = [];
  }
  
  // Utility to trigger a resize event in tests
  triggerResize(entries = []) {
    if (entries.length === 0) {
      // Create entries for all observed targets
      entries = this.observationTargets.map(target => ({
        target,
        contentRect: new DOMRectMock(0, 0, 100, 100)
      }));
    }
    
    if (this.callback && entries.length > 0) {
      this.callback(entries, this);
    }
  }
}

// Enhanced IntersectionObserver mock with callback invocation capability
class IntersectionObserverMock {
  constructor(callback, options = {}) {
    this.callback = callback;
    this.options = options;
    this.observationTargets = [];
    this.root = options.root || null;
    this.rootMargin = options.rootMargin || '0px';
    this.thresholds = Array.isArray(options.threshold) ? options.threshold : [options.threshold || 0];
  }
  
  observe(target) {
    this.observationTargets.push(target);
  }
  
  unobserve(target) {
    this.observationTargets = this.observationTargets.filter(t => t !== target);
  }
  
  disconnect() {
    this.observationTargets = [];
  }
  
  // Utility to simulate an intersection event in tests
  triggerIntersection(isIntersecting = true) {
    if (this.callback && this.observationTargets.length > 0) {
      const entries = this.observationTargets.map(target => ({
        target,
        isIntersecting,
        boundingClientRect: new DOMRectMock(0, 0, 100, 100),
        intersectionRatio: isIntersecting ? 1 : 0,
        intersectionRect: isIntersecting ? new DOMRectMock(0, 0, 100, 100) : new DOMRectMock(0, 0, 0, 0),
        rootBounds: this.root ? new DOMRectMock(0, 0, 500, 500) : null,
        time: Date.now()
      }));
      
      this.callback(entries, this);
    }
  }
}

// Enhanced DOMRect mock that better simulates browser behavior
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
  
  // Add static method to match browser implementation
  static fromRect(rect = {}) {
    return new DOMRectMock(
      rect.x || 0,
      rect.y || 0,
      rect.width || 0,
      rect.height || 0
    );
  }
}

// Setup all mocks
export const setupBrowserMocks = () => {
  // Create storage mocks
  const localStorageMock = createStorageMock();
  const sessionStorageMock = createStorageMock();
  
  // Assign to window
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true
  });
  
  Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock,
    writable: true
  });
  
  // Observer APIs
  global.ResizeObserver = ResizeObserverMock;
  global.IntersectionObserver = IntersectionObserverMock;
  global.DOMRect = DOMRectMock;
  
  // Match Media - Enhanced with ability to set matches value
  const createMatchMedia = (matches) => (query) => ({
    matches: matches,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
    // Add a function to simulate media query changes
    simulateChange: (newMatches) => {
      const oldMatches = this.matches;
      this.matches = newMatches;
      if (this.onchange) this.onchange();
      const event = new Event('change');
      this.dispatchEvent(event);
      return oldMatches;
    }
  });
  
  window.matchMedia = createMatchMedia(false);
  
  // Expose method to change matchMedia for different tests
  window.__setMatchMedia = (matches) => {
    window.matchMedia = createMatchMedia(matches);
  };
  
  // Window location with controlled history
  if (window.location) {
    // Save original properties
    const originalLocation = { ...window.location };
    
    // Create mockable location
    delete window.location;
    window.location = {
      href: originalLocation.href || 'http://localhost/',
      pathname: originalLocation.pathname || '/',
      search: originalLocation.search || '',
      hash: originalLocation.hash || '',
      origin: originalLocation.origin || 'http://localhost',
      host: originalLocation.host || 'localhost',
      hostname: originalLocation.hostname || 'localhost',
      protocol: originalLocation.protocol || 'http:',
      port: originalLocation.port || '',
      assign: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn()
    };
  }
  
  // Clipboard API
  if (!navigator.clipboard) {
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: jest.fn().mockResolvedValue(undefined),
        readText: jest.fn().mockResolvedValue('')
      },
      writable: true
    });
  }
  
  // Animation Frames
  global.requestAnimationFrame = (callback) => setTimeout(callback, 0);
  global.cancelAnimationFrame = (id) => clearTimeout(id);
  
  // HTMLMediaElement
  if (window.HTMLMediaElement) {
    Object.defineProperty(HTMLMediaElement.prototype, 'play', {
      value: jest.fn().mockResolvedValue(undefined),
      writable: true
    });
    
    Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
      value: jest.fn(),
      writable: true
    });
    
    Object.defineProperty(HTMLMediaElement.prototype, 'load', {
      value: jest.fn(),
      writable: true
    });
  }
  
  // URL object methods
  if (!URL.createObjectURL) {
    URL.createObjectURL = jest.fn(() => 'mock-object-url');
    URL.revokeObjectURL = jest.fn();
  }
  
  // Web Crypto API
  if (!window.crypto) {
    window.crypto = {
      subtle: {
        digest: jest.fn().mockResolvedValue(new ArrayBuffer(32))
      },
      getRandomValues: jest.fn((buffer) => {
        for (let i = 0; i < buffer.length; i++) {
          buffer[i] = Math.floor(Math.random() * 256);
        }
        return buffer;
      })
    };
  }
  
  // Suppress common React warnings that clutter test output
  const originalConsoleError = console.error;
  console.error = (...args) => {
    const shouldSuppress = args[0] && typeof args[0] === 'string' && (
      args[0].includes('Warning: ReactDOM.render is no longer supported') ||
      args[0].includes('act(...) is not supported in production builds') ||
      args[0].includes('forwardRef render functions accept exactly two parameters') ||
      args[0].includes('Inside StrictMode') ||
      args[0].includes('Warning: useLayoutEffect does nothing on the server') ||
      args[0].includes('Warning: An update to') ||
      args[0].includes('Warning: Can\'t perform a React state update on an unmounted component') ||
      args[0].includes('Warning: findDOMNode is deprecated')
    );
    
    if (shouldSuppress) {
      return;
    }
    originalConsoleError(...args);
  };
  
  // Also suppress noisy warnings
  const originalConsoleWarn = console.warn;
  console.warn = (...args) => {
    const shouldSuppress = args[0] && typeof args[0] === 'string' && (
      args[0].includes('Warning: React does not recognize the') ||
      args[0].includes('Warning: The tag <') ||
      args[0].includes('Warning: Invalid DOM property')
    );
    
    if (shouldSuppress) {
      return;
    }
    originalConsoleWarn(...args);
  };
  
  // Return functions to help with testing
  return {
    // Helper to reset all mocks between tests
    resetAllMocks: () => {
      localStorageMock.__resetMocks();
      sessionStorageMock.__resetMocks();
      jest.clearAllMocks();
    },
    
    // Allow triggering an intersection for tests
    triggerIntersection: (element, isIntersecting = true) => {
      if (element._intersectionObserver) {
        element._intersectionObserver.triggerIntersection(isIntersecting);
      }
    },
    
    // Allow triggering a resize for tests
    triggerResize: (element) => {
      if (element._resizeObserver) {
        element._resizeObserver.triggerResize();
      }
    }
  };
};

export default setupBrowserMocks;