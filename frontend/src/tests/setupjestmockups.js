// This file exports all mocks from setupJestMocks.js to fix import issues
// Problem: Some files import './setupjestmockups' (lowercase) but the actual file is './setupJestMocks' (camelCase)
// Solution: Create this forwarding module to maintain both import styles

// Re-export all mocks from the proper file
module.exports = require('./setupJestMocks');

// If there are any direct imports, make sure to support those as well
// For example, if something is imported like: import { something } from './setupjestmockups'
// We need to make it available