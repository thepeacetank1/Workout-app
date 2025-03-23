import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Divider, 
  Flex, 
  FormControl, 
  FormLabel, 
  FormErrorMessage,
  Heading, 
  Input, 
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Stack, 
  VStack, 
  useToast,
  useColorModeValue,
  Skeleton
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import UserProfileForm from '../user/UserProfileForm';
import { RootState } from '../../store';
import { fetchUserProfile, updateUserProfile } from '../../store/slices/profileSlice';
import { updateProfile } from '../../store/slices/authSlice';
import useAppToast from '../common/Toast';
import SkeletonLoader from '../common/SkeletonLoader';
import { email as validateEmail } from '../../utils/validation';

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch();
  const appToast = useAppToast();
  const chakraToast = useToast();
  
  const { user } = useSelector((state: RootState) => state.auth);
  const { profile, isLoading, error } = useSelector((state: RootState) => state.profile);
  
  const [activeTab, setActiveTab] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Load user profile data
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);
  
  // Set initial form values when user or profile data loads
  useEffect(() => {
    if (user) {
      const nameParts = user.name?.split(' ') || ['', ''];
      setFirstName(nameParts[0] || '');
      setLastName(nameParts.slice(1).join(' ') || '');
      setEmailValue(user.email || '');
    }
    
    if (profile) {
      setPhone(profile.phone || '');
    }
  }, [user, profile]);
  
  // Show error if API call fails
  useEffect(() => {
    if (error) {
      appToast.error({
        title: 'Error loading profile',
        description: error,
      });
    }
  }, [error, appToast]);
  
  const validateForm = () => {
    const errors: {
      email?: string;
      newPassword?: string;
      confirmPassword?: string;
    } = {};
    
    const emailError = validateEmail(emailValue);
    if (emailError) {
      errors.email = emailError;
    }
    
    if (newPassword && newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (newPassword && confirmPassword !== newPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const fullName = `${firstName} ${lastName}`.trim();
      dispatch(updateProfile({
        name: fullName,
        email: emailValue,
        phone
      }));
      
      chakraToast({
        title: 'Profile updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword && validateForm()) {
      dispatch(updateProfile({
        password: newPassword
      }));
      
      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      chakraToast({
        title: 'Password updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  return (
    <Box>
      <Heading as="h1" size="xl" mb={6}>Your Profile</Heading>
      
      {isLoading && !profile ? (
        <SkeletonLoader type="profile" />
      ) : (
        <Tabs index={activeTab} onChange={setActiveTab} variant="enclosed" mb={6}>
          <TabList>
            <Tab>Account Settings</Tab>
            <Tab>Fitness Profile</Tab>
          </TabList>
          
          <TabPanels>
            {/* Account Settings Tab */}
            <TabPanel p={0} pt={6}>
              <Flex direction={{ base: 'column', md: 'row' }} gap={8}>
                <Box flex={1}>
                  <Box as="form" onSubmit={handleSubmit} border="1px" borderColor={borderColor} borderRadius="md" p={6} mb={6}>
                    <Heading as="h2" size="md" mb={4}>Personal Information</Heading>
                    
                    <VStack spacing={4} align="stretch">
                      <Flex gap={4} direction={{ base: 'column', sm: 'row' }}>
                        <FormControl id="firstName">
                          <FormLabel>First Name</FormLabel>
                          <Input 
                            type="text" 
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            isRequired
                          />
                        </FormControl>
                        
                        <FormControl id="lastName">
                          <FormLabel>Last Name</FormLabel>
                          <Input 
                            type="text" 
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                          />
                        </FormControl>
                      </Flex>
                      
                      <FormControl id="email" isInvalid={!!formErrors.email}>
                        <FormLabel>Email</FormLabel>
                        <Input 
                          type="email" 
                          value={emailValue}
                          onChange={(e) => setEmailValue(e.target.value)}
                          isRequired
                        />
                        <FormErrorMessage>{formErrors.email}</FormErrorMessage>
                      </FormControl>
                      
                      <FormControl id="phone">
                        <FormLabel>Phone</FormLabel>
                        <Input 
                          type="tel" 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </FormControl>
                      
                      <Divider />
                      
                      <Button 
                        type="submit" 
                        colorScheme="blue" 
                        alignSelf="flex-end"
                        isLoading={isLoading}
                      >
                        Save Changes
                      </Button>
                    </VStack>
                  </Box>
                  
                  <Box 
                    as="form" 
                    onSubmit={handlePasswordUpdate} 
                    border="1px" 
                    borderColor={borderColor} 
                    borderRadius="md" 
                    p={6}
                  >
                    <Heading as="h2" size="md" mb={4}>Password</Heading>
                    
                    <Stack spacing={4}>
                      <FormControl id="currentPassword">
                        <FormLabel>Current Password</FormLabel>
                        <Input 
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          isRequired
                        />
                      </FormControl>
                      
                      <FormControl id="newPassword" isInvalid={!!formErrors.newPassword}>
                        <FormLabel>New Password</FormLabel>
                        <Input 
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          isRequired
                        />
                        <FormErrorMessage>{formErrors.newPassword}</FormErrorMessage>
                      </FormControl>
                      
                      <FormControl id="confirmPassword" isInvalid={!!formErrors.confirmPassword}>
                        <FormLabel>Confirm New Password</FormLabel>
                        <Input 
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          isRequired
                        />
                        <FormErrorMessage>{formErrors.confirmPassword}</FormErrorMessage>
                      </FormControl>
                      
                      <Button 
                        colorScheme="blue" 
                        alignSelf="flex-end" 
                        type="submit"
                        isLoading={isLoading}
                      >
                        Update Password
                      </Button>
                    </Stack>
                  </Box>
                </Box>
                
                <Box flex={1}>
                  <Box border="1px" borderColor={borderColor} borderRadius="md" p={6} mb={6}>
                    <Heading as="h2" size="md" mb={4}>Notification Settings</Heading>
                    
                    <VStack spacing={4} align="stretch" as="form">
                      <FormControl id="emailNotifications">
                        <FormLabel>Email Notifications</FormLabel>
                        <Input type="text" defaultValue="Enabled" />
                      </FormControl>
                      
                      <FormControl id="pushNotifications">
                        <FormLabel>Push Notifications</FormLabel>
                        <Input type="text" defaultValue="Enabled" />
                      </FormControl>
                      
                      <Button colorScheme="blue" alignSelf="flex-end">
                        Save
                      </Button>
                    </VStack>
                  </Box>
                  
                  <Box border="1px" borderColor={borderColor} borderRadius="md" p={6}>
                    <Heading as="h2" size="md" mb={4}>Preferences</Heading>
                    
                    <VStack spacing={4} align="stretch" as="form">
                      <FormControl id="unitSystem">
                        <FormLabel>Unit System</FormLabel>
                        <Input type="text" defaultValue="Metric" />
                      </FormControl>
                      
                      <FormControl id="language">
                        <FormLabel>Language</FormLabel>
                        <Input type="text" defaultValue="English" />
                      </FormControl>
                      
                      <Button colorScheme="blue" alignSelf="flex-end">
                        Save
                      </Button>
                    </VStack>
                  </Box>
                </Box>
              </Flex>
            </TabPanel>
            
            {/* Fitness Profile Tab */}
            <TabPanel p={0} pt={6}>
              {isLoading && !profile ? (
                <SkeletonLoader type="form" />
              ) : (
                <UserProfileForm onSaveSuccess={() => {
                  chakraToast({
                    title: 'Fitness profile updated',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                  });
                }} />
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      )}
    </Box>
  );
};

export default ProfilePage;