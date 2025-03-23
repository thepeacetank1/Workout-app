import { apiGet, apiPost, apiPut, apiDelete } from '../client';

// Types
export interface Exercise {
  _id: string;
  name: string;
  category: string;
  muscleGroup: string;
  difficulty: string;
  description: string;
  equipment?: string[];
}

export interface WorkoutSet {
  _id?: string;
  weight?: number;
  reps?: number;
  duration?: number;
  distance?: number;
  completed?: boolean;
  notes?: string;
}

export interface WorkoutExercise {
  _id?: string;
  exercise: Exercise | string;
  sets: WorkoutSet[];
  notes?: string;
}

export interface Workout {
  _id: string;
  name: string;
  description?: string;
  type: string;
  exercises: WorkoutExercise[];
  duration?: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutSession {
  _id: string;
  workout: Workout | string;
  date: string;
  duration: number;
  notes?: string;
  completed: boolean;
  exercises: Array<{
    exercise: Exercise | string;
    sets: WorkoutSet[];
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface GenerateWorkoutRequest {
  type: string;
  duration: number;
  difficulty: string;
  muscleGroups: string[];
  equipment?: string[];
}

// API services
export const getWorkouts = (): Promise<Workout[]> => {
  return apiGet<Workout[]>('/workouts');
};

export const getWorkoutById = (id: string): Promise<Workout> => {
  return apiGet<Workout>(`/workouts/${id}`);
};

export const createWorkout = (workout: Omit<Workout, '_id' | 'createdAt' | 'updatedAt'>): Promise<Workout> => {
  return apiPost<Workout>('/workouts', workout);
};

export const updateWorkout = (id: string, workout: Partial<Workout>): Promise<Workout> => {
  return apiPut<Workout>(`/workouts/${id}`, workout);
};

export const deleteWorkout = (id: string): Promise<{ message: string }> => {
  return apiDelete<{ message: string }>(`/workouts/${id}`);
};

export const getExercises = (): Promise<Exercise[]> => {
  return apiGet<Exercise[]>('/workouts/exercises');
};

export const createExercise = (exercise: Omit<Exercise, '_id'>): Promise<Exercise> => {
  return apiPost<Exercise>('/workouts/exercises', exercise);
};

export const getWorkoutSessions = (): Promise<WorkoutSession[]> => {
  return apiGet<WorkoutSession[]>('/workouts/sessions');
};

export const recordWorkoutSession = (
  workoutId: string, 
  session: Omit<WorkoutSession, '_id' | 'workout' | 'createdAt' | 'updatedAt'>
): Promise<WorkoutSession> => {
  return apiPost<WorkoutSession>(`/workouts/${workoutId}/sessions`, session);
};

export const generateWorkout = (params: GenerateWorkoutRequest): Promise<Workout> => {
  return apiPost<Workout>('/workouts/generate', params);
};