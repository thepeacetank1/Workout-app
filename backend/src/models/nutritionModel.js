const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  calories: {
    type: Number,
    required: true
  },
  protein: Number, // in grams
  carbs: Number,   // in grams
  fat: Number,     // in grams
  fiber: Number,   // in grams
  sugar: Number,   // in grams
  sodium: Number,  // in mg
  servingSize: {
    value: Number,
    unit: {
      type: String,
      enum: ['g', 'ml', 'oz', 'cup', 'tbsp', 'tsp', 'piece'],
      default: 'g'
    }
  },
  category: {
    type: String,
    enum: [
      'fruits',
      'vegetables',
      'grains',
      'protein',
      'dairy',
      'fats',
      'beverages',
      'snacks',
      'desserts',
      'condiments',
      'supplements',
      'other'
    ]
  },
  isCustom: {
    type: Boolean,
    default: false
  },
  userId: { // Only populated if isCustom is true
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const mealEntrySchema = new mongoose.Schema({
  foodItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FoodItem',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  servingSize: {
    value: Number,
    unit: {
      type: String,
      enum: ['g', 'ml', 'oz', 'cup', 'tbsp', 'tsp', 'piece'],
      default: 'g'
    }
  },
  // Calculated values based on quantity and food item
  calories: Number,
  protein: Number,
  carbs: Number,
  fat: Number,
  notes: String
});

const mealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['breakfast', 'lunch', 'dinner', 'snack', 'pre-workout', 'post-workout', 'other']
  },
  time: Date,
  entries: [mealEntrySchema],
  totalCalories: Number,
  totalProtein: Number,
  totalCarbs: Number,
  totalFat: Number,
  notes: String,
  photo: String
});

const nutritionDaySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    meals: [mealSchema],
    waterIntake: {
      amount: Number,
      unit: {
        type: String,
        enum: ['ml', 'oz', 'l'],
        default: 'ml'
      }
    },
    dailyNotes: String,
    dailyCalorieGoal: Number,
    dailyProteinGoal: Number,
    dailyCarbohydrateGoal: Number,
    dailyFatGoal: Number,
    dailySummary: {
      totalCalories: Number,
      totalProtein: Number,
      totalCarbs: Number,
      totalFat: Number,
      caloriesRemaining: Number
    }
  },
  {
    timestamps: true
  }
);

const mealPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  calorieTarget: Number,
  proteinTarget: Number,
  carbTarget: Number,
  fatTarget: Number,
  meals: [{
    name: {
      type: String,
      required: true,
      enum: ['breakfast', 'lunch', 'dinner', 'snack', 'pre-workout', 'post-workout', 'other']
    },
    suggestedTime: String,
    foodItems: [{
      foodItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FoodItem'
      },
      quantity: Number,
      servingSize: {
        value: Number,
        unit: String
      }
    }],
    calories: Number,
    notes: String
  }],
  dietaryRestrictions: [{
    type: String,
    enum: [
      'vegetarian', 
      'vegan', 
      'pescatarian', 
      'gluten-free', 
      'dairy-free', 
      'nut-free',
      'low-carb',
      'keto',
      'paleo',
      'halal',
      'kosher'
    ]
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isTemplate: {
    type: Boolean,
    default: false
  }
});

const FoodItem = mongoose.model('FoodItem', foodItemSchema);
const NutritionDay = mongoose.model('NutritionDay', nutritionDaySchema);
const MealPlan = mongoose.model('MealPlan', mealPlanSchema);

module.exports = { FoodItem, NutritionDay, MealPlan };