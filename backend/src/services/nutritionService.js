const { FoodItem } = require('../models/nutritionModel');
const { logger } = require('../utils/logger');

/**
 * Generate a meal plan based on user's goal and preferences
 * @param {Object} goal - User's goal
 * @param {Object} user - User object with preferences
 * @returns {Object} Generated meal plan
 */
const generateMealPlan = async (goal, user) => {
  try {
    // This is a simplified version - in production this would be more sophisticated
    
    // Calculate calorie needs based on goal
    let dailyCalories;
    let proteinPercentage, carbsPercentage, fatPercentage;
    
    if (goal.nutritionGoals && goal.nutritionGoals.dailyCalories) {
      // Use user-set nutrition goals if available
      dailyCalories = goal.nutritionGoals.dailyCalories;
      proteinPercentage = goal.nutritionGoals.macroSplit?.protein || 30;
      carbsPercentage = goal.nutritionGoals.macroSplit?.carbs || 40;
      fatPercentage = goal.nutritionGoals.macroSplit?.fat || 30;
    } else {
      // Calculate based on goal type
      // This is a very simplified estimation
      const baseCalories = user.gender === 'female' ? 1800 : 2200;
      
      switch (goal.primaryGoal) {
        case 'lose-weight':
          dailyCalories = baseCalories - 500; // Deficit
          proteinPercentage = 40;
          carbsPercentage = 30;
          fatPercentage = 30;
          break;
        case 'gain-muscle':
          dailyCalories = baseCalories + 300; // Surplus
          proteinPercentage = 30;
          carbsPercentage = 40;
          fatPercentage = 30;
          break;
        default:
          dailyCalories = baseCalories;
          proteinPercentage = 30;
          carbsPercentage = 40;
          fatPercentage = 30;
      }
    }
    
    // Calculate macros in grams
    const proteinGrams = Math.round((dailyCalories * (proteinPercentage / 100)) / 4); // Protein has 4 calories per gram
    const carbsGrams = Math.round((dailyCalories * (carbsPercentage / 100)) / 4);     // Carbs have 4 calories per gram
    const fatGrams = Math.round((dailyCalories * (fatPercentage / 100)) / 9);         // Fat has 9 calories per gram
    
    // Get dietary restrictions
    const dietaryRestrictions = user.dietaryRestrictions || [];
    
    // Fetch food items that match dietary restrictions
    const filter = {};
    
    if (dietaryRestrictions.includes('vegetarian')) {
      filter.category = { $nin: ['meat'] };
    }
    
    if (dietaryRestrictions.includes('vegan')) {
      filter.category = { $nin: ['meat', 'dairy', 'eggs'] };
    }
    
    // Get a sample of food items from database
    const foodItems = await FoodItem.find(filter).limit(100);
    
    // Group food items by category
    const foodByCategory = {
      proteins: foodItems.filter(food => food.category === 'protein'),
      fruits: foodItems.filter(food => food.category === 'fruits'),
      vegetables: foodItems.filter(food => food.category === 'vegetables'),
      grains: foodItems.filter(food => food.category === 'grains'),
      dairy: foodItems.filter(food => food.category === 'dairy'),
      fats: foodItems.filter(food => food.category === 'fats'),
      snacks: foodItems.filter(food => food.category === 'snacks')
    };
    
    // Determine meal frequency
    const mealFrequency = goal.nutritionGoals?.mealFrequency || 3;
    
    // Create meal plan
    const mealPlan = {
      name: `Meal Plan for ${goal.primaryGoal}`,
      description: `Generated meal plan for ${dailyCalories} calories per day`,
      calorieTarget: dailyCalories,
      proteinTarget: proteinGrams,
      carbTarget: carbsGrams,
      fatTarget: fatGrams,
      dietaryRestrictions,
      meals: []
    };
    
    // Standard meal times
    const mealTimes = {
      breakfast: '08:00',
      lunch: '13:00',
      dinner: '19:00',
      snack1: '10:30',
      snack2: '16:00'
    };
    
    // Create each meal
    if (mealFrequency >= 3) {
      // Breakfast (25% of calories)
      const breakfast = createMeal(
        'breakfast',
        mealTimes.breakfast,
        dailyCalories * 0.25,
        proteinGrams * 0.25,
        carbsGrams * 0.3,
        fatGrams * 0.25,
        foodByCategory
      );
      mealPlan.meals.push(breakfast);
      
      // Lunch (35% of calories)
      const lunch = createMeal(
        'lunch',
        mealTimes.lunch,
        dailyCalories * 0.35,
        proteinGrams * 0.35,
        carbsGrams * 0.35,
        fatGrams * 0.35,
        foodByCategory
      );
      mealPlan.meals.push(lunch);
      
      // Dinner (40% of calories)
      const dinner = createMeal(
        'dinner',
        mealTimes.dinner,
        dailyCalories * 0.4,
        proteinGrams * 0.4,
        carbsGrams * 0.35,
        fatGrams * 0.4,
        foodByCategory
      );
      mealPlan.meals.push(dinner);
    }
    
    // Add snacks if meal frequency is higher
    if (mealFrequency >= 4) {
      const snack1 = createMeal(
        'snack',
        mealTimes.snack1,
        dailyCalories * 0.1,
        proteinGrams * 0.1,
        carbsGrams * 0.1,
        fatGrams * 0.1,
        foodByCategory
      );
      mealPlan.meals.push(snack1);
    }
    
    if (mealFrequency >= 5) {
      const snack2 = createMeal(
        'snack',
        mealTimes.snack2,
        dailyCalories * 0.1,
        proteinGrams * 0.1,
        carbsGrams * 0.1,
        fatGrams * 0.1,
        foodByCategory
      );
      mealPlan.meals.push(snack2);
    }
    
    return mealPlan;
  } catch (error) {
    logger.error(`Error generating meal plan: ${error.message}`);
    throw error;
  }
};

/**
 * Create a meal with foods that match target macros
 * @param {String} name - Meal name
 * @param {String} time - Suggested meal time
 * @param {Number} calorieTarget - Target calories for this meal
 * @param {Number} proteinTarget - Target protein in grams
 * @param {Number} carbTarget - Target carbs in grams
 * @param {Number} fatTarget - Target fat in grams
 * @param {Object} foodByCategory - Food items grouped by category
 * @returns {Object} Meal object
 */
const createMeal = (name, time, calorieTarget, proteinTarget, carbTarget, fatTarget, foodByCategory) => {
  // This is a simplified meal creation algorithm
  // In production, this would be more sophisticated
  
  const meal = {
    name,
    suggestedTime: time,
    foodItems: [],
    calories: 0,
    notes: `Target: ${Math.round(calorieTarget)} calories, ${Math.round(proteinTarget)}g protein, ${Math.round(carbTarget)}g carbs, ${Math.round(fatTarget)}g fat`
  };
  
  // Add a protein source
  if (foodByCategory.proteins.length > 0) {
    const protein = getRandomItem(foodByCategory.proteins);
    const servingCount = calculateServings(protein, proteinTarget / 2, 'protein');
    
    meal.foodItems.push({
      foodItem: protein._id,
      quantity: servingCount,
      servingSize: protein.servingSize
    });
    
    meal.calories += protein.calories * servingCount;
  }
  
  // Add vegetables
  if (foodByCategory.vegetables.length > 0) {
    const vegetable = getRandomItem(foodByCategory.vegetables);
    // Always add a good amount of vegetables
    const servingCount = 2;
    
    meal.foodItems.push({
      foodItem: vegetable._id,
      quantity: servingCount,
      servingSize: vegetable.servingSize
    });
    
    meal.calories += vegetable.calories * servingCount;
  }
  
  // Add a carb source
  if (foodByCategory.grains.length > 0) {
    const grain = getRandomItem(foodByCategory.grains);
    const servingCount = calculateServings(grain, carbTarget / 2, 'carbs');
    
    meal.foodItems.push({
      foodItem: grain._id,
      quantity: servingCount,
      servingSize: grain.servingSize
    });
    
    meal.calories += grain.calories * servingCount;
  }
  
  // Add fruit for snacks
  if (name === 'snack' && foodByCategory.fruits.length > 0) {
    const fruit = getRandomItem(foodByCategory.fruits);
    const servingCount = 1;
    
    meal.foodItems.push({
      foodItem: fruit._id,
      quantity: servingCount,
      servingSize: fruit.servingSize
    });
    
    meal.calories += fruit.calories * servingCount;
  }
  
  // Add healthy fat
  if (name !== 'snack' && foodByCategory.fats.length > 0) {
    const fat = getRandomItem(foodByCategory.fats);
    const servingCount = calculateServings(fat, fatTarget / 3, 'fat');
    
    meal.foodItems.push({
      foodItem: fat._id,
      quantity: servingCount,
      servingSize: fat.servingSize
    });
    
    meal.calories += fat.calories * servingCount;
  }
  
  return meal;
};

/**
 * Get a random item from an array
 * @param {Array} items - Array of items
 * @returns {*} Random item
 */
const getRandomItem = (items) => {
  return items[Math.floor(Math.random() * items.length)];
};

/**
 * Calculate how many servings to include based on nutritional targets
 * @param {Object} food - Food item
 * @param {Number} targetAmount - Target amount in grams
 * @param {String} nutrient - Nutrient to target (protein, carbs, fat)
 * @returns {Number} Number of servings
 */
const calculateServings = (food, targetAmount, nutrient) => {
  if (!food[nutrient] || food[nutrient] === 0) {
    return 1; // Default if no nutritional info
  }
  
  const servingsNeeded = targetAmount / food[nutrient];
  return Math.max(0.5, Math.min(3, Math.round(servingsNeeded * 2) / 2)); // Round to nearest 0.5, with min 0.5 and max 3
};

module.exports = {
  generateMealPlan
};