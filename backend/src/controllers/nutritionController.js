const { FoodItem, NutritionDay, MealPlan } = require('../models/nutritionModel');
const Goal = require('../models/goalModel');
const { logger } = require('../utils/logger');
const { generateMealPlan } = require('../services/nutritionService');

// @desc    Create a new food item
// @route   POST /api/nutrition/foods
// @access  Private
const createFoodItem = async (req, res) => {
  try {
    const foodItem = await FoodItem.create({
      ...req.body,
      isCustom: true,
      userId: req.user._id
    });
    
    res.status(201).json(foodItem);
  } catch (error) {
    logger.error(`Error in createFoodItem: ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get food items
// @route   GET /api/nutrition/foods
// @access  Private
const getFoodItems = async (req, res) => {
  try {
    // Build filter
    const filter = {
      $or: [
        { isCustom: false }, // System foods
        { userId: req.user._id } // User's custom foods
      ]
    };
    
    // Add search term if provided
    if (req.query.search) {
      filter.name = { $regex: req.query.search, $options: 'i' };
    }
    
    // Add category filter if provided
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    const foodItems = await FoodItem.find(filter).limit(50);
    res.json(foodItems);
  } catch (error) {
    logger.error(`Error in getFoodItems: ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Generate a meal plan based on user's goal
// @route   POST /api/nutrition/generate
// @access  Private
const generateNutritionPlan = async (req, res) => {
  try {
    const { goalId } = req.body;
    
    // Get the user's goal
    const goal = await Goal.findById(goalId);
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this goal' });
    }
    
    // Generate meal plan based on goal and preferences
    const mealPlan = await generateMealPlan(goal, req.user);
    
    // Create meal plan in database
    const savedMealPlan = await MealPlan.create({
      ...mealPlan,
      createdBy: req.user._id
    });
    
    res.status(201).json(savedMealPlan);
  } catch (error) {
    logger.error(`Error in generateNutritionPlan: ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user's meal plans
// @route   GET /api/nutrition/meal-plans
// @access  Private
const getMealPlans = async (req, res) => {
  try {
    const mealPlans = await MealPlan.find({
      createdBy: req.user._id
    }).sort('-createdAt');
    
    res.json(mealPlans);
  } catch (error) {
    logger.error(`Error in getMealPlans: ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get meal plan by ID
// @route   GET /api/nutrition/meal-plans/:id
// @access  Private
const getMealPlanById = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findById(req.params.id)
      .populate('meals.foodItems.foodItem');
    
    if (mealPlan && mealPlan.createdBy.toString() === req.user._id.toString()) {
      res.json(mealPlan);
    } else if (!mealPlan) {
      res.status(404).json({ message: 'Meal plan not found' });
    } else {
      res.status(403).json({ message: 'Not authorized to access this meal plan' });
    }
  } catch (error) {
    logger.error(`Error in getMealPlanById: ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Record nutrition for a day
// @route   POST /api/nutrition/log
// @access  Private
const recordNutrition = async (req, res) => {
  try {
    const { date, meals, waterIntake, dailyNotes } = req.body;
    
    // Check if a log for this day already exists
    let nutritionDay = await NutritionDay.findOne({
      user: req.user._id,
      date: new Date(date)
    });
    
    if (nutritionDay) {
      // Update existing log
      nutritionDay.meals = meals || nutritionDay.meals;
      nutritionDay.waterIntake = waterIntake || nutritionDay.waterIntake;
      nutritionDay.dailyNotes = dailyNotes || nutritionDay.dailyNotes;
      
      // Calculate totals
      const totals = calculateDailyTotals(nutritionDay.meals);
      nutritionDay.dailySummary = {
        ...totals,
        caloriesRemaining: nutritionDay.dailyCalorieGoal ? 
          nutritionDay.dailyCalorieGoal - totals.totalCalories : 0
      };
      
      await nutritionDay.save();
    } else {
      // Create new log
      const newDay = {
        user: req.user._id,
        date: new Date(date),
        meals: meals || [],
        waterIntake: waterIntake || { amount: 0, unit: 'ml' },
        dailyNotes: dailyNotes || ''
      };
      
      // Get calorie goals from active goal
      const activeGoal = await Goal.findOne({ 
        user: req.user._id,
        active: true 
      }).sort('-createdAt');
      
      if (activeGoal?.nutritionGoals) {
        newDay.dailyCalorieGoal = activeGoal.nutritionGoals.dailyCalories;
        newDay.dailyProteinGoal = 
          activeGoal.nutritionGoals.macroSplit?.protein * activeGoal.nutritionGoals.dailyCalories / 400; // protein has 4 calories per gram
        newDay.dailyCarbohydrateGoal = 
          activeGoal.nutritionGoals.macroSplit?.carbs * activeGoal.nutritionGoals.dailyCalories / 400; // carbs have 4 calories per gram
        newDay.dailyFatGoal = 
          activeGoal.nutritionGoals.macroSplit?.fat * activeGoal.nutritionGoals.dailyCalories / 900; // fat has 9 calories per gram
      }
      
      // Calculate totals
      const totals = calculateDailyTotals(newDay.meals);
      newDay.dailySummary = {
        ...totals,
        caloriesRemaining: newDay.dailyCalorieGoal ? 
          newDay.dailyCalorieGoal - totals.totalCalories : 0
      };
      
      nutritionDay = await NutritionDay.create(newDay);
    }
    
    res.status(201).json(nutritionDay);
  } catch (error) {
    logger.error(`Error in recordNutrition: ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get nutrition logs for date range
// @route   GET /api/nutrition/log
// @access  Private
const getNutritionLogs = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Both startDate and endDate are required' });
    }
    
    const logs = await NutritionDay.find({
      user: req.user._id,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).sort('date');
    
    res.json(logs);
  } catch (error) {
    logger.error(`Error in getNutritionLogs: ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Helper function to calculate daily nutrition totals
const calculateDailyTotals = (meals) => {
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  
  meals.forEach(meal => {
    meal.entries.forEach(entry => {
      totalCalories += entry.calories || 0;
      totalProtein += entry.protein || 0;
      totalCarbs += entry.carbs || 0;
      totalFat += entry.fat || 0;
    });
  });
  
  return {
    totalCalories,
    totalProtein,
    totalCarbs,
    totalFat
  };
};

module.exports = {
  createFoodItem,
  getFoodItems,
  generateNutritionPlan,
  getMealPlans,
  getMealPlanById,
  recordNutrition,
  getNutritionLogs
};