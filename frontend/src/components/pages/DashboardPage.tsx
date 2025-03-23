import React, { useState } from 'react';
import { 
  Box, 
  Heading, 
  SimpleGrid, 
  Stat, 
  StatLabel, 
  StatNumber, 
  StatGroup,
  Button,
  Flex,
  Text,
  List,
  ListItem,
  useColorModeValue
} from '@chakra-ui/react';
import DashboardSummary from '../dashboard/DashboardSummary';
import ActivityChart from '../dashboard/ActivityChart';

// Mock data for demonstration
const mockSummaryStats = {
  totalWorkouts: 36,
  workoutStreak: 12,
  caloriesBurned: 4280,
  goalProgress: 65,
  lastWorkout: '2023-11-15',
  upcomingWorkout: {
    date: '2023-11-17',
    time: '6:00 PM',
    type: 'Full Body Strength'
  },
  weightProgress: {
    current: 75,
    target: 70,
    startWeight: 80
  },
  nutritionSummary: {
    averageCalories: 2100,
    averageProtein: 120,
    averageCarbs: 200,
    averageFat: 70
  }
};

const mockActivityData = [
  { date: '2023-11-09', workoutMinutes: 45, caloriesBurned: 320 },
  { date: '2023-11-10', workoutMinutes: 0, caloriesBurned: 0 },
  { date: '2023-11-11', workoutMinutes: 60, caloriesBurned: 450 },
  { date: '2023-11-12', workoutMinutes: 30, caloriesBurned: 220 },
  { date: '2023-11-13', workoutMinutes: 45, caloriesBurned: 330 },
  { date: '2023-11-14', workoutMinutes: 0, caloriesBurned: 0 },
  { date: '2023-11-15', workoutMinutes: 75, caloriesBurned: 550 }
];

const DashboardPage: React.FC = () => {
  const [timeFrame, setTimeFrame] = useState<'week' | 'month' | 'year'>('week');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box>
      <Heading as="h1" size="xl" mb={6}>Dashboard</Heading>
      
      <StatGroup>
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={8}>
          <Stat>
            <StatLabel>Total Workouts</StatLabel>
            <StatNumber>{mockSummaryStats.totalWorkouts}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>This Week</StatLabel>
            <StatNumber>3</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Calories Burned</StatLabel>
            <StatNumber>{mockSummaryStats.caloriesBurned.toLocaleString()}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Streak</StatLabel>
            <StatNumber>{mockSummaryStats.workoutStreak} days</StatNumber>
          </Stat>
        </SimpleGrid>
      </StatGroup>
      
      <Box border="1px" borderColor={borderColor} borderRadius="md" p={4} mb={6}>
        <Heading as="h2" size="md" mb={4}>Activity Overview</Heading>
        <ActivityChart 
          activityData={mockActivityData} 
          timeFrame={timeFrame} 
          onTimeFrameChange={setTimeFrame} 
        />
      </Box>
      
      <Box border="1px" borderColor={borderColor} borderRadius="md" p={4} mb={6}>
        <Heading as="h2" size="md" mb={4}>Your Goals</Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <Box>
            <Text fontWeight="bold">Weight Goal Progress: {mockSummaryStats.goalProgress}%</Text>
            <Box bg="gray.100" h="20px" w="100%" borderRadius="md" mt={2} overflow="hidden">
              <Box 
                bg="green.400" 
                h="100%" 
                w={`${mockSummaryStats.goalProgress}%`}
                transition="width 0.5s ease-in-out"
              />
            </Box>
            <Flex justify="space-between" mt={1}>
              <Text fontSize="sm">{mockSummaryStats.weightProgress?.startWeight} kg</Text>
              <Text fontSize="sm">{mockSummaryStats.weightProgress?.target} kg</Text>
            </Flex>
          </Box>
          
          <Box>
            <Text fontWeight="bold">Quick Actions</Text>
            <Flex mt={2} flexWrap="wrap" gap={2}>
              <Button colorScheme="blue" size="sm">Log Workout</Button>
              <Button colorScheme="green" size="sm">Log Food</Button>
              <Button colorScheme="purple" size="sm">Schedule Workout</Button>
            </Flex>
          </Box>
        </SimpleGrid>
      </Box>
      
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        <Box border="1px" borderColor={borderColor} borderRadius="md" p={4}>
          <Heading as="h2" size="md" mb={4}>Nutrition Summary</Heading>
          <SimpleGrid columns={2} spacing={4}>
            <Stat>
              <StatLabel>Avg. Daily Calories</StatLabel>
              <StatNumber>{mockSummaryStats.nutritionSummary.averageCalories}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Avg. Protein</StatLabel>
              <StatNumber>{mockSummaryStats.nutritionSummary.averageProtein}g</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Avg. Carbs</StatLabel>
              <StatNumber>{mockSummaryStats.nutritionSummary.averageCarbs}g</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Avg. Fat</StatLabel>
              <StatNumber>{mockSummaryStats.nutritionSummary.averageFat}g</StatNumber>
            </Stat>
          </SimpleGrid>
        </Box>
        
        <Box border="1px" borderColor={borderColor} borderRadius="md" p={4}>
          <Heading as="h2" size="md" mb={4}>Upcoming Workouts</Heading>
          {mockSummaryStats.upcomingWorkout ? (
            <Box p={3} bg="blue.50" borderRadius="md">
              <Text fontWeight="bold">{mockSummaryStats.upcomingWorkout.type}</Text>
              <Text>{mockSummaryStats.upcomingWorkout.date} at {mockSummaryStats.upcomingWorkout.time}</Text>
            </Box>
          ) : (
            <Text>No upcoming workouts scheduled</Text>
          )}
          <Button mt={4} colorScheme="blue" size="sm">View Calendar</Button>
        </Box>
      </SimpleGrid>
      
      <Box border="1px" borderColor={borderColor} borderRadius="md" p={4} mt={6}>
        <Heading as="h2" size="md" mb={4}>Recent Progress</Heading>
        <List spacing={2}>
          <ListItem>
            <Text>
              <Text as="span" fontWeight="bold">Nov 15:</Text> Completed Full Body Workout
            </Text>
          </ListItem>
          <ListItem>
            <Text>
              <Text as="span" fontWeight="bold">Nov 13:</Text> Logged nutrition for 7 consecutive days
            </Text>
          </ListItem>
          <ListItem>
            <Text>
              <Text as="span" fontWeight="bold">Nov 11:</Text> Reached 25% of weight loss goal
            </Text>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};

export default DashboardPage;