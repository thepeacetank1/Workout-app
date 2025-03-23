import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Textarea,
  VStack,
  HStack,
  Text,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormErrorMessage,
  useToast,
  IconButton,
  Divider,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { getExercises, recordWorkoutSession, Exercise } from '../../store/slices/workoutSlice';
import { RootState, AppDispatch } from '../../store';

interface WorkoutSet {
  weight?: number;
  reps?: number;
  duration?: number;
  distance?: number;
  completed?: boolean;
  notes?: string;
}

interface WorkoutExercise {
  exercise: string;
  sets: WorkoutSet[];
  notes?: string;
}

interface WorkoutSession {
  date: string;
  duration: number;
  notes?: string;
  completed: boolean;
  exercises: WorkoutExercise[];
}

const WorkoutLogger: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const toast = useToast();
  
  const { exercises, isLoading, error } = useSelector((state: RootState) => state.workout);
  
  const [workoutSession, setWorkoutSession] = useState<WorkoutSession>({
    date: new Date().toISOString().split('T')[0],
    duration: 0,
    completed: true,
    exercises: [
      {
        exercise: '',
        sets: [{ weight: 0, reps: 0 }],
        notes: ''
      }
    ]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    dispatch(getExercises());
  }, [dispatch]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!workoutSession.date) {
      newErrors.date = 'Date is required';
    }
    
    if (workoutSession.duration <= 0) {
      newErrors.duration = 'Duration must be greater than 0';
    }
    
    workoutSession.exercises.forEach((exercise, idx) => {
      if (!exercise.exercise) {
        newErrors[`exercise-${idx}`] = 'Please select an exercise';
      }
      
      exercise.sets.forEach((set, setIdx) => {
        if ((set.reps === undefined || set.reps <= 0) && (set.duration === undefined || set.duration <= 0)) {
          newErrors[`set-${idx}-${setIdx}`] = 'Either reps or duration must be provided';
        }
      });
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleExerciseChange = (idx: number, field: string, value: any) => {
    const updatedExercises = [...workoutSession.exercises];
    updatedExercises[idx] = { ...updatedExercises[idx], [field]: value };
    setWorkoutSession({ ...workoutSession, exercises: updatedExercises });
  };

  const handleSetChange = (exerciseIdx: number, setIdx: number, field: string, value: any) => {
    const updatedExercises = [...workoutSession.exercises];
    updatedExercises[exerciseIdx].sets[setIdx] = { 
      ...updatedExercises[exerciseIdx].sets[setIdx], 
      [field]: field === 'completed' ? value : Number(value) 
    };
    setWorkoutSession({ ...workoutSession, exercises: updatedExercises });
  };

  const addExercise = () => {
    setWorkoutSession({
      ...workoutSession,
      exercises: [
        ...workoutSession.exercises,
        {
          exercise: '',
          sets: [{ weight: 0, reps: 0 }],
          notes: ''
        }
      ]
    });
  };

  const removeExercise = (idx: number) => {
    const updatedExercises = [...workoutSession.exercises];
    updatedExercises.splice(idx, 1);
    setWorkoutSession({ ...workoutSession, exercises: updatedExercises });
  };

  const addSet = (exerciseIdx: number) => {
    const updatedExercises = [...workoutSession.exercises];
    updatedExercises[exerciseIdx].sets.push({ weight: 0, reps: 0 });
    setWorkoutSession({ ...workoutSession, exercises: updatedExercises });
  };

  const removeSet = (exerciseIdx: number, setIdx: number) => {
    const updatedExercises = [...workoutSession.exercises];
    updatedExercises[exerciseIdx].sets.splice(setIdx, 1);
    setWorkoutSession({ ...workoutSession, exercises: updatedExercises });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please correct the errors in the form.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    
    try {
      // We need to select a workout first - using the default workout ID for simplicity
      // In a real app, this would be selected by the user
      const workoutId = 'default-workout-id';
      
      const sessionToSubmit = {
        ...workoutSession,
        exercises: workoutSession.exercises.map(ex => ({
          ...ex,
          sets: ex.sets.map(set => ({
            ...set,
            // Convert empty strings to undefined
            weight: set.weight || undefined,
            reps: set.reps || undefined,
            duration: set.duration || undefined,
            distance: set.distance || undefined,
          }))
        }))
      };
      
      dispatch(recordWorkoutSession({ workoutId, session: sessionToSubmit }))
        .unwrap()
        .then(() => {
          toast({
            title: 'Workout Logged Successfully',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          
          // Reset form
          setWorkoutSession({
            date: new Date().toISOString().split('T')[0],
            duration: 0,
            completed: true,
            exercises: [
              {
                exercise: '',
                sets: [{ weight: 0, reps: 0 }],
                notes: ''
              }
            ]
          });
        })
        .catch((error) => {
          toast({
            title: 'Error Logging Workout',
            description: error.message || 'Something went wrong',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        });
    } catch (error) {
      console.error('Error submitting workout:', error);
    }
  };

  return (
    <Box>
      <Heading size="lg" mb={6}>Log Your Workout</Heading>
      
      {error && (
        <Text color="red.500" mb={4}>Error: {error}</Text>
      )}
      
      <form onSubmit={handleSubmit}>
        <VStack spacing={6} align="stretch">
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <FormControl isInvalid={!!errors.date}>
              <FormLabel htmlFor="date">Date</FormLabel>
              <Input
                id="date"
                type="date"
                value={workoutSession.date}
                onChange={(e) => setWorkoutSession({ ...workoutSession, date: e.target.value })}
              />
              {errors.date && <FormErrorMessage>{errors.date}</FormErrorMessage>}
            </FormControl>
            
            <FormControl isInvalid={!!errors.duration}>
              <FormLabel htmlFor="duration">Duration (minutes)</FormLabel>
              <NumberInput
                id="duration"
                min={0}
                value={workoutSession.duration}
                onChange={(_, value) => setWorkoutSession({ ...workoutSession, duration: value })}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {errors.duration && <FormErrorMessage>{errors.duration}</FormErrorMessage>}
            </FormControl>
          </SimpleGrid>
          
          <FormControl>
            <FormLabel htmlFor="notes">Workout Notes</FormLabel>
            <Textarea
              id="notes"
              placeholder="Add notes about your workout"
              value={workoutSession.notes || ''}
              onChange={(e) => setWorkoutSession({ ...workoutSession, notes: e.target.value })}
            />
          </FormControl>
          
          <Box>
            <Flex justify="space-between" align="center" mb={4}>
              <Heading size="md">Exercises</Heading>
              <Button leftIcon={<AddIcon />} colorScheme="blue" size="sm" onClick={addExercise}>
                Add Exercise
              </Button>
            </Flex>
            
            <VStack spacing={6} align="stretch">
              {workoutSession.exercises.map((exercise, exerciseIdx) => (
                <Card key={exerciseIdx} borderWidth="1px">
                  <CardHeader pb={2}>
                    <Flex justify="space-between" align="center">
                      <FormControl isInvalid={!!errors[`exercise-${exerciseIdx}`]}>
                        <Select
                          placeholder="Select exercise"
                          value={exercise.exercise}
                          onChange={(e) => handleExerciseChange(exerciseIdx, 'exercise', e.target.value)}
                        >
                          {exercises.map((ex) => (
                            <option key={ex._id} value={ex._id}>
                              {ex.name}
                            </option>
                          ))}
                        </Select>
                        {errors[`exercise-${exerciseIdx}`] && <FormErrorMessage>{errors[`exercise-${exerciseIdx}`]}</FormErrorMessage>}
                      </FormControl>
                      <IconButton
                        aria-label="Remove exercise"
                        icon={<DeleteIcon />}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        isDisabled={workoutSession.exercises.length <= 1}
                        onClick={() => removeExercise(exerciseIdx)}
                      />
                    </Flex>
                  </CardHeader>
                  
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <FormControl>
                        <FormLabel fontSize="sm">Exercise Notes</FormLabel>
                        <Textarea
                          placeholder="Notes about this exercise"
                          size="sm"
                          value={exercise.notes || ''}
                          onChange={(e) => handleExerciseChange(exerciseIdx, 'notes', e.target.value)}
                        />
                      </FormControl>
                      
                      <Box>
                        <Flex justify="space-between" align="center" mb={2}>
                          <Heading size="xs">Sets</Heading>
                          <Button size="xs" leftIcon={<AddIcon />} onClick={() => addSet(exerciseIdx)}>Add Set</Button>
                        </Flex>
                        
                        {exercise.sets.map((set, setIdx) => (
                          <Box key={setIdx} mb={3}>
                            <Flex justify="space-between" align="center" mb={2}>
                              <Text fontWeight="bold" fontSize="sm">Set {setIdx + 1}</Text>
                              <IconButton
                                aria-label="Remove set"
                                icon={<DeleteIcon />}
                                size="xs"
                                colorScheme="red"
                                variant="ghost"
                                isDisabled={exercise.sets.length <= 1}
                                onClick={() => removeSet(exerciseIdx, setIdx)}
                              />
                            </Flex>
                            
                            <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={2}>
                              <FormControl isInvalid={!!errors[`set-${exerciseIdx}-${setIdx}`]}>
                                <FormLabel fontSize="xs">Weight (lbs)</FormLabel>
                                <NumberInput
                                  size="sm"
                                  min={0}
                                  step={2.5}
                                  value={set.weight || 0}
                                  onChange={(_, value) => handleSetChange(exerciseIdx, setIdx, 'weight', value)}
                                >
                                  <NumberInputField />
                                  <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                  </NumberInputStepper>
                                </NumberInput>
                              </FormControl>
                              
                              <FormControl isInvalid={!!errors[`set-${exerciseIdx}-${setIdx}`]}>
                                <FormLabel fontSize="xs">Reps</FormLabel>
                                <NumberInput
                                  size="sm"
                                  min={0}
                                  value={set.reps || 0}
                                  onChange={(_, value) => handleSetChange(exerciseIdx, setIdx, 'reps', value)}
                                >
                                  <NumberInputField />
                                  <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                  </NumberInputStepper>
                                </NumberInput>
                                {errors[`set-${exerciseIdx}-${setIdx}`] && <FormErrorMessage>{errors[`set-${exerciseIdx}-${setIdx}`]}</FormErrorMessage>}
                              </FormControl>
                            </SimpleGrid>
                          </Box>
                        ))}
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          </Box>
          
          <Button 
            type="submit" 
            colorScheme="blue" 
            size="lg" 
            isLoading={isLoading}
            loadingText="Submitting"
          >
            Log Workout
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default WorkoutLogger;