import React, { useState } from 'react';
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
  Flex,
  useColorModeValue
} from '@chakra-ui/react';
import DietPlan from '../diet/DietPlan';
import DietPreferences from '../diet/DietPreferences';

// Mock data for demonstration
const mockWeeklyPlan = [
  {
    day: 'Monday',
    meals: {
      breakfast: {
        id: 'b1',
        name: 'Protein Oatmeal',
        calories: 350,
        protein: 24,
        carbs: 45,
        fat: 10,
        ingredients: [
          '1 cup rolled oats',
          '1 scoop protein powder',
          '1 tbsp almond butter',
          '1/2 banana, sliced',
          'Cinnamon to taste'
        ],
        recipe: 'Cook oats with water, stir in protein powder once cooked, top with banana and almond butter.'
      },
      lunch: {
        id: 'l1',
        name: 'Chicken and Quinoa Bowl',
        calories: 480,
        protein: 35,
        carbs: 50,
        fat: 15,
        ingredients: [
          '4 oz grilled chicken breast',
          '1/2 cup cooked quinoa',
          '1 cup mixed vegetables',
          '1 tbsp olive oil',
          'Lemon juice and herbs'
        ]
      },
      dinner: {
        id: 'd1',
        name: 'Baked Salmon with Sweet Potato',
        calories: 520,
        protein: 38,
        carbs: 42,
        fat: 22,
        ingredients: [
          '5 oz salmon fillet',
          '1 medium sweet potato',
          '2 cups leafy greens',
          '1 tbsp olive oil',
          'Garlic and herbs'
        ]
      },
      snacks: [
        {
          id: 's1',
          name: 'Greek Yogurt with Berries',
          calories: 150,
          protein: 15,
          carbs: 12,
          fat: 5,
          ingredients: [
            '3/4 cup Greek yogurt',
            '1/2 cup mixed berries',
            '1 tsp honey'
          ]
        }
      ]
    },
    totalCalories: 1500,
    totalProtein: 112,
    totalCarbs: 149,
    totalFat: 52
  },
  {
    day: 'Tuesday',
    meals: {
      breakfast: {
        id: 'b2',
        name: 'Veggie Egg Scramble',
        calories: 320,
        protein: 20,
        carbs: 15,
        fat: 20,
        ingredients: [
          '3 whole eggs',
          '1/2 cup bell peppers, diced',
          '1/4 cup onions, diced',
          '1 cup spinach',
          '1 oz feta cheese'
        ]
      },
      lunch: {
        id: 'l2',
        name: 'Turkey Wrap',
        calories: 450,
        protein: 30,
        carbs: 45,
        fat: 18,
        ingredients: [
          '4 oz sliced turkey breast',
          '1 whole grain wrap',
          '1 tbsp hummus',
          'Lettuce, tomato, cucumber',
          '1/4 avocado'
        ]
      },
      dinner: {
        id: 'd2',
        name: 'Beef and Vegetable Stir Fry',
        calories: 520,
        protein: 35,
        carbs: 40,
        fat: 25,
        ingredients: [
          '4 oz lean beef',
          '1 cup mixed stir fry vegetables',
          '1/2 cup brown rice',
          '1 tbsp sesame oil',
          'Soy sauce and ginger'
        ]
      },
      snacks: [
        {
          id: 's2',
          name: 'Apple with Almond Butter',
          calories: 200,
          protein: 5,
          carbs: 25,
          fat: 10,
          ingredients: [
            '1 medium apple',
            '1 tbsp almond butter'
          ]
        }
      ]
    },
    totalCalories: 1490,
    totalProtein: 90,
    totalCarbs: 125,
    totalFat: 73
  }
];

const mockDietPreferences = {
  calorieGoal: 2200,
  dietType: 'high-protein',
  restrictions: ['no-artificial-sweeteners', 'limited-dairy'],
  budgetConstraint: 80,
  mealsPerDay: 4,
  preferredCuisines: ['Mediterranean', 'Asian', 'Mexican']
};

const DietPage: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [showFullPlan, setShowFullPlan] = useState(false);
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleSavePreferences = (preferences: any) => {
    console.log('Diet preferences saved:', preferences);
    // In a real implementation, this would dispatch an action to store the preferences
    alert('Diet preferences saved successfully!');
  };

  return (
    <Box>
      <Heading as="h1" size="xl" mb={6}>Diet Plan</Heading>
      
      <Tabs index={tabIndex} onChange={setTabIndex} variant="enclosed" mb={6}>
        <TabList>
          <Tab>Your Diet Plan</Tab>
          <Tab>Preferences</Tab>
        </TabList>
        
        <TabPanels>
          {/* Diet Plan Tab */}
          <TabPanel>
            <Box mb={6}>
              <Text fontSize="lg" mb={4}>
                Based on your goals, preferences, and budget, here is your personalized diet plan:
              </Text>
              
              {showFullPlan ? (
                <DietPlan
                  weeklyPlan={mockWeeklyPlan}
                  userCalorieGoal={mockDietPreferences.calorieGoal}
                  userProteinGoal={Math.round(mockDietPreferences.calorieGoal * 0.3 / 4)} // 30% of calories from protein
                  userCarbsGoal={Math.round(mockDietPreferences.calorieGoal * 0.45 / 4)} // 45% of calories from carbs
                  userFatGoal={Math.round(mockDietPreferences.calorieGoal * 0.25 / 9)} // 25% of calories from fat
                />
              ) : (
                <Box p={4} borderRadius="md" border="1px" borderColor={borderColor}>
                  <Heading as="h3" size="md" mb={4}>Diet Plan Overview</Heading>
                  <Text mb={3}>This plan is designed for your {mockDietPreferences.dietType} diet preferences with a budget of ${mockDietPreferences.budgetConstraint} per week.</Text>
                  <Text mb={3}>It includes {mockDietPreferences.mealsPerDay} meals per day with a focus on your preferred cuisines.</Text>
                  <Text mb={4}>Nutrition targets: {mockDietPreferences.calorieGoal} calories, {Math.round(mockDietPreferences.calorieGoal * 0.3 / 4)}g protein, {Math.round(mockDietPreferences.calorieGoal * 0.45 / 4)}g carbs, {Math.round(mockDietPreferences.calorieGoal * 0.25 / 9)}g fat.</Text>
                  
                  <Box bg={useColorModeValue('blue.50', 'blue.900')} p={3} borderRadius="md" mb={4}>
                    <Text fontWeight="bold">Monday's Meals Preview:</Text>
                    <Text>Breakfast: {mockWeeklyPlan[0].meals.breakfast.name}</Text>
                    <Text>Lunch: {mockWeeklyPlan[0].meals.lunch.name}</Text>
                    <Text>Dinner: {mockWeeklyPlan[0].meals.dinner.name}</Text>
                    <Text>Snack: {mockWeeklyPlan[0].meals.snacks[0].name}</Text>
                  </Box>
                  
                  <Button colorScheme="blue" onClick={() => setShowFullPlan(true)}>
                    View Full Diet Plan
                  </Button>
                </Box>
              )}
              
              <Flex justify="center" mt={6}>
                <Button colorScheme="green" size="lg">
                  Generate Shopping List
                </Button>
              </Flex>
            </Box>
          </TabPanel>
          
          {/* Preferences Tab */}
          <TabPanel>
            <DietPreferences 
              currentPreferences={mockDietPreferences} 
              onSavePreferences={handleSavePreferences} 
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default DietPage;