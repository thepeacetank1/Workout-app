import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getWorkouts,
  getWorkoutById,
  createWorkout as createWorkoutAPI,
  updateWorkout as updateWorkoutAPI,
  deleteWorkout as deleteWorkoutAPI,
  getExercises as getExercisesAPI,
  recordWorkoutSession as recordWorkoutSessionAPI,
  getWorkoutSessions as getWorkoutSessionsAPI,
  generateWorkout as generateWorkoutAPI,
  Workout as APIWorkout,
  Exercise as APIExercise,
  WorkoutSession,
  GenerateWorkoutRequest
} from '../../api/services/workout';

// Types for our Redux state
interface Exercise {
  id: string;
  name: string;
  category: string;
  muscleGroup: string;
  difficulty: string;
  description: string;
  equipment?: string[];
  sets: {
    id?: string;
    reps?: number;
    weight?: number;
    duration?: number;
    distance?: number;
    completed?: boolean;
    notes?: string;
  }[];
}

interface Workout {
  id: string;
  name: string;
  description?: string;
  type: string;
  exercises: Exercise[];
  duration?: number;
  date?: string;
  createdAt: string;
  updatedAt: string;
}

interface Session {
  id: string;
  workout: Workout | string;
  date: string;
  duration: number;
  notes?: string;
  completed: boolean;
  exercises: Exercise[];
  createdAt: string;
  updatedAt: string;
}

interface WorkoutState {
  workouts: Workout[];
  exercises: APIExercise[];
  sessions: Session[];
  currentWorkout: Workout | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: WorkoutState = {
  workouts: [],
  exercises: [],
  sessions: [],
  currentWorkout: null,
  isLoading: false,
  error: null,
};

// Helper function to map API workout to state workout
const mapApiWorkoutToWorkout = (apiWorkout: APIWorkout): Workout => {
  return {
    id: apiWorkout._id,
    name: apiWorkout.name,
    description: apiWorkout.description,
    type: apiWorkout.type,
    exercises: apiWorkout.exercises.map(ex => {
      const exercise = typeof ex.exercise === 'string' 
        ? { id: ex.exercise, name: '', category: '', muscleGroup: '', difficulty: '', description: '' }
        : {
            id: ex.exercise._id,
            name: ex.exercise.name,
            category: ex.exercise.category,
            muscleGroup: ex.exercise.muscleGroup,
            difficulty: ex.exercise.difficulty,
            description: ex.exercise.description,
            equipment: ex.exercise.equipment
          };
      
      return {
        ...exercise,
        sets: ex.sets.map(set => ({
          id: set._id,
          reps: set.reps,
          weight: set.weight,
          duration: set.duration,
          distance: set.distance,
          completed: set.completed,
          notes: set.notes
        }))
      };
    }),
    duration: apiWorkout.duration,
    createdAt: apiWorkout.createdAt,
    updatedAt: apiWorkout.updatedAt
  };
};

// Thunks
export const fetchWorkouts = createAsyncThunk(
  'workout/fetchWorkouts',
  async (_, { rejectWithValue }) => {
    try {
      const workouts = await getWorkouts();
      return workouts;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch workouts');
    }
  }
);

export const fetchWorkoutById = createAsyncThunk(
  'workout/fetchWorkoutById',
  async (id: string, { rejectWithValue }) => {
    try {
      const workout = await getWorkoutById(id);
      return workout;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch workout');
    }
  }
);

export const createWorkout = createAsyncThunk(
  'workout/createWorkout',
  async (workout: Omit<APIWorkout, '_id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const newWorkout = await createWorkoutAPI(workout);
      return newWorkout;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create workout');
    }
  }
);

export const updateWorkout = createAsyncThunk(
  'workout/updateWorkout',
  async ({ id, workout }: { id: string; workout: Partial<APIWorkout> }, { rejectWithValue }) => {
    try {
      const updatedWorkout = await updateWorkoutAPI(id, workout);
      return updatedWorkout;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update workout');
    }
  }
);

export const deleteWorkout = createAsyncThunk(
  'workout/deleteWorkout',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteWorkoutAPI(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete workout');
    }
  }
);

export const getExercises = createAsyncThunk(
  'workout/getExercises',
  async (_, { rejectWithValue }) => {
    try {
      const exercises = await getExercisesAPI();
      return exercises;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch exercises');
    }
  }
);

export const recordWorkoutSession = createAsyncThunk(
  'workout/recordWorkoutSession',
  async ({ 
    workoutId, 
    session 
  }: { 
    workoutId: string; 
    session: Omit<WorkoutSession, '_id' | 'workout' | 'createdAt' | 'updatedAt'> 
  }, { rejectWithValue }) => {
    try {
      const recordedSession = await recordWorkoutSessionAPI(workoutId, session);
      return recordedSession;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to record workout session');
    }
  }
);

export const getWorkoutSessions = createAsyncThunk(
  'workout/getWorkoutSessions',
  async (_, { rejectWithValue }) => {
    try {
      const sessions = await getWorkoutSessionsAPI();
      return sessions;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch workout sessions');
    }
  }
);

export const generateWorkout = createAsyncThunk(
  'workout/generateWorkout',
  async (params: GenerateWorkoutRequest, { rejectWithValue }) => {
    try {
      const workout = await generateWorkoutAPI(params);
      return workout;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to generate workout');
    }
  }
);

const workoutSlice = createSlice({
  name: 'workout',
  initialState,
  reducers: {
    clearWorkoutError: (state) => {
      state.error = null;
    },
    setCurrentWorkout: (state, action: PayloadAction<Workout | null>) => {
      state.currentWorkout = action.payload;
    }
  },
  extraReducers: (builder) => {
    // fetchWorkouts
    builder.addCase(fetchWorkouts.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchWorkouts.fulfilled, (state, action) => {
      state.workouts = action.payload.map(mapApiWorkoutToWorkout);
      state.isLoading = false;
    });
    builder.addCase(fetchWorkouts.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string || 'Failed to fetch workouts';
    });

    // fetchWorkoutById
    builder.addCase(fetchWorkoutById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchWorkoutById.fulfilled, (state, action) => {
      state.currentWorkout = mapApiWorkoutToWorkout(action.payload);
      state.isLoading = false;
    });
    builder.addCase(fetchWorkoutById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string || 'Failed to fetch workout';
    });

    // createWorkout
    builder.addCase(createWorkout.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createWorkout.fulfilled, (state, action) => {
      state.workouts.push(mapApiWorkoutToWorkout(action.payload));
      state.isLoading = false;
    });
    builder.addCase(createWorkout.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string || 'Failed to create workout';
    });

    // updateWorkout
    builder.addCase(updateWorkout.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateWorkout.fulfilled, (state, action) => {
      const updatedWorkout = mapApiWorkoutToWorkout(action.payload);
      const index = state.workouts.findIndex((w) => w.id === updatedWorkout.id);
      if (index !== -1) {
        state.workouts[index] = updatedWorkout;
      }
      if (state.currentWorkout?.id === updatedWorkout.id) {
        state.currentWorkout = updatedWorkout;
      }
      state.isLoading = false;
    });
    builder.addCase(updateWorkout.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string || 'Failed to update workout';
    });

    // deleteWorkout
    builder.addCase(deleteWorkout.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteWorkout.fulfilled, (state, action) => {
      state.workouts = state.workouts.filter((w) => w.id !== action.payload);
      if (state.currentWorkout?.id === action.payload) {
        state.currentWorkout = null;
      }
      state.isLoading = false;
    });
    builder.addCase(deleteWorkout.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string || 'Failed to delete workout';
    });

    // getExercises
    builder.addCase(getExercises.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getExercises.fulfilled, (state, action) => {
      state.exercises = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getExercises.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string || 'Failed to fetch exercises';
    });

    // recordWorkoutSession
    builder.addCase(recordWorkoutSession.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(recordWorkoutSession.fulfilled, (state, action) => {
      const session = action.payload;
      const mappedSession: Session = {
        id: session._id,
        workout: typeof session.workout === 'string' 
          ? session.workout 
          : mapApiWorkoutToWorkout(session.workout),
        date: session.date,
        duration: session.duration,
        notes: session.notes,
        completed: session.completed,
        exercises: session.exercises.map(ex => {
          const exercise = typeof ex.exercise === 'string' 
            ? { id: ex.exercise, name: '', category: '', muscleGroup: '', difficulty: '', description: '', sets: [] }
            : {
                id: ex.exercise._id,
                name: ex.exercise.name,
                category: ex.exercise.category,
                muscleGroup: ex.exercise.muscleGroup,
                difficulty: ex.exercise.difficulty,
                description: ex.exercise.description,
                equipment: ex.exercise.equipment,
                sets: []
              };
          
          return {
            ...exercise,
            sets: ex.sets.map(set => ({
              id: set._id,
              reps: set.reps,
              weight: set.weight,
              duration: set.duration,
              distance: set.distance,
              completed: set.completed,
              notes: set.notes
            }))
          };
        }),
        createdAt: session.createdAt,
        updatedAt: session.updatedAt
      };
      
      state.sessions.push(mappedSession);
      state.isLoading = false;
    });
    builder.addCase(recordWorkoutSession.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string || 'Failed to record workout session';
    });

    // getWorkoutSessions
    builder.addCase(getWorkoutSessions.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getWorkoutSessions.fulfilled, (state, action) => {
      const mappedSessions = action.payload.map(session => {
        return {
          id: session._id,
          workout: typeof session.workout === 'string' 
            ? session.workout 
            : mapApiWorkoutToWorkout(session.workout),
          date: session.date,
          duration: session.duration,
          notes: session.notes,
          completed: session.completed,
          exercises: session.exercises.map(ex => {
            const exercise = typeof ex.exercise === 'string' 
              ? { id: ex.exercise, name: '', category: '', muscleGroup: '', difficulty: '', description: '', sets: [] }
              : {
                  id: ex.exercise._id,
                  name: ex.exercise.name,
                  category: ex.exercise.category,
                  muscleGroup: ex.exercise.muscleGroup,
                  difficulty: ex.exercise.difficulty,
                  description: ex.exercise.description,
                  equipment: ex.exercise.equipment,
                  sets: []
                };
            
            return {
              ...exercise,
              sets: ex.sets.map(set => ({
                id: set._id,
                reps: set.reps,
                weight: set.weight,
                duration: set.duration,
                distance: set.distance,
                completed: set.completed,
                notes: set.notes
              }))
            };
          }),
          createdAt: session.createdAt,
          updatedAt: session.updatedAt
        };
      });
      
      state.sessions = mappedSessions;
      state.isLoading = false;
    });
    builder.addCase(getWorkoutSessions.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string || 'Failed to fetch workout sessions';
    });

    // generateWorkout
    builder.addCase(generateWorkout.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(generateWorkout.fulfilled, (state, action) => {
      const workout = mapApiWorkoutToWorkout(action.payload);
      state.workouts.push(workout);
      state.currentWorkout = workout;
      state.isLoading = false;
    });
    builder.addCase(generateWorkout.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string || 'Failed to generate workout';
    });
  },
});

export const { clearWorkoutError, setCurrentWorkout } = workoutSlice.actions;

export default workoutSlice.reducer;