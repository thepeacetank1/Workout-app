import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  Button,
  VStack,
  HStack,
  Text,
  Grid,
  GridItem,
  InputGroup,
  InputRightAddon,
  useColorModeValue,
  Flex,
  Spacer,
  Divider,
  List,
  ListItem,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormErrorMessage,
  Badge,
  Spinner,
  useToast,
  Tooltip
} from '@chakra-ui/react';
import { AddIcon, SearchIcon, CloseIcon, InfoIcon } from '@chakra-ui/icons';
import { 
  FoodItem, 
  createFoodItem as createFoodItemAPI, 
  recordNutrition as recordNutritionAPI, 
  getFoodItems as getFoodItemsAPI 
} from '../../api/services/nutrition';
import { RootState, AppDispatch } from '../../store';
import { 
  getFoodItems, 
  createFoodItem, 
  recordNutrition 
} from '../../store/slices/nutritionSlice';

interface FormFoodItem {
  id: string;
  servings: number;
  notes?: string;
}

interface NutritionFormData {
  date: string;
  meal: string;
  foods: Array<{
    foodItem: string;
    servings: number;
    notes?: string;
  }>;
  notes?: string;
}

const FoodLogger: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const toast = useToast();
  
  const { foodItems, isLoading, error } = useSelector((state: RootState) => state.nutrition);
  
  // Form state
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [meal, setMeal] = useState<string>('breakfast');
  const [notes, setNotes] = useState<string>('');
  const [selectedFoods, setSelectedFoods] = useState<Array<{
    id: string;
    servings: number;
    notes?: string;
    name?: string; // For display purposes
  }>>([]);
  
  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Search state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  
  // New food form state
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newFood, setNewFood] = useState<{
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    servingSize: number;
    servingUnit: string;
  }>({
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    servingSize: 100,
    servingUnit: 'g'
  });
  
  // Fetch food items on component mount
  useEffect(() => {
    dispatch(getFoodItems());
  }, [dispatch]);
  
  // Effects for search
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      setIsSearching(true);
      
      // Option 1: Filter client-side if we have all foods loaded
      const results = foodItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.brand && item.brand.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      
      // Option 2: Make API call with search parameter (real implementation would use this)
      // In a real app, we would call dispatch(searchFoodItems(searchQuery))
      
      setSearchResults(results);
      setIsSearching(false);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, foodItems]);
  
  // Form validation function
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!date) {
      newErrors.date = 'Date is required';
    }
    
    if (!meal) {
      newErrors.meal = 'Meal type is required';
    }
    
    if (selectedFoods.length === 0) {
      newErrors.foods = 'At least one food item is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle selecting a food from search results
  const handleSelectFood = (food: FoodItem) => {
    setSelectedFoods([...selectedFoods, {
      id: food._id,
      servings: 1,
      name: food.name
    }]);
    setSearchQuery('');
    setSearchResults([]);
  };
  
  // Handle removing a selected food
  const handleRemoveFood = (index: number) => {
    const newSelectedFoods = [...selectedFoods];
    newSelectedFoods.splice(index, 1);
    setSelectedFoods(newSelectedFoods);
  };
  
  // Handle changing servings for a selected food
  const handleServingChange = (index: number, value: number) => {
    const newSelectedFoods = [...selectedFoods];
    newSelectedFoods[index].servings = value;
    setSelectedFoods(newSelectedFoods);
  };
  
  // Handle notes for a selected food
  const handleFoodNotesChange = (index: number, value: string) => {
    const newSelectedFoods = [...selectedFoods];
    newSelectedFoods[index].notes = value;
    setSelectedFoods(newSelectedFoods);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: 'Form validation error',
        description: 'Please correct the errors in the form.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // Format the data for API
    const formData: NutritionFormData = {
      date,
      meal,
      foods: selectedFoods.map(food => ({
        foodItem: food.id,
        servings: food.servings,
        notes: food.notes
      })),
      notes
    };
    
    dispatch(recordNutrition(formData))
      .unwrap()
      .then(() => {
        toast({
          title: 'Food logged successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        // Reset form
        setSelectedFoods([]);
        setNotes('');
        setMeal('breakfast');
      })
      .catch((error) => {
        toast({
          title: 'Error logging food',
          description: error.message || 'Something went wrong',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });
  };
  
  // Handle new food form changes
  const handleNewFoodChange = (field: string, value: string | number) => {
    setNewFood({
      ...newFood,
      [field]: value
    });
  };
  
  // Validate new food form
  const validateNewFoodForm = (): boolean => {
    // Basic validation
    return (
      newFood.name.trim() !== '' &&
      newFood.calories > 0 &&
      newFood.servingSize > 0
    );
  };
  
  // Handle creating a new food
  const handleCreateFood = () => {
    if (!validateNewFoodForm()) {
      toast({
        title: 'Invalid food data',
        description: 'Please check the food information and try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    const foodItemData = {
      name: newFood.name,
      calories: newFood.calories,
      servingSize: newFood.servingSize,
      servingUnit: newFood.servingUnit,
      macros: {
        protein: newFood.protein,
        carbs: newFood.carbs,
        fat: newFood.fat
      },
      isCustom: true
    };
    
    dispatch(createFoodItem(foodItemData))
      .unwrap()
      .then((newFoodItem) => {
        toast({
          title: 'Food created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        // Add the new food to selected foods
        setSelectedFoods([...selectedFoods, {
          id: newFoodItem._id,
          servings: 1,
          name: newFoodItem.name
        }]);
        
        onClose();
        
        // Reset form
        setNewFood({
          name: '',
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          servingSize: 100,
          servingUnit: 'g'
        });
      })
      .catch((error) => {
        toast({
          title: 'Error creating food',
          description: error.message || 'Something went wrong',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });
  };
  
  // Calculate nutrition totals for selected foods
  const calculateTotals = () => {
    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;
    
    selectedFoods.forEach(selected => {
      const foodDetails = foodItems.find(item => item._id === selected.id);
      if (foodDetails) {
        calories += foodDetails.calories * selected.servings;
        protein += foodDetails.macros.protein * selected.servings;
        carbs += foodDetails.macros.carbs * selected.servings;
        fat += foodDetails.macros.fat * selected.servings;
      }
    });
    
    return {
      calories: Math.round(calories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: Math.round(fat)
    };
  };
  
  const totals = calculateTotals();
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  return (
    <Box>
      <Heading size="lg" mb={6}>Log Your Food</Heading>
      
      {error && (
        <Box p={4} mb={4} borderWidth="1px" borderRadius="md" bg="red.50" color="red.600">
          <Text>Error: {error}</Text>
        </Box>
      )}
      
      <form onSubmit={handleSubmit}>
        <Grid templateColumns="repeat(12, 1fr)" gap={6} mb={6}>
          <GridItem colSpan={{ base: 12, md: 6 }}>
            <FormControl isRequired isInvalid={!!errors.date}>
              <FormLabel>Date</FormLabel>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              {errors.date && <FormErrorMessage>{errors.date}</FormErrorMessage>}
            </FormControl>
          </GridItem>
          
          <GridItem colSpan={{ base: 12, md: 6 }}>
            <FormControl isRequired isInvalid={!!errors.meal}>
              <FormLabel>Meal</FormLabel>
              <Select
                value={meal}
                onChange={(e) => setMeal(e.target.value)}
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </Select>
              {errors.meal && <FormErrorMessage>{errors.meal}</FormErrorMessage>}
            </FormControl>
          </GridItem>
        </Grid>
        
        <Box mb={6}>
          <FormControl isInvalid={!!errors.foods}>
            <FormLabel>
              <Flex align="center">
                <Text>Search Foods</Text>
                <Tooltip label="Search for foods to add to your meal log. You can also create custom foods.">
                  <InfoIcon ml={2} color="blue.500" />
                </Tooltip>
              </Flex>
            </FormLabel>
            <InputGroup>
              <Input
                placeholder="Search for foods (e.g. chicken, apple, rice)"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <InputRightAddon children={<SearchIcon />} />
            </InputGroup>
            {errors.foods && <FormErrorMessage>{errors.foods}</FormErrorMessage>}
          </FormControl>
          
          {isSearching ? (
            <Flex justify="center" my={4}>
              <Spinner />
            </Flex>
          ) : searchResults.length > 0 ? (
            <Box 
              mt={2} 
              maxH="200px" 
              overflowY="auto" 
              borderWidth="1px" 
              borderColor={borderColor} 
              borderRadius="md"
            >
              <List spacing={0}>
                {searchResults.map((food) => (
                  <ListItem 
                    key={food._id} 
                    p={2} 
                    _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}
                    cursor="pointer"
                    onClick={() => handleSelectFood(food)}
                    borderBottomWidth="1px"
                    borderBottomColor={borderColor}
                    _last={{ borderBottomWidth: 0 }}
                  >
                    <Flex align="center">
                      <Box>
                        <Text fontWeight="medium">{food.name}</Text>
                        {food.brand && (
                          <Text fontSize="xs" color="gray.500">{food.brand}</Text>
                        )}
                        <Text fontSize="sm" color="gray.500">
                          {food.calories} cal | {food.macros.protein}g protein | {food.macros.carbs}g carbs | {food.macros.fat}g fat
                        </Text>
                      </Box>
                      <Spacer />
                      <Badge colorScheme="green" ml={2}>{food.servingSize} {food.servingUnit}</Badge>
                    </Flex>
                  </ListItem>
                ))}
              </List>
            </Box>
          ) : searchQuery.length > 1 && (
            <Box mt={2} p={2} borderWidth="1px" borderColor={borderColor} borderRadius="md">
              <Text>No foods found. <Button size="sm" colorScheme="blue" onClick={onOpen}>Add Custom Food</Button></Text>
            </Box>
          )}
          
          <Flex mt={2}>
            <Spacer />
            <Button size="sm" leftIcon={<AddIcon />} onClick={onOpen}>
              Add Custom Food
            </Button>
          </Flex>
        </Box>
        
        {selectedFoods.length > 0 && (
          <Box mb={6} p={4} borderWidth="1px" borderRadius="md">
            <Flex justify="space-between" align="center" mb={4}>
              <Heading size="sm">Selected Foods</Heading>
              <HStack spacing={2}>
                <Badge colorScheme="blue" p={1} fontSize="xs">{totals.calories} cal</Badge>
                <Badge colorScheme="red" p={1} fontSize="xs">{totals.protein}g protein</Badge>
                <Badge colorScheme="green" p={1} fontSize="xs">{totals.carbs}g carbs</Badge>
                <Badge colorScheme="orange" p={1} fontSize="xs">{totals.fat}g fat</Badge>
              </HStack>
            </Flex>
            
            <VStack spacing={4} align="stretch">
              {selectedFoods.map((selected, index) => {
                const foodDetails = foodItems.find(item => item._id === selected.id);
                return (
                  <Box key={index} p={3} borderWidth="1px" borderRadius="md">
                    <Flex direction={{ base: 'column', md: 'row' }} align={{ base: 'flex-start', md: 'center' }} gap={2}>
                      <Box flex="1">
                        <Text fontWeight="medium">{selected.name || (foodDetails ? foodDetails.name : 'Unknown food')}</Text>
                        {foodDetails && (
                          <Text fontSize="sm" color="gray.500">
                            {Math.round(foodDetails.calories * selected.servings)} cal |  
                            {Math.round(foodDetails.macros.protein * selected.servings)}g protein | 
                            {Math.round(foodDetails.macros.carbs * selected.servings)}g carbs | 
                            {Math.round(foodDetails.macros.fat * selected.servings)}g fat
                          </Text>
                        )}
                      </Box>
                      
                      <FormControl maxW={{ base: '100%', md: '150px' }}>
                        <InputGroup size="sm">
                          <NumberInput 
                            min={0.25} 
                            max={10} 
                            step={0.25} 
                            value={selected.servings}
                            onChange={(value) => handleServingChange(index, Number(value))}
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                          <InputRightAddon children={foodDetails ? foodDetails.servingUnit : 'serving'} />
                        </InputGroup>
                      </FormControl>
                      
                      <IconButton
                        size="sm"
                        aria-label="Remove food"
                        icon={<CloseIcon />}
                        onClick={() => handleRemoveFood(index)}
                      />
                    </Flex>
                    
                    <FormControl mt={2} size="sm">
                      <Input
                        placeholder="Add notes for this food item (optional)"
                        size="sm"
                        value={selected.notes || ''}
                        onChange={(e) => handleFoodNotesChange(index, e.target.value)}
                      />
                    </FormControl>
                  </Box>
                );
              })}
            </VStack>
          </Box>
        )}
        
        <FormControl mb={6}>
          <FormLabel>Notes</FormLabel>
          <Input
            placeholder="Add any notes about this meal (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </FormControl>
        
        <Button 
          type="submit" 
          colorScheme="blue" 
          isDisabled={selectedFoods.length === 0}
          isLoading={isLoading}
          size="lg"
          width={{ base: '100%', md: 'auto' }}
        >
          Log Food
        </Button>
      </form>
      
      {/* Add Custom Food Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'full', md: 'md' }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Custom Food</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Food Name</FormLabel>
                <Input
                  value={newFood.name}
                  onChange={(e) => handleNewFoodChange('name', e.target.value)}
                  placeholder="e.g. Grilled Chicken Breast"
                />
              </FormControl>
              
              <Grid templateColumns="repeat(12, 1fr)" gap={4} width="100%">
                <GridItem colSpan={{ base: 12, md: 6 }}>
                  <FormControl isRequired>
                    <FormLabel>Serving Size</FormLabel>
                    <NumberInput
                      min={0}
                      value={newFood.servingSize}
                      onChange={(value) => handleNewFoodChange('servingSize', Number(value))}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </GridItem>
                
                <GridItem colSpan={{ base: 12, md: 6 }}>
                  <FormControl isRequired>
                    <FormLabel>Unit</FormLabel>
                    <Select
                      value={newFood.servingUnit}
                      onChange={(e) => handleNewFoodChange('servingUnit', e.target.value)}
                    >
                      <option value="g">grams (g)</option>
                      <option value="ml">milliliters (ml)</option>
                      <option value="oz">ounces (oz)</option>
                      <option value="cup">cup</option>
                      <option value="tbsp">tablespoon</option>
                      <option value="tsp">teaspoon</option>
                      <option value="piece">piece</option>
                      <option value="serving">serving</option>
                    </Select>
                  </FormControl>
                </GridItem>
              </Grid>
              
              <FormControl isRequired>
                <FormLabel>Calories</FormLabel>
                <NumberInput
                  min={0}
                  value={newFood.calories}
                  onChange={(value) => handleNewFoodChange('calories', Number(value))}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              
              <Grid templateColumns="repeat(12, 1fr)" gap={4} width="100%">
                <GridItem colSpan={{ base: 12, md: 4 }}>
                  <FormControl isRequired>
                    <FormLabel>Protein (g)</FormLabel>
                    <NumberInput
                      min={0}
                      step={0.1}
                      precision={1}
                      value={newFood.protein}
                      onChange={(value) => handleNewFoodChange('protein', Number(value))}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </GridItem>
                
                <GridItem colSpan={{ base: 12, md: 4 }}>
                  <FormControl isRequired>
                    <FormLabel>Carbs (g)</FormLabel>
                    <NumberInput
                      min={0}
                      step={0.1}
                      precision={1}
                      value={newFood.carbs}
                      onChange={(value) => handleNewFoodChange('carbs', Number(value))}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </GridItem>
                
                <GridItem colSpan={{ base: 12, md: 4 }}>
                  <FormControl isRequired>
                    <FormLabel>Fat (g)</FormLabel>
                    <NumberInput
                      min={0}
                      step={0.1}
                      precision={1}
                      value={newFood.fat}
                      onChange={(value) => handleNewFoodChange('fat', Number(value))}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </GridItem>
              </Grid>
              
              <Box 
                width="100%" 
                p={3} 
                bg="gray.50" 
                borderRadius="md"
                color="gray.700"
              >
                <Text fontWeight="medium" mb={1}>Nutrition Summary:</Text>
                <Text fontSize="sm">
                  {newFood.calories} calories | {newFood.protein}g protein | {newFood.carbs}g carbs | {newFood.fat}g fat
                </Text>
                <Text fontSize="xs" mt={1} color="gray.500">
                  For {newFood.servingSize} {newFood.servingUnit} serving
                </Text>
              </Box>
            </VStack>
          </ModalBody>
          
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleCreateFood}
              isLoading={isLoading}
              isDisabled={!validateNewFoodForm()}
            >
              Add Food
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default FoodLogger;