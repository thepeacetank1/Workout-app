const mongoose = require('mongoose');

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

describe('MongoDB Connection', () => {
  it('should handle MongoDB connection timeout gracefully', async () => {
    // This test verifies the timeout functionality works correctly
    jest.useFakeTimers();
    
    // Mock mongoose connection to always be in connecting state (readyState = 2)
    const originalReadyState = mongoose.connection.readyState;
    Object.defineProperty(mongoose.connection, 'readyState', {
      get: jest.fn().mockReturnValue(2)
    });
    
    // Start the connection check
    const connectionPromise = checkMongoConnection();
    
    // Fast-forward time to trigger the timeout
    jest.advanceTimersByTime(MONGO_TIMEOUT + 100);
    
    // Wait for the promise to resolve
    const result = await connectionPromise;
    
    // Verify the promise resolved to false (connection timed out)
    expect(result).toBe(false);
    
    // Restore original readyState
    Object.defineProperty(mongoose.connection, 'readyState', {
      get: () => originalReadyState
    });
    
    jest.useRealTimers();
  });

  it('should detect existing MongoDB connection', async () => {
    // This test verifies detection of an already connected state
    const originalReadyState = mongoose.connection.readyState;
    
    // Mock mongoose connection to be connected (readyState = 1)
    Object.defineProperty(mongoose.connection, 'readyState', {
      get: jest.fn().mockReturnValue(1)
    });
    
    // Check connection
    const result = await checkMongoConnection();
    
    // Should detect as connected
    expect(result).toBe(true);
    
    // Restore original readyState
    Object.defineProperty(mongoose.connection, 'readyState', {
      get: () => originalReadyState
    });
  });

  it('should handle connection errors gracefully', async () => {
    // This test verifies error handling in connection check
    jest.useFakeTimers();
    
    // Mock mongoose connection to be connecting
    const originalReadyState = mongoose.connection.readyState;
    Object.defineProperty(mongoose.connection, 'readyState', {
      get: jest.fn().mockReturnValue(2)
    });
    
    // Mock connection event
    const originalOnce = mongoose.connection.once;
    mongoose.connection.once = jest.fn((event, callback) => {
      if (event === 'error') {
        // Simulate error event
        setTimeout(() => callback(new Error('Connection failed')), 100);
      }
    });
    
    // Start connection check
    const connectionPromise = checkMongoConnection();
    
    // Advance time to trigger the error callback
    jest.advanceTimersByTime(200);
    
    // Wait for promise to resolve
    const result = await connectionPromise;
    
    // Should handle error and resolve to false
    expect(result).toBe(false);
    
    // Restore originals
    Object.defineProperty(mongoose.connection, 'readyState', {
      get: () => originalReadyState
    });
    mongoose.connection.once = originalOnce;
    
    jest.useRealTimers();
  });
});

module.exports = { checkMongoConnection };