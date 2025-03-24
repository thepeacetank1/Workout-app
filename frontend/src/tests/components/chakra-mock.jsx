// Direct component mocks for Chakra UI
import React from 'react';

// Mock component factory
const createChakraMock = (displayName) => {
  const MockComponent = ({ children, ...props }) => {
    return (
      <div data-testid={`chakra-${displayName.toLowerCase()}`} {...props}>
        {children}
      </div>
    );
  };
  MockComponent.displayName = displayName;
  return MockComponent;
};

// Create common components
export const Box = createChakraMock('Box');
export const SimpleGrid = ({ children, columns, spacing, ...props }) => (
  <div 
    data-testid="chakra-simple-grid" 
    data-columns={JSON.stringify(columns)} 
    data-spacing={spacing}
    {...props}
  >
    {children}
  </div>
);
export const Grid = createChakraMock('Grid');
export const GridItem = createChakraMock('GridItem');
export const HStack = createChakraMock('HStack');
export const VStack = createChakraMock('VStack');
export const Stack = createChakraMock('Stack');
export const Flex = createChakraMock('Flex');
export const Center = createChakraMock('Center');
export const Container = createChakraMock('Container');

// Form components
export const FormControl = createChakraMock('FormControl');
export const FormLabel = ({ children, ...props }) => (
  <label data-testid="chakra-form-label" {...props}>
    {children}
  </label>
);
export const FormErrorMessage = createChakraMock('FormErrorMessage');
export const FormHelperText = createChakraMock('FormHelperText');
export const Input = ({ onChange, ...props }) => (
  <input data-testid="chakra-input" onChange={onChange} {...props} />
);
export const NumberInput = createChakraMock('NumberInput');
export const NumberInputField = createChakraMock('NumberInputField');
export const NumberInputStepper = createChakraMock('NumberInputStepper');
export const NumberIncrementStepper = createChakraMock('NumberIncrementStepper');
export const NumberDecrementStepper = createChakraMock('NumberDecrementStepper');
export const Select = createChakraMock('Select');
export const Textarea = createChakraMock('Textarea');
export const Checkbox = ({ children, isChecked, onChange, ...props }) => (
  <div data-testid="chakra-checkbox" {...props}>
    <input type="checkbox" checked={isChecked} onChange={onChange} />
    <label>{children}</label>
  </div>
);

// Typography
export const Text = ({ children, ...props }) => (
  <p data-testid="chakra-text" {...props}>
    {children}
  </p>
);
export const Heading = ({ children, ...props }) => (
  <h1 data-testid="chakra-heading" {...props}>
    {children}
  </h1>
);

// Buttons and interactions
export const Button = ({ children, onClick, isLoading, ...props }) => (
  <button 
    data-testid="chakra-button" 
    onClick={onClick} 
    disabled={isLoading} 
    {...props}
  >
    {children}
  </button>
);
export const IconButton = createChakraMock('IconButton');
export const Link = ({ children, ...props }) => (
  <a data-testid="chakra-link" href={props.href || "#"} {...props}>
    {children}
  </a>
);

// Navigation
export const Tabs = ({ children, ...props }) => (
  <div data-testid="chakra-tabs" {...props}>
    {children}
  </div>
);
export const TabList = ({ children, ...props }) => (
  <div data-testid="chakra-tablist" role="tablist" {...props}>
    {children}
  </div>
);
export const Tab = ({ children, isSelected, ...props }) => (
  <button 
    data-testid="chakra-tab" 
    role="tab"
    aria-selected={!!isSelected}
    {...props}
  >
    {children}
  </button>
);
export const TabPanels = createChakraMock('TabPanels');
export const TabPanel = ({ children, ...props }) => (
  <div data-testid="chakra-tabpanel" role="tabpanel" {...props}>
    {children}
  </div>
);

// Display
export const Avatar = createChakraMock('Avatar');
export const AvatarBadge = createChakraMock('AvatarBadge');
export const Badge = createChakraMock('Badge');
export const Card = createChakraMock('Card');
export const CardHeader = createChakraMock('CardHeader');
export const CardBody = createChakraMock('CardBody');
export const CardFooter = createChakraMock('CardFooter');
export const Image = createChakraMock('Image');
export const Divider = () => <hr data-testid="chakra-divider" />;

// Feedback
export const Alert = createChakraMock('Alert');
export const AlertIcon = createChakraMock('AlertIcon');
export const AlertTitle = createChakraMock('AlertTitle');
export const AlertDescription = createChakraMock('AlertDescription');
export const Spinner = createChakraMock('Spinner');
export const CircularProgress = createChakraMock('CircularProgress');
export const Progress = createChakraMock('Progress');

// Overlay
export const Modal = ({ isOpen, onClose, children, ...props }) => {
  if (!isOpen) return null;
  return (
    <div data-testid="chakra-modal" role="dialog" {...props}>
      {children}
    </div>
  );
};
export const ModalOverlay = createChakraMock('ModalOverlay');
export const ModalContent = createChakraMock('ModalContent');
export const ModalHeader = createChakraMock('ModalHeader');
export const ModalFooter = createChakraMock('ModalFooter');
export const ModalBody = createChakraMock('ModalBody');
export const ModalCloseButton = createChakraMock('ModalCloseButton');

// Hooks
export const useToast = () => {
  const toast = jest.fn();
  toast.closeAll = jest.fn();
  toast.close = jest.fn();
  toast.isActive = jest.fn();
  return toast;
};

export const useDisclosure = () => ({
  isOpen: false,
  onOpen: jest.fn(),
  onClose: jest.fn(),
  onToggle: jest.fn(),
});

export const useColorMode = () => ({
  colorMode: 'light',
  toggleColorMode: jest.fn(),
  setColorMode: jest.fn(),
});

export const useColorModeValue = (lightValue, darkValue) => lightValue;

// Providers
export const ChakraProvider = ({ children }) => <div data-testid="chakra-provider">{children}</div>;
export const ColorModeProvider = ({ children }) => children;
export const ThemeProvider = ({ children }) => children;

// Utilities
export const createStandaloneToast = () => ({ toast: jest.fn() });