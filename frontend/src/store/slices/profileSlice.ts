import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as profileService from '../../api/services/profile';
import { UserProfile, MeasurementHistory } from '../../api/services/profile';

interface ProfileState {
  profile: UserProfile | null;
  measurements: {
    weight: MeasurementHistory[];
    chest: MeasurementHistory[];
    waist: MeasurementHistory[];
    hips: MeasurementHistory[];
    biceps: MeasurementHistory[];
    thighs: MeasurementHistory[];
  };
  isLoading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  measurements: {
    weight: [],
    chest: [],
    waist: [],
    hips: [],
    biceps: [],
    thighs: [],
  },
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  'profile/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      return await profileService.getUserProfile();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch user profile'
      );
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'profile/updateUserProfile',
  async (profileData: Partial<UserProfile>, { rejectWithValue }) => {
    try {
      return await profileService.updateUserProfile(profileData);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update profile'
      );
    }
  }
);

export const uploadProfilePicture = createAsyncThunk(
  'profile/uploadProfilePicture',
  async (formData: FormData, { rejectWithValue, dispatch }) => {
    try {
      const response = await profileService.uploadProfilePicture(formData);
      // After uploading, update the user profile
      dispatch(fetchUserProfile());
      return response.avatarUrl;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to upload profile picture'
      );
    }
  }
);

export const fetchMeasurementHistory = createAsyncThunk(
  'profile/fetchMeasurementHistory',
  async (type: 'weight' | 'chest' | 'waist' | 'hips' | 'biceps' | 'thighs', { rejectWithValue }) => {
    try {
      const measurements = await profileService.getMeasurementHistory(type);
      return { type, measurements };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || `Failed to fetch ${type} measurements`
      );
    }
  }
);

export const addMeasurement = createAsyncThunk(
  'profile/addMeasurement',
  async (data: Omit<MeasurementHistory, 'date'>, { rejectWithValue, dispatch }) => {
    try {
      const measurement = await profileService.addMeasurement(data);
      // Refresh the measurement history for that type
      dispatch(fetchMeasurementHistory(data.type));
      return measurement;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add measurement'
      );
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update user profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Upload profile picture
      .addCase(uploadProfilePicture.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadProfilePicture.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(uploadProfilePicture.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch measurement history
      .addCase(fetchMeasurementHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMeasurementHistory.fulfilled, (state, action: PayloadAction<{
        type: 'weight' | 'chest' | 'waist' | 'hips' | 'biceps' | 'thighs';
        measurements: MeasurementHistory[];
      }>) => {
        state.isLoading = false;
        state.measurements[action.payload.type] = action.payload.measurements;
      })
      .addCase(fetchMeasurementHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Add measurement (just set loading/error state, actual data updated in thunk)
      .addCase(addMeasurement.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addMeasurement.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(addMeasurement.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProfileError } = profileSlice.actions;

export default profileSlice.reducer;