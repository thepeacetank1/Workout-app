# Frontend Testing Checklist

This document outlines all tests that should be run before submitting code changes to ensure high code quality and prevent common issues.

## Automated Tests

Always run these tests before submitting changes:

- [ ] **Unit Tests**: `cd frontend && npm test`
- [ ] **File Import Validation**: `cd frontend && npx jest tests/file-imports.test.js`
- [ ] **Component Tests**: `cd frontend && npx jest tests/components/`
- [ ] **Store Tests**: `cd frontend && npx jest tests/store/`
- [ ] **API Integration Tests**: `cd frontend && npx jest tests/api/`

## Manual Validation

These checks should be manually performed before submitting changes:

- [ ] **Build Validation**: `cd frontend && npm run build`
- [ ] **Lint Check**: `cd frontend && npm run lint`
- [ ] **Visual Inspection**: Test on multiple screen sizes
- [ ] **Cross-Browser Testing**: Test on Chrome, Firefox, and Safari if possible
- [ ] **Performance Check**: Use Chrome DevTools to ensure good load times
- [ ] **Authentication Flow**: Test login, logout, and protected routes
- [ ] **Navigation Testing**: Test all navigation links and mobile navigation

## API Integration Tests

The API integration tests verify connectivity with backend endpoints:

1. **Auth API**: Tests login, register, profile fetch, and profile update
2. **Workout API**: Tests workout fetching, creation, and updating
3. **Nutrition API**: Tests food logging and meal plan generation
4. **Goal API**: Tests goal setting and progress tracking

## Redux Store Tests

The Redux store tests verify state management:

1. **Auth Slice**: Tests authentication state, login/logout flows, and token handling
2. **Workout Slice**: Tests workout data management and session recording
3. **Nutrition Slice**: Tests food logging and meal planning
4. **Goal Slice**: Tests goal setting and progress updates
5. **UI Slice**: Tests UI state management (loading, modals, etc.)

## Component Tests

Key component tests to run:

1. **Auth Components**: Login, Register, ProtectedRoute
2. **Layout Components**: Header, Sidebar, MobileNav
3. **Dashboard Components**: DashboardSummary, ActivityChart
4. **Workout Components**: WorkoutList, WorkoutLogger, WorkoutCalendar
5. **Nutrition Components**: FoodLogger, FoodHistory, NutritionSummary
6. **Diet Components**: DietPlan, DietPreferences
7. **Profile Components**: UserProfileForm

## Import Validation Checks

The import validation test checks for common issues:

1. **Missing Files**: Ensures all imported files actually exist
2. **Path Case Issues**: Detects path case mismatches (important on case-sensitive systems)
3. **Directory vs File Confusion**: Identifies when importing a directory without an index file
4. **Extension Issues**: Checks for incorrect or missing file extensions

## Common Import Issues and Solutions

| Error | Description | Solution |
|-------|-------------|----------|
| Missing Store | `Error: Can't resolve './store'` | Create the store directory with an index file |
| Missing Components | `Error: Can't resolve './components/*'` | Create the component structure |
| Path Case Issues | `Error: Can't resolve './Components'` on Linux | Match exact case of folder names |
| Extension Mismatch | Importing .jsx file as .js | Use correct extension or omit and let bundler resolve |

## When Adding New Tests

When adding a new test, add it to this checklist:

1. Add the test to the appropriate section above
2. Document what the test validates
3. Add any specific commands needed to run the test
4. Update this file with the date and your name
5. Ensure CI/CD pipeline includes the new test if applicable

## Recent Changes to Test Suite

| Date | Change | Author |
|------|--------|--------|
| 2025-03-13 | Added recursive import validation test | Claude |
| 2025-03-13 | Updated auth slice tests for Redux Toolkit async thunks | Claude |
| 2025-03-13 | Added API integration testing structure | Claude |
