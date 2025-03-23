import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getFoodItems,
  createFoodItem as createFoodItemAPI,
  recordNutrition as recordNutritionAPI,
  getNutritionLogs,
  getNutritionLogByDate,
  updateNutritionLog as updateNutritionLogAPI,
  deleteNutritionLog as deleteNutritionLogAPI,
  getMealPlans,
  getMealPlanById,
  generateNutritionPlan as generateNutritionPlanAPI,
  FoodItem as APIFoodItem,
  NutritionLog as APINutritionLog,
  MealPlan as APIMealPlan,
  Meal as APIMeal,
  GenerateNutritionPlanRequest
} from '../../api/services/nutrition';

// State Types
interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  calories: number;
  servingSize: number;
  servingUnit: string;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  isCustom?: boolean;
}

interface MealFood {
  id: string;
  foodItem: FoodItem | string;
  servings: number;
  notes?: string;
}

interface NutritionLogEntry {
  id: string;
  date: string;
  meal: string;
  foods: MealFood[];
  notes?: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  createdAt: string;
  updatedAt: string;
}

interface MealPlan {
  id: string;
  name: string;
  description?: string;
  targetCalories: number;
  targetMacros: {
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
  };
  meals: {
    id?: string;
    name: string;
    foods: Array<{
      foodItem: FoodItem | string;
      servings: number;
    }>;
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface NutritionState {
  foodItems: FoodItem[];
  nutritionLogs: NutritionLogEntry[];
  mealPlans: MealPlan[];
  currentMealPlan: MealPlan | null;
  dailyGoals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: NutritionState = {
  foodItems: [],
  nutritionLogs: [],
  mealPlans: [],
  currentMealPlan: null,
  dailyGoals: {
    calories: 2000,
    protein: 150,
    carbs: 200,
    fat: 65,
  },
  isLoading: false,
  error: null,
};

// Helper functions to map API types to state types
const mapApiFoodItemToFoodItem = (apiFoodItem: APIFoodItem): FoodItem => {
  return {
    id: apiFoodItem._id,
    name: apiFoodItem.name,
    brand: apiFoodItem.brand,
    calories: apiFoodItem.calories,
    servingSize: apiFoodItem.servingSize,
    servingUnit: apiFoodItem.servingUnit,
    protein: apiFoodItem.macros.protein,
    carbs: apiFoodItem.macros.carbs,
    fat: apiFoodItem.macros.fat,
    fiber: apiFoodItem.macros.fiber,
    isCustom: apiFoodItem.isCustom
  };
};

const mapApiNutritionLogToNutritionLogEntry = (apiLog: APINutritionLog): NutritionLogEntry => {
  // Calculate totals
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  
  const mappedFoods = apiLog.foods.map(food => {
    const foodDetails = typeof food.foodItem === 'string' 
      ? { id: food.foodItem, name: '', calories: 0, servingSize: 0, servingUnit: '', protein: 0, carbs: 0, fat: 0 }
      : mapApiFoodItemToFoodItem(food.foodItem);
    
    // Update totals if we have the food details
    if (typeof food.foodItem !== 'string') {
      totalCalories += food.foodItem.calories * food.servings;
      totalProtein += food.foodItem.macros.protein * food.servings;
      totalCarbs += food.foodItem.macros.carbs * food.servings;
      totalFat += food.foodItem.macros.fat * food.servings;
    }
    
    return {
      id: typeof food.foodItem === 'string' ? food.foodItem : food.foodItem._id,
      foodItem: foodDetails,
      servings: food.servings,
      notes: food.notes
    };
  });
  
  return {
    id: apiLog._id,
    date: apiLog.date,
    meal: apiLog.meal,
    foods: mappedFoods,
    notes: apiLog.notes,
    totalCalories,
    totalProtein,
    totalCarbs,
    totalFat,
    createdAt: apiLog.createdAt,
    updatedAt: apiLog.updatedAt
  };
};

const mapApiMealPlanToMealPlan = (apiMealPlan: APIMealPlan): MealPlan => {
  return {
    id: apiMealPlan._id,
    name: apiMealPlan.name,
    description: apiMealPlan.description,
    targetCalories: apiMealPlan.targetCalories,
    targetMacros: apiMealPlan.targetMacros,
    meals: apiMealPlan.meals.map(meal => {
      // Calculate totals per meal
      let totalCalories = meal.totalCalories;
      let totalProtein = meal.macros.protein;
      let totalCarbs = meal.macros.carbs;
      let totalFat = meal.macros.fat;
      
      return {
        id: meal._id,
        name: meal.name,
        foods: meal.foods.map(food => ({
          foodItem: typeof food.foodItem === 'string' 
            ? food.foodItem 
            : mapApiFoodItemToFoodItem(food.foodItem),
          servings: food.servings
        })),
        totalCalories,
        totalProtein,
        totalCarbs,
        totalFat
      };
    }),
    createdAt: apiMealPlan.createdAt,
    updatedAt: apiMealPlan.updatedAt
  };
};

// Thunks
export const getFoodItemsList = createAsyncThunk(
  'nutrition/getFoodItems',
  async (search: string | undefined, { rejectWithValue }) => {
    try {
      const foodItems = await getFoodItems(search);
      return foodItems;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch food items');
    }
  }
);

export const createFoodItem = createAsyncThunk(
  'nutrition/createFoodItem',
  async (foodItem: Omit<APIFoodItem, '_id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const newFoodItem = await createFoodItemAPI(foodItem);
      return newFoodItem;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create food item');
    }
  }
);

export const fetchNutritionLogs = createAsyncThunk(
  'nutrition/fetchNutritionLogs',
  async ({ startDate, endDate }: { startDate?: string, endDate?: string }, { rejectWithValue }) => {
    try {
      const logs = await getNutritionLogs(startDate, endDate);
      return logs;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch nutrition logs');
    }
  }
);

export const fetchNutritionLogByDate = createAsyncThunk(
  'nutrition/fetchNutritionLogByDate',
  async (date: string, { rejectWithValue }) => {
    try {
      const logs = await getNutritionLogByDate(date);
      return logs;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch nutrition logs for date');
    }
  }
);

export const recordNutrition = createAsyncThunk(
  'nutrition/recordNutrition',
  async (log: Omit<APINutritionLog, '_id' | 'user' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const newLog = await recordNutritionAPI(log);
      return newLog;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to record nutrition');
    }
  }
);

export const updateNutritionLog = createAsyncThunk(
  'nutrition/updateNutritionLog',
  async ({ id, log }: { id: string; log: Partial<APINutritionLog> }, { rejectWithValue }) => {
    try {
      const updatedLog = await updateNutritionLogAPI(id, log);
      return updatedLog;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update nutrition log');
    }
  }
);

export const deleteNutritionLog = createAsyncThunk(
  'nutrition/deleteNutritionLog',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteNutritionLogAPI(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete nutrition log');
    }
  }
);

export const fetchMealPlans = createAsyncThunk(
  'nutrition/fetchMealPlans',
  async (_, { rejectWithValue }) => {
    try {
      const mealPlans = await getMealPlans();
      return mealPlans;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch meal plans');
    }
  }
);

export const fetchMealPlanById = createAsyncThunk(
  'nutrition/fetchMealPlanById',
  async (id: string, { rejectWithValue }) => {
    try {
      const mealPlan = await getMealPlanById(id);
      return mealPlan;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch meal plan');
    }
  }
);

export const generateNutritionPlan = createAsyncThunk(
  'nutrition/generateNutritionPlan',
  async (params: GenerateNutritionPlanRequest, { rejectWithValue }) => {
    try {
      const mealPlan = await generateNutritionPlanAPI(params);
      return mealPlan;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to generate nutrition plan');
    }
  }
);

// Slice
const nutritionSlice = createSlice({
  name: 'nutrition',
  initialState,
  reducers: {
    updateDailyGoals: (
      state,
      action: PayloadAction<{
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
      }>
    ) => {
      state.dailyGoals = action.payload;
    },
    clearNutritionError: (state) => {
      state.error = null;
    },
    setCurrentMealPlan: (state, action: PayloadAction<MealPlan | null>) => {
      state.currentMealPlan = action.payload;
    }
  },
  extraReducers: (builder) => {
    // getFoodItems
    builder.addCase(getFoodItemsList.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getFoodItemsList.fulfilled, (state, action) => {
      state.foodItems = action.payload.map(mapApiFoodItemToFoodItem);
      state.isLoading = false;
    });
    builder.addCase(getFoodItemsList.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string || 'Failed to fetch food items';
    });

    // createFoodItem
    builder.addCase(createFoodItem.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createFoodItem.fulfilled, (state, action) => {
      state.foodItems.push(mapApiFoodItemToFoodItem(action.payload));
      state.isLoading = false;
    });
    builder.addCase(createFoodItem.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string || 'Failed to create food item';
    });

    // fetchNutritionLogs
    builder.addCase(fetchNutritionLogs.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchNutritionLogs.fulfilled, (state, action) => {
      state.nutritionLogs = action.payload.map(mapApiNutritionLogToNutritionLogEntry);
      state.isLoading = false;
    });
    builder.addCase(fetchNutritionLogs.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string || 'Failed to fetch nutrition logs';
    });

    // fetchNutritionLogByDate
    builder.addCase(fetchNutritionLogByDate.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchNutritionLogByDate.fulfilled, (state, action) => {
      const logs = action.payload.map(mapApiNutritionLogToNutritionLogEntry);
      
      // Replace logs for this date, keep other dates
      const otherDates = state.nutritionLogs.filter(log => {
        return !logs.some(newLog => newLog.date === log.date);
      });
      
      state.nutritionLogs = [...otherDates, ...logs];
      state.isLoading = false;
    });
    builder.addCase(fetchNutritionLogByDate.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string || 'Failed to fetch nutrition logs for date';
    });

    // recordNutrition
    builder.addCase(recordNutrition.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(recordNutrition.fulfilled, (state, action) => {
      const newLog = mapApiNutritionLogToNutritionLogEntry(action.payload);
      
      // Check if this is an update to an existing meal time
      const existingLogIndex = state.nutritionLogs.findIndex(
        log => log.date === newLog.date && log.meal === newLog.meal
      );
      
      if (existingLogIndex !== -1) {
        state.nutritionLogs[existingLogIndex] = newLog;
      } else {
        state.nutritionLogs.push(newLog);
      }
      
      state.isLoading = false;
    });
    builder.addCase(recordNutrition.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string || 'Failed to record nutrition';
    });

    // updateNutritionLog
    builder.addCase(updateNutritionLog.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateNutritionLog.fulfilled, (state, action) => {
      const updatedLog = mapApiNutritionLogToNutritionLogEntry(action.payload);
      const index = state.nutritionLogs.findIndex(log => log.id === updatedLog.id);
      if (index !== -1) {
        state.nutritionLogs[index] = updatedLog;
      }
      state.isLoading = false;
    });
    builder.addCase(updateNutritionLog.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string || 'Failed to update nutrition log';
    });

    // deleteNutritionLog
    builder.addCase(deleteNutritionLog.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteNutritionLog.fulfilled, (state, action) => {
      state.nutritionLogs = state.nutritionLogs.filter(log => log.id !== action.payload);
      state.isLoading = false;
    });
    builder.addCase(deleteNutritionLog.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string || 'Failed to delete nutrition log';
    });

    // fetchMealPlans
    builder.addCase(fetchMealPlans.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchMealPlans.fulfilled, (state, action) => {
      state.mealPlans = action.payload.map(mapApiMealPlanToMealPlan);
      state.isLoading = false;
    });
    builder.addCase(fetchMealPlans.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string || 'Failed to fetch meal plans';
    });

    // fetchMealPlanById
    builder.addCase(fetchMealPlanById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchMealPlanById.fulfilled, (state, action) => {
      state.currentMealPlan = mapApiMealPlanToMealPlan(action.payload);
      state.isLoading = false;
    });
    builder.addCase(fetchMealPlanById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string || 'Failed to fetch meal plan';
    });

    // generateNutritionPlan
    builder.addCase(generateNutritionPlan.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(generateNutritionPlan.fulfilled, (state, action) => {
      const mealPlan = mapApiMealPlanToMealPlan(action.payload);
      state.mealPlans.push(mealPlan);
      state.currentMealPlan = mealPlan;
      state.isLoading = false;
    });
    builder.addCase(generateNutritionPlan.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string || 'Failed to generate nutrition plan';
    });
  },
});

export const {
  updateDailyGoals,
  clearNutritionError,
  setCurrentMealPlan
} = nutritionSlice.actions;

export default nutritionSlice.reducer;