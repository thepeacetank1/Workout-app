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

// Mock store actions - making sure they work with thunk middleware
jest.mock('../../store/slices/workoutSlice', () => ({
  // These actions now return proper thunk functions
  fetchWorkouts: jest.fn().mockImplementation(() => {
    return (dispatch) => {
      dispatch({ type: 'workout/fetchWorkouts/pending' });
      return Promise.resolve().then(() => {
        dispatch({
          type: 'workout/fetchWorkouts/fulfilled',
          payload: []
        });
        return [];
      });
    };
  }),
  deleteWorkout: jest.fn().mockImplementation((id) => {
    return (dispatch) => {
      dispatch({ type: 'workout/deleteWorkout/pending' });
      return Promise.resolve().then(() => {
        dispatch({
          type: 'workout/deleteWorkout/fulfilled',
          payload: id
        });
        return id;
      });
    };
  }),
  getWorkoutSessions: jest.fn().mockImplementation(() => {
    return (dispatch) => {
      dispatch({ type: 'workout/getWorkoutSessions/pending' });
      return Promise.resolve().then(() => {
        dispatch({
          type: 'workout/getWorkoutSessions/fulfilled',
          payload: []
        });
        return [];
      });
    };
  }),
}));

// Import the actual component (not mocked)
import WorkoutPage from '../../components/pages/WorkoutPage';

// Setup tests
describe('WorkoutPage component', () => {
  const renderWithProviders = (ui: React.ReactElement) => {
    // Use the shared mock store creator which has thunk middleware properly configured
    const store = createMockStore({
      auth: {
        user: {
          id: 'test-user-id',
          name: 'Test User',
          email: 'testuser@example.com',
        },
        token: 'mock-token',
        isAuthenticated: true,
        isLoading: false, 
        error: null
      },
      workout: {
        workouts: [
          {
            id: '1',
            name: 'Full Body Strength',
            description: 'A complete full body workout focusing on strength',
            type: 'strength',
            duration: 45,
            difficulty: 'intermediate'
          },
          {
            id: '2',
            name: 'HIIT Cardio',
            description: 'High-intensity interval training for maximum calorie burn',
            type: 'cardio',
            duration: 30,
            difficulty: 'advanced'
          },
          {
            id: '3',
            name: 'Yoga Flow',
            description: 'Gentle yoga flow for flexibility and relaxation',
            type: 'flexibility',
            duration: 60,
            difficulty: 'beginner'
          }
        ],
        sessions: [],
        isLoading: false,
        error: null
      }
    });
    
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