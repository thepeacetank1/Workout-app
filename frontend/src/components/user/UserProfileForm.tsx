import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  TagLabel,
  TagCloseButton,
  Text,
  VStack,
  HStack,
  useToast,
  Avatar,
  Center,
  InputGroup,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { FiEdit, FiUpload } from 'react-icons/fi';
import { RootState } from '../../store';
import { updateUserProfile, uploadProfilePicture } from '../../store/slices/profileSlice';
import { UserProfile } from '../../api/services/profile';
import useAppToast from '../common/Toast';
import { required, positiveNumber, email } from '../../utils/validation';

interface UserProfileFormProps {
  initialData?: Partial<UserProfile>;
  onSaveSuccess?: () => void;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({ 
  initialData, 
  onSaveSuccess 
}) => {
  const dispatch = useDispatch();
  const { profile, isLoading, error } = useSelector((state: RootState) => state.profile);
  const { user } = useSelector((state: RootState) => state.auth);
  const toast = useAppToast();
  
  // Combine profile from Redux with any initial data passed as props
  const combinedProfile = {
    ...profile,
    ...initialData,
  };

  const [formValues, setFormValues] = useState<Partial<UserProfile>>(
    combinedProfile || {
      name: user?.name || '',
      email: user?.email || '',
      height: 170,
      weight: 70,
      gender: 'male',
      fitnessLevel: 'beginner',
      fitnessGoals: [],
      dietaryPreferences: [],
      dietaryRestrictions: [],
      activityLevel: 'moderately_active',
      measurements: {
        chest: undefined,
        waist: undefined,
        hips: undefined,
        biceps: undefined,
        thighs: undefined,
      },
    }
  );
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newGoal, setNewGoal] = useState('');
  const [newDietaryPreference, setNewDietaryPreference] = useState('');
  const [newDietaryRestriction, setNewDietaryRestriction] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    combinedProfile?.avatar
  );

  // Update form values when profile data changes
  useEffect(() => {
    if (profile) {
      setFormValues(prev => ({
        ...prev,
        ...profile,
      }));
      if (profile.avatar) {
        setAvatarPreview(profile.avatar);
      }
    }
  }, [profile]);

  // Display error message if Redux operation fails
  useEffect(() => {
    if (error) {
      toast.error({ 
        title: 'Error updating profile',
        description: error,
      });
    }
  }, [error, toast]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formValues.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formValues.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Numeric validations
    if (formValues.height !== undefined && (formValues.height < 100 || formValues.height > 250)) {
      newErrors.height = 'Height must be between 100cm and 250cm';
    }

    if (formValues.weight !== undefined && (formValues.weight < 30 || formValues.weight > 300)) {
      newErrors.weight = 'Weight must be between 30kg and 300kg';
    }
    
    // Validate measurements if present
    const measurements = formValues.measurements || {};
    
    if (measurements.chest !== undefined && (measurements.chest < 50 || measurements.chest > 200)) {
      newErrors['measurements.chest'] = 'Chest must be between 50cm and 200cm';
    }
    
    if (measurements.waist !== undefined && (measurements.waist < 50 || measurements.waist > 200)) {
      newErrors['measurements.waist'] = 'Waist must be between 50cm and 200cm';
    }
    
    if (measurements.hips !== undefined && (measurements.hips < 50 || measurements.hips > 200)) {
      newErrors['measurements.hips'] = 'Hips must be between 50cm and 200cm';
    }
    
    if (measurements.biceps !== undefined && (measurements.biceps < 20 || measurements.biceps > 60)) {
      newErrors['measurements.biceps'] = 'Biceps must be between 20cm and 60cm';
    }
    
    if (measurements.thighs !== undefined && (measurements.thighs < 30 || measurements.thighs > 100)) {
      newErrors['measurements.thighs'] = 'Thighs must be between 30cm and 100cm';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: any) => {
    // Handle nested fields like measurements.chest
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormValues((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof UserProfile],
          [child]: value,
        },
      }));
    } else {
      setFormValues((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleNumberInputChange = (field: string, valueAsString: string, valueAsNumber: number) => {
    handleInputChange(field, isNaN(valueAsNumber) ? undefined : valueAsNumber);
  };

  const handleGoalAdd = () => {
    if (newGoal && !formValues.fitnessGoals?.includes(newGoal)) {
      setFormValues((prev) => ({
        ...prev,
        fitnessGoals: [...(prev.fitnessGoals || []), newGoal],
      }));
      setNewGoal('');
    }
  };

  const handleGoalRemove = (goal: string) => {
    setFormValues((prev) => ({
      ...prev,
      fitnessGoals: prev.fitnessGoals?.filter((g) => g !== goal) || [],
    }));
  };

  const handleDietaryPreferenceAdd = () => {
    if (newDietaryPreference && !formValues.dietaryPreferences?.includes(newDietaryPreference)) {
      setFormValues((prev) => ({
        ...prev,
        dietaryPreferences: [...(prev.dietaryPreferences || []), newDietaryPreference],
      }));
      setNewDietaryPreference('');
    }
  };

  const handleDietaryPreferenceRemove = (pref: string) => {
    setFormValues((prev) => ({
      ...prev,
      dietaryPreferences: prev.dietaryPreferences?.filter((p) => p !== pref) || [],
    }));
  };

  const handleDietaryRestrictionAdd = () => {
    if (newDietaryRestriction && !formValues.dietaryRestrictions?.includes(newDietaryRestriction)) {
      setFormValues((prev) => ({
        ...prev,
        dietaryRestrictions: [...(prev.dietaryRestrictions || []), newDietaryRestriction],
      }));
      setNewDietaryRestriction('');
    }
  };

  const handleDietaryRestrictionRemove = (restriction: string) => {
    setFormValues((prev) => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions?.filter((r) => r !== restriction) || [],
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = async () => {
    if (avatarFile) {
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      
      try {
        await dispatch(uploadProfilePicture(formData));
        toast.success({ 
          title: 'Success', 
          description: 'Profile picture updated successfully' 
        });
      } catch (error) {
        console.error('Avatar upload failed:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await dispatch(updateUserProfile(formValues));
        toast.success({ 
          title: 'Success',
          description: 'Profile updated successfully',
        });
        if (onSaveSuccess) {
          onSaveSuccess();
        }
      } catch (error) {
        console.error('Profile update failed:', error);
      }
    }
  };

  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      bg={useColorModeValue('white', 'gray.800')}
      borderRadius="lg"
      p={6}
      shadow="md"
      width="100%"
    >
      <VStack spacing={6} align="stretch">
        <Heading size="lg" mb={4}>
          Your Profile
        </Heading>
        
        {/* Profile Picture Section */}
        <Center mb={6}>
          <VStack spacing={4}>
            <Box position="relative">
              <Avatar 
                size="2xl" 
                name={formValues.name} 
                src={avatarPreview} 
                border="3px solid"
                borderColor="brand.500"
              />
              <Box
                position="absolute"
                bottom={0}
                right={0}
                bg="brand.500"
                p={1}
                borderRadius="full"
                cursor="pointer"
                as="label"
                htmlFor="avatar-upload"
              >
                <Input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  display="none"
                  onChange={handleAvatarChange}
                />
                <FiEdit color="white" />
              </Box>
            </Box>
            {avatarFile && (
              <Button
                leftIcon={<FiUpload />}
                size="sm"
                colorScheme="blue"
                onClick={handleAvatarUpload}
                isLoading={isLoading}
              >
                Upload
              </Button>
            )}
          </VStack>
        </Center>
        
        <Tabs colorScheme="brand" variant="enclosed">
          <TabList>
            <Tab>Personal</Tab>
            <Tab>Body Metrics</Tab>
            <Tab>Fitness Goals</Tab>
            <Tab>Diet</Tab>
          </TabList>
          
          <TabPanels mt={4}>
            {/* Personal Information Panel */}
            <TabPanel>
              <VStack spacing={4} align="stretch">
                <FormControl isRequired isInvalid={!!errors.name}>
                  <FormLabel htmlFor="name">Full Name</FormLabel>
                  <Input
                    id="name"
                    type="text"
                    value={formValues.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                  <FormErrorMessage>{errors.name}</FormErrorMessage>
                </FormControl>
                
                <FormControl isRequired isInvalid={!!errors.email}>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input
                    id="email"
                    type="email"
                    value={formValues.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>
                
                <FormControl>
                  <FormLabel htmlFor="dateOfBirth">Date of Birth</FormLabel>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formValues.dateOfBirth || ''}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel htmlFor="gender">Gender</FormLabel>
                  <Select
                    id="gender"
                    value={formValues.gender || ''}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Select>
                </FormControl>
                
                <FormControl>
                  <FormLabel htmlFor="activityLevel">Activity Level</FormLabel>
                  <Select
                    id="activityLevel"
                    value={formValues.activityLevel || ''}
                    onChange={(e) => handleInputChange('activityLevel', e.target.value)}
                  >
                    <option value="sedentary">Sedentary (little or no exercise)</option>
                    <option value="lightly_active">Lightly active (light exercise 1-3 days/week)</option>
                    <option value="moderately_active">Moderately active (moderate exercise 3-5 days/week)</option>
                    <option value="very_active">Very active (hard exercise 6-7 days/week)</option>
                    <option value="extremely_active">Extremely active (very hard exercise & physical job)</option>
                  </Select>
                </FormControl>
              </VStack>
            </TabPanel>
            
            {/* Body Metrics Panel */}
            <TabPanel>
              <VStack spacing={4} align="stretch">
                <HStack spacing={4}>
                  <FormControl isInvalid={!!errors.height}>
                    <FormLabel htmlFor="height">Height (cm)</FormLabel>
                    <NumberInput
                      id="height"
                      min={100}
                      max={250}
                      value={formValues.height || undefined}
                      onChange={(valueString, valueNumber) => 
                        handleNumberInputChange('height', valueString, valueNumber)
                      }
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <FormErrorMessage>{errors.height}</FormErrorMessage>
                  </FormControl>
                  
                  <FormControl isInvalid={!!errors.weight}>
                    <FormLabel htmlFor="weight">Weight (kg)</FormLabel>
                    <NumberInput
                      id="weight"
                      min={30}
                      max={300}
                      precision={1}
                      step={0.1}
                      value={formValues.weight || undefined}
                      onChange={(valueString, valueNumber) => 
                        handleNumberInputChange('weight', valueString, valueNumber)
                      }
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <FormErrorMessage>{errors.weight}</FormErrorMessage>
                  </FormControl>
                </HStack>
                
                <Box p={4} bg={bgColor} borderRadius="md" borderWidth="1px" borderColor={borderColor}>
                  <Heading size="sm" mb={3}>Measurements (optional)</Heading>
                  
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl isInvalid={!!errors['measurements.chest']}>
                      <FormLabel htmlFor="chest">Chest (cm)</FormLabel>
                      <NumberInput
                        id="chest"
                        min={50}
                        max={200}
                        precision={1}
                        value={formValues.measurements?.chest || undefined}
                        onChange={(valueString, valueNumber) => 
                          handleNumberInputChange('measurements.chest', valueString, valueNumber)
                        }
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <FormErrorMessage>{errors['measurements.chest']}</FormErrorMessage>
                    </FormControl>
                    
                    <FormControl isInvalid={!!errors['measurements.waist']}>
                      <FormLabel htmlFor="waist">Waist (cm)</FormLabel>
                      <NumberInput
                        id="waist"
                        min={50}
                        max={200}
                        precision={1}
                        value={formValues.measurements?.waist || undefined}
                        onChange={(valueString, valueNumber) => 
                          handleNumberInputChange('measurements.waist', valueString, valueNumber)
                        }
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <FormErrorMessage>{errors['measurements.waist']}</FormErrorMessage>
                    </FormControl>
                    
                    <FormControl isInvalid={!!errors['measurements.hips']}>
                      <FormLabel htmlFor="hips">Hips (cm)</FormLabel>
                      <NumberInput
                        id="hips"
                        min={50}
                        max={200}
                        precision={1}
                        value={formValues.measurements?.hips || undefined}
                        onChange={(valueString, valueNumber) => 
                          handleNumberInputChange('measurements.hips', valueString, valueNumber)
                        }
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <FormErrorMessage>{errors['measurements.hips']}</FormErrorMessage>
                    </FormControl>
                    
                    <FormControl isInvalid={!!errors['measurements.biceps']}>
                      <FormLabel htmlFor="biceps">Biceps (cm)</FormLabel>
                      <NumberInput
                        id="biceps"
                        min={20}
                        max={60}
                        precision={1}
                        value={formValues.measurements?.biceps || undefined}
                        onChange={(valueString, valueNumber) => 
                          handleNumberInputChange('measurements.biceps', valueString, valueNumber)
                        }
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <FormErrorMessage>{errors['measurements.biceps']}</FormErrorMessage>
                    </FormControl>
                    
                    <FormControl isInvalid={!!errors['measurements.thighs']}>
                      <FormLabel htmlFor="thighs">Thighs (cm)</FormLabel>
                      <NumberInput
                        id="thighs"
                        min={30}
                        max={100}
                        precision={1}
                        value={formValues.measurements?.thighs || undefined}
                        onChange={(valueString, valueNumber) => 
                          handleNumberInputChange('measurements.thighs', valueString, valueNumber)
                        }
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <FormErrorMessage>{errors['measurements.thighs']}</FormErrorMessage>
                    </FormControl>
                  </SimpleGrid>
                </Box>
              </VStack>
            </TabPanel>
            
            {/* Fitness Goals Panel */}
            <TabPanel>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel htmlFor="fitnessLevel">Fitness Level</FormLabel>
                  <Select
                    id="fitnessLevel"
                    value={formValues.fitnessLevel || ''}
                    onChange={(e) => handleInputChange('fitnessLevel', e.target.value)}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </Select>
                </FormControl>
                
                <FormControl>
                  <FormLabel>Fitness Goals</FormLabel>
                  <HStack mb={2}>
                    <Input
                      value={newGoal}
                      onChange={(e) => setNewGoal(e.target.value)}
                      placeholder="Add a fitness goal..."
                      flex={1}
                    />
                    <Button onClick={handleGoalAdd}>Add</Button>
                  </HStack>
                  
                  <Box>
                    <HStack spacing={2} flexWrap="wrap">
                      {formValues.fitnessGoals?.map((goal) => (
                        <Tag key={goal} size="md" borderRadius="full" variant="solid" colorScheme="blue" m={1}>
                          <TagLabel>{goal}</TagLabel>
                          <TagCloseButton onClick={() => handleGoalRemove(goal)} />
                        </Tag>
                      ))}
                    </HStack>
                  </Box>
                </FormControl>
              </VStack>
            </TabPanel>
            
            {/* Diet Panel */}
            <TabPanel>
              <VStack spacing={5} align="stretch">
                {/* Dietary Preferences */}
                <FormControl>
                  <FormLabel>Dietary Preferences</FormLabel>
                  <HStack mb={2}>
                    <Input
                      value={newDietaryPreference}
                      onChange={(e) => setNewDietaryPreference(e.target.value)}
                      placeholder="Add a dietary preference (e.g., vegetarian)"
                      flex={1}
                    />
                    <Button onClick={handleDietaryPreferenceAdd}>Add</Button>
                  </HStack>
                  
                  <Box>
                    <HStack spacing={2} flexWrap="wrap">
                      {formValues.dietaryPreferences?.map((pref) => (
                        <Tag key={pref} size="md" borderRadius="full" variant="solid" colorScheme="green" m={1}>
                          <TagLabel>{pref}</TagLabel>
                          <TagCloseButton onClick={() => handleDietaryPreferenceRemove(pref)} />
                        </Tag>
                      ))}
                    </HStack>
                  </Box>
                </FormControl>
                
                {/* Dietary Restrictions */}
                <FormControl>
                  <FormLabel>Dietary Restrictions</FormLabel>
                  <HStack mb={2}>
                    <Input
                      value={newDietaryRestriction}
                      onChange={(e) => setNewDietaryRestriction(e.target.value)}
                      placeholder="Add a restriction (e.g., gluten-free, no dairy)"
                      flex={1}
                    />
                    <Button onClick={handleDietaryRestrictionAdd}>Add</Button>
                  </HStack>
                  
                  <Box>
                    <HStack spacing={2} flexWrap="wrap">
                      {formValues.dietaryRestrictions?.map((restriction) => (
                        <Tag key={restriction} size="md" borderRadius="full" variant="solid" colorScheme="red" m={1}>
                          <TagLabel>{restriction}</TagLabel>
                          <TagCloseButton onClick={() => handleDietaryRestrictionRemove(restriction)} />
                        </Tag>
                      ))}
                    </HStack>
                  </Box>
                </FormControl>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
        
        <Button
          mt={8}
          colorScheme="blue"
          type="submit"
          size="lg"
          isLoading={isLoading}
          loadingText="Saving..."
        >
          Save Profile
        </Button>
      </VStack>
    </Box>
  );
};

export default UserProfileForm;