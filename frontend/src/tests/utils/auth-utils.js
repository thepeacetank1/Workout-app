/**
 * Utilities to help with authentication in tests
 */

/**
 * Sets up the localStorage with authentication token
 * @param {string} token - The JWT token
 * @param {Object} user - The user object
 */
export const setupAuthToken = (token = 'test-auth-token', user = { id: 'test-user-id', name: 'Test User' }) => {
  // Reset storage first
  localStorage.clear();
  
  // Store token and user data
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  
  return { token, user };
};

/**
 * Clears authentication data from localStorage
 */
export const clearAuthToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Creates a mock JWT token for testing
 * @param {Object} payload - Token payload data
 * @returns {string} Mock JWT token
 */
export const createMockToken = (payload = {}) => {
  // Create a basic payload with defaults
  const tokenPayload = {
    sub: 'test-user-id',
    name: 'Test User',
    email: 'test@example.com',
    exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
    iat: Math.floor(Date.now() / 1000),
    ...payload
  };
  
  // Create token parts
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payloadEncoded = btoa(JSON.stringify(tokenPayload));
  const signature = 'TEST_SIGNATURE'; // Not a real signature, just for testing
  
  // Combine parts
  return `${header}.${payloadEncoded}.${signature}`;
};

/**
 * Creates expired token for testing expiration logic
 * @returns {string} Expired mock JWT token
 */
export const createExpiredToken = () => {
  return createMockToken({
    exp: Math.floor(Date.now() / 1000) - 3600 // 1 hour ago (expired)
  });
};

export default {
  setupAuthToken,
  clearAuthToken,
  createMockToken,
  createExpiredToken
};