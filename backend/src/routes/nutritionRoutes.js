const express = require('express');
const router = express.Router();
const {
  createFoodItem,
  getFoodItems,
  generateNutritionPlan,
  getMealPlans,
  getMealPlanById,
  recordNutrition,
  getNutritionLogs
} = require('../controllers/nutritionController');
const { protect } = require('../middleware/authMiddleware');

// Apply protect middleware to all routes
router.use(protect);

// Food item routes
router.route('/foods')
  .post(createFoodItem)
  .get(getFoodItems);

// Generate meal plan
router.post('/generate', generateNutritionPlan);

// Meal plan routes
router.route('/meal-plans')
  .get(getMealPlans);

router.route('/meal-plans/:id')
  .get(getMealPlanById);

// Nutrition logging
router.route('/log')
  .post(recordNutrition)
  .get(getNutritionLogs);

module.exports = router;