const express = require('express');
const router = express.Router();
const {
  createExercise,
  getExercises,
  generateWorkout,
  createWorkout,
  getWorkouts,
  getWorkoutById,
  updateWorkout,
  recordWorkoutSession,
  getWorkoutSessions
} = require('../controllers/workoutController');
const { protect, admin } = require('../middleware/authMiddleware');

// Apply protect middleware to all routes
router.use(protect);

// Exercise routes
router.route('/exercises')
  .post(admin, createExercise)
  .get(getExercises);

// Generate workout plan
router.post('/generate', generateWorkout);

// Workout session reporting
router.get('/sessions', getWorkoutSessions);

// Workout CRUD operations
router.route('/')
  .post(createWorkout)
  .get(getWorkouts);

router.route('/:id')
  .get(getWorkoutById)
  .put(updateWorkout);

// Record workout session
router.post('/:id/sessions', recordWorkoutSession);

module.exports = router;