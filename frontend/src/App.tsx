import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider, extendTheme, Box, Center, Heading, Text, Button } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import { store } from './store';

// Layouts
import MainLayout from './components/layout/MainLayout';

// Pages
import HomePage from './components/pages/HomePage';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import DashboardPage from './components/pages/DashboardPage';
import ProfilePage from './components/pages/ProfilePage';

// Components
import ProtectedRoute from './components/auth/ProtectedRoute';

// Custom theme
const colors = {
  brand: {
    50: '#e6f7ff',
    100: '#b3e5fc',
    200: '#81d4fa',
    300: '#4fc3f7',
    400: '#29b6f6',
    500: '#03a9f4',
    600: '#039be5',
    700: '#0288d1',
    800: '#0277bd',
    900: '#01579b',
  },
  accent: {
    50: '#fff8e1',
    100: '#ffecb3',
    200: '#ffe082',
    300: '#ffd54f',
    400: '#ffca28',
    500: '#ffc107',
    600: '#ffb300',
    700: '#ffa000',
    800: '#ff8f00',
    900: '#ff6f00',
  },
};

const theme = extendTheme({
  colors,
  fonts: {
    heading: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
    body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
        borderRadius: 'md',
      },
      variants: {
        solid: {
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.600',
          },
        },
        outline: {
          borderColor: 'brand.500',
          color: 'brand.500',
        },
      },
    },
  },
});

// Simple error boundary component
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null, errorInfo: React.ErrorInfo | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <Box p={8} textAlign="center">
          <Heading mb={4} color="red.500">Something went wrong</Heading>
          <Text mb={6}>Please try refreshing the page or contact support if the problem persists.</Text>
          <Button 
            colorScheme="blue" 
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <ErrorBoundary>
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<Center p={8}><Heading>Forgot Password Page</Heading></Center>} />
              
              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <DashboardPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              
              <Route 
                path="/workouts" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Center p={8}><Heading>Workouts Page</Heading></Center>
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              
              <Route 
                path="/workouts/:id" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Center p={8}><Heading>Workout Details</Heading></Center>
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              
              <Route 
                path="/nutrition" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Center p={8}><Heading>Nutrition Page</Heading></Center>
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              
              <Route 
                path="/progress" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Center p={8}><Heading>Progress Page</Heading></Center>
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <ProfilePage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </ErrorBoundary>
      </ChakraProvider>
    </Provider>
  );
}

export default App;