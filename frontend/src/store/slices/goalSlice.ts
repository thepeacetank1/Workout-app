import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  category: 'weight' | 'strength' | 'cardio' | 'nutrition' | 'other';
  targetValue: number;
  currentValue: number;
  unit: string;
  completed: boolean;
}

interface GoalState {
  goals: Goal[];
  isLoading: boolean;
  error: string | null;
}

const initialState: GoalState = {
  goals: [],
  isLoading: false,
  error: null,
};

const goalSlice = createSlice({
  name: 'goal',
  initialState,
  reducers: {
    fetchGoalsRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchGoalsSuccess: (state, action: PayloadAction<Goal[]>) => {
      state.goals = action.payload;
      state.isLoading = false;
    },
    fetchGoalsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    createGoalRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    createGoalSuccess: (state, action: PayloadAction<Goal>) => {
      state.goals.push(action.payload);
      state.isLoading = false;
    },
    createGoalFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateGoalRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    updateGoalSuccess: (state, action: PayloadAction<Goal>) => {
      const index = state.goals.findIndex((g) => g.id === action.payload.id);
      if (index !== -1) {
        state.goals[index] = action.payload;
      }
      state.isLoading = false;
    },
    updateGoalFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateGoalProgress: (
      state,
      action: PayloadAction<{ id: string; currentValue: number }>
    ) => {
      const goal = state.goals.find((g) => g.id === action.payload.id);
      if (goal) {
        goal.currentValue = action.payload.currentValue;
        // Check if goal is completed
        if (
          (goal.category === 'weight' && goal.currentValue <= goal.targetValue) ||
          (goal.category !== 'weight' && goal.currentValue >= goal.targetValue)
        ) {
          goal.completed = true;
        }
      }
    },
    deleteGoalRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteGoalSuccess: (state, action: PayloadAction<string>) => {
      state.goals = state.goals.filter((g) => g.id !== action.payload);
      state.isLoading = false;
    },
    deleteGoalFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearGoalError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchGoalsRequest,
  fetchGoalsSuccess,
  fetchGoalsFailure,
  createGoalRequest,
  createGoalSuccess,
  createGoalFailure,
  updateGoalRequest,
  updateGoalSuccess,
  updateGoalFailure,
  updateGoalProgress,
  deleteGoalRequest,
  deleteGoalSuccess,
  deleteGoalFailure,
  clearGoalError,
} = goalSlice.actions;

export default goalSlice.reducer;