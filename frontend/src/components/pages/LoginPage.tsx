import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Link as ChakraLink,
  Stack,
  Text,
  useToast,
  FormErrorMessage,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../../store/slices/authSlice';
import { RootState } from '../../store';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  
  // Get auth state from Redux
  const { isLoading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  
  // Get redirect path from location state or default to /app
  const from = (location.state as any)?.from?.pathname || '/app';
  
  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);
  
  // Show error toast when error occurs
  useEffect(() => {
    if (error) {
      toast({
        title: 'Login failed',
        description: error,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [error, toast]);
  
  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      dispatch(loginUser({ email, password }));
      
      // If remember me is checked, store credentials in localStorage
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberedCredentials', 
          JSON.stringify({ email, password })
        );
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedCredentials');
      }
    }
  };
  
  // Load remembered credentials if available
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const rememberedData = localStorage.getItem('rememberedCredentials');
    
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
    
    if (rememberedData) {
      try {
        const { email: savedEmail, password: savedPassword } = JSON.parse(rememberedData);
        setEmail(savedEmail);
        setPassword(savedPassword);
        setRememberMe(true);
      } catch (err) {
        // If data is corrupted, clear it
        localStorage.removeItem('rememberedCredentials');
      }
    }
  }, []);
  
  return (
    <Box
      bg="gray.50"
      minH="100vh"
      py={{ base: '12', md: '24' }}
      px={{ base: '4', sm: '8' }}
    >
      <Container
        maxW="md"
        py={{ base: '0', sm: '8' }}
        px={{ base: '4', sm: '10' }}
        bg="white"
        boxShadow={{ base: 'none', sm: 'md' }}
        borderRadius={{ base: 'none', sm: 'xl' }}
      >
        <Stack spacing="8">
          <Stack spacing="6" align="center">
            <Heading
              as={RouterLink}
              to="/"
              color="brand.500"
              textAlign="center"
              size="lg"
            >
              Workout App
            </Heading>
            <Stack spacing="1" textAlign="center">
              <Heading size="md">Log in to your account</Heading>
              <Text color="gray.500">
                Don't have an account?{' '}
                <ChakraLink as={RouterLink} to="/register" color="brand.500">
                  Sign up
                </ChakraLink>
              </Text>
            </Stack>
          </Stack>
          <Stack spacing="6">
            <form onSubmit={handleSubmit}>
              <Stack spacing="5">
                <FormControl isInvalid={!!errors.email}>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.password}>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>
              </Stack>
              <HStack justify="space-between" my="4">
                <Checkbox 
                  isChecked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                >
                  Remember me
                </Checkbox>
                <ChakraLink as={RouterLink} to="/forgot-password" color="brand.500" fontSize="sm">
                  Forgot password?
                </ChakraLink>
              </HStack>
              <Button
                type="submit"
                colorScheme="blue"
                bg="brand.500"
                _hover={{ bg: 'brand.600' }}
                size="lg"
                fontSize="md"
                width="full"
                isLoading={isLoading}
                loadingText="Signing in"
              >
                Sign in
              </Button>
            </form>
            <Stack spacing="2">
              <Divider />
              <Stack spacing="3">
                <Button
                  variant="outline"
                  leftIcon={<FaGoogle />}
                  width="full"
                  isDisabled={true}
                >
                  Continue with Google
                </Button>
                <Button
                  variant="outline"
                  leftIcon={<FaFacebook />}
                  width="full"
                  isDisabled={true}
                >
                  Continue with Facebook
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default LoginPage;