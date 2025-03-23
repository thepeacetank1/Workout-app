import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import createMockStore from '../mocks/mockStore';

// Mock the component dependencies
jest.mock('../../components/workout/WorkoutList', () => {
  return function MockedWorkoutList({ onViewWorkout, onEditWorkout, onDeleteWorkout }) {
    return (
      <div data-testid="workout-list">
        <div data-testid="workout-1" onClick={() => onViewWorkout('1')}>Full Body Strength</div>
        <div data-testid="workout-2" onClick={() => onEditWorkout('2')}>HIIT Cardio</div>
        <div data-testid="workout-3" onClick={() => onDeleteWorkout('3')}>Yoga Flow</div>
        <div data-testid="workout-4">Core Crusher</div>
      </div>
    );
  };
});

jest.mock('../../components/workout/WorkoutLogger', () => {
  return function MockedWorkoutLogger() {
    return <div data-testid="workout-logger">Workout Logger Component</div>;
  }
});

jest.mock('../../components/workout/WorkoutCalendar', () => {
  return function MockedWorkoutCalendar() {
    return <div data-testid="workout-calendar">Workout Calendar Component</div>;
  }
});

// Mock store actions
jest.mock('../../store/slices/workoutSlice', () => ({
  fetchWorkouts: jest.fn().mockReturnValue({ type: 'workout/fetchWorkouts' }),
  deleteWorkout: jest.fn().mockReturnValue({ type: 'workout/deleteWorkout' }),
  getWorkoutSessions: jest.fn().mockReturnValue({ type: 'workout/getWorkoutSessions' }),
}));

// Setup tests
describe('WorkoutPage component', () => {
  // Import the actual component (not mocked)
  const WorkoutPage = require('../../components/pages/WorkoutPage').default;
  
  const renderWithProviders = (ui) => {
    const store = createMockStore();
    return render(
      <Provider store={store}>
        {ui}
      </Provider>
    );
  };

  it('renders the component title correctly', async () => {
    renderWithProviders(<WorkoutPage />);
    
    // Check that the main title is rendered
    await waitFor(() => {
      expect(screen.getByText('Workouts')).toBeInTheDocument();
    });
  });
  
  it('renders the tabs correctly', async () => {
    renderWithProviders(<WorkoutPage />);
    
    // Check that the tabs are rendered - test by their content rather than role
    await waitFor(() => {
      expect(screen.getByText('My Workouts')).toBeInTheDocument();
      expect(screen.getByText('Log Workout')).toBeInTheDocument();
      expect(screen.getByText('Schedule')).toBeInTheDocument();
      expect(screen.getByText('History')).toBeInTheDocument();
    });
  });
  
  it('renders the workout list on the first tab', async () => {
    renderWithProviders(<WorkoutPage />);
    
    // Check that the workout list is rendered
    await waitFor(() => {
      expect(screen.getByTestId('workout-list')).toBeInTheDocument();
    });
  });
});