import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import createMockStore from '../mocks/mockStore';

// Mock the authSlice
jest.mock('../../store/slices/authSlice', () => {
  const fetchUserProfileMock = jest.fn();
  
  // Create a proper thunk-compatible action creator
  fetchUserProfileMock.mockImplementation(() => {
    // Return a function for the thunk middleware
    return function(dispatch) {
      dispatch({ type: 'auth/fetchUserProfile/pending' });
      
      // Return a promise that resolves with the data
      return Promise.resolve({ id: '1', name: 'Test User', email: 'test@example.com' })
        .then(userData => {
          dispatch({ 
            type: 'auth/fetchUserProfile/fulfilled',
            payload: userData
          });
          return userData;
        });
    };
  });
  
  return {
    fetchUserProfile: fetchUserProfileMock
  };
});

// Mock components for testing
const ProtectedComponent = () => <div>Protected Content</div>;

// Helper function to render component with different auth states
const renderProtectedRoute = (customState = {}) => {
  const authState = {
    isAuthenticated: false,
    token: null,
    user: null,
    isLoading: false,
    error: null,
    ...customState
  };
  
  // Use createMockStore which already has thunk middleware configured
  const store = createMockStore({
    auth: authState
  });

  return render(
    <Provider store={store}>
      <ProtectedRoute>
        <ProtectedComponent />
      </ProtectedRoute>
    </Provider>
  );
};

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redirects to login page when user is not authenticated', async () => {
    renderProtectedRoute({ isAuthenticated: false, user: null });
    
    // Should redirect to login page which renders PublicComponent in our mock
    await waitFor(() => {
      expect(screen.getByText(/public content/i)).toBeInTheDocument();
    });
  });

  it('renders protected content when user is authenticated', async () => {
    renderProtectedRoute({ 
      isAuthenticated: true,
      user: { id: '1', name: 'Test User', email: 'test@example.com' }
    });
    
    // Should show protected content
    await waitFor(() => {
      expect(screen.getByText(/protected content/i)).toBeInTheDocument();
    });
  });

  it('shows loading state while checking authentication', async () => {
    renderProtectedRoute({ isLoading: true });
    
    // Should show loading message
    await waitFor(() => {
      expect(screen.getByText(/loading your dashboard/i)).toBeInTheDocument();
    });
  });

  it('fetches user profile if token exists but no user data', async () => {
    const { fetchUserProfile } = require('../../store/slices/authSlice');
    
    renderProtectedRoute({ 
      token: 'fake-token',
      isAuthenticated: true,
      user: null
    });
    
    // Should try to fetch user profile
    await waitFor(() => {
      expect(fetchUserProfile).toHaveBeenCalled();
    });
  });

  it('does not fetch user profile if user data already exists', async () => {
    const { fetchUserProfile } = require('../../store/slices/authSlice');
    
    renderProtectedRoute({ 
      token: 'fake-token',
      isAuthenticated: true,
      user: { id: '1', name: 'Test User', email: 'test@example.com' }
    });
    
    // Should not try to fetch user profile again
    expect(fetchUserProfile).not.toHaveBeenCalled();
    
    // Should show protected content
    await waitFor(() => {
      expect(screen.getByText(/protected content/i)).toBeInTheDocument();
    });
  });
});