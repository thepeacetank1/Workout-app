import { apiGet, apiPost, apiPut, apiDelete } from '../client';

// Types
export interface Nutrient {
  name: string;
  amount: number;
  unit: string;
}

export interface FoodItem {
  _id: string;
  name: string;
  brand?: string;
  calories: number;
  servingSize: number;
  servingUnit: string;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
  };
  nutrients?: Nutrient[];
  isCustom?: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NutritionLog {
  _id: string;
  user: string;
  date: string;
  meal: string;
  foods: Array<{
    foodItem: FoodItem | string;
    servings: number;
    notes?: string;
  }>;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Meal {
  _id?: string;
  name: string;
  foods: Array<{
    foodItem: FoodItem | string;
    servings: number;
  }>;
  totalCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
  };
}

export interface MealPlan {
  _id: string;
  name: string;
  description?: string;
  targetCalories: number;
  targetMacros: {
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
  };
  meals: Meal[];
  createdAt: string;
  updatedAt: string;
}

export interface GenerateNutritionPlanRequest {
  targetCalories: number;
  mealsPerDay: number;
  dietType?: string;
  allergies?: string[];
  preferences?: string[];
  goal?: string;
}

// API services
export const getFoodItems = (search?: string): Promise<FoodItem[]> => {
  const params = search ? `?search=${encodeURIComponent(search)}` : '';
  return apiGet<FoodItem[]>(`/nutrition/foods${params}`);
};

export const createFoodItem = (foodItem: Omit<FoodItem, '_id' | 'createdAt' | 'updatedAt'>): Promise<FoodItem> => {
  return apiPost<FoodItem>('/nutrition/foods', foodItem);
};

export const recordNutrition = (log: Omit<NutritionLog, '_id' | 'user' | 'createdAt' | 'updatedAt'>): Promise<NutritionLog> => {
  return apiPost<NutritionLog>('/nutrition/log', log);
};

export const getNutritionLogs = (startDate?: string, endDate?: string): Promise<NutritionLog[]> => {
  let params = '';
  if (startDate) {
    params += `?startDate=${startDate}`;
    if (endDate) {
      params += `&endDate=${endDate}`;
    }
  } else if (endDate) {
    params += `?endDate=${endDate}`;
  }
  return apiGet<NutritionLog[]>(`/nutrition/log${params}`);
};

export const getNutritionLogByDate = (date: string): Promise<NutritionLog[]> => {
  return apiGet<NutritionLog[]>(`/nutrition/log?date=${date}`);
};

export const updateNutritionLog = (id: string, log: Partial<NutritionLog>): Promise<NutritionLog> => {
  return apiPut<NutritionLog>(`/nutrition/log/${id}`, log);
};

export const deleteNutritionLog = (id: string): Promise<{ message: string }> => {
  return apiDelete<{ message: string }>(`/nutrition/log/${id}`);
};

export const getMealPlans = (): Promise<MealPlan[]> => {
  return apiGet<MealPlan[]>('/nutrition/meal-plans');
};

export const getMealPlanById = (id: string): Promise<MealPlan> => {
  return apiGet<MealPlan>(`/nutrition/meal-plans/${id}`);
};

export const generateNutritionPlan = (params: GenerateNutritionPlanRequest): Promise<MealPlan> => {
  return apiPost<MealPlan>('/nutrition/generate', params);
};