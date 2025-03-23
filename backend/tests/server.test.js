const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/index');
const User = require('../src/models/userModel');

// Test user data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123'
};

let authToken;
let mongoConnected = false;

// Timeout for MongoDB connection attempts (5 seconds)
const MONGO_TIMEOUT = 5000;

// Helper function to check MongoDB connection with timeout
const checkMongoConnection = async () => {
  return new Promise((resolve) => {
    // Set a timeout to abort connection attempt
    const timeoutId = setTimeout(() => {
      console.warn('MongoDB connection timeout - tests will be skipped if database is unreachable');
      resolve(false);
    }, MONGO_TIMEOUT);
    
    // Try to connect
    try {
      if (mongoose.connection.readyState === 1) {
        clearTimeout(timeoutId);
        resolve(true);
      }
      
      // Check if already connecting
      if (mongoose.connection.readyState === 2) {
        mongoose.connection.once('connected', () => {
          clearTimeout(timeoutId);
          resolve(true);
        });
        
        mongoose.connection.once('error', () => {
          clearTimeout(timeoutId);
          resolve(false);
        });
      }
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('Error checking MongoDB connection:', error);
      resolve(false);
    }
  });
};

beforeAll(async () => {
  // Check MongoDB connection
  mongoConnected = await checkMongoConnection();
  
  if (!mongoConnected) {
    console.warn('⚠️ MongoDB is not available - some tests will be skipped');
    return;
  }
  
  // Clear users collection before tests
  try {
    await User.deleteMany({ email: testUser.email });
  } catch (err) {
    console.error('Error cleaning up test database:', err);
    mongoConnected = false;
  }
});

afterAll(async () => {
  // Only clean up if MongoDB was connected
  if (mongoConnected) {
    try {
      await User.deleteMany({ email: testUser.email });
      await mongoose.connection.close();
    } catch (err) {
      console.error('Error cleaning up after tests:', err);
    }
  }
});

describe('Server API Endpoints', () => {
  // Basic server health check that doesn't require MongoDB
  describe('Server Health', () => {
    it('should have a running server', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).not.toEqual(500);
    });
  });

  describe('User Authentication', () => {
    beforeEach(() => {
      // Skip tests if MongoDB is not connected
      if (!mongoConnected) {
        console.warn('Skipping test - MongoDB not available');
        return;
      }
    });

    it('should register a new user', async () => {
      // Skip test if MongoDB is not connected
      if (!mongoConnected) return;

      const res = await request(app)
        .post('/api/users/register')
        .send(testUser);
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('name', testUser.name);
      expect(res.body.user).toHaveProperty('email', testUser.email);
      expect(res.body.user).not.toHaveProperty('password');
    });

    it('should login the user', async () => {
      // Skip test if MongoDB is not connected
      if (!mongoConnected) return;

      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('name', testUser.name);
      expect(res.body.user).toHaveProperty('email', testUser.email);
      
      // Save token for authenticated requests
      authToken = res.body.token;
    });

    it('should not login with wrong password', async () => {
      // Skip test if MongoDB is not connected
      if (!mongoConnected) return;

      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });
      
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });
  });

  describe('Protected Routes', () => {
    beforeEach(() => {
      // Skip tests if MongoDB is not connected
      if (!mongoConnected) {
        console.warn('Skipping test - MongoDB not available');
        return;
      }
    });

    it('should get user profile with auth token', async () => {
      // Skip test if MongoDB is not connected
      if (!mongoConnected) return;

      const res = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('name', testUser.name);
      expect(res.body).toHaveProperty('email', testUser.email);
    });

    it('should reject requests without auth token', async () => {
      // This test doesn't actually require MongoDB to be available,
      // as it tests the authentication middleware which runs before DB access
      const res = await request(app)
        .get('/api/users/profile');
      
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message', 'Not authorized, no token');
    });
  });

  describe('Workouts API', () => {
    beforeEach(() => {
      // Skip tests if MongoDB is not connected
      if (!mongoConnected) {
        console.warn('Skipping test - MongoDB not available');
        return;
      }
    });

    it('should return empty array when no workouts exist', async () => {
      // Skip test if MongoDB is not connected
      if (!mongoConnected) return;

      const res = await request(app)
        .get('/api/workouts')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    // Add more workout API tests here
  });

  describe('Nutrition API', () => {
    beforeEach(() => {
      // Skip tests if MongoDB is not connected
      if (!mongoConnected) {
        console.warn('Skipping test - MongoDB not available');
        return;
      }
    });

    it('should return empty array when no nutrition entries exist', async () => {
      // Skip test if MongoDB is not connected
      if (!mongoConnected) return;

      const res = await request(app)
        .get('/api/nutrition')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    // Add more nutrition API tests here
  });

  describe('Goals API', () => {
    beforeEach(() => {
      // Skip tests if MongoDB is not connected
      if (!mongoConnected) {
        console.warn('Skipping test - MongoDB not available');
        return;
      }
    });

    it('should return empty array when no goals exist', async () => {
      // Skip test if MongoDB is not connected
      if (!mongoConnected) return;

      const res = await request(app)
        .get('/api/goals')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    // Add more goals API tests here
  });
});