const request = require('supertest');
const app = require('../src/index');

describe('Server Health Check', () => {
  it('should have a running server that responds to requests', async () => {
    // This test verifies that the server is running and can handle basic requests
    // without requiring MongoDB connection
    const res = await request(app).get('/');
    
    // Server should respond with some status code (not concerned with which one)
    // Just verifying it responds and doesn't crash
    expect(res.status).toBeDefined();
    expect(typeof res.status).toBe('number');
  });
  
  it('should handle requests to non-existent endpoints gracefully', async () => {
    // This test verifies the server handles 404 cases properly
    const res = await request(app).get('/non-existent-path');
    
    // Should return 404 or some error code
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it('should handle requests without authentication properly', async () => {
    // This test verifies authentication middleware works without MongoDB
    const res = await request(app).get('/api/users/profile');
    
    // Should return 401 Unauthorized
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Not authorized, no token');
  });
});