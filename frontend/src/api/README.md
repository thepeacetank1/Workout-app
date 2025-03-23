# Frontend-Backend Integration

This directory contains the API integration code for connecting the frontend to the backend services.

## Directory Structure

- `client.ts` - Core API client with Axios configuration
- `services/` - Service-specific API functions
  - `auth.ts` - Authentication API functions
  - `workout.ts` - Workout API functions
  - `nutrition.ts` - Nutrition API functions
  - `goal.ts` - Goal API functions

## Overview

The API integration follows a layered approach:

1. **Base Client**: A configured Axios instance with interceptors for auth and error handling
2. **Service Modules**: Functions for specific API endpoints grouped by domain
3. **Redux Thunks**: Async thunks in Redux slices that use the service modules

## Authentication

The authentication flow uses JWT tokens:

1. User logs in/registers and receives a token
2. Token is stored in localStorage
3. Token is included in all subsequent API requests via interceptor
4. Expired tokens trigger logout
5. Auth protection via ProtectedRoute component

## API URL Configuration

The API URL can be configured via environment variables:

```
REACT_APP_API_URL=http://your-api-url/api
```

Default is http://localhost:5000/api if not specified.

## Error Handling

The API client includes comprehensive error handling:

1. Request errors are caught and formatted consistently
2. Authentication errors (401) trigger automatic logout
3. Network errors are detected and reported
4. Redux slices handle loading and error states

## Next Steps

- Implement the remaining API service modules
- Add mock data for development and testing
- Create API request/response typing
- Implement caching and request deduplication
- Add logging for API requests in development mode