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
  HStack,
  Select,
  Checkbox,
} from '@chakra-ui/react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    birthdate: '',
    agreeToTerms: false,
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.gender) newErrors.gender = 'Please select your gender';
    if (!formData.birthdate) newErrors.birthdate = 'Please enter your birthdate';
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
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
      // Mock registration functionality - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: 'Account created!',
        description: "We've created your account for you.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      navigate('/login');
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: error.message || 'An error occurred during registration',
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
            <Heading fontSize="4xl" textAlign="center">
              Create your account
            </Heading>
            <Text fontSize="lg" color="gray.600">
              to start your fitness journey with us ✌️
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
              <HStack>
                <FormControl id="firstName" isRequired isInvalid={!!errors.firstName}>
                  <FormLabel>First Name</FormLabel>
                  <Input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  <FormErrorMessage>{errors.firstName}</FormErrorMessage>
                </FormControl>
                
                <FormControl id="lastName" isRequired isInvalid={!!errors.lastName}>
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                  <FormErrorMessage>{errors.lastName}</FormErrorMessage>
                </FormControl>
              </HStack>
              
              <FormControl id="email" isRequired isInvalid={!!errors.email}>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>
              
              <FormControl id="password" isRequired isInvalid={!!errors.password}>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              </FormControl>
              
              <FormControl id="confirmPassword" isRequired isInvalid={!!errors.confirmPassword}>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
              </FormControl>
              
              <HStack>
                <FormControl id="gender" isRequired isInvalid={!!errors.gender}>
                  <FormLabel>Gender</FormLabel>
                  <Select 
                    placeholder="Select gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </Select>
                  <FormErrorMessage>{errors.gender}</FormErrorMessage>
                </FormControl>
                
                <FormControl id="birthdate" isRequired isInvalid={!!errors.birthdate}>
                  <FormLabel>Birth Date</FormLabel>
                  <Input
                    type="date"
                    name="birthdate"
                    value={formData.birthdate}
                    onChange={handleChange}
                  />
                  <FormErrorMessage>{errors.birthdate}</FormErrorMessage>
                </FormControl>
              </HStack>
              
              <FormControl id="agreeToTerms" isInvalid={!!errors.agreeToTerms}>
                <Checkbox
                  name="agreeToTerms"
                  isChecked={formData.agreeToTerms}
                  onChange={handleChange}
                >
                  I agree to the Terms of Service and Privacy Policy
                </Checkbox>
                <FormErrorMessage>{errors.agreeToTerms}</FormErrorMessage>
              </FormControl>
              
              <Stack spacing={10} pt={2}>
                <Button
                  type="submit"
                  loadingText="Submitting"
                  size="lg"
                  colorScheme="brand"
                  isLoading={isLoading}
                >
                  Sign up
                </Button>
              </Stack>
              
              <Stack pt={6}>
                <Text align="center">
                  Already a user?{' '}
                  <Link as={Link} to="/login" color="brand.500">
                    Login
                  </Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Flex>
  );
};

export default RegisterPage;