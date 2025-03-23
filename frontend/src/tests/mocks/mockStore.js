import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

// Create middleware with thunk
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

// Create default mock store state
const createMockStore = (customState = {}) => {
  const defaultState = {
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
        },
        {
          id: '4',
          name: 'Core Crusher',
          description: 'Focused core workout to build abdominal strength',
          type: 'strength',
          duration: 20,
          difficulty: 'intermediate'
        }
      ],
      sessions: [],
      isLoading: false,
      error: null
    },
    diet: {
      plans: [],
      preferences: {
        calorieGoal: 2200,
        dietType: 'high-protein',
        restrictions: ['no-artificial-sweeteners', 'limited-dairy'],
        budgetConstraint: 80,
        mealsPerDay: 4,
        preferredCuisines: ['Mediterranean', 'Asian', 'Mexican']
      },
      isLoading: false,
      error: null
    }
  };

  // Merge custom state with default state
  return mockStore({
    ...defaultState,
    ...customState
  });
};

export default createMockStore;