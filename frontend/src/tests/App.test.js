import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import { store } from '../store';
import App from '../App';

// Mock React Router's useLocation
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '/'
  })
}));

// Wrapper to provide necessary context providers
const AllTheProviders = ({ children }) => {
  return (
    <Provider store={store}>
      <ChakraProvider>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </ChakraProvider>
    </Provider>
  );
};

describe('App Component', () => {
  test('renders homepage without crashing', () => {
    render(<App />, { wrapper: AllTheProviders });
    
    // Check that the homepage title is rendered
    const titleElement = screen.getByText(/Track Your Fitness Journey/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders login link', () => {
    render(<App />, { wrapper: AllTheProviders });
    
    // Check that the login link is rendered
    const loginLink = screen.getByText(/Login/i);
    expect(loginLink).toBeInTheDocument();
  });

  test('renders get started link', () => {
    render(<App />, { wrapper: AllTheProviders });
    
    // Check that the get started button is rendered
    const getStartedButton = screen.getByText(/Get Started/i);
    expect(getStartedButton).toBeInTheDocument();
  });

  test('renders features section', () => {
    render(<App />, { wrapper: AllTheProviders });
    
    // Check that the features section is rendered
    const featuresHeading = screen.getByText(/Key Features/i);
    expect(featuresHeading).toBeInTheDocument();
    
    // Check that features are listed
    const workoutTracking = screen.getByText(/Workout Tracking/i);
    expect(workoutTracking).toBeInTheDocument();
    
    const nutritionTracking = screen.getByText(/Nutrition Tracking/i);
    expect(nutritionTracking).toBeInTheDocument();
  });
});