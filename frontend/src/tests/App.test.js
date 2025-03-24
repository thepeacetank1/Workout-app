import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import createMockStore from './mocks/mockStore';
import App from '../App';

// Mock the Chakra icons
jest.mock('@chakra-ui/icons', () => require('./__mocks__/@chakra-ui/icons'));

// Mock react-icons
jest.mock('react-icons/fa', () => ({
  FaGoogle: () => <div data-testid="fa-google-icon" />,
  FaFacebook: () => <div data-testid="fa-facebook-icon" />,
  FaApple: () => <div data-testid="fa-apple-icon" />,
  FaUser: () => <div data-testid="fa-user-icon" />,
  FaDumbbell: () => <div data-testid="fa-dumbbell-icon" />,
  FaWeight: () => <div data-testid="fa-weight-icon" />,
  FaUtensils: () => <div data-testid="fa-utensils-icon" />,
  FaRunning: () => <div data-testid="fa-running-icon" />,
  FaHeart: () => <div data-testid="fa-heart-icon" />,
  FaChartLine: () => <div data-testid="fa-chart-line-icon" />,
  FaCalendarAlt: () => <div data-testid="fa-calendar-alt-icon" />,
  FaCog: () => <div data-testid="fa-cog-icon" />,
  FaSignOutAlt: () => <div data-testid="fa-sign-out-alt-icon" />,
  FaBars: () => <div data-testid="fa-bars-icon" />,
  FaTimes: () => <div data-testid="fa-times-icon" />
}));

// Wrapper to provide necessary context providers
const renderWithProviders = (ui, options = {}) => {
  const store = createMockStore({
    auth: {
      isAuthenticated: false,
      isLoading: false,
      user: null
    },
    ui: {
      theme: 'light',
      sidebarOpen: false,
      activePage: 'home'
    }
  });
  
  return render(
    <Provider store={store}>
      {ui}
    </Provider>,
    options
  );
};

describe('App Component', () => {
  test('renders homepage without crashing', () => {
    renderWithProviders(<App />);
    
    // Check that the homepage title is rendered
    const titleElement = screen.getByText(/Track Your Fitness Journey/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders login link', () => {
    renderWithProviders(<App />);
    
    // Check that the login link is rendered
    const loginLink = screen.getByText(/Login/i);
    expect(loginLink).toBeInTheDocument();
  });

  test('renders get started link', () => {
    renderWithProviders(<App />);
    
    // Check that the get started button is rendered
    const getStartedButton = screen.getByText(/Get Started/i);
    expect(getStartedButton).toBeInTheDocument();
  });

  test('renders features section', () => {
    renderWithProviders(<App />);
    
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