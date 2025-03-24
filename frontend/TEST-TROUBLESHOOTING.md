# Test Troubleshooting Guide

This document provides solutions for common test failures in the workout app frontend.

## Common Test Failures and Solutions

### Jest DOM Setup Issues

**Symptoms:**
- `TypeError: expect(...).toBeInTheDocument is not a function`
- Missing DOM assertion methods

**Solutions:**
- Ensure setupTests.js correctly imports Jest DOM: `import '@testing-library/jest-dom'`
- Check import order in test files
- Verify Jest configuration in package.json includes setupFilesAfterEnv

### Component Rendering Issues

**Symptoms:**
- `React.jsx: type is invalid`
- `Component is not defined` errors

**Solutions:**
- Check component import paths
- Verify component is properly exported from source file
- Ensure all required props are provided
- Wrap components with necessary providers (Redux Provider, Router, etc.)

### Chakra UI Component Issues

**Symptoms:**
- `Error: React does not recognize the prop` warnings
- Missing Chakra components in tests

**Solutions:**
- Create proper Chakra UI mock file (@chakra-ui/react.js) in __mocks__ directory
- Add missing component mocks (Button, Box, SimpleGrid, etc.)
- Use proper Chakra component props instead of DOM element props
- Ensure Chakra ThemeProvider is used when testing Chakra components

### Redux Store Testing Issues

**Symptoms:**
- `Cannot read properties of undefined (reading 'state')`
- `Actions must be plain objects. Use custom middleware for async actions`

**Solutions:**
- Initialize store with proper initial state
- Use configureStore with thunk middleware for async actions
- Ensure reducers handle all action types correctly
- Mock API calls when testing async actions

### Jest Mock Implementation Issues

**Symptoms:**
- `The module factory of jest.mock() is not allowed to reference any out-of-scope variables`
- Mock functions not being called as expected

**Solutions:**
- Move jest.mock() calls to the top of the file (hoisted by Jest)
- Don't reference variables from test scope in mock implementations
- Use inline factory functions that don't reference external variables
- For complex mocks, use separate mock files

### Import and Syntax Issues

**Symptoms:**
- `Jest encountered an unexpected token`
- `Unexpected token 'export'`

**Solutions:**
- Check for ES module syntax issues
- Ensure babel configuration supports the syntax used
- Verify import/export syntax is correct
- Check for typos in import paths

## Testing Best Practices

1. **Isolation**: Test components in isolation with mocked dependencies
2. **Accessibility**: Test for accessibility issues with axe or similar tools
3. **User Interactions**: Test user interactions with fireEvent or userEvent
4. **Error States**: Test error handling and boundary conditions
5. **Snapshot Testing**: Use sparingly and update snapshots when needed

## Debugging Tests

When tests fail:

1. Run single test with `npm test -- -t 'test name'`
2. Use `console.log()` to debug test execution
3. Check render output with `screen.debug()`
4. Verify mock implementations are working correctly
5. Inspect component state during test execution