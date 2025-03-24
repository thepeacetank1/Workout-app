import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import DietPage from '../../components/pages/DietPage';
import createMockStore from '../mocks/mockStore';
import { ChakraProvider } from '@chakra-ui/react';

// Mock the window.alert
const mockAlert = jest.fn();
global.alert = mockAlert;

// Mock useColorModeValue as it causes issues in tests
jest.mock('@chakra-ui/react', () => {
  const originalModule = jest.requireActual('@chakra-ui/react');
  return {
    __esModule: true,
    ...originalModule,
    useColorModeValue: jest.fn().mockImplementation((lightValue, darkValue) => lightValue)
  };
});

// Mock the DietPlan component with a simplified version
jest.mock('../../components/diet/DietPlan', () => {
  return {
    __esModule: true,
    default: ({ 
      weeklyPlan,
      userCalorieGoal,
      userProteinGoal,
      userCarbsGoal,
      userFatGoal
    }) => (
      <div data-testid="diet-plan">
        {/* Use unique identifiers to avoid multiple matches */}
        <div data-testid="diet-plan-calorie-goal">Calorie Goal: {userCalorieGoal}</div>
        <div data-testid="protein-goal">Protein Goal: {userProteinGoal}g</div>
        <div data-testid="carbs-goal">Carbs Goal: {userCarbsGoal}g</div>
        <div data-testid="fat-goal">Fat Goal: {userFatGoal}g</div>
        {weeklyPlan.map((day) => (
          <div key={day.day} data-testid={`day-${day.day}`}>
            <h3>{day.day}</h3>
            <div>Breakfast: {day.meals.breakfast.name}</div>
            <div>Lunch: {day.meals.lunch.name}</div>
            <div>Dinner: {day.meals.dinner.name}</div>
          </div>
        ))}
      </div>
    ),
  };
});

// Mock the DietPreferences component with a simplified version
jest.mock('../../components/diet/DietPreferences', () => {
  return {
    __esModule: true,
    default: ({ 
      currentPreferences, 
      onSavePreferences
    }) => (
      <div data-testid="diet-preferences">
        <div data-testid="diet-type">Diet Type: {currentPreferences.dietType}</div>
        <div data-testid="calorie-goal">Calorie Goal: {currentPreferences.calorieGoal}</div>
        <button 
          onClick={() => onSavePreferences({
            ...currentPreferences,
            calorieGoal: 2000,
            dietType: 'keto'
          })}
          data-testid="save-preferences-button"
        >
          Save Preferences
        </button>
      </div>
    ),
  };
});

describe('DietPage component', () => {
  let store;
  
  beforeEach(() => {
    // Create a fresh store for each test
    store = createMockStore();
    jest.clearAllMocks();
  });
  
  const renderComponent = () => {
    return render(
      <ChakraProvider>
        <Provider store={store}>
          <DietPage />
        </Provider>
      </ChakraProvider>
    );
  };

  it('renders the component correctly', async () => {
    renderComponent();
    
    // Wait for component to fully render
    await waitFor(() => {
      // Check if the main title is rendered
      expect(screen.getByText('Diet Plan')).toBeInTheDocument();
      
      // Check if the tabs are rendered - more robust query
      expect(screen.getByRole('tab', { name: /your diet plan/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /preferences/i })).toBeInTheDocument();
    });
  });

  it('displays diet plan overview by default', async () => {
    renderComponent();
    
    // Wait for component to fully render and check assertions
    await waitFor(() => {
      // The diet plan tab should be active by default
      expect(screen.getByText('Diet Plan Overview')).toBeInTheDocument();
      
      // Check if overview information is displayed
      expect(screen.getByText(/this plan is designed for your high-protein diet preferences/i)).toBeInTheDocument();
      expect(screen.getByText(/monday's meals preview:/i)).toBeInTheDocument();
      
      // Check if the buttons are displayed
      expect(screen.getByRole('button', { name: /view full diet plan/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /generate shopping list/i })).toBeInTheDocument();
    });
  });

  it('displays full diet plan when clicking the view button', async () => {
    renderComponent();
    
    // Wait for the button to be available
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /view full diet plan/i })).toBeInTheDocument();
    });
    
    // Click on the "View Full Diet Plan" button using userEvent
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /view full diet plan/i }));
    
    // Check if the full diet plan is displayed
    await waitFor(() => {
      expect(screen.getByTestId('diet-plan')).toBeInTheDocument();
      expect(screen.getByTestId('diet-plan-calorie-goal')).toBeInTheDocument();
      expect(screen.getByTestId('protein-goal')).toBeInTheDocument();
      expect(screen.getByTestId('carbs-goal')).toBeInTheDocument();
      expect(screen.getByTestId('fat-goal')).toBeInTheDocument();
      
      // Check if days are displayed
      expect(screen.getByTestId('day-Monday')).toBeInTheDocument();
      expect(screen.getByTestId('day-Tuesday')).toBeInTheDocument();
    });
  });

  it('displays diet preferences when clicking the preferences tab', async () => {
    renderComponent();
    
    // Wait for tabs to render
    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /preferences/i })).toBeInTheDocument();
    });
    
    // Click on the "Preferences" tab using userEvent
    const user = userEvent.setup();
    await user.click(screen.getByRole('tab', { name: /preferences/i }));
    
    // Check if the diet preferences form is displayed
    await waitFor(() => {
      expect(screen.getByTestId('diet-preferences')).toBeInTheDocument();
      expect(screen.getByTestId('diet-type')).toBeInTheDocument();
      expect(screen.getByTestId('calorie-goal')).toBeInTheDocument();
    });
    
    // Click the save preferences button and check if alert is shown
    await user.click(screen.getByTestId('save-preferences-button'));
    expect(mockAlert).toHaveBeenCalledWith('Diet preferences saved successfully!');
  });
});