import { apiPost, apiGet, apiPut } from '../client';

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ProfileUpdateData {
  name?: string;
  email?: string;
  password?: string;
  avatar?: string;
  height?: number;
  weight?: number;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  fitnessLevel?: 'beginner' | 'intermediate' | 'advanced';
  dietaryPreferences?: string[];
}

// API services
export const login = (credentials: LoginCredentials): Promise<AuthResponse> => {
  return apiPost<AuthResponse>('/users/login', credentials);
};

export const register = (data: RegisterData): Promise<AuthResponse> => {
  return apiPost<AuthResponse>('/users', data);
};

export const getUserProfile = (): Promise<User> => {
  return apiGet<User>('/users/profile');
};

export const updateUserProfile = (data: ProfileUpdateData): Promise<User> => {
  return apiPut<User>('/users/profile', data);
};