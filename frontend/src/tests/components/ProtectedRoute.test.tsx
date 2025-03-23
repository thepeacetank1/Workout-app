import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import createMockStore from '../mocks/mockStore';

// Mock the authSlice
jest.mock('../../store/slices/authSlice', () => ({
  fetchUserProfile: jest.fn().mockReturnValue({ type: 'auth/fetchUserProfile/pending' }),
}));

// Mock components for testing
const ProtectedComponent = () => <div>Protected Content</div>;
const PublicComponent = () => <div>Public Content</div>;
const LoadingComponent = () => <div>Loading your dashboard...</div>;

// Create a manual mock version of the Navigate component
jest.mock('react-router-dom', () => {
  // Use the actual mock implementation from our mocks directory
  const routerMock = jest.requireActual('../__mocks__/react-router-dom');
  
  // Customize the Navigate component to work better with our tests
  return {
    ...routerMock,
    Navigate: ({ to }) => {
      if (to === '/login') {
        return <PublicComponent />;
      }
      return <div data-testid="navigate" data-to={to}>Navigate to {to}</div>;
    }
  };
});

// Helper function to render component with different auth states
const renderProtectedRoute = (customState: any = {}) => {
  const authState = {
    isAuthenticated: false,
    token: null,
    user: null,
    isLoading: false,
    error: null,
    ...customState
  };
  
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