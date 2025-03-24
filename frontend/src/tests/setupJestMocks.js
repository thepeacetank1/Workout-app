// Advanced Jest mocks setup for consistent test behavior

// Set up mock timers to handle setTimeout, setInterval, etc.
jest.useFakeTimers();

// Mock API client
jest.mock('../api/client', () => require('./__mocks__/apiClient'));

// Mock axios
jest.mock('axios', () => require('./__mocks__/axios'));

// Use the enhanced mockStore for Redux testing
jest.mock('../store', () => {
  const mockStore = require('./mocks/mockStore').default;
  const defaultStore = mockStore();
  
  // Properly handle thunks with full middleware support
  const mockDispatch = jest.fn((action) => {
    // If action is a function (thunk), call it with dispatch and getState
    if (typeof action === 'function') {
      return action(mockDispatch, defaultStore.getState, {});
    }
    return action;
  });

  return {
    __esModule: true,
    store: {
      ...defaultStore,
      dispatch: mockDispatch,
      subscribe: jest.fn(),
      replaceReducer: jest.fn(),
    },
    default: {
      ...defaultStore,
      dispatch: mockDispatch,
      subscribe: jest.fn(),
      replaceReducer: jest.fn(),
    }
  };
});

// Import React in the mock factory function to avoid the out-of-scope reference error
jest.mock('react-router-dom', () => {
  const mockReactRouterDom = jest.requireActual('react-router-dom');
  
  // Create stub components that forward to the actual implementation
  return {
    ...mockReactRouterDom,
    // Add any specific overrides here if needed
    useLocation: jest.fn().mockImplementation(() => ({
      pathname: '/',
      search: '',
      hash: '',
      state: { 
        from: { pathname: '/app' },
        message: null,
        redirectPath: null,
        email: ''
      },
      key: '5nvxpbdafa'
    })),
    useNavigate: jest.fn().mockReturnValue(jest.fn()),
    useParams: jest.fn().mockReturnValue({}),
    useSearchParams: jest.fn().mockReturnValue([
      {
        get: jest.fn(key => null),
        getAll: jest.fn(() => []),
        has: jest.fn(() => false),
        forEach: jest.fn()
      },
      jest.fn()
    ])
  };
});

// Mock Chakra UI using a factory function that doesn't reference React directly
jest.mock('@chakra-ui/react', () => {
  // Import React inside the factory function to avoid the scope issue
  const React = jest.requireActual('react');
  
  // Create a mock component factory
  const createMockComponent = (displayName) => {
    const MockComponent = ({children, ...props}) => {
      return React.createElement('div', {
        'data-testid': `chakra-${displayName.toLowerCase()}`,
        ...props
      }, children);
    };
    MockComponent.displayName = displayName;
    return MockComponent;
  };
  
  // List of components to ensure are mocked
  const additionalComponents = [
    'SimpleGrid', 'Grid', 'GridItem', 'ChakraProvider', 'Icon',
    'IconButton', 'Card', 'CardHeader', 'CardBody', 'CardFooter',
    'Container', 'Center', 'Circle', 'Square', 'Wrap', 'WrapItem'
  ];
  
  // Create the basic mock module
  const mockModule = {
    ChakraProvider: ({children}) => React.createElement('div', {'data-testid': 'chakra-provider'}, children),
    Box: createMockComponent('Box'),
    SimpleGrid: ({children, columns, spacing, ...props}) => 
      React.createElement('div', {
        'data-testid': 'chakra-simple-grid',
        style: {
          display: 'grid',
          gridTemplateColumns: columns && typeof columns === 'number' ? `repeat(${columns}, 1fr)` : 'repeat(2, 1fr)',
          gap: spacing || '10px'
        },
        ...props
      }, children),
    Grid: ({children, templateColumns, gap, ...props}) => 
      React.createElement('div', {
        'data-testid': 'chakra-grid',
        style: {
          display: 'grid',
          gridTemplateColumns: templateColumns || 'repeat(2, 1fr)',
          gap: gap || '10px'
        },
        ...props
      }, children),
    GridItem: createMockComponent('GridItem'),
    Button: ({children, onClick, isLoading, ...props}) => 
      React.createElement('button', {
        'data-testid': 'chakra-button',
        onClick,
        disabled: isLoading,
        ...props
      }, children),
    Input: ({onChange, ...props}) => 
      React.createElement('input', {
        'data-testid': 'chakra-input',
        onChange,
        ...props
      }),
    FormControl: createMockComponent('FormControl'),
    FormLabel: ({children, ...props}) => 
      React.createElement('label', {
        'data-testid': 'chakra-form-label',
        ...props
      }, children),
    FormErrorMessage: createMockComponent('FormErrorMessage'),
    Stack: createMockComponent('Stack'),
    HStack: createMockComponent('HStack'),
    VStack: createMockComponent('VStack'),
    Flex: createMockComponent('Flex'),
    Text: ({children, ...props}) => 
      React.createElement('p', {
        'data-testid': 'chakra-text',
        ...props
      }, children),
    Heading: ({children, ...props}) => 
      React.createElement('h1', {
        'data-testid': 'chakra-heading',
        ...props
      }, children),
    Tabs: ({children, ...props}) => 
      React.createElement('div', {
        'data-testid': 'chakra-tabs',
        ...props
      }, children),
    TabList: ({children, ...props}) => 
      React.createElement('div', {
        'data-testid': 'chakra-tablist',
        role: 'tablist',
        ...props
      }, children),
    Tab: ({children, isSelected, ...props}) => 
      React.createElement('button', {
        'data-testid': 'chakra-tab',
        role: 'tab',
        'aria-selected': !!isSelected,
        ...props
      }, children),
    TabPanels: createMockComponent('TabPanels'),
    TabPanel: ({children, ...props}) => 
      React.createElement('div', {
        'data-testid': 'chakra-tabpanel',
        role: 'tabpanel',
        ...props
      }, children),
    Link: ({children, ...props}) => 
      React.createElement('a', {
        'data-testid': 'chakra-link',
        href: props.href || '#',
        ...props
      }, children),
    Checkbox: ({children, isChecked, onChange, ...props}) => 
      React.createElement('div', {
        'data-testid': 'chakra-checkbox',
        ...props
      }, [
        React.createElement('input', {
          key: 'checkbox-input',
          type: 'checkbox',
          checked: isChecked,
          onChange
        }),
        React.createElement('label', {key: 'checkbox-label'}, children)
      ]),
    // Add NumberInput components
    NumberInput: createMockComponent('NumberInput'),
    NumberInputField: createMockComponent('NumberInputField'),
    NumberInputStepper: createMockComponent('NumberInputStepper'),
    NumberIncrementStepper: createMockComponent('NumberIncrementStepper'),
    NumberDecrementStepper: createMockComponent('NumberDecrementStepper'),
    // Add more components
    Container: createMockComponent('Container'),
    Center: createMockComponent('Center'),
    Avatar: createMockComponent('Avatar'),
    AvatarBadge: createMockComponent('AvatarBadge'),
    Badge: createMockComponent('Badge'),
    Alert: createMockComponent('Alert'),
    AlertIcon: createMockComponent('AlertIcon'),
    AlertTitle: createMockComponent('AlertTitle'),
    AlertDescription: createMockComponent('AlertDescription'),
    Icon: createMockComponent('Icon'),
    IconButton: createMockComponent('IconButton'),
    Spinner: createMockComponent('Spinner'),
    Divider: createMockComponent('Divider'),
    Image: createMockComponent('Image'),
    // Card components
    Card: createMockComponent('Card'),
    CardHeader: createMockComponent('CardHeader'),
    CardBody: createMockComponent('CardBody'),
    CardFooter: createMockComponent('CardFooter'),
    // Select components
    Select: createMockComponent('Select'),
    // Textarea
    Textarea: createMockComponent('Textarea'),
    // Modal components
    Modal: createMockComponent('Modal'),
    ModalOverlay: createMockComponent('ModalOverlay'),
    ModalContent: createMockComponent('ModalContent'),
    ModalHeader: createMockComponent('ModalHeader'),
    ModalFooter: createMockComponent('ModalFooter'),
    ModalBody: createMockComponent('ModalBody'),
    ModalCloseButton: createMockComponent('ModalCloseButton'),
    // Other hooks
    useToast: () => jest.fn(),
    useDisclosure: () => ({
      isOpen: false,
      onOpen: jest.fn(),
      onClose: jest.fn(),
      onToggle: jest.fn()
    }),
    useColorMode: () => ({
      colorMode: 'light',
      toggleColorMode: jest.fn(),
      setColorMode: jest.fn()
    }),
    useColorModeValue: (lightValue, darkValue) => lightValue
  };
  
  // Add any missing additional components
  additionalComponents.forEach(component => {
    if (!mockModule[component]) {
      mockModule[component] = createMockComponent(component);
    }
  });
  
  return mockModule;
});

// Mock Chakra UI icons
jest.mock('@chakra-ui/icons', () => {
  // Import React inside the factory function to avoid the scope issue
  const React = jest.requireActual('react');
  
  const createIconMock = (name) => {
    const Icon = (props) => {
      return React.createElement('span', {
        'data-testid': `chakra-icon-${name.toLowerCase()}`,
        ...props
      });
    };
    Icon.displayName = name;
    return Icon;
  };

  return {
    ViewIcon: createIconMock('ViewIcon'),
    ViewOffIcon: createIconMock('ViewOffIcon'),
    CheckIcon: createIconMock('CheckIcon'),
    CloseIcon: createIconMock('CloseIcon'),
    AddIcon: createIconMock('AddIcon'),
    MinusIcon: createIconMock('MinusIcon'),
    InfoIcon: createIconMock('InfoIcon'),
    WarningIcon: createIconMock('WarningIcon'),
    CalendarIcon: createIconMock('CalendarIcon'),
    SearchIcon: createIconMock('SearchIcon'),
    ArrowForwardIcon: createIconMock('ArrowForwardIcon'),
    ArrowBackIcon: createIconMock('ArrowBackIcon'),
    HamburgerIcon: createIconMock('HamburgerIcon'),
    SettingsIcon: createIconMock('SettingsIcon')
  };
});

// Mock React Icons
jest.mock('react-icons/fa', () => {
  // Import React inside the factory function to avoid the scope issue
  const React = jest.requireActual('react');
  
  // Create a simple icon mock factory
  const createIconMock = (name) => {
    const Icon = (props) => {
      return React.createElement('span', {
        'data-testid': `fa-icon-${name.toLowerCase()}`,
        ...props
      });
    };
    Icon.displayName = name;
    return Icon;
  };

  // Export common icons used in the app
  return {
    FaEye: createIconMock('FaEye'),
    FaEyeSlash: createIconMock('FaEyeSlash'),
    FaGoogle: createIconMock('FaGoogle'),
    FaUser: createIconMock('FaUser'),
    FaEnvelope: createIconMock('FaEnvelope'),
    FaLock: createIconMock('FaLock'),
    FaHome: createIconMock('FaHome'),
    FaDumbbell: createIconMock('FaDumbbell'),
    FaUtensils: createIconMock('FaUtensils'),
    FaUserAlt: createIconMock('FaUserAlt'),
    FaSignInAlt: createIconMock('FaSignInAlt'),
    FaFacebook: createIconMock('FaFacebook'),
    FaApple: createIconMock('FaApple'),
    FaStar: createIconMock('FaStar'),
    FaEdit: createIconMock('FaEdit'),
    FaTrash: createIconMock('FaTrash'),
    FaCheck: createIconMock('FaCheck'),
    FaTimes: createIconMock('FaTimes'),
    FaCalendarAlt: createIconMock('FaCalendarAlt'),
    FaChartLine: createIconMock('FaChartLine'),
    FaWeight: createIconMock('FaWeight'),
    // Add any other icons needed by your tests
  };
});

// Mock window.matchMedia and other browser-specific APIs
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

global.IntersectionObserver = MockIntersectionObserver;

// Mock ResizeObserver
class MockResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

global.ResizeObserver = MockResizeObserver;

// Mock for FormData
global.FormData = class FormData {
  constructor() {
    this.data = {};
  }
  append(key, value) {
    this.data[key] = value;
  }
  get(key) {
    return this.data[key];
  }
  getAll() {
    return Object.values(this.data);
  }
  entries() {
    return Object.entries(this.data);
  }
};

// Set up a more robust test environment
global.testUtils = {
  // Helper to wait for DOM updates to complete
  waitForDomChange: () => new Promise(resolve => setTimeout(resolve, 0)),
  
  // Helper to wait for all promises to resolve
  flushPromises: () => new Promise(resolve => setImmediate(resolve)),
  
  // Helper to simulate API responses
  mockApiResponse: (data = {}, status = 200, headers = {}) => ({
    data,
    status,
    headers,
    statusText: status === 200 ? 'OK' : 'Error',
    config: {},
    request: {}
  })
};