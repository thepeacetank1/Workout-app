# Working Problems

This document tracks remaining test issues that need to be fixed.

## Core Issues

1. **React Rendering in Tests**
   - Several component tests still have timing issues with async rendering
   - Components with complex state transitions need better waitFor patterns
   - Need to ensure consistent async testing patterns across all tests
   - Using queryBy instead of getBy would help avoid immediate test failures

2. **Redux Side Effect Testing**
   - Testing components with complex side effects in useEffect remains challenging
   - Need to properly handle testing of components that dispatch actions in useEffect
   - Components with conditional dispatches based on props or state are tricky to test

3. **Circular Dependency Resolution**
   - Some modules have circular dependencies that are difficult to mock correctly
   - Need to further restructure tests to avoid circular import issues
   - May need to use factory functions for creating consistent mocks

## Specific Test Failures

1. **Component Tests**
   - [ ] **WorkoutPageTabs.test.jsx**
     - Component rendering with tabs requires better async handling
     - Still need to improve mock implementation for tab switching
   
   - [ ] **WorkoutPage.test.tsx**
     - Complex component with multiple side effects and conditional rendering
     - Needs better approach for testing useEffect with dispatched actions

   - [ ] **DietPage.test.tsx**
     - Test fails on async assertions after clicking the view button
     - Need to handle state transitions better with proper waitFor patterns

   - [ ] **UserProfileForm.test.tsx**
     - Form submission and validation logic needs better testing approach
     - Need to improve test isolation for complex form components

2. **Redux and API Integration**
   - [ ] **LoginPage.test.js**
     - Redux state access is improved but still having issues with form submission
     - Form validation testing needs better assertions

   - [ ] **ProtectedRoute.test.tsx**
     - Auth checking and redirecting logic needs better testing approach
     - Component has complex conditional rendering based on auth state

3. **Form Testing Issues**
   - [ ] **LoginForm.test.tsx and RegisterForm.test.tsx**
     - Form validation errors are inconsistent in testing environment
     - Need to improve the testing of form submission and error handling

   - [ ] **App.test.js**
     - Main App component has complex provider wrapping that causes test issues
     - Multiple routes and conditional rendering based on auth state is challenging

4. **API Test Issues**
   - [ ] **api-service.test.js**
     - API service tests have timing issues with async mocks
     - Need better isolation for API tests with consistent mocking patterns

## Current Progress

1. **Fixed Issues**
   - ✅ Implemented proper ES module mock for axios
   - ✅ Improved setupJestMocks.js with centralized mock configuration
   - ✅ Enhanced mockStore creator with better thunk support
   - ✅ Implemented more robust Chakra UI mocking
   - ✅ Fixed circular dependency issues in core mocks
   - ✅ Improved async testing patterns with waitFor
   - ✅ Successfully passing 8 test files, including:
     - SimpleTest.test.js
     - ProtectedRouteSimple.test.jsx
     - authSlice.test.js and basicStore.test.js
     - SimpleComponent.test.js
     - Basic API tests

2. **Partially Fixed Issues**
   - ⚠️ Improved LoginForm.test.tsx with better async patterns but still failing
   - ⚠️ Enhanced DietPage.test.tsx with Chakra provider but has async timing issues
   - ⚠️ Improved API mocking but still have issues with service tests
   - ⚠️ Made progress on Redux thunk action testing but complex components still failing

## Recommended Next Steps

1. **Improve Async Testing Patterns**
   - Convert all component tests to use consistent async testing patterns
   - Use act() properly to wrap state updates and async operations
   - Implement consistent waitFor timeouts and retry strategies

2. **Enhance Mock Store Implementation**
   - Create a more robust store mock for complex components
   - Implement better logging of dispatch calls for debugging
   - Add utilities for testing specific state transitions

3. **Better Isolation for Complex Components**
   - Break down complex component tests into smaller, focused tests
   - Test complex components at different levels of integration
   - Use more specific mocks for child components in complex views

4. **Improve Form Testing**
   - Create helper utilities for testing form validation
   - Implement better patterns for simulating user form interaction
   - Use consistent form testing patterns across similar components