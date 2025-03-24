import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import LoginPage from '../../components/pages/LoginPage';
import { loginUser } from '../../store/slices/authSlice';
import createMockStore from '../mocks/mockStore';
import '@testing-library/jest-dom';

// Mock the login action - creates a proper thunk
jest.mock('../../store/slices/authSlice', () => ({
  __esModule: true,
  loginUser: jest.fn((credentials) => {
    return function thunk(dispatch) {
      dispatch({ type: 'auth/login/pending' });
      // Return a mock promise for test assertions
      return Promise.resolve({ type: 'auth/login/fulfilled', payload: { user: { email: credentials.email } } });
    };
  }),
  clearError: jest.fn(),
}));

// Make sure we use the shared mock for react-router-dom
jest.mock('react-router-dom');

// Helper function to render the component with providers
const renderLoginPage = (initialState = {}) => {
  const store = createMockStore({
    auth: {
      isLoading: false,
      error: null,
      isAuthenticated: false,
      ...initialState,
    },
  });

  return {
    ...render(
      <Provider store={store}>
        <LoginPage />
      </Provider>
    ),
    store,
  };
};

describe('LoginPage Component', () => {
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
    
    // Create a proper mock localStorage
    const localStorageMock = (() => {
      let store = {};
      return {
        getItem: jest.fn(key => store[key] || null),
        setItem: jest.fn((key, value) => {
          store[key] = value.toString();
        }),
        removeItem: jest.fn(key => {
          delete store[key];
        }),
        clear: jest.fn(() => {
          store = {};
        })
      };
    })();
    
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });
  });

  it('renders the login form correctly', async () => {
    renderLoginPage();
    
    // Use queryBy instead of getBy to avoid test failures if elements are not found immediately
    await waitFor(() => {
      // Check for the presence of key elements
      expect(screen.queryByText(/log in to your account/i)).toBeInTheDocument();
      expect(screen.queryByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.queryByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.queryByRole('checkbox', { name: /remember me/i })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });
  });

  it('validates the form and shows validation errors', async () => {
    renderLoginPage();
    
    // Find the submit button (needs to be robust)
    const submitButton = await screen.findByRole('button', { name: /sign in/i });
    
    // Submit the form without filling in any fields
    fireEvent.click(submitButton);
    
    // Check for validation errors
    await waitFor(() => {
      expect(screen.queryByText(/email is required/i)).toBeInTheDocument();
      expect(screen.queryByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    renderLoginPage();
    
    // Wait for form to be fully rendered
    await waitFor(() => {
      expect(screen.queryByLabelText(/email/i)).toBeInTheDocument();
    });
    
    // Fill in invalid email format
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);
    
    // Check for email validation error
    await waitFor(() => {
      expect(screen.queryByText(/email is invalid/i)).toBeInTheDocument();
    });
  });

  it('submits the form with valid data', async () => {
    const { store } = renderLoginPage();
    
    // Wait for form to render
    await waitFor(() => {
      expect(screen.queryByLabelText(/email/i)).toBeInTheDocument();
    });
    
    // Fill in the form with valid data
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);
    
    // Check that the login action was dispatched with the correct data
    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('remembers user credentials when "Remember me" is checked', async () => {
    renderLoginPage();
    
    // Wait for form to render
    await waitFor(() => {
      expect(screen.queryByLabelText(/email/i)).toBeInTheDocument();
    });
    
    // Fill in the form with valid data
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Check the "Remember me" checkbox
    const rememberMeCheckbox = screen.getByRole('checkbox', { name: /remember me/i });
    fireEvent.click(rememberMeCheckbox);
    expect(rememberMeCheckbox).toBeChecked();
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);
    
    // Check that localStorage.setItem was called
    await waitFor(() => {
      expect(window.localStorage.setItem).toHaveBeenCalledWith('rememberedEmail', 'test@example.com');
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        'rememberedCredentials', 
        JSON.stringify({ email: 'test@example.com', password: 'password123' })
      );
    });
  });

  it('loads remembered credentials on mount', async () => {
    // Mock localStorage to return saved credentials
    window.localStorage.getItem = jest.fn()
      .mockImplementation((key) => {
        if (key === 'rememberedEmail') return 'saved@example.com';
        if (key === 'rememberedCredentials') return JSON.stringify({
          email: 'saved@example.com',
          password: 'savedpassword',
        });
        return null;
      });
    
    renderLoginPage();
    
    // Check that the form is pre-filled with the saved values
    await waitFor(() => {
      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
      const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
      
      expect(emailInput.value).toBe('saved@example.com');
      expect(passwordInput.value).toBe('savedpassword');
      expect(screen.getByRole('checkbox', { name: /remember me/i })).toBeChecked();
    });
  });
});