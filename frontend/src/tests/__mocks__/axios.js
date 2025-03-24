// Enhanced mock for axios with better async handling and request tracking
const createAxiosResponse = (data = {}, status = 200, delay = 0) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (status >= 200 && status < 300) {
        resolve({
          data,
          status,
          statusText: status === 200 ? 'OK' : 'Success',
          headers: {},
          config: {},
          request: {}
        });
      } else {
        const error = new Error(`Request failed with status ${status}`);
        error.response = {
          data,
          status,
          statusText: 'Error',
          headers: {},
          config: {},
          request: {}
        };
        error.isAxiosError = true;
        reject(error);
      }
    }, delay);
  });
};

// Track request history for testing
const requestHistory = [];

const axiosMock = {
  __requestHistory: requestHistory,
  
  // Clear request history for test isolation
  __clearHistory: () => {
    requestHistory.length = 0;
  },
  
  // Configure mock responses
  __setMockResponse: (method, url, data, status = 200, delay = 0) => {
    axiosMock[method].mockImplementationOnce((requestUrl, requestData) => {
      if (typeof requestUrl === 'string' && requestUrl.includes(url)) {
        requestHistory.push({ method, url: requestUrl, data: requestData });
        return createAxiosResponse(data, status, delay);
      } else if (typeof requestUrl === 'object' && requestUrl.url && requestUrl.url.includes(url)) {
        requestHistory.push({ method, url: requestUrl.url, data: requestUrl.data });
        return createAxiosResponse(data, status, delay);
      }
      // Default response
      requestHistory.push({ method, url: typeof requestUrl === 'string' ? requestUrl : requestUrl.url, data: requestData });
      return createAxiosResponse({}, 200, delay);
    });
    return axiosMock;
  },
  
  create: jest.fn(() => axiosMock),
  get: jest.fn((url) => {
    requestHistory.push({ method: 'get', url });
    return createAxiosResponse({});
  }),
  post: jest.fn((url, data) => {
    requestHistory.push({ method: 'post', url, data });
    return createAxiosResponse({});
  }),
  put: jest.fn((url, data) => {
    requestHistory.push({ method: 'put', url, data });
    return createAxiosResponse({});
  }),
  delete: jest.fn((url) => {
    requestHistory.push({ method: 'delete', url });
    return createAxiosResponse({});
  }),
  patch: jest.fn((url, data) => {
    requestHistory.push({ method: 'patch', url, data });
    return createAxiosResponse({});
  }),
  request: jest.fn((config) => {
    requestHistory.push({ method: config.method || 'get', url: config.url, data: config.data });
    return createAxiosResponse({});
  }),
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
    transformResponse: [],
    timeout: 0,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    maxContentLength: -1,
    validateStatus: jest.fn((status) => status >= 200 && status < 300)
  },
  isCancel: jest.fn(() => false),
  CancelToken: {
    source: jest.fn(() => ({
      token: {},
      cancel: jest.fn()
    }))
  },
  isAxiosError: jest.fn((error) => error && error.isAxiosError === true)
};

// Handle both CommonJS and ESM
module.exports = {
  __esModule: true,
  default: axiosMock,
  ...axiosMock
};