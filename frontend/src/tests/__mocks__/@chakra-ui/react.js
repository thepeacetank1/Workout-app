const React = require('react');

// List of Chakra UI props to filter out or handle specially
const CHAKRA_PROPS = [
  'borderRadius', 'borderWidth', 'borderColor', 'borderTop', 'borderBottom', 
  'borderLeft', 'borderRight', 'colorScheme', 'variant', 'isOpen', 'onOpen', 
  'onClose', 'onToggle', 'isDisabled', 'isInvalid', 'isReadOnly', 'isRequired',
  'isChecked', 'isFocused', 'isLoading', 'isActive', 'spacing', 'direction',
  'align', 'justify', 'wrap', 'flex', 'flexGrow', 'flexShrink', 'flexBasis',
  'w', 'h', 'minW', 'maxW', 'minH', 'maxH', 'p', 'px', 'py', 'pt', 'pr', 'pb', 'pl',
  'm', 'mx', 'my', 'mt', 'mr', 'mb', 'ml', 'size', 'shadow', 'columns', 'rows',
  'gap', 'rowGap', 'columnGap', 'templateColumns', 'templateRows', 'templateAreas'
];

// Create mock components for each Chakra UI component
const createChakraMock = (displayName) => {
  const MockComponent = React.forwardRef((props, ref) => {
    // Extract children before destructuring
    const { children, ...rest } = props;
    
    // Filter out Chakra UI specific props
    const domProps = {};
    const chakraProps = {};
    
    Object.keys(rest).forEach(key => {
      if (CHAKRA_PROPS.includes(key)) {
        chakraProps[key] = rest[key];
      } else if (key.startsWith('_') || key.startsWith('aria-') || key === 'role' || key === 'id' || key === 'className' || key === 'data-testid') {
        // Pass through common DOM props and accessibility attributes directly
        domProps[key] = rest[key];
      } else if (typeof rest[key] === 'function') {
        // Pass through event handlers and functions
        domProps[key] = rest[key];
      } else {
        // Default behavior for unknown props - transform to data attributes to avoid React warnings
        const dataAttrName = `data-${key.toLowerCase().replace(/([A-Z])/g, '-$1')}`;
        domProps[dataAttrName] = rest[key];
      }
    });

    // Convert some Chakra UI props to style properties
    const style = {
      ...(domProps.style || {}),
      ...(chakraProps.borderRadius ? { borderRadius: typeof chakraProps.borderRadius === 'string' ? chakraProps.borderRadius : `${chakraProps.borderRadius}px` } : {}),
      ...(chakraProps.borderWidth ? { borderWidth: typeof chakraProps.borderWidth === 'string' ? chakraProps.borderWidth : `${chakraProps.borderWidth}px` } : {}),
      ...(chakraProps.borderColor ? { borderColor: chakraProps.borderColor } : {})
    };

    // Create data attributes for Chakra specific props
    const dataAttrs = {};
    Object.keys(chakraProps).forEach(key => {
      if (typeof chakraProps[key] !== 'function') {
        const dataAttrName = `data-chakra-${key.toLowerCase()}`;
        dataAttrs[dataAttrName] = chakraProps[key] === true ? '' : chakraProps[key];
      }
    });

    // For specific components like SimpleGrid, Grid, etc. add appropriate styling
    let additionalStyles = {};
    if (displayName === 'SimpleGrid' || displayName === 'Grid') {
      additionalStyles = {
        display: 'grid',
        gridTemplateColumns: chakraProps.columns ? `repeat(${typeof chakraProps.columns === 'object' ? '2' : chakraProps.columns}, 1fr)` : 'repeat(2, 1fr)',
        gap: chakraProps.spacing || '10px',
      };
    } else if (displayName === 'Stack' || displayName === 'HStack' || displayName === 'VStack') {
      additionalStyles = {
        display: 'flex',
        flexDirection: displayName === 'HStack' ? 'row' : 'column',
        gap: chakraProps.spacing || '10px',
      };
    }

    return React.createElement('div', {
      'data-testid': `chakra-${displayName.toLowerCase()}`,
      'data-chakra-component': displayName,
      ref,
      style: {
        ...style,
        ...additionalStyles
      },
      ...dataAttrs,
      ...domProps
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
const Button = React.forwardRef((props, ref) => {
  // Extract important props and children before destructuring
  const { children, onClick, isLoading, loadingText, isDisabled, colorScheme, ...rest } = props;
  
  // Filter out Chakra UI specific props
  const domProps = {};
  const chakraProps = {};
  
  Object.keys(rest).forEach(key => {
    if (CHAKRA_PROPS.includes(key)) {
      chakraProps[key] = rest[key];
    } else if (key.startsWith('_') || key.startsWith('aria-') || key === 'role' || key === 'id' || key === 'className' || key === 'data-testid') {
      // Pass through common DOM props and accessibility attributes directly
      domProps[key] = rest[key];
    } else if (typeof rest[key] === 'function') {
      // Pass through event handlers and functions
      domProps[key] = rest[key];
    } else {
      // Default behavior for unknown props - transform to data attributes to avoid React warnings
      const dataAttrName = `data-${key.toLowerCase().replace(/([A-Z])/g, '-$1')}`;
      domProps[dataAttrName] = rest[key];
    }
  });

  // Convert some Chakra UI props to style properties
  const style = {
    ...(domProps.style || {}),
    ...(chakraProps.borderRadius ? { borderRadius: typeof chakraProps.borderRadius === 'string' ? chakraProps.borderRadius : `${chakraProps.borderRadius}px` } : {}),
    ...(chakraProps.borderWidth ? { borderWidth: typeof chakraProps.borderWidth === 'string' ? chakraProps.borderWidth : `${chakraProps.borderWidth}px` } : {}),
    ...(chakraProps.borderColor ? { borderColor: chakraProps.borderColor } : {})
  };

  // Create data attributes for Chakra specific props
  const dataAttrs = {};
  Object.keys(chakraProps).forEach(key => {
    if (typeof chakraProps[key] !== 'function') {
      const dataAttrName = `data-chakra-${key.toLowerCase()}`;
      dataAttrs[dataAttrName] = chakraProps[key] === true ? '' : chakraProps[key];
    }
  });

  // Add colorScheme as a data attribute
  if (colorScheme) {
    dataAttrs['data-chakra-colorscheme'] = colorScheme;
  }

  return React.createElement('button', {
    'data-testid': 'chakra-button',
    'data-chakra-component': 'Button',
    onClick,
    disabled: isLoading || isDisabled,
    ref,
    style: Object.keys(style).length > 0 ? style : undefined,
    ...dataAttrs,
    ...domProps
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

// Create specialized modal components that handle isOpen properly
const Modal = ({ isOpen, onClose, children, ...props }) => {
  if (!isOpen) return null;
  return React.createElement('div', {
    'data-testid': 'chakra-modal',
    'data-chakra-component': 'Modal',
    'data-chakra-isopen': isOpen ? 'true' : 'false',
    role: 'dialog',
    ...props
  }, children);
};
Modal.displayName = 'Modal';

const AlertDialog = ({ isOpen, onClose, leastDestructiveRef, children, ...props }) => {
  if (!isOpen) return null;
  return React.createElement('div', {
    'data-testid': 'chakra-alert-dialog',
    'data-chakra-component': 'AlertDialog',
    'data-chakra-isopen': isOpen ? 'true' : 'false',
    role: 'alertdialog',
    ...props
  }, children);
};
AlertDialog.displayName = 'AlertDialog';

const Drawer = ({ isOpen, onClose, children, ...props }) => {
  if (!isOpen) return null;
  return React.createElement('div', {
    'data-testid': 'chakra-drawer',
    'data-chakra-component': 'Drawer',
    'data-chakra-isopen': isOpen ? 'true' : 'false',
    role: 'dialog',
    ...props
  }, children);
};
Drawer.displayName = 'Drawer';

// Explicitly create SimpleGrid component
// Explicitly create SimpleGrid with proper grid styling
const SimpleGrid = React.forwardRef(({ columns = 2, spacing = '10px', children, ...props }, ref) => {
  return React.createElement('div', {
    'data-testid': 'chakra-simple-grid',
    'data-chakra-component': 'SimpleGrid',
    ref,
    style: {
      display: 'grid',
      gridTemplateColumns: `repeat(${typeof columns === 'object' ? '2' : columns}, 1fr)`,
      gap: spacing
    },
    ...props
  }, children);
});
SimpleGrid.displayName = 'SimpleGrid';

// Export all mocked components - making sure SimpleGrid is properly defined
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
  SimpleGrid, // Using the explicit SimpleGrid implementation
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
  NumberInput: createChakraMock('NumberInput'),
  NumberInputField: createChakraMock('NumberInputField'),
  NumberInputStepper: createChakraMock('NumberInputStepper'),
  NumberIncrementStepper: createChakraMock('NumberIncrementStepper'),
  NumberDecrementStepper: createChakraMock('NumberDecrementStepper'),
  
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
  
  // Overlay components - using specialized implementations 
  Modal,
  ModalOverlay: createChakraMock('ModalOverlay'),
  ModalContent: createChakraMock('ModalContent'),
  ModalHeader: createChakraMock('ModalHeader'),
  ModalFooter: createChakraMock('ModalFooter'),
  ModalBody: createChakraMock('ModalBody'),
  ModalCloseButton: createChakraMock('ModalCloseButton'),
  AlertDialog,
  AlertDialogOverlay: createChakraMock('AlertDialogOverlay'),
  AlertDialogContent: createChakraMock('AlertDialogContent'),
  AlertDialogHeader: createChakraMock('AlertDialogHeader'),
  AlertDialogFooter: createChakraMock('AlertDialogFooter'),
  AlertDialogBody: createChakraMock('AlertDialogBody'),
  AlertDialogCloseButton: createChakraMock('AlertDialogCloseButton'),
  Drawer,
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
  
  // Utility functions for test setup
  createChakraMock,
  
  // Constants and utils
  createStandaloneToast: () => ({ toast: jest.fn() })
};