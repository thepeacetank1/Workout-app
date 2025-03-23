import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import DietPage from '../../components/pages/DietPage';
import createMockStore from '../mocks/mockStore';

// Mock the window.alert
const mockAlert = jest.fn();
global.alert = mockAlert;

// Mock the DietPlan component
jest.mock('../../components/diet/DietPlan', () => {
  return {
    __esModule: true,
    default: ({ 
      weeklyPlan,
      userCalorieGoal,
      userProteinGoal,
      userCarbsGoal,
      userFatGoal
    }: {
      weeklyPlan: any[];
      userCalorieGoal: number;
      userProteinGoal: number;
      userCarbsGoal: number;
      userFatGoal: number;
    }) => (
      <div data-testid="diet-plan">
        <div data-testid="calorie-goal">Calorie Goal: {userCalorieGoal}</div>
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

// Mock the DietPreferences component
jest.mock('../../components/diet/DietPreferences', () => {
  return {
    __esModule: true,
    default: ({ 
      currentPreferences, 
      onSavePreferences
    }: { 
      currentPreferences: any;
      onSavePreferences: (preferences: any) => void; 
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

// Create mock store
const store = createMockStore();

describe('DietPage component', () => {
  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <DietPage />
        </BrowserRouter>
      </Provider>
    );
  };

  it('renders the component correctly', () => {
    renderComponent();
    
    // Check if the main title is rendered
    expect(screen.getByText('Diet Plan')).toBeInTheDocument();
    
    // Check if the tabs are rendered
    expect(screen.getByRole('tab', { name: 'Your Diet Plan' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Preferences' })).toBeInTheDocument();
  });

  it('displays diet plan overview by default', () => {
    renderComponent();
    
    // The diet plan tab should be active by default
    expect(screen.getByText('Diet Plan Overview')).toBeInTheDocument();
    
    // Check if overview information is displayed
    expect(screen.getByText('This plan is designed for your high-protein diet preferences with a budget of $80 per week.')).toBeInTheDocument();
    expect(screen.getByText('Monday\'s Meals Preview:')).toBeInTheDocument();
    
    // Check if the "View Full Diet Plan" button is displayed
    expect(screen.getByRole('button', { name: 'View Full Diet Plan' })).toBeInTheDocument();
    
    // Check if the "Generate Shopping List" button is displayed
    expect(screen.getByRole('button', { name: 'Generate Shopping List' })).toBeInTheDocument();
  });

  it('displays full diet plan when clicking the view button', () => {
    renderComponent();
    
    // Click on the "View Full Diet Plan" button
    fireEvent.click(screen.getByRole('button', { name: 'View Full Diet Plan' }));
    
    // Check if the full diet plan is displayed
    expect(screen.getByTestId('diet-plan')).toBeInTheDocument();
    expect(screen.getByTestId('calorie-goal')).toBeInTheDocument();
    expect(screen.getByTestId('protein-goal')).toBeInTheDocument();
    expect(screen.getByTestId('carbs-goal')).toBeInTheDocument();
    expect(screen.getByTestId('fat-goal')).toBeInTheDocument();
    
    // Check if days are displayed
    expect(screen.getByTestId('day-Monday')).toBeInTheDocument();
    expect(screen.getByTestId('day-Tuesday')).toBeInTheDocument();
  });

  it('displays diet preferences when clicking the preferences tab', () => {
    renderComponent();
    
    // Click on the "Preferences" tab
    fireEvent.click(screen.getByRole('tab', { name: 'Preferences' }));
    
    // Check if the diet preferences form is displayed
    expect(screen.getByTestId('diet-preferences')).toBeInTheDocument();
    expect(screen.getByTestId('diet-type')).toBeInTheDocument();
    expect(screen.getByTestId('calorie-goal')).toBeInTheDocument();
    
    // Click the save preferences button and check if alert is shown
    fireEvent.click(screen.getByTestId('save-preferences-button'));
    expect(mockAlert).toHaveBeenCalledWith('Diet preferences saved successfully!');
  });
});