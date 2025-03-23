module.exports = {
  // Use babel-jest for TypeScript files
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  // Configure module file extensions
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  // Mock CSS and style imports
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/src/tests/__mocks__/styleMock.js',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/tests/__mocks__/fileMock.js',
  },
  // Transform ignore patterns - essential for node_modules that use ESM
  transformIgnorePatterns: [
    '/node_modules/(?!(@?chakra|@emotion|framer|redux-mock-store|redux-thunk|@?reduxjs|axios)).+\\.js$',
  ],
  // Setup test environment
  testEnvironment: 'jsdom',
  // Setup files to run before each test
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.js'],
  // Ignore paths
  testPathIgnorePatterns: ['/node_modules/'],
  // Set test timeout
  testTimeout: 10000,
};