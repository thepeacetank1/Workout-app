import { apiGet, apiPost, apiPut } from '../client';
import { User } from './auth';

export interface UserProfile extends User {
  height?: number; // in cm
  weight?: number; // in kg
  dateOfBirth?: string; // ISO date string
  gender?: 'male' | 'female' | 'other';
  fitnessLevel?: 'beginner' | 'intermediate' | 'advanced';
  fitnessGoals?: string[]; // e.g. ['weight_loss', 'muscle_gain', 'endurance']
  dietaryPreferences?: string[]; // e.g. ['vegetarian', 'vegan', 'keto', 'paleo']
  dietaryRestrictions?: string[]; // e.g. ['gluten', 'dairy', 'nuts']
  activityLevel?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    biceps?: number;
    thighs?: number;
  };
}

export interface MeasurementHistory {
  date: string; // ISO date string
  value: number;
  type: 'weight' | 'chest' | 'waist' | 'hips' | 'biceps' | 'thighs';
}

// API endpoints
export const getUserProfile = (): Promise<UserProfile> => {
  return apiGet<UserProfile>('/users/profile');
};

export const updateUserProfile = (data: Partial<UserProfile>): Promise<UserProfile> => {
  return apiPut<UserProfile>('/users/profile', data);
};

export const uploadProfilePicture = (formData: FormData): Promise<{avatarUrl: string}> => {
  return apiPost<{avatarUrl: string}>('/users/profile/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getMeasurementHistory = (type: string): Promise<MeasurementHistory[]> => {
  return apiGet<MeasurementHistory[]>(`/users/measurements/${type}`);
};

export const addMeasurement = (data: Omit<MeasurementHistory, 'date'>): Promise<MeasurementHistory> => {
  return apiPost<MeasurementHistory>('/users/measurements', data);
};