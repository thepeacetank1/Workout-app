import { apiGet } from '../client';

export interface DashboardSummary {
  stats: {
    workoutsCompleted: number;
    caloriesBurned: number;
    activeMinutes: number;
    streakDays: number;
  };
  goals: {
    id: string;
    name: string;
    target: number;
    current: number;
    unit: string;
    endDate: string;
    startDate: string;
    category: 'weight' | 'workout' | 'nutrition' | 'custom';
  }[];
  recentWorkouts: {
    id: string;
    date: string;
    name: string;
    duration: number;
    caloriesBurned: number;
    exercises: number;
  }[];
  nutritionSummary: {
    calories: {
      consumed: number;
      target: number;
    };
    macros: {
      protein: { consumed: number; target: number; unit: string };
      carbs: { consumed: number; target: number; unit: string };
      fat: { consumed: number; target: number; unit: string };
    };
  };
  activityChart: {
    date: string;
    workoutMinutes: number;
    caloriesBurned: number;
  }[];
}

export const getDashboardSummary = (): Promise<DashboardSummary> => {
  return apiGet<DashboardSummary>('/dashboard/summary');
};

export interface WeeklyActivity {
  date: string;
  activityMinutes: number;
  caloriesBurned: number;
  workoutCompleted: boolean;
}

export const getWeeklyActivity = (): Promise<WeeklyActivity[]> => {
  return apiGet<WeeklyActivity[]>('/dashboard/weekly-activity');
};

export interface UpcomingWorkout {
  id: string;
  name: string;
  date: string;
  duration: number;
  exercises: {
    id: string;
    name: string;
    sets: number;
    reps: number;
  }[];
}

export const getUpcomingWorkouts = (): Promise<UpcomingWorkout[]> => {
  return apiGet<UpcomingWorkout[]>('/dashboard/upcoming-workouts');
};