const express = require('express');
const router = express.Router();
const {
  createGoal,
  getActiveGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deactivateGoal
} = require('../controllers/goalController');
const { protect } = require('../middleware/authMiddleware');

// Apply protect middleware to all routes
router.use(protect);

// Create goal and get all goals
router.route('/')
  .post(createGoal)
  .get(getGoals);

// Get active goal
router.get('/active', getActiveGoal);

// Get, update, and deactivate specific goal
router.route('/:id')
  .get(getGoalById)
  .put(updateGoal);

router.put('/:id/deactivate', deactivateGoal);

module.exports = router;