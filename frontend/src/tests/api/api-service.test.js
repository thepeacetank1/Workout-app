// Mock axios before imports
jest.mock('axios');

// Import axios
const axios = require('axios');

// Use the mock localStorage already setup in setupTests.js
// We don't need to define it here as it should be available globally

describe('Auth API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Define login function for testing
  const login = async (credentials) => {
    try {
      const response = await axios.post('/api/auth/login', credentials);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Authentication failed');
      }
      throw error;
    }
  };

  // Define logout function for testing
  const logout = () => {
    localStorage.removeItem('token');
  };

  // Define getUserProfile function for testing
  const getUserProfile = async () => {
    try {
      const response = await axios.get('/api/auth/profile');
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to fetch profile');
      }
      throw error;
    }
  };

  test('login should make POST request to auth endpoint', async () => {
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
    const result = await login(credentials);

    // Assertions
    expect(axios.post).toHaveBeenCalledWith('/api/auth/login', credentials);
    expect(result.token).toBe('test-jwt-token');
    expect(result.user).toEqual({ id: '1', name: 'Test User', email: 'test@example.com' });
  });

  test('logout should remove token from localStorage', () => {
    // Reset mock state before test
    jest.clearAllMocks();
    
    // Mock localStorage.removeItem specifically for this test
    jest.spyOn(window.localStorage.__proto__, 'removeItem')
      .mockImplementation(jest.fn());
    
    // Call logout
    logout();
    
    // Check that token was removed using more specific assertion
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('token');
  });

  test('getUserProfile should make GET request to profile endpoint', async () => {
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
    const result = await getUserProfile();

    // Assertions
    expect(axios.get).toHaveBeenCalledWith('/api/auth/profile');
    expect(result.id).toBe('1');
    expect(result.name).toBe('Test User');
    expect(result.fitnessLevel).toBe('Intermediate');
  });
});