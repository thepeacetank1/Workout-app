const React = require('react');

// Create mock components for each Chakra UI component
const createChakraMock = (displayName) => {
  const MockComponent = React.forwardRef(({ children, ...props }, ref) => {
    return React.createElement('div', {
      'data-testid': `chakra-${displayName.toLowerCase()}`,
      ref,
      ...props
    }, children);
  });
  MockComponent.displayName = displayName;
  return MockComponent;
};

// Create mock custom hooks
const useToast = () => {
  const toast = jest.fn();
  toast.closeAll = jest.fn();
  toast.close = jest.fn();
  toast.isActive = jest.fn();
  return toast;
};

const useDisclosure = () => ({
  isOpen: false,
  onOpen: jest.fn(),
  onClose: jest.fn(),
  onToggle: jest.fn(),
});

const useColorMode = () => ({
  colorMode: 'light',
  toggleColorMode: jest.fn(),
  setColorMode: jest.fn(),
});

const useColorModeValue = (lightValue, darkValue) => lightValue;

// Create mock context providers
const ChakraProvider = ({ children }) => children;
const ColorModeProvider = ({ children }) => children;
const ThemeProvider = ({ children }) => children;

// Mock specific components with additional functionality
const Button = React.forwardRef(({ children, onClick, isLoading, loadingText, isDisabled, ...props }, ref) => {
  return React.createElement('button', {
    'data-testid': 'chakra-button',
    onClick,
    disabled: isLoading || isDisabled,
    ref,
    ...props
  }, isLoading && loadingText ? loadingText : children);
});
Button.displayName = 'Button';

const Input = React.forwardRef(({ onChange, type = 'text', ...props }, ref) => {
  return React.createElement('input', {
    'data-testid': 'chakra-input',
    onChange,
    type,
    ref,
    ...props
  });
});
Input.displayName = 'Input';

const Link = React.forwardRef(({ children, as, to, href, ...props }, ref) => {
  // Handle RouterLink integration - support both 'as' prop pattern and direct import
  if (as && (as.displayName === 'Link' || as.displayName === 'BrowserRouter')) {
    return React.createElement('a', {
      'data-testid': 'chakra-router-link',
      href: to || href || '#',
      ref,
      'data-to': to,
      ...props
    }, children);
  }
  
  return React.createElement('a', {
    'data-testid': 'chakra-link',
    href: href || '#',
    ref,
    ...props
  }, children);
});
Link.displayName = 'Link';

const FormLabel = ({ children, htmlFor, ...props }) => {
  return React.createElement('label', {
    'data-testid': 'chakra-form-label',
    htmlFor,
    ...props
  }, children);
};
FormLabel.displayName = 'FormLabel';

const Checkbox = ({ children, isChecked, onChange, ...props }) => {
  return React.createElement('div', {
    'data-testid': 'chakra-checkbox',
    ...props
  }, [
    React.createElement('input', {
      key: 'input',
      type: 'checkbox',
      checked: isChecked,
      onChange
    }),
    React.createElement('label', { key: 'label' }, children)
  ]);
};
Checkbox.displayName = 'Checkbox';

// Mock input group and related components
const InputGroup = ({ children, ...props }) => {
  return React.createElement('div', {
    'data-testid': 'chakra-input-group',
    ...props
  }, children);
};
InputGroup.displayName = 'InputGroup';

const InputRightElement = ({ children, ...props }) => {
  return React.createElement('div', {
    'data-testid': 'chakra-input-right-element',
    ...props
  }, children);
};
InputRightElement.displayName = 'InputRightElement';

// Export all mocked components
module.exports = {
  // Providers
  ChakraProvider,
  ColorModeProvider,
  ThemeProvider,
  
  // Layout components
  Box: createChakraMock('Box'),
  Container: createChakraMock('Container'),
  Flex: createChakraMock('Flex'),
  Grid: createChakraMock('Grid'),
  GridItem: createChakraMock('GridItem'),
  SimpleGrid: createChakraMock('SimpleGrid'),
  Stack: createChakraMock('Stack'),
  HStack: createChakraMock('HStack'),
  VStack: createChakraMock('VStack'),
  Center: createChakraMock('Center'),
  
  // Typography components
  Heading: ({ children, ...props }) => 
    React.createElement('h1', { 'data-testid': 'chakra-heading', ...props }, children),
  Text: ({ children, ...props }) => 
    React.createElement('p', { 'data-testid': 'chakra-text', ...props }, children),
  
  // Form components
  Button,
  Input,
  Textarea: createChakraMock('Textarea'),
  Select: createChakraMock('Select'),
  Checkbox,
  Radio: createChakraMock('Radio'),
  RadioGroup: createChakraMock('RadioGroup'),
  FormControl: createChakraMock('FormControl'),
  FormLabel,
  FormHelperText: createChakraMock('FormHelperText'),
  FormErrorMessage: createChakraMock('FormErrorMessage'),
  InputGroup,
  InputLeftElement: createChakraMock('InputLeftElement'),
  InputRightElement,
  InputLeftAddon: createChakraMock('InputLeftAddon'),
  InputRightAddon: createChakraMock('InputRightAddon'),
  
  // Feedback components
  Alert: createChakraMock('Alert'),
  AlertIcon: createChakraMock('AlertIcon'),
  AlertTitle: createChakraMock('AlertTitle'),
  AlertDescription: createChakraMock('AlertDescription'),
  CircularProgress: createChakraMock('CircularProgress'),
  Progress: createChakraMock('Progress'),
  Spinner: () => React.createElement('div', { 'data-testid': 'chakra-spinner' }, 'Loading your dashboard...'),
  Skeleton: createChakraMock('Skeleton'),
  
  // Navigation components
  Breadcrumb: createChakraMock('Breadcrumb'),
  BreadcrumbItem: createChakraMock('BreadcrumbItem'),
  BreadcrumbLink: createChakraMock('BreadcrumbLink'),
  Menu: createChakraMock('Menu'),
  MenuButton: createChakraMock('MenuButton'),
  MenuList: createChakraMock('MenuList'),
  MenuItem: createChakraMock('MenuItem'),
  Tabs: ({ children, index, onChange, ...props }) => {
    return React.createElement('div', {
      'data-testid': 'chakra-tabs',
      ...props
    }, typeof children === 'function' ? children({ index, onChange }) : children);
  },
  TabList: ({ children, ...props }) => {
    return React.createElement('div', {
      'data-testid': 'chakra-tablist',
      role: 'tablist',
      ...props
    }, children);
  },
  Tab: ({ children, isSelected, ...props }) => {
    return React.createElement('button', {
      'data-testid': 'chakra-tab',
      role: 'tab',
      'aria-selected': isSelected === true,
      ...props
    }, children);
  },
  TabPanels: createChakraMock('TabPanels'),
  TabPanel: ({ children, ...props }) => {
    return React.createElement('div', {
      'data-testid': 'chakra-tabpanel',
      role: 'tabpanel',
      ...props
    }, children);
  },
  
  // Overlay components
  Modal: createChakraMock('Modal'),
  ModalOverlay: createChakraMock('ModalOverlay'),
  ModalContent: createChakraMock('ModalContent'),
  ModalHeader: createChakraMock('ModalHeader'),
  ModalFooter: createChakraMock('ModalFooter'),
  ModalBody: createChakraMock('ModalBody'),
  ModalCloseButton: createChakraMock('ModalCloseButton'),
  Drawer: createChakraMock('Drawer'),
  DrawerOverlay: createChakraMock('DrawerOverlay'),
  DrawerContent: createChakraMock('DrawerContent'),
  DrawerHeader: createChakraMock('DrawerHeader'),
  DrawerFooter: createChakraMock('DrawerFooter'),
  DrawerBody: createChakraMock('DrawerBody'),
  DrawerCloseButton: createChakraMock('DrawerCloseButton'),
  Tooltip: createChakraMock('Tooltip'),
  
  // Media components
  Avatar: createChakraMock('Avatar'),
  AvatarBadge: createChakraMock('AvatarBadge'),
  AvatarGroup: createChakraMock('AvatarGroup'),
  Image: createChakraMock('Image'),
  
  // Other components
  Divider: () => React.createElement('hr', { 'data-testid': 'chakra-divider' }),
  Badge: createChakraMock('Badge'),
  Icon: createChakraMock('Icon'),
  IconButton: ({ 'aria-label': ariaLabel, icon, onClick, ...props }) => 
    React.createElement('button', { 
      'aria-label': ariaLabel, 
      onClick, 
      'data-testid': 'chakra-icon-button',
      ...props
    }, icon),
  Card: createChakraMock('Card'),
  CardHeader: createChakraMock('CardHeader'),
  CardBody: createChakraMock('CardBody'),
  CardFooter: createChakraMock('CardFooter'),
  
  // Links
  Link,
  
  // Hooks
  useToast,
  useDisclosure,
  useColorMode,
  useColorModeValue,
  
  // Constants and utils
  createStandaloneToast: () => ({ toast: jest.fn() })
};