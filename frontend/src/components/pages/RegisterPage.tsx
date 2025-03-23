import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
  Input,
  Link as ChakraLink,
  Stack,
  Text,
  useToast,
  Progress,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FaGoogle, FaFacebook, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../../store/slices/authSlice';
import { RootState } from '../../store';

// Password strength calculation
const calculatePasswordStrength = (password: string): number => {
  let strength = 0;
  
  // Length check
  if (password.length >= 8) strength += 25;
  
  // Contains lowercase
  if (/[a-z]/.test(password)) strength += 25;
  
  // Contains uppercase
  if (/[A-Z]/.test(password)) strength += 25;
  
  // Contains number or special char
  if (/[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) strength += 25;
  
  return strength;
};

const getStrengthColor = (strength: number): string => {
  if (strength < 30) return 'red.500';
  if (strength < 60) return 'orange.500';
  if (strength < 90) return 'yellow.500';
  return 'green.500';
};

const getStrengthLabel = (strength: number): string => {
  if (strength < 30) return 'Weak';
  if (strength < 60) return 'Fair';
  if (strength < 90) return 'Good';
  return 'Strong';
};

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get auth state from Redux
  const { isLoading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  
  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app');
    }
  }, [isAuthenticated, navigate]);
  
  // Show error toast when error occurs
  useEffect(() => {
    if (error) {
      toast({
        title: 'Registration failed',
        description: error,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [error, toast]);
  
  // Update password strength when password changes
  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(password));
  }, [password]);
  
  const validateForm = () => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/.test(password)) {
      newErrors.password = 'Password must include lowercase, uppercase, and numbers or special characters';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      dispatch(registerUser({
        name,
        email,
        password
      }));
    }
  };

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
              <Heading size="md">Create an account</Heading>
              <Text color="gray.500">
                Already have an account?{' '}
                <ChakraLink as={RouterLink} to="/login" color="brand.500">
                  Sign in
                </ChakraLink>
              </Text>
            </Stack>
          </Stack>
          <Stack spacing="6">
            <form onSubmit={handleSubmit}>
              <Stack spacing="5">
                <FormControl isRequired isInvalid={!!errors.name}>
                  <FormLabel htmlFor="name">Full name</FormLabel>
                  <Input 
                    id="name" 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <FormErrorMessage>{errors.name}</FormErrorMessage>
                </FormControl>
                
                <FormControl isRequired isInvalid={!!errors.email}>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input 
                    id="email" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>
                
                <FormControl isRequired isInvalid={!!errors.password}>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <InputGroup>
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                  
                  {/* Password strength indicator */}
                  {password && (
                    <Box mt={2}>
                      <Progress 
                        value={passwordStrength} 
                        size="sm"
                        colorScheme={
                          passwordStrength < 30 ? "red" : 
                          passwordStrength < 60 ? "orange" : 
                          passwordStrength < 90 ? "yellow" : "green"
                        }
                        borderRadius="md"
                      />
                      <Text 
                        fontSize="xs" 
                        mt={1}
                        color={getStrengthColor(passwordStrength)}
                      >
                        Password strength: {getStrengthLabel(passwordStrength)}
                      </Text>
                    </Box>
                  )}
                </FormControl>
                
                <FormControl isRequired isInvalid={!!errors.confirmPassword}>
                  <FormLabel htmlFor="confirmPassword">Confirm password</FormLabel>
                  <InputGroup>
                    <Input 
                      id="confirmPassword" 
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        icon={showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      />
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
                </FormControl>
              </Stack>
              <Button
                type="submit"
                colorScheme="blue"
                bg="brand.500"
                _hover={{ bg: 'brand.600' }}
                size="lg"
                fontSize="md"
                width="full"
                mt="6"
                isLoading={isLoading}
                loadingText="Creating account"
              >
                Create account
              </Button>
            </form>
            <Stack spacing="2">
              <Divider />
              <Text textAlign="center" fontWeight="medium">
                Or continue with
              </Text>
              <Stack spacing="3">
                <Button
                  variant="outline"
                  leftIcon={<FaGoogle />}
                  width="full"
                  isDisabled={true} // Disabled until implemented
                >
                  Google
                </Button>
                <Button
                  variant="outline"
                  leftIcon={<FaFacebook />}
                  width="full"
                  isDisabled={true} // Disabled until implemented
                >
                  Facebook
                </Button>
              </Stack>
            </Stack>
          </Stack>
          <Text color="gray.500" fontSize="sm" textAlign="center">
            By signing up, you agree to our{' '}
            <ChakraLink color="brand.500">Terms of Service</ChakraLink> and{' '}
            <ChakraLink color="brand.500">Privacy Policy</ChakraLink>
          </Text>
        </Stack>
      </Container>
    </Box>
  );
};

export default RegisterPage;