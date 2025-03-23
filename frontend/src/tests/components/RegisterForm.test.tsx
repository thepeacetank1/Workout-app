import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import RegisterPage from '../../components/pages/RegisterPage';
import { registerUser } from '../../store/slices/authSlice';
import createMockStore from '../mocks/mockStore';

// Mock the registerUser action
jest.mock('../../store/slices/authSlice', () => ({
  registerUser: jest.fn(),
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
const renderRegisterPage = (initialState = {}) => {
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
          <RegisterPage />
        </Router>
      </Provider>
    ),
    store,
  };
};

describe('RegisterPage Component', () => {
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
  });

  it('renders the registration form correctly', () => {
    renderRegisterPage();
    
    // Check that the main elements are present
    expect(screen.getByText(/create an account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('validates the form and shows validation errors', async () => {
    renderRegisterPage();
    
    // Submit the form without filling in any fields
    const submitButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitButton);
    
    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      expect(screen.getByText(/please confirm your password/i)).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    renderRegisterPage();
    
    // Fill in fields with invalid email
    const nameInput = screen.getByLabelText(/full name/i);
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    const passwordInput = screen.getByLabelText(/^password$/i);
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    fireEvent.change(confirmPasswordInput, { target: { value: 'Password123' } });
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitButton);
    
    // Check for email validation error
    await waitFor(() => {
      expect(screen.getByText(/email is invalid/i)).toBeInTheDocument();
    });
  });

  it('validates password strength', async () => {
    renderRegisterPage();
    
    // Fill in fields with weak password
    const nameInput = screen.getByLabelText(/full name/i);
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    const passwordInput = screen.getByLabelText(/^password$/i);
    fireEvent.change(passwordInput, { target: { value: 'weak' } });
    
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    fireEvent.change(confirmPasswordInput, { target: { value: 'weak' } });
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitButton);
    
    // Check for password strength error
    await waitFor(() => {
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    });
  });

  it('validates password matching', async () => {
    renderRegisterPage();
    
    // Fill in fields with mismatched passwords
    const nameInput = screen.getByLabelText(/full name/i);
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    const passwordInput = screen.getByLabelText(/^password$/i);
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    fireEvent.change(confirmPasswordInput, { target: { value: 'DifferentPassword' } });
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitButton);
    
    // Check for password matching error
    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it('displays password strength indicator', async () => {
    renderRegisterPage();
    
    // Type a weak password
    const passwordInput = screen.getByLabelText(/^password$/i);
    fireEvent.change(passwordInput, { target: { value: 'weak' } });
    
    // Check for weak indicator
    await waitFor(() => {
      expect(screen.getByText(/password strength: weak/i)).toBeInTheDocument();
    });
    
    // Type a medium strength password
    fireEvent.change(passwordInput, { target: { value: 'Medium123' } });
    
    // Check for fair/good indicator
    await waitFor(() => {
      const strengthIndicator = screen.getByText(/password strength:/i);
      expect(strengthIndicator).toBeInTheDocument();
      // Could be either "Fair" or "Good" depending on the exact implementation
      expect(strengthIndicator.textContent).toMatch(/fair|good/i);
    });
    
    // Type a strong password
    fireEvent.change(passwordInput, { target: { value: 'StrongPassword123!' } });
    
    // Check for strong indicator
    await waitFor(() => {
      expect(screen.getByText(/password strength: strong/i)).toBeInTheDocument();
    });
  });

  it('toggles password visibility', async () => {
    renderRegisterPage();
    
    // Check initial state (password should be hidden)
    const passwordInput = screen.getByLabelText(/^password$/i) as HTMLInputElement;
    expect(passwordInput.type).toBe('password');
    
    // Click the show password button
    const showPasswordButton = screen.getByLabelText(/show password/i);
    fireEvent.click(showPasswordButton);
    
    // Check that password is now visible
    await waitFor(() => {
      expect(passwordInput.type).toBe('text');
    });
    
    // Click the hide password button
    const hidePasswordButton = screen.getByLabelText(/hide password/i);
    fireEvent.click(hidePasswordButton);
    
    // Check that password is hidden again
    await waitFor(() => {
      expect(passwordInput.type).toBe('password');
    });
  });

  it('submits the form with valid data', async () => {
    // Mock the registerUser action to return a promise
    (registerUser as jest.Mock).mockReturnValue({ type: 'auth/register/pending' });
    
    const { store } = renderRegisterPage();
    
    // Fill in the form with valid data
    const nameInput = screen.getByLabelText(/full name/i);
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    const passwordInput = screen.getByLabelText(/^password$/i);
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    fireEvent.change(confirmPasswordInput, { target: { value: 'Password123' } });
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitButton);
    
    // Check that the register action was dispatched with the correct data
    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123',
      });
    });
  });

  it('shows loading state while submitting the form', async () => {
    renderRegisterPage({ isLoading: true });
    
    // Check that the button is in loading state
    const submitButton = screen.getByRole('button', { name: /creating account/i });
    expect(submitButton).toBeDisabled();
  });
});