const { Exercise, WorkoutPlan, Workout } = require('../models/workoutModel');
const Goal = require('../models/goalModel');
const { logger } = require('../utils/logger');
const { generateWorkoutPlan } = require('../services/workoutService');

// @desc    Create a new exercise
// @route   POST /api/workouts/exercises
// @access  Private/Admin
const createExercise = async (req, res) => {
  try {
    const exercise = await Exercise.create(req.body);
    res.status(201).json(exercise);
  } catch (error) {
    logger.error(`Error in createExercise: ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all exercises
// @route   GET /api/workouts/exercises
// @access  Private
const getExercises = async (req, res) => {
  try {
    // Filtering options
    const filter = {};
    if (req.query.type) filter.type = req.query.type;
    if (req.query.muscleGroup) filter.muscleGroups = req.query.muscleGroup;
    if (req.query.equipment) filter.equipment = req.query.equipment;
    if (req.query.difficulty) filter.difficultyLevel = req.query.difficulty;

    const exercises = await Exercise.find(filter);
    res.json(exercises);
  } catch (error) {
    logger.error(`Error in getExercises: ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Generate a workout plan based on user's goal
// @route   POST /api/workouts/generate
// @access  Private
const generateWorkout = async (req, res) => {
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
    
    // Get user's workout preferences
    const user = req.user;
    
    // Generate workout plan based on goal and preferences
    const workoutPlan = await generateWorkoutPlan(goal, user);
    
    // Create workout with generated plan
    const workout = await Workout.create({
      user: req.user._id,
      title: `Workout for ${goal.primaryGoal}`,
      description: `Auto-generated workout plan based on your ${goal.primaryGoal} goal`,
      workoutPlans: workoutPlan.plans,
      schedule: workoutPlan.schedule,
      generatedFromGoal: goal._id
    });
    
    res.status(201).json(workout);
  } catch (error) {
    logger.error(`Error in generateWorkout: ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a new workout
// @route   POST /api/workouts
// @access  Private
const createWorkout = async (req, res) => {
  try {
    const workout = await Workout.create({
      ...req.body,
      user: req.user._id
    });
    
    res.status(201).json(workout);
  } catch (error) {
    logger.error(`Error in createWorkout: ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all user's workouts
// @route   GET /api/workouts
// @access  Private
const getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ 
      user: req.user._id 
    }).sort('-createdAt');
    
    res.json(workouts);
  } catch (error) {
    logger.error(`Error in getWorkouts: ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get workout by ID
// @route   GET /api/workouts/:id
// @access  Private
const getWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id)
      .populate('workoutPlans.exercises.exerciseId');
    
    if (workout && workout.user.toString() === req.user._id.toString()) {
      res.json(workout);
    } else if (!workout) {
      res.status(404).json({ message: 'Workout not found' });
    } else {
      res.status(403).json({ message: 'Not authorized to access this workout' });
    }
  } catch (error) {
    logger.error(`Error in getWorkoutById: ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a workout
// @route   PUT /api/workouts/:id
// @access  Private
const updateWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    
    if (workout.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this workout' });
    }
    
    // Update workout fields except user
    const { user, ...updateData } = req.body;
    Object.assign(workout, updateData);
    
    const updatedWorkout = await workout.save();
    res.json(updatedWorkout);
  } catch (error) {
    logger.error(`Error in updateWorkout: ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Record a workout session
// @route   POST /api/workouts/:id/sessions
// @access  Private
const recordWorkoutSession = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    
    if (workout.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this workout' });
    }
    
    workout.sessions.push(req.body);
    await workout.save();
    
    res.status(201).json(workout.sessions[workout.sessions.length - 1]);
  } catch (error) {
    logger.error(`Error in recordWorkoutSession: ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get workout sessions for date range
// @route   GET /api/workouts/sessions
// @access  Private
const getWorkoutSessions = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Both startDate and endDate are required' });
    }
    
    const workouts = await Workout.find({
      user: req.user._id,
      'sessions.startTime': {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    });
    
    // Extract all sessions within the date range
    const sessions = [];
    workouts.forEach(workout => {
      workout.sessions.forEach(session => {
        if (session.startTime >= new Date(startDate) && session.startTime <= new Date(endDate)) {
          sessions.push({
            workoutId: workout._id,
            workoutTitle: workout.title,
            session
          });
        }
      });
    });
    
    res.json(sessions);
  } catch (error) {
    logger.error(`Error in getWorkoutSessions: ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createExercise,
  getExercises,
  generateWorkout,
  createWorkout,
  getWorkouts,
  getWorkoutById,
  updateWorkout,
  recordWorkoutSession,
  getWorkoutSessions
};