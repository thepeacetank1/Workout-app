import React from 'react';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import renderWithProviders from '../utils/test-wrapper';

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

// Mock store actions
jest.mock('../../store/slices/workoutSlice', () => ({
  fetchWorkouts: jest.fn().mockReturnValue({ type: 'workout/fetchWorkouts' }),
  deleteWorkout: jest.fn().mockReturnValue({ type: 'workout/deleteWorkout' }),
  getWorkoutSessions: jest.fn().mockReturnValue({ type: 'workout/getWorkoutSessions' }),
}));

describe('WorkoutPage Tab Isolation Tests', () => {
  // Import the actual component
  const WorkoutPage = require('../../components/pages/WorkoutPage').default;
  
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

  it('renders the first tab (My Workouts) by default', async () => {
    renderWithProviders(<WorkoutPage />, { customState });
    
    await waitFor(() => {
      expect(screen.getByTestId('workout-list')).toBeInTheDocument();
    });
  });

  it('switches to the Log Workout tab when clicked', async () => {
    renderWithProviders(<WorkoutPage />, { customState });
    
    // Find the Log Workout tab and click it
    const logWorkoutTab = screen.getByText('Log Workout');
    fireEvent.click(logWorkoutTab);
    
    // Verify the workout logger is displayed
    await waitFor(() => {
      expect(screen.getByTestId('workout-logger')).toBeInTheDocument();
    });
  });

  it('switches to the Schedule tab when clicked', async () => {
    renderWithProviders(<WorkoutPage />, { customState });
    
    // Find the Schedule tab and click it
    const scheduleTab = screen.getByText('Schedule');
    fireEvent.click(scheduleTab);
    
    // Verify the workout calendar is displayed
    await waitFor(() => {
      expect(screen.getByTestId('workout-calendar')).toBeInTheDocument();
    });
  });

  it('switches to the History tab when clicked', async () => {
    renderWithProviders(<WorkoutPage />, { customState });
    
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
    // Create a custom state with no sessions
    const emptySessionsState = {
      workout: {
        ...customState.workout,
        sessions: []
      }
    };
    
    renderWithProviders(<WorkoutPage />, { customState: emptySessionsState });
    
    // Switch to the History tab
    const historyTab = screen.getByText('History');
    fireEvent.click(historyTab);
    
    // Verify the "no history" message is shown
    await waitFor(() => {
      expect(screen.getByText(/no workout history available/i)).toBeInTheDocument();
    });
  });
});