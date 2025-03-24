// Enhanced mock for apiClient with better async handling and consistent response structure
const createResponsePromise = (data = {}, status = 200, delay = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data,
        status,
        statusText: status === 200 ? 'OK' : 'Error',
        headers: {},
        config: {},
        request: {}
      });
    }, delay);
  });
};

// Default response structure for API methods
const defaultResponse = { success: true, data: {}, message: 'Success' };

const apiClientMock = {
  get: jest.fn(() => createResponsePromise(defaultResponse)),
  post: jest.fn(() => createResponsePromise(defaultResponse)),
  put: jest.fn(() => createResponsePromise(defaultResponse)),
  delete: jest.fn(() => createResponsePromise(defaultResponse)),
  patch: jest.fn(() => createResponsePromise(defaultResponse)),
  request: jest.fn(() => createResponsePromise(defaultResponse)),
  interceptors: {
    request: {
      use: jest.fn(),
      eject: jest.fn()
    },
    response: {
      use: jest.fn(),
      eject: jest.fn()
    }
  },
  defaults: {
    headers: {
      common: {},
      delete: {},
      get: {},
      head: {},
      post: {},
      put: {},
      patch: {}
    },
    baseURL: '',
    transformRequest: [],
    transformResponse: []
  },
  
  // Helper method to setup specific mock responses for testing
  __setMockResponse: function(method, path, data, status = 200, delay = 0) {
    this[method].mockImplementationOnce((url) => {
      if (url.includes(path)) {
        return createResponsePromise(data, status, delay);
      }
      return createResponsePromise(defaultResponse);
    });
    return this;
  }
};

// Enhanced helper functions with better async handling and ability to set custom responses
const createApiPromise = (data = {}, delay = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ 
        success: true, 
        data, 
        message: 'Success' 
      });
    }, delay);
  });
};

// Default implementations for API methods
const apiGet = jest.fn(() => createApiPromise());
const apiPost = jest.fn(() => createApiPromise());
const apiPut = jest.fn(() => createApiPromise());
const apiDelete = jest.fn(() => createApiPromise());

// Add ability to set mock responses for specific paths
apiGet.mockResponseFor = (path, data, delay = 0) => {
  apiGet.mockImplementationOnce((url) => {
    if (url.includes(path)) {
      return createApiPromise(data, delay);
    }
    return createApiPromise();
  });
  return apiGet;
};

apiPost.mockResponseFor = (path, data, delay = 0) => {
  apiPost.mockImplementationOnce((url) => {
    if (url.includes(path)) {
      return createApiPromise(data, delay);
    }
    return createApiPromise();
  });
  return apiPost;
};

apiPut.mockResponseFor = (path, data, delay = 0) => {
  apiPut.mockImplementationOnce((url) => {
    if (url.includes(path)) {
      return createApiPromise(data, delay);
    }
    return createApiPromise();
  });
  return apiPut;
};

apiDelete.mockResponseFor = (path, data, delay = 0) => {
  apiDelete.mockImplementationOnce((url) => {
    if (url.includes(path)) {
      return createApiPromise(data, delay);
    }
    return createApiPromise();
  });
  return apiDelete;
};

// Export as ES Module to avoid import issues
module.exports = {
  __esModule: true,
  default: apiClientMock,
  apiGet,
  apiPost,
  apiPut,
  apiDelete
};