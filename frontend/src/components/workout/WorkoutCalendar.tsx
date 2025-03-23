import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Heading,
  Text,
  Grid,
  VStack,
  HStack,
  Flex,
  Badge,
  Button,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
  Card,
  CardBody,
  Select
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon, AddIcon } from '@chakra-ui/icons';
import { getWorkoutSessions, fetchWorkouts } from '../../store/slices/workoutSlice';
import { RootState, AppDispatch } from '../../store';
import { Link } from 'react-router-dom';

const WorkoutCalendar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const { sessions, workouts, isLoading, error } = useSelector((state: RootState) => state.workout);
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [daysInMonth, setDaysInMonth] = useState<Date[]>([]);
  const [sessionsInMonth, setSessionsInMonth] = useState<Record<string, any[]>>({});
  
  // Get days in the current month for the calendar
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    // Get the day of the week of the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDayOfMonth.getDay();
    
    // Get the previous month's last days to fill the first week
    const previousMonthLastDay = new Date(year, month, 0).getDate();
    const previousMonthDays = Array.from(
      { length: firstDayOfWeek },
      (_, i) => new Date(year, month - 1, previousMonthLastDay - firstDayOfWeek + i + 1)
    );
    
    // Get all days in the current month
    const daysInCurrentMonth = Array.from(
      { length: lastDayOfMonth.getDate() },
      (_, i) => new Date(year, month, i + 1)
    );
    
    // Get next month's first days to fill the last week
    const lastDayOfWeek = lastDayOfMonth.getDay();
    const nextMonthDays = Array.from(
      { length: 6 - lastDayOfWeek },
      (_, i) => new Date(year, month + 1, i + 1)
    );
    
    setDaysInMonth([...previousMonthDays, ...daysInCurrentMonth, ...nextMonthDays]);
  }, [currentDate]);
  
  // Fetch workout sessions on component mount
  useEffect(() => {
    dispatch(fetchWorkouts());
    dispatch(getWorkoutSessions());
  }, [dispatch]);
  
  // Process sessions for the current month
  useEffect(() => {
    if (sessions.length > 0) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      
      // Group sessions by date
      const sessionsByDate: Record<string, any[]> = {};
      
      sessions.forEach(session => {
        const sessionDate = new Date(session.date);
        if (sessionDate.getFullYear() === year && sessionDate.getMonth() === month) {
          const dateKey = sessionDate.toISOString().split('T')[0];
          
          if (!sessionsByDate[dateKey]) {
            sessionsByDate[dateKey] = [];
          }
          
          sessionsByDate[dateKey].push(session);
        }
      });
      
      setSessionsInMonth(sessionsByDate);
    }
  }, [sessions, currentDate]);
  
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
  };
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
  };
  
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onOpen();
  };
  
  const getDayClasses = (date: Date) => {
    const isToday = isSameDay(date, new Date());
    const isCurrentMonth = date.getMonth() === currentDate.getMonth();
    const dateKey = date.toISOString().split('T')[0];
    const hasSessions = sessionsInMonth[dateKey] && sessionsInMonth[dateKey].length > 0;
    
    return {
      bg: isToday ? 'blue.50' : isCurrentMonth ? 'white' : 'gray.50',
      color: isCurrentMonth ? 'black' : 'gray.400',
      fontWeight: isToday ? 'bold' : 'normal',
      border: hasSessions ? '2px solid' : '1px solid',
      borderColor: hasSessions ? 'blue.400' : 'gray.200',
      cursor: 'pointer',
      _hover: {
        bg: 'blue.50',
      }
    };
  };
  
  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };
  
  const getSelectedDateSessions = () => {
    if (!selectedDate) return [];
    
    const dateKey = selectedDate.toISOString().split('T')[0];
    return sessionsInMonth[dateKey] || [];
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };
  
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

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Workout Calendar</Heading>
        <HStack>
          <Button as={Link} to="/workout/log" leftIcon={<AddIcon />} colorScheme="blue" size="sm">
            Log Workout
          </Button>
        </HStack>
      </Flex>
      
      {error && (
        <Text color="red.500" mb={4}>Error: {error}</Text>
      )}
      
      <Box mb={6}>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="md">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </Heading>
          <HStack>
            <IconButton
              aria-label="Previous month"
              icon={<ChevronLeftIcon />}
              onClick={goToPreviousMonth}
            />
            <Button
              size="sm"
              onClick={() => setCurrentDate(new Date())}
            >
              Today
            </Button>
            <IconButton
              aria-label="Next month"
              icon={<ChevronRightIcon />}
              onClick={goToNextMonth}
            />
          </HStack>
        </Flex>
        
        <Grid templateColumns="repeat(7, 1fr)" gap={1}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <Box
              key={day}
              p={2}
              textAlign="center"
              fontWeight="bold"
              bg="gray.100"
              borderTopRadius="md"
            >
              {day}
            </Box>
          ))}
          
          {daysInMonth.map((date, index) => {
            const dateKey = date.toISOString().split('T')[0];
            const daySessions = sessionsInMonth[dateKey] || [];
            
            return (
              <Box
                key={index}
                height="100px"
                p={2}
                {...getDayClasses(date)}
                onClick={() => handleDateClick(date)}
                borderRadius="md"
                overflow="hidden"
              >
                <Text fontSize="sm" textAlign="right">
                  {date.getDate()}
                </Text>
                
                {daySessions.length > 0 && (
                  <VStack spacing={1} mt={1} align="stretch">
                    {daySessions.slice(0, 2).map((session, idx) => {
                      const workoutName = typeof session.workout === 'string' 
                        ? workouts.find(w => w.id === session.workout)?.name || 'Workout' 
                        : session.workout.name;
                      
                      const workoutType = typeof session.workout === 'string'
                        ? workouts.find(w => w.id === session.workout)?.type || 'other'
                        : session.workout.type;
                      
                      return (
                        <Box key={idx} bg={`${getWorkoutTypeColor(workoutType)}.100`} p={1} borderRadius="sm" fontSize="xs">
                          {workoutName}
                        </Box>
                      );
                    })}
                    
                    {daySessions.length > 2 && (
                      <Text fontSize="xs" textAlign="center">+{daySessions.length - 2} more</Text>
                    )}
                  </VStack>
                )}
              </Box>
            );
          })}
        </Grid>
      </Box>
      
      <Box>
        <Heading size="md" mb={4}>Upcoming Workouts</Heading>
        <VStack spacing={4} align="stretch">
          {sessions.length === 0 ? (
            <Box p={4} borderWidth="1px" borderRadius="md" textAlign="center">
              <Text>No upcoming workouts. Start logging your workouts to see them here.</Text>
              <Button mt={4} as={Link} to="/workout/log" colorScheme="blue" size="sm">
                Log Workout
              </Button>
            </Box>
          ) : (
            sessions
              .filter(session => new Date(session.date) >= new Date())
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .slice(0, 3)
              .map((session, idx) => {
                const workoutName = typeof session.workout === 'string' 
                  ? workouts.find(w => w.id === session.workout)?.name || 'Workout' 
                  : session.workout.name;
                
                const workoutType = typeof session.workout === 'string'
                  ? workouts.find(w => w.id === session.workout)?.type || 'other'
                  : session.workout.type;
                
                return (
                  <Card key={idx} borderWidth="1px" borderRadius="md">
                    <CardBody>
                      <Flex justify="space-between" align="center">
                        <Box>
                          <Heading size="sm">{workoutName}</Heading>
                          <HStack mt={1}>
                            <Badge colorScheme={getWorkoutTypeColor(workoutType)}>
                              {workoutType}
                            </Badge>
                            <Text fontSize="sm">
                              {formatDuration(session.duration)}
                            </Text>
                          </HStack>
                          <Text fontSize="sm" color="gray.600" mt={1}>
                            {new Date(session.date).toLocaleDateString()} 
                          </Text>
                        </Box>
                        <Button as={Link} to={`/workout/session/${session.id}`} size="sm" colorScheme="blue">
                          View
                        </Button>
                      </Flex>
                    </CardBody>
                  </Card>
                );
              })
          )}
        </VStack>
      </Box>
      
      {/* Modal for selected date details */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedDate && selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              {getSelectedDateSessions().length === 0 ? (
                <Box p={4} borderWidth="1px" borderRadius="md" textAlign="center">
                  <Text>No workouts on this day.</Text>
                  <Button mt={4} as={Link} to="/workout/log" colorScheme="blue" size="sm" onClick={onClose}>
                    Log Workout
                  </Button>
                </Box>
              ) : (
                getSelectedDateSessions().map((session, idx) => {
                  const workoutName = typeof session.workout === 'string' 
                    ? workouts.find(w => w.id === session.workout)?.name || 'Workout' 
                    : session.workout.name;
                  
                  const workoutType = typeof session.workout === 'string'
                    ? workouts.find(w => w.id === session.workout)?.type || 'other'
                    : session.workout.type;
                  
                  return (
                    <Card key={idx} borderWidth="1px" borderRadius="md">
                      <CardBody>
                        <Heading size="sm" mb={2}>{workoutName}</Heading>
                        <HStack spacing={2} mb={2}>
                          <Badge colorScheme={getWorkoutTypeColor(workoutType)}>
                            {workoutType}
                          </Badge>
                          <Text fontSize="sm">
                            Duration: {formatDuration(session.duration)}
                          </Text>
                        </HStack>
                        
                        {session.notes && (
                          <Text fontSize="sm" color="gray.600" mb={2}>
                            Notes: {session.notes}
                          </Text>
                        )}
                        
                        <Box mt={3}>
                          <Heading size="xs" mb={2}>Exercises:</Heading>
                          <VStack spacing={2} align="stretch">
                            {session.exercises.map((ex: any, exIdx: number) => {
                              const exerciseName = typeof ex.exercise === 'string'
                                ? 'Exercise'
                                : ex.exercise.name;
                                
                              return (
                                <Box key={exIdx} p={2} borderWidth="1px" borderRadius="sm">
                                  <Text fontWeight="bold">{exerciseName}</Text>
                                  <Text fontSize="sm">
                                    {ex.sets.length} {ex.sets.length === 1 ? 'set' : 'sets'}
                                  </Text>
                                </Box>
                              );
                            })}
                          </VStack>
                        </Box>
                        
                        <Button 
                          as={Link} 
                          to={`/workout/session/${session.id}`} 
                          size="sm" 
                          colorScheme="blue" 
                          mt={4}
                          onClick={onClose}
                        >
                          View Details
                        </Button>
                      </CardBody>
                    </Card>
                  );
                })
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default WorkoutCalendar;