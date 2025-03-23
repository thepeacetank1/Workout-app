const Goal = require('../models/goalModel');
const { logger } = require('../utils/logger');

// @desc    Create a new goal
// @route   POST /api/goals
// @access  Private
const createGoal = async (req, res) => {
  try {
    const {
      primaryGoal,
      secondaryGoals,
      targetWeight,
      weeklyWorkoutFrequency,
      timeline,
      specificEvent,
      nutritionGoals,
      notes
    } = req.body;

    // Create new goal
    const goal = await Goal.create({
      user: req.user._id,
      primaryGoal,
      secondaryGoals,
      targetWeight,
      weeklyWorkoutFrequency,
      timeline,
      specificEvent,
      nutritionGoals,
      notes
    });

    res.status(201).json(goal);
  } catch (error) {
    logger.error(`Error in createGoal: ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user's active goal
// @route   GET /api/goals/active
// @access  Private
const getActiveGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({ 
      user: req.user._id,
      active: true 
    }).sort('-createdAt');

    if (goal) {
      res.json(goal);
    } else {
      res.status(404).json({ message: 'No active goal found' });
    }
  } catch (error) {
    logger.error(`Error in getActiveGoal: ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all user's goals
// @route   GET /api/goals
// @access  Private
const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id }).sort('-createdAt');
    res.json(goals);
  } catch (error) {
    logger.error(`Error in getGoals: ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get goal by ID
// @route   GET /api/goals/:id
// @access  Private
const getGoalById = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (goal && goal.user.toString() === req.user._id.toString()) {
      res.json(goal);
    } else if (!goal) {
      res.status(404).json({ message: 'Goal not found' });
    } else {
      res.status(403).json({ message: 'Not authorized to access this goal' });
    }
  } catch (error) {
    logger.error(`Error in getGoalById: ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a goal
// @route   PUT /api/goals/:id
// @access  Private
const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    // Check if goal belongs to user
    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this goal' });
    }

    // Update goal fields
    Object.assign(goal, req.body);
    
    const updatedGoal = await goal.save();
    res.json(updatedGoal);
  } catch (error) {
    logger.error(`Error in updateGoal: ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Deactivate a goal
// @route   PUT /api/goals/:id/deactivate
// @access  Private
const deactivateGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    // Check if goal belongs to user
    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this goal' });
    }

    goal.active = false;
    await goal.save();

    res.json({ message: 'Goal deactivated' });
  } catch (error) {
    logger.error(`Error in deactivateGoal: ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createGoal,
  getActiveGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deactivateGoal
};