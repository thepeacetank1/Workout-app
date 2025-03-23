import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

// Import any slices here
// import authReducer from './slices/authSlice';

// Define the root reducer
const rootReducer = combineReducers({
  // auth: authReducer,
  // Add other reducers here
});

// Configure the Redux store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Export types
// TypeScript types removed from JS file