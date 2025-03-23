// Import axios directly here
import axios from 'axios';

// Create API service mock functions
const authService = {
  login: async (credentials) => {
    try {
      const response = await axios.post('/api/auth/login', credentials);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Authentication failed');
      }
      throw error;
    }
  },
  
  register: async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Registration failed');
      }
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
  },
  
  getUserProfile: async () => {
    try {
      const response = await axios.get('/api/auth/profile');
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to fetch profile');
      }
      throw error;
    }
  }
};

const workoutService = {
  fetchWorkouts: async () => {
    try {
      const response = await axios.get('/api/workouts');
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to fetch workouts');
      }
      throw error;
    }
  },
  
  getWorkoutById: async (id) => {
    try {
      const response = await axios.get(`/api/workouts/${id}`);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to fetch workout');
      }
      throw error;
    }
  },
  
  createWorkout: async (workoutData) => {
    try {
      const response = await axios.post('/api/workouts', workoutData);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to create workout');
      }
      throw error;
    }
  },
  
  updateWorkout: async (id, workoutData) => {
    try {
      const response = await axios.put(`/api/workouts/${id}`, workoutData);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to update workout');
      }
      throw error;
    }
  },
  
  deleteWorkout: async (id) => {
    try {
      await axios.delete(`/api/workouts/${id}`);
      return { success: true };
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to delete workout');
      }
      throw error;
    }
  },
  
  logWorkoutSession: async (sessionData) => {
    try {
      const response = await axios.post('/api/workouts/sessions', sessionData);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to log workout');
      }
      throw error;
    }
  },
  
  getWorkoutSessions: async () => {
    try {
      const response = await axios.get('/api/workouts/sessions');
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to fetch workout sessions');
      }
      throw error;
    }
  }
};

const dietService = {
  fetchMealPlan: async (planId) => {
    try {
      const response = await axios.get(`/api/diet/plans/${planId}`);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to fetch meal plan');
      }
      throw error;
    }
  },
  
  updateDietPreferences: async (preferencesData) => {
    try {
      const response = await axios.put('/api/diet/preferences', preferencesData);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to update diet preferences');
      }
      throw error;
    }
  },
  
  getDietPreferences: async () => {
    try {
      const response = await axios.get('/api/diet/preferences');
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to fetch diet preferences');
      }
      throw error;
    }
  },
  
  generateShoppingList: async (mealPlanId) => {
    try {
      const response = await axios.get(`/api/diet/shopping-list/${mealPlanId}`);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to generate shopping list');
      }
      throw error;
    }
  }
};

const profileService = {
  getProfile: async () => {
    try {
      const response = await axios.get('/api/users/profile');
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to fetch profile');
      }
      throw error;
    }
  },
  
  updateProfile: async (profileData) => {
    try {
      const response = await axios.put('/api/users/profile', profileData);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to update profile');
      }
      throw error;
    }
  },
  
  updateUserImage: async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await axios.post('/api/users/profile/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to upload image');
      }
      throw error;
    }
  }
};

// Create complete mocks for axios
jest.mock('axios');

describe('API Services', () => {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('Auth API Service', () => {
    it('login should make POST request to auth endpoint', async () => {
      // Setup axios mock
      axios.post.mockResolvedValue({ 
        data: { 
          token: 'test-jwt-token',
          user: { id: '1', name: 'Test User', email: 'test@example.com' } 
        }
      });

      // Test parameters
      const credentials = { email: 'test@example.com', password: 'password123' };

      // Call the service
      const result = await authService.login(credentials);

      // Assertions
      expect(axios.post).toHaveBeenCalledWith('/api/auth/login', credentials);
      expect(result.token).toBe('test-jwt-token');
      expect(result.user).toEqual({ id: '1', name: 'Test User', email: 'test@example.com' });
    });

    it('register should make POST request to register endpoint', async () => {
      // Setup axios mock
      axios.post.mockResolvedValue({ 
        data: { 
          token: 'test-jwt-token',
          user: { id: '1', name: 'New User', email: 'new@example.com' } 
        }
      });

      // Test parameters
      const userData = { 
        name: 'New User', 
        email: 'new@example.com', 
        password: 'password123' 
      };

      // Call the service
      const result = await authService.register(userData);

      // Assertions
      expect(axios.post).toHaveBeenCalledWith('/api/auth/register', userData);
      expect(result.token).toBe('test-jwt-token');
      expect(result.user).toEqual({ id: '1', name: 'New User', email: 'new@example.com' });
    });

    it('should handle login errors properly', async () => {
      // Setup mock to return error
      const errorResponse = { 
        response: { 
          data: { message: 'Invalid credentials' },
          status: 401
        }
      };
      axios.post.mockRejectedValue(errorResponse);

      // Test parameters
      const credentials = { email: 'wrong@example.com', password: 'wrongpass' };

      // Expect the service to throw an error
      await expect(authService.login(credentials)).rejects.toThrow('Invalid credentials');
      expect(axios.post).toHaveBeenCalledWith('/api/auth/login', credentials);
    });

    it('logout should remove token from localStorage', () => {
      // Setup localStorage with a token
      localStorage.setItem('token', 'test-token');
      
      // Call logout
      authService.logout();
      
      // Check that token was removed
      expect(localStorage.getItem('token')).toBeNull();
    });

    it('getUserProfile should make GET request to profile endpoint', async () => {
      // Setup axios mock
      axios.get.mockResolvedValue({ 
        data: { 
          id: '1', 
          name: 'Test User', 
          email: 'test@example.com',
          fitnessGoals: ['Weight loss', 'Muscle gain'],
          fitnessLevel: 'Intermediate' 
        }
      });

      // Call the service
      const result = await authService.getUserProfile();

      // Assertions
      expect(axios.get).toHaveBeenCalledWith('/api/auth/profile');
      expect(result.id).toBe('1');
      expect(result.name).toBe('Test User');
      expect(result.fitnessLevel).toBe('Intermediate');
    });
  });

  describe('Workout API Service', () => {
    it('fetchWorkouts should make GET request to workouts endpoint', async () => {
      // Setup axios mock
      const mockWorkouts = [
        { id: '1', name: 'Chest Day', exercises: ['Bench Press', 'Push-ups'] },
        { id: '2', name: 'Leg Day', exercises: ['Squats', 'Lunges'] }
      ];
      axios.get.mockResolvedValue({ data: mockWorkouts });

      // Call the service
      const result = await workoutService.fetchWorkouts();

      // Assertions
      expect(axios.get).toHaveBeenCalledWith('/api/workouts');
      expect(result).toEqual(mockWorkouts);
      expect(result.length).toBe(2);
    });

    it('getWorkoutById should make GET request to specific workout endpoint', async () => {
      // Setup axios mock
      const mockWorkout = { 
        id: '1', 
        name: 'Chest Day', 
        description: 'Full chest workout routine',
        exercises: [
          { name: 'Bench Press', sets: 3, reps: '8-10', weight: '135lbs' },
          { name: 'Push-ups', sets: 3, reps: '15-20', weight: 'bodyweight' }
        ]
      };
      axios.get.mockResolvedValue({ data: mockWorkout });

      // Call the service
      const result = await workoutService.getWorkoutById('1');

      // Assertions
      expect(axios.get).toHaveBeenCalledWith('/api/workouts/1');
      expect(result).toEqual(mockWorkout);
      expect(result.exercises.length).toBe(2);
    });

    it('createWorkout should make POST request to workouts endpoint', async () => {
      // Setup axios mock
      const newWorkout = { 
        id: '3', 
        name: 'Back Day', 
        description: 'Complete back routine',
        exercises: [
          { name: 'Pull-ups', sets: 3, reps: '8-10', weight: 'bodyweight' },
          { name: 'Rows', sets: 3, reps: '10-12', weight: '80lbs' }
        ]
      };
      axios.post.mockResolvedValue({ data: newWorkout });

      // Test parameters
      const workoutData = { 
        name: 'Back Day', 
        description: 'Complete back routine',
        exercises: [
          { name: 'Pull-ups', sets: 3, reps: '8-10', weight: 'bodyweight' },
          { name: 'Rows', sets: 3, reps: '10-12', weight: '80lbs' }
        ]
      };

      // Call the service
      const result = await workoutService.createWorkout(workoutData);

      // Assertions
      expect(axios.post).toHaveBeenCalledWith('/api/workouts', workoutData);
      expect(result).toEqual(newWorkout);
    });

    it('updateWorkout should make PUT request to specific workout endpoint', async () => {
      // Setup axios mock
      const updatedWorkout = { 
        id: '1', 
        name: 'Updated Chest Day', 
        description: 'Revised chest workout',
        exercises: [
          { name: 'Incline Bench Press', sets: 4, reps: '8', weight: '145lbs' },
          { name: 'Cable Flyes', sets: 3, reps: '12', weight: '30lbs' }
        ]
      };
      axios.put.mockResolvedValue({ data: updatedWorkout });

      // Test parameters
      const workoutId = '1';
      const workoutData = { 
        name: 'Updated Chest Day', 
        description: 'Revised chest workout',
        exercises: [
          { name: 'Incline Bench Press', sets: 4, reps: '8', weight: '145lbs' },
          { name: 'Cable Flyes', sets: 3, reps: '12', weight: '30lbs' }
        ]
      };

      // Call the service
      const result = await workoutService.updateWorkout(workoutId, workoutData);

      // Assertions
      expect(axios.put).toHaveBeenCalledWith('/api/workouts/1', workoutData);
      expect(result).toEqual(updatedWorkout);
    });

    it('deleteWorkout should make DELETE request to specific workout endpoint', async () => {
      // Setup axios mock
      axios.delete.mockResolvedValue({ data: { success: true } });

      // Call the service
      const result = await workoutService.deleteWorkout('1');

      // Assertions
      expect(axios.delete).toHaveBeenCalledWith('/api/workouts/1');
      expect(result).toEqual({ success: true });
    });

    it('logWorkoutSession should make POST request to sessions endpoint', async () => {
      // Setup axios mock
      const newSession = { 
        id: '1', 
        workout: '1',
        date: '2023-11-20',
        duration: 60,
        exercises: [
          { name: 'Bench Press', sets: 3, reps: 10, weight: 135 },
          { name: 'Push-ups', sets: 3, reps: 15, weight: 0 }
        ],
        notes: 'Great workout session!'
      };
      axios.post.mockResolvedValue({ data: newSession });

      // Test parameters
      const sessionData = { 
        workout: '1',
        date: '2023-11-20',
        duration: 60,
        exercises: [
          { name: 'Bench Press', sets: 3, reps: 10, weight: 135 },
          { name: 'Push-ups', sets: 3, reps: 15, weight: 0 }
        ],
        notes: 'Great workout session!'
      };

      // Call the service
      const result = await workoutService.logWorkoutSession(sessionData);

      // Assertions
      expect(axios.post).toHaveBeenCalledWith('/api/workouts/sessions', sessionData);
      expect(result).toEqual(newSession);
    });

    it('getWorkoutSessions should make GET request to sessions endpoint', async () => {
      // Setup axios mock
      const mockSessions = [
        { 
          id: '1', 
          workout: { id: '1', name: 'Chest Day' },
          date: '2023-11-20',
          duration: 60,
          exercises: [
            { name: 'Bench Press', sets: 3, reps: 10, weight: 135 },
            { name: 'Push-ups', sets: 3, reps: 15, weight: 0 }
          ]
        },
        { 
          id: '2', 
          workout: { id: '2', name: 'Leg Day' },
          date: '2023-11-22',
          duration: 45,
          exercises: [
            { name: 'Squats', sets: 4, reps: 12, weight: 185 },
            { name: 'Lunges', sets: 3, reps: 10, weight: 30 }
          ]
        }
      ];
      axios.get.mockResolvedValue({ data: mockSessions });

      // Call the service
      const result = await workoutService.getWorkoutSessions();

      // Assertions
      expect(axios.get).toHaveBeenCalledWith('/api/workouts/sessions');
      expect(result).toEqual(mockSessions);
      expect(result.length).toBe(2);
    });
  });

  describe('Diet API Service', () => {
    it('fetchMealPlan should make GET request to meal plans endpoint', async () => {
      // Setup axios mock
      const mockMealPlan = {
        id: '1',
        name: 'Weight Loss Plan',
        meals: [
          { id: '1', name: 'Breakfast', calories: 400 },
          { id: '2', name: 'Lunch', calories: 600 },
          { id: '3', name: 'Dinner', calories: 500 }
        ]
      };
      axios.get.mockResolvedValue({ data: mockMealPlan });

      // Call the service
      const result = await dietService.fetchMealPlan('1');

      // Assertions
      expect(axios.get).toHaveBeenCalledWith('/api/diet/plans/1');
      expect(result).toEqual(mockMealPlan);
      expect(result.meals.length).toBe(3);
    });

    it('updateDietPreferences should make PUT request to preferences endpoint', async () => {
      // Setup axios mock
      const updatedPreferences = {
        id: '1',
        calorieGoal: 2200,
        dietType: 'keto',
        restrictions: ['no-dairy', 'low-carb'],
        allergens: ['peanuts', 'shellfish']
      };
      axios.put.mockResolvedValue({ data: updatedPreferences });

      // Test parameters
      const preferencesData = {
        calorieGoal: 2200,
        dietType: 'keto',
        restrictions: ['no-dairy', 'low-carb'],
        allergens: ['peanuts', 'shellfish']
      };

      // Call the service
      const result = await dietService.updateDietPreferences(preferencesData);

      // Assertions
      expect(axios.put).toHaveBeenCalledWith('/api/diet/preferences', preferencesData);
      expect(result).toEqual(updatedPreferences);
    });

    it('getDietPreferences should make GET request to preferences endpoint', async () => {
      // Setup axios mock
      const mockPreferences = {
        id: '1',
        calorieGoal: 2000,
        dietType: 'balanced',
        restrictions: ['vegetarian'],
        allergens: ['gluten']
      };
      axios.get.mockResolvedValue({ data: mockPreferences });

      // Call the service
      const result = await dietService.getDietPreferences();

      // Assertions
      expect(axios.get).toHaveBeenCalledWith('/api/diet/preferences');
      expect(result).toEqual(mockPreferences);
    });

    it('generateShoppingList should make GET request to shopping-list endpoint', async () => {
      // Setup axios mock
      const mockShoppingList = {
        id: '1',
        mealPlanId: '1',
        items: [
          { name: 'Chicken breast', amount: '2 lbs', category: 'Protein' },
          { name: 'Broccoli', amount: '1 head', category: 'Vegetables' },
          { name: 'Brown rice', amount: '2 cups', category: 'Grains' }
        ]
      };
      axios.get.mockResolvedValue({ data: mockShoppingList });

      // Call the service
      const result = await dietService.generateShoppingList('1');

      // Assertions
      expect(axios.get).toHaveBeenCalledWith('/api/diet/shopping-list/1');
      expect(result).toEqual(mockShoppingList);
      expect(result.items.length).toBe(3);
    });
  });

  describe('User Profile API Service', () => {
    it('getProfile should make GET request to profile endpoint', async () => {
      // Setup axios mock
      const mockProfile = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        bio: 'Fitness enthusiast',
        height: 180,
        weight: 75,
        fitnessLevel: 'Intermediate',
        fitnessGoals: ['Weight loss', 'Muscle tone']
      };
      axios.get.mockResolvedValue({ data: mockProfile });

      // Call the service
      const result = await profileService.getProfile();

      // Assertions
      expect(axios.get).toHaveBeenCalledWith('/api/users/profile');
      expect(result).toEqual(mockProfile);
    });

    it('updateProfile should make PUT request to profile endpoint', async () => {
      // Setup axios mock
      const updatedProfile = { 
        id: '1', 
        name: 'Updated User', 
        email: 'updated@example.com',
        bio: 'Fitness and nutrition enthusiast',
        height: 180,
        weight: 72,
        weightGoal: 70,
        fitnessLevel: 'Advanced'
      };
      axios.put.mockResolvedValue({ data: updatedProfile });

      // Test parameters
      const profileData = { 
        name: 'Updated User',
        bio: 'Fitness and nutrition enthusiast',
        weight: 72,
        weightGoal: 70,
        fitnessLevel: 'Advanced'
      };

      // Call the service
      const result = await profileService.updateProfile(profileData);

      // Assertions
      expect(axios.put).toHaveBeenCalledWith('/api/users/profile', profileData);
      expect(result).toEqual(updatedProfile);
    });

    it('updateUserImage should make POST request to profile image endpoint', async () => {
      // Setup axios mock
      const imageResponse = { 
        success: true,
        imageUrl: 'https://example.com/images/profile-1.jpg'
      };
      axios.post.mockResolvedValue({ data: imageResponse });

      // Create a mock file
      const mockFile = new File(['dummy content'], 'profile.jpg', { type: 'image/jpeg' });

      // Call the service
      const result = await profileService.updateUserImage(mockFile);

      // Check form data was created (we can't check the exact content easily)
      expect(axios.post).toHaveBeenCalled();
      expect(axios.post.mock.calls[0][0]).toBe('/api/users/profile/image');
      expect(axios.post.mock.calls[0][2].headers['Content-Type']).toBe('multipart/form-data');
      expect(result).toEqual(imageResponse);
    });
  });
});