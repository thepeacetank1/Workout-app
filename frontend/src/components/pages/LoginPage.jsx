import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  FormErrorMessage,
  useToast,
  Checkbox,
} from '@chakra-ui/react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const toast = useToast();

  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Mock login functionality - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Login successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      navigate('/app');
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error.message || 'Please check your credentials and try again',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50">
      <Container maxW="lg" py={12} px={{ base: 4, sm: 8 }}>
        <Stack spacing={8}>
          <Stack align="center">
            <Heading fontSize="4xl">Sign in to your account</Heading>
            <Text fontSize="lg" color="gray.600">
              to enjoy all of our cool fitness features ✌️
            </Text>
          </Stack>
          
          <Box
            as="form"
            onSubmit={handleSubmit}
            rounded="lg"
            bg="white"
            boxShadow="lg"
            p={8}
          >
            <Stack spacing={4}>
              <FormControl id="email" isRequired isInvalid={!!errors.email}>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>
              
              <FormControl id="password" isRequired isInvalid={!!errors.password}>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              </FormControl>
              
              <Stack spacing={10}>
                <Stack
                  direction={{ base: 'column', sm: 'row' }}
                  align="start"
                  justify="space-between"
                >
                  <Checkbox>Remember me</Checkbox>
                  <Link color="brand.500" href="#">
                    Forgot password?
                  </Link>
                </Stack>
                
                <Button
                  type="submit"
                  colorScheme="brand"
                  size="lg"
                  isLoading={isLoading}
                >
                  Sign in
                </Button>
              </Stack>
            </Stack>
          </Box>
          
          <Text align="center">
            Don&apos;t have an account?{' '}
            <Link as={Link} to="/register" color="brand.500">
              Sign up
            </Link>
          </Text>
        </Stack>
      </Container>
    </Flex>
  );
};

export default LoginPage;