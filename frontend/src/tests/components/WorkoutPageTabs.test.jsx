import React from 'react';
import { screen, waitFor, fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

// Mock the component dependencies
jest.mock('../../components/workout/WorkoutList', () => {
  return function MockedWorkoutList() {
    return <div data-testid="workout-list">Workout List Component</div>;
  };
});

jest.mock('../../components/workout/WorkoutLogger', () => {
  return function MockedWorkoutLogger() {
    return <div data-testid="workout-logger">Workout Logger Component</div>;
  };
});

jest.mock('../../components/workout/WorkoutCalendar', () => {
  return function MockedWorkoutCalendar() {
    return <div data-testid="workout-calendar">Workout Calendar Component</div>;
  };
});

// Mock store actions - using thunk functions
jest.mock('../../store/slices/workoutSlice', () => ({
  fetchWorkouts: jest.fn().mockImplementation(() => {
    return (dispatch) => {
      dispatch({ type: 'workout/fetchWorkouts/pending' });
      dispatch({ type: 'workout/fetchWorkouts/fulfilled', payload: [] });
      return Promise.resolve([]);
    };
  }),
  deleteWorkout: jest.fn().mockImplementation((id) => {
    return (dispatch) => {
      dispatch({ type: 'workout/deleteWorkout/pending' });
      dispatch({ type: 'workout/deleteWorkout/fulfilled', payload: id });
      return Promise.resolve(id);
    };
  }),
  getWorkoutSessions: jest.fn().mockImplementation(() => {
    return (dispatch) => {
      dispatch({ type: 'workout/getWorkoutSessions/pending' });
      dispatch({ type: 'workout/getWorkoutSessions/fulfilled', payload: [] });
      return Promise.resolve([]);
    };
  }),
}));

// Import the actual component
import WorkoutPage from '../../components/pages/WorkoutPage';

describe('WorkoutPage Tab Isolation Tests', () => {
  
  // Define custom state with workouts and sessions
  const customState = {
    workout: {
      workouts: [
        { id: '1', name: 'Full Body Strength', type: 'strength' },
        { id: '2', name: 'HIIT Cardio', type: 'cardio' },
        { id: '3', name: 'Yoga Flow', type: 'flexibility' },
      ],
      sessions: [
        { 
          id: '1', 
          workout: { name: 'Morning Workout' }, 
          date: '2023-11-17', 
          duration: 45,
          exercises: [{ name: 'Push-ups', sets: 3, reps: 10 }],
          notes: 'Felt great!' 
        }
      ],
    }
  };

  // Create a custom render function with a properly configured store
  const renderWithConfiguredStore = (ui) => {
    // Use a simple directly created store with thunk middleware
    const middlewares = [thunk.withExtraArgument({})];
    const mockStoreWithThunk = configureMockStore(middlewares);
    
    const store = mockStoreWithThunk({
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
          { id: '1', name: 'Full Body Strength', type: 'strength' },
          { id: '2', name: 'HIIT Cardio', type: 'cardio' },
          { id: '3', name: 'Yoga Flow', type: 'flexibility' },
        ],
        sessions: [
          { 
            id: '1', 
            workout: { name: 'Morning Workout' }, 
            date: '2023-11-17', 
            duration: 45,
            exercises: [{ name: 'Push-ups', sets: 3, reps: 10 }],
            notes: 'Felt great!' 
          }
        ],
        isLoading: false,
        error: null
      }
    });
    
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <ChakraProvider>
            {ui}
          </ChakraProvider>
        </BrowserRouter>
      </Provider>
    );
  };

  it('renders the first tab (My Workouts) by default', async () => {
    // Use direct rendering with configured store instead of renderWithProviders
    renderWithConfiguredStore(<WorkoutPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('workout-list')).toBeInTheDocument();
    });
  });

  it('switches to the Log Workout tab when clicked', async () => {
    renderWithConfiguredStore(<WorkoutPage />);
    
    // Find the Log Workout tab and click it
    const logWorkoutTab = screen.getByText('Log Workout');
    fireEvent.click(logWorkoutTab);
    
    // Verify the workout logger is displayed
    await waitFor(() => {
      expect(screen.getByTestId('workout-logger')).toBeInTheDocument();
    });
  });

  it('switches to the Schedule tab when clicked', async () => {
    renderWithConfiguredStore(<WorkoutPage />);
    
    // Find the Schedule tab and click it
    const scheduleTab = screen.getByText('Schedule');
    fireEvent.click(scheduleTab);
    
    // Verify the workout calendar is displayed
    await waitFor(() => {
      expect(screen.getByTestId('workout-calendar')).toBeInTheDocument();
    });
  });

  it('switches to the History tab when clicked', async () => {
    renderWithConfiguredStore(<WorkoutPage />);
    
    // Find the History tab and click it
    const historyTab = screen.getByText('History');
    fireEvent.click(historyTab);
    
    // Verify workout history content is displayed
    await waitFor(() => {
      // Look for text specific to the history tab
      expect(screen.getByText('Workout History')).toBeInTheDocument();
      
      // Since we have a session in our mock data, it should display the workout name
      expect(screen.getByText('Morning Workout')).toBeInTheDocument();
    });
  });
  
  it('shows "No workout history" message when no sessions exist', async () => {
    // Use a simple directly created store with thunk middleware but with empty sessions
    const middlewares = [thunk.withExtraArgument({})];
    const mockStoreWithThunk = configureMockStore(middlewares);
    
    const store = mockStoreWithThunk({
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
          { id: '1', name: 'Full Body Strength', type: 'strength' },
          { id: '2', name: 'HIIT Cardio', type: 'cardio' },
          { id: '3', name: 'Yoga Flow', type: 'flexibility' },
        ],
        sessions: [], // Empty sessions array
        isLoading: false,
        error: null
      }
    });
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ChakraProvider>
            <WorkoutPage />
          </ChakraProvider>
        </BrowserRouter>
      </Provider>
    );
    
    // Switch to the History tab
    const historyTab = screen.getByText('History');
    fireEvent.click(historyTab);
    
    // Verify the "no history" message is shown
    await waitFor(() => {
      expect(screen.getByText(/no workout history available/i)).toBeInTheDocument();
    });
  });
});