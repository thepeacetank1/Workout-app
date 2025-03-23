import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Heading, 
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel, 
  SimpleGrid,
  Button,
  Text,
  useColorModeValue,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  HStack
} from '@chakra-ui/react';
import WorkoutList from '../workout/WorkoutList';
import WorkoutLogger from '../workout/WorkoutLogger';
import WorkoutCalendar from '../workout/WorkoutCalendar';
import { fetchWorkouts, deleteWorkout, getWorkoutSessions } from '../../store/slices/workoutSlice';
import { RootState, AppDispatch } from '../../store';

const mockScheduledWorkouts = [
  {
    id: '101',
    title: 'Morning Cardio',
    date: '2023-11-17',
    time: '06:30 AM',
    duration: 45
  },
  {
    id: '102',
    title: 'Full Body Strength',
    date: '2023-11-19',
    time: '05:00 PM',
    duration: 60
  },
  {
    id: '103',
    title: 'Yoga Session',
    date: '2023-11-21',
    time: '07:00 AM',
    duration: 30
  }
];

const WorkoutPage: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const toast = useToast();
  
  const { workouts, sessions, isLoading, error } = useSelector((state: RootState) => state.workout);
  
  // State for delete confirmation dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState<string | null>(null);
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  
  useEffect(() => {
    dispatch(fetchWorkouts());
    dispatch(getWorkoutSessions());
  }, [dispatch]);

  const handleViewWorkout = (id: string) => {
    navigate(`/workout/${id}`);
  };

  const handleEditWorkout = (id: string) => {
    navigate(`/workout/edit/${id}`);
  };

  const handleDeleteWorkoutConfirm = (id: string) => {
    setWorkoutToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteWorkout = async () => {
    if (workoutToDelete) {
      try {
        await dispatch(deleteWorkout(workoutToDelete)).unwrap();
        toast({
          title: "Workout deleted",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (err) {
        toast({
          title: "Error deleting workout",
          description: typeof err === 'string' ? err : "An error occurred",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
    setIsDeleteDialogOpen(false);
    setWorkoutToDelete(null);
  };

  const handleLogWorkout = (entry: any) => {
    console.log('Workout logged:', entry);
    // In a real implementation, this would dispatch an action to store the workout
    toast({
      title: "Workout logged",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleAddScheduledWorkout = (workout: any) => {
    console.log('Workout scheduled:', workout);
    // In a real implementation, this would dispatch an action to store the scheduled workout
    toast({
      title: "Workout scheduled",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Filter workouts by type for recommendation buttons
  const filterWorkoutsByType = (type: string) => {
    return workouts.filter(workout => 
      workout.type.toLowerCase() === type.toLowerCase()
    );
  };

  return (
    <Box>
      <Heading as="h1" size="xl" mb={6}>Workouts</Heading>
      
      <Tabs index={tabIndex} onChange={setTabIndex} variant="enclosed" mb={6}>
        <TabList>
          <Tab>My Workouts</Tab>
          <Tab>Log Workout</Tab>
          <Tab>Schedule</Tab>
          <Tab>History</Tab>
        </TabList>
        
        <TabPanels>
          {/* Workouts Tab */}
          <TabPanel>
            <Box mb={6}>
              <Text fontSize="lg" mb={4}>
                Manage your personalized workout routines:
              </Text>
              <WorkoutList 
                showActions={true}
                onViewWorkout={handleViewWorkout}
                onEditWorkout={handleEditWorkout}
                onDeleteWorkout={handleDeleteWorkoutConfirm}
              />
              
              <Box mt={6} p={4} border="1px" borderColor={borderColor} borderRadius="md">
                <Heading as="h3" size="sm" mb={3}>Filter by Workout Type</Heading>
                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                  <Button colorScheme="blue" onClick={() => navigate('/workout/filter/strength')}>Strength</Button>
                  <Button colorScheme="green" onClick={() => navigate('/workout/filter/cardio')}>Cardio</Button>
                  <Button colorScheme="orange" onClick={() => navigate('/workout/filter/hiit')}>HIIT</Button>
                  <Button colorScheme="purple" onClick={() => navigate('/workout/filter/flexibility')}>Flexibility</Button>
                </SimpleGrid>
              </Box>
            </Box>
          </TabPanel>
          
          {/* Log Workout Tab */}
          <TabPanel>
            <WorkoutLogger onLogWorkout={handleLogWorkout} />
          </TabPanel>
          
          {/* Schedule Tab */}
          <TabPanel>
            <WorkoutCalendar 
              scheduledWorkouts={mockScheduledWorkouts} 
              onAddWorkout={handleAddScheduledWorkout} 
            />
            
            <Box mt={6} p={4} border="1px" borderColor={borderColor} borderRadius="md">
              <Heading as="h3" size="sm" mb={3}>Calendar Integration</Heading>
              <Text mb={4}>
                Sync your workout schedule with your calendar to keep track of your fitness routine.
              </Text>
              <HStack spacing={4}>
                <Button colorScheme="blue">Connect to Google Calendar</Button>
                <Button colorScheme="teal">Export Schedule</Button>
              </HStack>
            </Box>
          </TabPanel>
          
          {/* History Tab */}
          <TabPanel>
            <Box p={4} border="1px" borderColor={borderColor} borderRadius="md">
              <Heading as="h3" size="md" mb={4}>Workout History</Heading>
              
              {sessions && sessions.length > 0 ? (
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  {sessions.map(session => (
                    <Box key={session.id} p={3} borderWidth="1px" borderRadius="md">
                      <Heading size="sm">{
                        typeof session.workout === 'string' 
                          ? 'Unknown Workout' 
                          : session.workout.name
                      }</Heading>
                      <Text fontSize="sm" mt={1}>{new Date(session.date).toLocaleDateString()}</Text>
                      <Text fontSize="sm">Duration: {session.duration} minutes</Text>
                      <Text fontSize="sm">Exercises: {session.exercises.length}</Text>
                      {session.notes && <Text fontSize="sm" mt={1}>Notes: {session.notes}</Text>}
                    </Box>
                  ))}
                </SimpleGrid>
              ) : (
                <>
                  <Text color="gray.500" fontStyle="italic">
                    No workout history available yet. Start logging your workouts!
                  </Text>
                  
                  <Button mt={4} colorScheme="blue" onClick={() => setTabIndex(1)}>
                    Log Your First Workout
                  </Button>
                </>
              )}
            </Box>
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
              Delete Workout
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this workout? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteWorkout} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default WorkoutPage;