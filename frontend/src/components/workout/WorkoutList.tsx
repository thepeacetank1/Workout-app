import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Heading, 
  Text, 
  VStack, 
  HStack, 
  Badge, 
  SimpleGrid, 
  Card, 
  CardBody, 
  CardHeader, 
  Button, 
  Flex, 
  IconButton,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Divider,
  Skeleton,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Input
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, ViewIcon, AddIcon, SearchIcon, StarIcon } from '@chakra-ui/icons';
import { Link, useNavigate } from 'react-router-dom';
import { fetchWorkouts, fetchWorkoutById, deleteWorkout, getExercises, generateWorkout } from '../../store/slices/workoutSlice';
import { RootState, AppDispatch } from '../../store';

interface WorkoutFilters {
  search: string;
  type: string;
}

interface WorkoutListProps {
  limit?: number;
  showActions?: boolean;
  onViewWorkout?: (id: string) => void;
  onEditWorkout?: (id: string) => void;
  onDeleteWorkout?: (id: string) => void;
}

const WorkoutList: React.FC<WorkoutListProps> = ({ 
  limit, 
  showActions = true,
  onViewWorkout,
  onEditWorkout,
  onDeleteWorkout
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const toast = useToast();
  
  const { workouts, currentWorkout, exercises, isLoading, error } = useSelector((state: RootState) => state.workout);
  
  const [filters, setFilters] = useState<WorkoutFilters>({
    search: '',
    type: ''
  });
  
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);
  
  const { 
    isOpen: isViewModalOpen, 
    onOpen: onViewModalOpen, 
    onClose: onViewModalClose 
  } = useDisclosure();
  
  const { 
    isOpen: isGenerateModalOpen, 
    onOpen: onGenerateModalOpen, 
    onClose: onGenerateModalClose 
  } = useDisclosure();
  
  const { 
    isOpen: isDeleteAlertOpen, 
    onOpen: onDeleteAlertOpen, 
    onClose: onDeleteAlertClose 
  } = useDisclosure();
  
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  
  useEffect(() => {
    dispatch(fetchWorkouts());
    dispatch(getExercises());
  }, [dispatch]);
  
  useEffect(() => {
    if (selectedWorkoutId) {
      dispatch(fetchWorkoutById(selectedWorkoutId));
    }
  }, [dispatch, selectedWorkoutId]);
  
  const filteredWorkouts = workouts.filter(workout => {
    const matchesSearch = filters.search === '' || 
      workout.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      (workout.description && workout.description.toLowerCase().includes(filters.search.toLowerCase()));
    
    const matchesType = filters.type === '' || workout.type === filters.type;
    
    return matchesSearch && matchesType;
  });
  
  const displayedWorkouts = limit ? filteredWorkouts.slice(0, limit) : filteredWorkouts;
  
  const handleViewWorkout = (id: string) => {
    setSelectedWorkoutId(id);
    onViewModalOpen();
    
    if (onViewWorkout) {
      onViewWorkout(id);
    }
  };
  
  const handleEditWorkout = (id: string) => {
    if (onEditWorkout) {
      onEditWorkout(id);
    } else {
      navigate(`/workout/edit/${id}`);
    }
  };
  
  const handleDeleteWorkout = (id: string) => {
    setSelectedWorkoutId(id);
    onDeleteAlertOpen();
  };
  
  const confirmDeleteWorkout = () => {
    if (selectedWorkoutId) {
      dispatch(deleteWorkout(selectedWorkoutId))
        .unwrap()
        .then(() => {
          toast({
            title: 'Workout deleted',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          
          if (onDeleteWorkout) {
            onDeleteWorkout(selectedWorkoutId);
          }
        })
        .catch((error) => {
          toast({
            title: 'Error deleting workout',
            description: error.message || 'Something went wrong',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        })
        .finally(() => {
          onDeleteAlertClose();
        });
    }
  };
  
  const handleGenerateWorkout = () => {
    // Mock parameters for demo
    const params = {
      type: 'strength',
      duration: 45,
      difficulty: 'intermediate',
      muscleGroups: ['chest', 'back', 'legs'],
      equipment: ['dumbbell', 'barbell']
    };
    
    dispatch(generateWorkout(params))
      .unwrap()
      .then((workout) => {
        toast({
          title: 'Workout generated successfully',
          description: `${workout.name} has been added to your workouts`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        onGenerateModalClose();
      })
      .catch((error) => {
        toast({
          title: 'Error generating workout',
          description: error.message || 'Something went wrong',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });
  };
  
  const getWorkoutTypeOptions = () => {
    const types = new Set<string>();
    
    workouts.forEach(workout => {
      if (workout.type) {
        types.add(workout.type);
      }
    });
    
    return Array.from(types);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      search: e.target.value
    });
  };
  
  const handleTypeFilterChange = (type: string) => {
    setFilters({
      ...filters,
      type: filters.type === type ? '' : type
    });
  };
  
  if (isLoading && workouts.length === 0) {
    return (
      <Box>
        <Skeleton height="40px" width="200px" mb={4} />
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} borderWidth="1px" borderRadius="lg" overflow="hidden">
              <CardHeader pb={0}>
                <Skeleton height="24px" width="80%" mb={2} />
                <Skeleton height="20px" width="60px" />
              </CardHeader>
              <CardBody>
                <Skeleton height="36px" mb={3} />
                <Skeleton height="16px" width="50%" />
                <Flex justify="flex-end" mt={4}>
                  <Skeleton height="32px" width="100px" />
                </Flex>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </Box>
    );
  }
  
  if (error && workouts.length === 0) {
    return (
      <Box textAlign="center" py={10}>
        <Text color="red.500">Error: {error}</Text>
        <Button mt={4} onClick={() => dispatch(fetchWorkouts())}>Retry</Button>
      </Box>
    );
  }
  
  return (
    <Box>
      <Flex 
        direction={{ base: 'column', md: 'row' }} 
        justify="space-between" 
        align={{ base: 'flex-start', md: 'center' }} 
        mb={6}
        gap={4}
      >
        <Heading size="lg">Your Workouts</Heading>
        
        {showActions && (
          <HStack spacing={2}>
            <Button 
              leftIcon={<StarIcon />} 
              colorScheme="purple" 
              size="sm"
              onClick={onGenerateModalOpen}
            >
              Generate Workout
            </Button>
            <Button 
              as={Link} 
              to="/workout/new" 
              leftIcon={<AddIcon />} 
              colorScheme="blue" 
              size="sm"
            >
              Create Workout
            </Button>
          </HStack>
        )}
      </Flex>
      
      <Box mb={6}>
        <Flex 
          direction={{ base: 'column', sm: 'row' }} 
          justify="space-between" 
          align={{ base: 'flex-start', sm: 'center' }}
          mb={4}
          gap={4}
        >
          <Box position="relative" width={{ base: '100%', sm: 'auto' }}>
            <Input
              placeholder="Search workouts..."
              value={filters.search}
              onChange={handleSearchChange}
              pr="40px"
            />
            <Box position="absolute" right="12px" top="50%" transform="translateY(-50%)">
              <SearchIcon color="gray.400" />
            </Box>
          </Box>
          
          <HStack spacing={2} wrap="wrap">
            {getWorkoutTypeOptions().map(type => (
              <Badge
                key={type}
                colorScheme={getWorkoutTypeColor(type)}
                cursor="pointer"
                px={2}
                py={1}
                borderRadius="full"
                fontWeight="normal"
                variant={filters.type === type ? 'solid' : 'subtle'}
                onClick={() => handleTypeFilterChange(type)}
              >
                {type}
              </Badge>
            ))}
          </HStack>
        </Flex>
      </Box>
      
      {isLoading && workouts.length > 0 && (
        <Box textAlign="center" py={4} mb={4}>
          <Text>Refreshing workouts...</Text>
        </Box>
      )}
      
      {displayedWorkouts.length === 0 ? (
        <Box textAlign="center" py={10} borderWidth="1px" borderRadius="lg">
          <Text color="gray.500">
            {filters.search || filters.type 
              ? 'No workouts match your filters. Try adjusting your search criteria.'
              : 'No workouts available. Create your first workout to get started.'}
          </Text>
          <Button mt={4} as={Link} to="/workout/new" colorScheme="blue">
            Create Workout
          </Button>
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
          {displayedWorkouts.map((workout) => (
            <Card 
              key={workout.id} 
              borderWidth="1px" 
              borderRadius="lg" 
              overflow="hidden"
              transition="transform 0.2s"
              _hover={{ transform: 'translateY(-4px)', shadow: 'md' }}
            >
              <CardHeader pb={0}>
                <Heading size="md">{workout.name}</Heading>
                <Badge colorScheme={getWorkoutTypeColor(workout.type)} mt={1}>
                  {workout.type}
                </Badge>
              </CardHeader>
              <CardBody>
                {workout.description && (
                  <Text noOfLines={2} color="gray.600" mb={3}>
                    {workout.description}
                  </Text>
                )}
                <Text fontSize="sm">
                  {workout.exercises.length} exercises • {formatDuration(workout.duration || 0)}
                </Text>
                
                {showActions && (
                  <HStack mt={4} justify="flex-end" spacing={2}>
                    <IconButton
                      aria-label="View workout"
                      icon={<ViewIcon />}
                      size="sm"
                      onClick={() => handleViewWorkout(workout.id)}
                    />
                    <IconButton
                      aria-label="Edit workout"
                      icon={<EditIcon />}
                      size="sm"
                      onClick={() => handleEditWorkout(workout.id)}
                    />
                    <IconButton
                      aria-label="Delete workout"
                      icon={<DeleteIcon />}
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => handleDeleteWorkout(workout.id)}
                    />
                  </HStack>
                )}
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      )}
      
      {/* View Workout Modal */}
      <Modal isOpen={isViewModalOpen} onClose={onViewModalClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Workout Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {!currentWorkout ? (
              <VStack spacing={4}>
                <Skeleton height="30px" width="80%" />
                <Skeleton height="20px" width="40%" />
                <Skeleton height="100px" width="100%" />
                <Skeleton height="150px" width="100%" />
              </VStack>
            ) : (
              <VStack spacing={4} align="stretch">
                <Heading size="md">{currentWorkout.name}</Heading>
                <HStack>
                  <Badge colorScheme={getWorkoutTypeColor(currentWorkout.type)}>
                    {currentWorkout.type}
                  </Badge>
                  <Text fontSize="sm">
                    Duration: {formatDuration(currentWorkout.duration || 0)}
                  </Text>
                </HStack>
                
                {currentWorkout.description && (
                  <Box>
                    <Text fontWeight="semibold">Description</Text>
                    <Text>{currentWorkout.description}</Text>
                  </Box>
                )}
                
                <Divider />
                
                <Box>
                  <Heading size="sm" mb={3}>Exercises ({currentWorkout.exercises.length})</Heading>
                  <VStack spacing={3} align="stretch">
                    {currentWorkout.exercises.map((exercise, index) => (
                      <Card key={index} variant="outline">
                        <CardBody py={3}>
                          <Heading size="xs" mb={1}>{exercise.name || 'Exercise'}</Heading>
                          
                          {exercise.sets.length > 0 && (
                            <Box mt={2}>
                              <Text fontSize="xs" fontWeight="semibold">Sets:</Text>
                              <SimpleGrid columns={3} spacing={2} mt={1}>
                                <Text fontSize="xs" fontWeight="medium">Weight</Text>
                                <Text fontSize="xs" fontWeight="medium">Reps</Text>
                                <Text fontSize="xs" fontWeight="medium">Notes</Text>
                                
                                {exercise.sets.map((set, setIdx) => (
                                  <React.Fragment key={setIdx}>
                                    <Text fontSize="xs">{set.weight ? `${set.weight} lbs` : '-'}</Text>
                                    <Text fontSize="xs">{set.reps || '-'}</Text>
                                    <Text fontSize="xs" noOfLines={1}>{set.notes || '-'}</Text>
                                  </React.Fragment>
                                ))}
                              </SimpleGrid>
                            </Box>
                          )}
                        </CardBody>
                      </Card>
                    ))}
                  </VStack>
                </Box>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onViewModalClose}>
              Close
            </Button>
            <Button 
              colorScheme="blue" 
              leftIcon={<EditIcon />}
              onClick={() => {
                if (currentWorkout) {
                  onViewModalClose();
                  handleEditWorkout(currentWorkout.id);
                }
              }}
            >
              Edit Workout
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* Generate Workout Modal */}
      <Modal isOpen={isGenerateModalOpen} onClose={onGenerateModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Generate Workout</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>
              Our AI will create a personalized workout based on your preferences.
            </Text>
            <Text fontStyle="italic" fontSize="sm" color="gray.600" mb={4}>
              Note: This is a demo feature. In a real implementation, you would provide detailed options for workout type, duration, difficulty, muscle groups, and available equipment.
            </Text>
            <Text>Sample parameters:</Text>
            <Box p={3} bg="gray.50" borderRadius="md" mt={2}>
              <Text><strong>Type:</strong> Strength</Text>
              <Text><strong>Duration:</strong> 45 minutes</Text>
              <Text><strong>Difficulty:</strong> Intermediate</Text>
              <Text><strong>Muscle Groups:</strong> Chest, Back, Legs</Text>
              <Text><strong>Equipment:</strong> Dumbbells, Barbell</Text>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onGenerateModalClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              leftIcon={<StarIcon />}
              onClick={handleGenerateWorkout}
              isLoading={isLoading}
            >
              Generate Workout
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* Delete Confirmation Alert */}
      <AlertDialog
        isOpen={isDeleteAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteAlertClose}
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
              <Button ref={cancelRef} onClick={onDeleteAlertClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDeleteWorkout} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

// Helper functions
const getWorkoutTypeColor = (type: string): string => {
  const typeColors: Record<string, string> = {
    'strength': 'red',
    'cardio': 'green',
    'hiit': 'orange',
    'flexibility': 'blue',
    'crossfit': 'purple',
    'bodyweight': 'teal',
    'yoga': 'cyan'
  };
  
  return typeColors[type.toLowerCase()] || 'gray';
};

const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

export default WorkoutList;