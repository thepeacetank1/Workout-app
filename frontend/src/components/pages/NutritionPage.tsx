import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Heading, 
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel, 
  Text,
  Button,
  useColorModeValue,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  SimpleGrid
} from '@chakra-ui/react';
import FoodLogger from '../nutrition/FoodLogger';
import NutritionSummary from '../nutrition/NutritionSummary';
import FoodHistory from '../nutrition/FoodHistory';
import { 
  fetchNutritionLogByDate, 
  recordNutrition, 
  deleteNutritionLog,
  getFoodItemsList
} from '../../store/slices/nutritionSlice';
import { RootState, AppDispatch } from '../../store';

// Types
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

const NutritionPage: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const dispatch = useDispatch<AppDispatch>();
  const toast = useToast();
  
  // Get today's date in YYYY-MM-DD format for API
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  
  // Format current date for display
  const currentDate = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Redux state
  const { 
    nutritionLogs, 
    foodItems,
    dailyGoals,
    isLoading, 
    error 
  } = useSelector((state: RootState) => state.nutrition);
  
  // State for delete confirmation dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [logToDelete, setLogToDelete] = useState<string | null>(null);
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  
  // Calculate nutrition totals for today
  const calculateTotalsForToday = () => {
    const logsForToday = nutritionLogs.filter(log => log.date === selectedDate);
    
    // Calculate totals
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    
    logsForToday.forEach(log => {
      totalCalories += log.totalCalories;
      totalProtein += log.totalProtein;
      totalCarbs += log.totalCarbs;
      totalFat += log.totalFat;
    });
    
    return {
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      goalCalories: dailyGoals.calories,
      goalProtein: dailyGoals.protein,
      goalCarbs: dailyGoals.carbs,
      goalFat: dailyGoals.fat
    };
  };
  
  // Effect to fetch nutrition logs for today
  useEffect(() => {
    dispatch(fetchNutritionLogByDate(selectedDate));
    dispatch(getFoodItemsList());
  }, [dispatch, selectedDate]);
  
  // Handle logging food
  const handleLogFood = async (formData: NutritionFormData) => {
    try {
      await dispatch(recordNutrition(formData)).unwrap();
      toast({
        title: "Food logged successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Error logging food",
        description: typeof err === 'string' ? err : "An error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  // Handle delete confirmation
  const handleDeleteConfirm = (id: string) => {
    setLogToDelete(id);
    setIsDeleteDialogOpen(true);
  };
  
  // Handle actual deletion
  const handleDeleteEntry = async () => {
    if (logToDelete) {
      try {
        await dispatch(deleteNutritionLog(logToDelete)).unwrap();
        toast({
          title: "Food entry deleted",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (err) {
        toast({
          title: "Error deleting entry",
          description: typeof err === 'string' ? err : "An error occurred",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
    setIsDeleteDialogOpen(false);
    setLogToDelete(null);
  };
  
  // Map nutrition logs to format expected by FoodHistory component
  const mapLogsToFoodEntries = () => {
    const entries: Array<{
      id: string;
      name: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      servingSize: string;
      mealType: string;
      date: string;
      time: string;
    }> = [];
    
    nutritionLogs.forEach(log => {
      log.foods.forEach(food => {
        if (typeof food.foodItem !== 'string') {
          entries.push({
            id: log.id + '-' + food.id,
            name: food.foodItem.name,
            calories: food.foodItem.calories * food.servings,
            protein: food.foodItem.protein * food.servings,
            carbs: food.foodItem.carbs * food.servings,
            fat: food.foodItem.fat * food.servings,
            servingSize: `${food.servings} ${food.foodItem.servingUnit}`,
            mealType: log.meal,
            date: log.date,
            time: new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
        }
      });
    });
    
    return entries;
  };
  
  // Get logs for today only
  const getTodaysLogs = () => {
    return nutritionLogs.filter(log => log.date === selectedDate);
  };

  const nutritionSummaryData = calculateTotalsForToday();
  const foodEntries = mapLogsToFoodEntries();
  const todaysLogs = getTodaysLogs();

  return (
    <Box>
      <Heading as="h1" size="xl" mb={6}>Nutrition</Heading>
      
      <Tabs index={tabIndex} onChange={setTabIndex} variant="enclosed" mb={6}>
        <TabList>
          <Tab>Summary</Tab>
          <Tab>Log Food</Tab>
          <Tab>Food History</Tab>
        </TabList>
        
        <TabPanels>
          {/* Summary Tab */}
          <TabPanel>
            <Box mb={6}>
              <Heading as="h2" size="md" mb={4}>Nutrition Summary for {currentDate}</Heading>
              {isLoading ? (
                <Text>Loading nutrition data...</Text>
              ) : (
                <NutritionSummary 
                  nutritionData={nutritionSummaryData} 
                  date={currentDate} 
                />
              )}
              
              <Box mt={8} p={4} border="1px" borderColor={borderColor} borderRadius="md">
                <Heading as="h3" size="sm" mb={3}>Today's Meals</Heading>
                <Text mb={4}>Quick overview of what you've eaten today:</Text>
                
                {todaysLogs.length === 0 ? (
                  <Box textAlign="center" py={5}>
                    <Text color="gray.500">No meals logged for today yet.</Text>
                    <Button mt={4} colorScheme="blue" onClick={() => setTabIndex(1)}>
                      Log Your First Meal
                    </Button>
                  </Box>
                ) : (
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {todaysLogs.map(log => (
                      <Box 
                        key={log.id} 
                        p={3} 
                        borderRadius="md"
                        bg={useColorModeValue('gray.50', 'gray.700')}
                      >
                        <Heading size="sm" mb={2}>{log.meal.charAt(0).toUpperCase() + log.meal.slice(1)}</Heading>
                        {log.foods.map((food, idx) => {
                          if (typeof food.foodItem === 'string') {
                            return null;
                          }
                          return (
                            <Box key={idx} ml={2} mb={1}>
                              <Text fontSize="sm" fontWeight="medium">{food.foodItem.name}</Text>
                              <Text fontSize="xs">{food.servings} {food.foodItem.servingUnit} • {Math.round(food.foodItem.calories * food.servings)} calories</Text>
                            </Box>
                          );
                        })}
                        <Text fontSize="sm" fontWeight="bold" mt={2}>
                          Total: {log.totalCalories} cal | {log.totalProtein}g protein | {log.totalCarbs}g carbs | {log.totalFat}g fat
                        </Text>
                      </Box>
                    ))}
                  </SimpleGrid>
                )}
              </Box>
            </Box>
          </TabPanel>
          
          {/* Log Food Tab */}
          <TabPanel>
            <FoodLogger 
              onLogFood={handleLogFood} 
              foodItems={foodItems}
              isLoading={isLoading}
            />
          </TabPanel>
          
          {/* Food History Tab */}
          <TabPanel>
            {isLoading ? (
              <Text>Loading food history...</Text>
            ) : (
              <FoodHistory 
                foodEntries={foodEntries} 
                onDeleteEntry={handleDeleteConfirm} 
              />
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Food Entry
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this food entry? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteEntry} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default NutritionPage;