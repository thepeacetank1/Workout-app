import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as dashboardService from '../../api/services/dashboard';
import { 
  DashboardSummary, 
  WeeklyActivity, 
  UpcomingWorkout 
} from '../../api/services/dashboard';

interface DashboardState {
  summary: DashboardSummary | null;
  weeklyActivity: WeeklyActivity[];
  upcomingWorkouts: UpcomingWorkout[];
  isLoading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  summary: null,
  weeklyActivity: [],
  upcomingWorkouts: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchDashboardSummary = createAsyncThunk(
  'dashboard/fetchSummary',
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardService.getDashboardSummary();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch dashboard summary'
      );
    }
  }
);

export const fetchWeeklyActivity = createAsyncThunk(
  'dashboard/fetchWeeklyActivity',
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardService.getWeeklyActivity();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch weekly activity'
      );
    }
  }
);

export const fetchUpcomingWorkouts = createAsyncThunk(
  'dashboard/fetchUpcomingWorkouts',
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardService.getUpcomingWorkouts();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch upcoming workouts'
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch dashboard summary
      .addCase(fetchDashboardSummary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action: PayloadAction<DashboardSummary>) => {
        state.isLoading = false;
        state.summary = action.payload;
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch weekly activity
      .addCase(fetchWeeklyActivity.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWeeklyActivity.fulfilled, (state, action: PayloadAction<WeeklyActivity[]>) => {
        state.isLoading = false;
        state.weeklyActivity = action.payload;
      })
      .addCase(fetchWeeklyActivity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch upcoming workouts
      .addCase(fetchUpcomingWorkouts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUpcomingWorkouts.fulfilled, (state, action: PayloadAction<UpcomingWorkout[]>) => {
        state.isLoading = false;
        state.upcomingWorkouts = action.payload;
      })
      .addCase(fetchUpcomingWorkouts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearDashboardError } = dashboardSlice.actions;

export default dashboardSlice.reducer;