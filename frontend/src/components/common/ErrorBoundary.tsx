import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  Code,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback 
        error={this.state.error} 
        resetError={this.handleReset} 
      />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  resetError: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      p={6}
      bg={bgColor}
      borderRadius="lg"
      boxShadow="md"
      borderWidth="1px"
      borderColor={borderColor}
      maxW="800px"
      mx="auto"
      my={8}
    >
      <VStack spacing={4} align="stretch">
        <Box color="red.500" fontSize="4xl" textAlign="center">
          <FiAlertTriangle />
        </Box>
        <Heading size="lg" textAlign="center" color="red.500">
          Something went wrong
        </Heading>
        <Text textAlign="center">
          We've encountered an error. Please try refreshing the page or click the button below.
        </Text>
        <Divider />
        {error && (
          <Box bg="gray.50" p={4} borderRadius="md">
            <Text fontWeight="bold" mb={2}>
              Error:
            </Text>
            <Code colorScheme="red" p={2} borderRadius="md" width="100%">
              {error.toString()}
            </Code>
          </Box>
        )}
        <Button
          leftIcon={<FiRefreshCw />}
          colorScheme="blue"
          onClick={resetError}
          alignSelf="center"
        >
          Try Again
        </Button>
      </VStack>
    </Box>
  );
};

export default ErrorBoundary;