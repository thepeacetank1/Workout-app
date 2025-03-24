import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

// Mock the API client for thunks
const mockApiClient = {
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} })),
  patch: jest.fn(() => Promise.resolve({ data: {} }))
};

// Define an enhanced thunk middleware with proper handling
const thunkMiddleware = thunk.withExtraArgument({
  // Add any extra arguments your thunks use here
  api: mockApiClient,
  apiClient: mockApiClient,
  services: {
    auth: {
      login: jest.fn(() => Promise.resolve({ user: {}, token: 'mock-token' })),
      register: jest.fn(() => Promise.resolve({ user: {}, token: 'mock-token' })),
      logout: jest.fn(() => Promise.resolve(true))
    },
    workout: {
      getWorkouts: jest.fn(() => Promise.resolve([])),
      saveWorkout: jest.fn(() => Promise.resolve({}))
    }
  }
});

// Create middleware with enhanced thunk
const middlewares = [thunkMiddleware];
const mockStore = configureMockStore(middlewares);

// Create default mock store state with recursive deep merge
const deepMerge = (target, source) => {
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (result[key] && typeof result[key] === 'object' && !Array.isArray(result[key])) {
        result[key] = deepMerge(result[key], source[key]);
      } else {
        result[key] = { ...source[key] };
      }
    } else {
      result[key] = source[key];
    }
  }
  
  return result;
};

/**
 * Creates a redux mock store with thunk support
 * @param {Object} customState - Optional state overrides 
 * @returns {Object} Configured mock store
 */
const createMockStore = (customState = {}) => {
  // Default state with comprehensive test data
  const defaultState = {
    auth: {
      user: {
        id: 'test-user-id',
        name: 'Test User',
        email: 'testuser@example.com',
        preferences: {
          theme: 'light',
          notifications: true
        }
      },
      token: 'mock-token',
      isAuthenticated: true,
      isLoading: false,
      error: null,
      authChecked: true
    },
    workout: {
      workouts: [
        {
          id: '1',
          name: 'Full Body Strength',
          description: 'A complete full body workout focusing on strength',
          type: 'strength',
          duration: 45,
          difficulty: 'intermediate',
          exercises: [
            { id: 'ex1', name: 'Squats', sets: 3, reps: 12 },
            { id: 'ex2', name: 'Push-ups', sets: 3, reps: 15 }
          ]
        },
        {
          id: '2',
          name: 'HIIT Cardio',
          description: 'High-intensity interval training for maximum calorie burn',
          type: 'cardio',
          duration: 30,
          difficulty: 'advanced',
          exercises: [
            { id: 'ex3', name: 'Burpees', sets: 4, reps: 20 },
            { id: 'ex4', name: 'Mountain Climbers', sets: 4, reps: 30 }
          ]
        }
      ],
      sessions: [
        {
          id: 'session1',
          workoutId: '1',
          date: '2023-03-15',
          duration: 45,
          completed: true
        }
      ],
      currentWorkout: null,
      isLoading: false,
      error: null
    },
    diet: {
      plans: [
        {
          id: 'plan1',
          name: 'High Protein Plan',
          description: 'Focus on protein-rich foods',
          days: 7,
          meals: []
        }
      ],
      preferences: {
        calorieGoal: 2200,
        dietType: 'high-protein',
        restrictions: ['no-artificial-sweeteners', 'limited-dairy'],
        budgetConstraint: 80,
        mealsPerDay: 4,
        preferredCuisines: ['Mediterranean', 'Asian', 'Mexican']
      },
      currentPlan: null,
      isLoading: false,
      error: null
    },
    ui: {
      theme: 'light',
      sidebarOpen: false,
      activePage: 'dashboard',
      notifications: []
    }
  };

  // Use deep merge to avoid losing nested state
  const mergedState = deepMerge(defaultState, customState);
  
  // Create the store with merged state
  const store = mockStore(mergedState);
  
  // Add a getState method that returns the current state
  // This helps with testing thunks that access getState
  store.getState = () => mergedState;
  
  return store;
};

export default createMockStore;