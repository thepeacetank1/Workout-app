import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

// Mock the ChakraProvider and components
jest.mock('@chakra-ui/react', () => {
  const originalModule = jest.requireActual('@chakra-ui/react');
  
  // Mock the components used in LoginPage
  return {
    ...originalModule,
    ChakraProvider: ({ children }) => <div>{children}</div>,
    Box: ({ children, ...props }) => <div {...props}>{children}</div>,
    Flex: ({ children, ...props }) => <div {...props}>{children}</div>,
    VStack: ({ children, ...props }) => <div {...props}>{children}</div>,
    Heading: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    Text: ({ children, ...props }) => <p {...props}>{children}</p>,
    Button: ({ children, onClick, ...props }) => (
      <button onClick={onClick} {...props}>{children}</button>
    ),
    FormControl: ({ children, ...props }) => <div {...props}>{children}</div>,
    FormLabel: ({ children, htmlFor, ...props }) => (
      <label htmlFor={htmlFor} {...props}>{children}</label>
    ),
    Input: ({ id, type, onChange, ...props }) => (
      <input id={id} type={type} onChange={onChange} {...props} />
    ),
    InputGroup: ({ children, ...props }) => <div {...props}>{children}</div>,
    InputRightElement: ({ children, ...props }) => <div {...props}>{children}</div>,
    Checkbox: ({ children, onChange, isChecked, ...props }) => (
      <div>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={onChange}
          {...props}
        />
        <label>{children}</label>
      </div>
    ),
    Divider: () => <hr />,
    useToast: () => ({
      toast: jest.fn(),
      closeAll: jest.fn(),
      close: jest.fn(),
      isActive: jest.fn()
    }),
  };
});

// Mock the auth slice
jest.mock('../../store/slices/authSlice', () => ({
  loginUser: jest.fn().mockReturnValue({ type: 'auth/loginUser/pending' }),
}));

// Create mock store
const mockStore = configureMockStore([thunk]);
const store = mockStore({
  auth: {
    isAuthenticated: false,
    isLoading: false,
    error: null,
    user: null,
    token: null
  }
});

// Import our component after mocks are set up
const LoginPage = require('../../components/pages/LoginPage').default;

// Setup test wrapper with required providers
const renderWithProviders = (ui) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </Provider>
  );
};

describe('LoginPage Component', () => {
  test('renders login form correctly', () => {
    renderWithProviders(<LoginPage />);
    
    // Check for heading
    expect(screen.getByText(/Log in to your account/i)).toBeInTheDocument();
    
    // Check for form elements
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    
    // Check for sign in button
    expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
    
    // Check for sign up link
    expect(screen.getByText(/Don't have an account/i)).toBeInTheDocument();
  });

  test('allows email input', () => {
    renderWithProviders(<LoginPage />);
    
    const emailInput = screen.getByLabelText(/Email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    expect(emailInput.value).toBe('test@example.com');
  });

  test('allows password input', () => {
    renderWithProviders(<LoginPage />);
    
    const passwordInput = screen.getByLabelText(/Password/i);
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(passwordInput.value).toBe('password123');
  });
});