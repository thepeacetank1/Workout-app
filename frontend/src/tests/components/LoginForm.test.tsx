import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import LoginPage from '../../components/pages/LoginPage';
import { loginUser } from '../../store/slices/authSlice';
import createMockStore from '../mocks/mockStore';

// Mock the loginUser action
jest.mock('../../store/slices/authSlice', () => ({
  loginUser: jest.fn(),
  clearError: jest.fn(),
}));

// Mock react-router-dom Link component
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  
  return {
    ...originalModule,
    Link: ({ children, to, ...props }) => {
      return React.createElement('a', { href: to || '#', ...props }, children);
    }
  };
});

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
        <Router>
          <LoginPage />
        </Router>
      </Provider>
    ),
    store,
  };
};

describe('LoginPage Component', () => {
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
    
    // Mock localStorage
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
    });
  });

  it('renders the login form correctly', () => {
    renderLoginPage();
    
    // Check that the main elements are present
    expect(screen.getByText(/log in to your account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /remember me/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('validates the form and shows validation errors', async () => {
    renderLoginPage();
    
    // Submit the form without filling in any fields
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);
    
    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    renderLoginPage();
    
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
      expect(screen.getByText(/email is invalid/i)).toBeInTheDocument();
    });
  });

  it('submits the form with valid data', async () => {
    // Mock the loginUser action to return a promise
    (loginUser as jest.Mock).mockReturnValue({ type: 'auth/login/pending' });
    
    const { store } = renderLoginPage();
    
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
    
    // Fill in the form with valid data
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Check the "Remember me" checkbox (it's checked by default)
    const rememberMeCheckbox = screen.getByRole('checkbox', { name: /remember me/i });
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

  it('does not store credentials when "Remember me" is unchecked', async () => {
    renderLoginPage();
    
    // Fill in the form with valid data
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Uncheck the "Remember me" checkbox
    const rememberMeCheckbox = screen.getByRole('checkbox', { name: /remember me/i });
    fireEvent.click(rememberMeCheckbox);
    expect(rememberMeCheckbox).not.toBeChecked();
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);
    
    // Check that localStorage.removeItem was called
    await waitFor(() => {
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('rememberedEmail');
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('rememberedCredentials');
    });
  });

  it('shows loading state while submitting the form', async () => {
    // Mock the loginUser action to return a pending action
    (loginUser as jest.Mock).mockReturnValue({ type: 'auth/login/pending' });
    
    renderLoginPage({ isLoading: true });
    
    // Fill in the form with valid data
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Submit the form should be disabled in loading state
    const submitButton = screen.getByRole('button', { name: /signing in/i });
    expect(submitButton).toBeDisabled();
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