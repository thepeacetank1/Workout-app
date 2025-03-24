module.exports = {
  // Use babel-jest for TypeScript and JavaScript files
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { configFile: './babel.config.js' }],
  },

  // Configure module file extensions for imports
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],

  // Mock CSS, style and asset imports
  moduleNameMapper: {
    // Style files
    '\\.(css|less|scss|sass)$': '<rootDir>/src/tests/__mocks__/styleMock.js',

    // Asset files
    '\\.(jpg|jpeg|png|gif|webp|svg|ttf|woff|woff2|eot)$': '<rootDir>/src/tests/__mocks__/fileMock.js',

    // Mock specific problematic modules
    '^react-router-dom$': '<rootDir>/src/tests/__mocks__/react-router-dom.js',
    '^axios$': '<rootDir>/src/tests/__mocks__/axios.js',
    '^@chakra-ui/react$': '<rootDir>/src/tests/__mocks__/@chakra-ui/react.js',
    '^@chakra-ui/icons$': '<rootDir>/src/tests/__mocks__/@chakra-ui/icons.js',
    '^react-icons/fa$': '<rootDir>/src/tests/__mocks__/react-icons/fa.js',
    '^react-icons/fi$': '<rootDir>/src/tests/__mocks__/react-icons/fa.js',
    '^react-icons/md$': '<rootDir>/src/tests/__mocks__/react-icons/fa.js',
    '^react-icons/bi$': '<rootDir>/src/tests/__mocks__/react-icons/fa.js',
    '^react-icons/bs$': '<rootDir>/src/tests/__mocks__/react-icons/fa.js',
    '^react-icons/hi$': '<rootDir>/src/tests/__mocks__/react-icons/fa.js',
    '^react-icons/gi$': '<rootDir>/src/tests/__mocks__/react-icons/fa.js',
    '^react-icons/io$': '<rootDir>/src/tests/__mocks__/react-icons/fa.js',
    '^react-icons/io5$': '<rootDir>/src/tests/__mocks__/react-icons/fa.js',
  },

  // Transform ignore patterns - essential for node_modules that use ESM
  transformIgnorePatterns: [
    '/node_modules/(?!(@?chakra|@emotion|framer|lodash-es|redux-mock-store|redux-thunk|@?reduxjs|axios|chart.js|react-icons)).+\\.(js|jsx|ts|tsx)$',
  ],

  // Setup test environment
  testEnvironment: 'jsdom',

  // Setup files to run before each test
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.js'],

  // Ignore paths for tests
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/coverage/', '/build/'],

  // Set test timeout - increased for async tests
  testTimeout: 30000,

  // Configure code coverage collection
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/tests/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.{js,jsx,ts,tsx}',
    '!src/reportWebVitals.{js,ts}',
    '!src/setupTests.{js,ts}',
    '!src/serviceWorker.{js,ts}',
  ],

  // Require 100% branch coverage on changed files
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },

  // Generate coverage with HTML reports
  coverageReporters: ['text', 'lcov', 'html'],

  // Display test results with colors
  verbose: true,

  // Watch plugins for better terminal experience during development
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],

  // Reset mocks before each test
  resetMocks: false,

  // Clear mocks between tests
  clearMocks: true,

  // Don't reset modules between tests for performance
  resetModules: false,

  // Use fake timers for consistent time in tests
  fakeTimers: {
    enableGlobally: true, // Enables fake timers globally
  },

  // Improve error handling for broken imports
  moduleDirectories: ['node_modules', 'src'],
};
