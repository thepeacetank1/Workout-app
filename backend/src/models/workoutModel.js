const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: [
      'compound', 
      'isolation', 
      'cardio', 
      'flexibility', 
      'plyometric', 
      'calisthenics',
      'olympic'
    ],
    required: true
  },
  muscleGroups: [{
    type: String,
    enum: [
      'chest', 
      'back', 
      'shoulders', 
      'biceps', 
      'triceps', 
      'quadriceps', 
      'hamstrings',
      'glutes',
      'calves',
      'abs',
      'forearms',
      'traps',
      'lats',
      'full-body',
      'lower-body',
      'upper-body'
    ],
    required: true
  }],
  equipment: {
    type: String,
    enum: [
      'none',
      'dumbbells',
      'barbell',
      'kettlebells',
      'resistance-bands',
      'pull-up-bar',
      'bench',
      'squat-rack',
      'cable-machine',
      'treadmill',
      'stationary-bike',
      'rowing-machine',
      'elliptical',
      'machine'
    ],
    default: 'none'
  },
  instructions: {
    type: String,
    required: true
  },
  videoUrl: String,
  imageUrl: String,
  difficultyLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  }
});

const setSchema = new mongoose.Schema({
  setNumber: {
    type: Number,
    required: true
  },
  exerciseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true
  },
  weight: {
    value: Number,
    unit: {
      type: String,
      enum: ['kg', 'lb'],
      default: 'kg'
    }
  },
  reps: Number,
  duration: { // For timed exercises
    value: Number,
    unit: {
      type: String,
      enum: ['seconds', 'minutes'],
      default: 'seconds'
    }
  },
  distance: {
    value: Number,
    unit: {
      type: String,
      enum: ['km', 'mi', 'm'],
      default: 'm'
    }
  },
  restAfter: {
    value: Number,
    unit: {
      type: String,
      enum: ['seconds', 'minutes'],
      default: 'seconds'
    }
  },
  completed: {
    type: Boolean,
    default: false
  },
  notes: String
});

const workoutSessionSchema = new mongoose.Schema({
  sets: [setSchema],
  startTime: Date,
  endTime: Date,
  totalDuration: Number, // in minutes
  caloriesBurned: Number,
  notes: String,
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  energyLevel: {
    type: Number,
    min: 1,
    max: 10
  },
  completed: {
    type: Boolean,
    default: false
  }
});

const workoutPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  type: {
    type: String,
    enum: [
      'strength', 
      'hypertrophy', 
      'endurance', 
      'cardio', 
      'hiit', 
      'circuit',
      'full-body',
      'split',
      'custom'
    ],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  exercises: [{
    exerciseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exercise'
    },
    sets: Number,
    reps: Number,
    restBetweenSets: Number // in seconds
  }],
  estimatedDuration: Number, // in minutes
  notes: String
});

const workoutScheduleSchema = new mongoose.Schema({
  dayOfWeek: {
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    required: true
  },
  workoutPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkoutPlan'
  },
  startTime: String, // Format: 'HH:MM'
  notes: String
});

const workoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: String,
    workoutPlans: [workoutPlanSchema],
    schedule: [workoutScheduleSchema],
    sessions: [workoutSessionSchema],
    active: {
      type: Boolean,
      default: true
    },
    generatedFromGoal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Goal'
    }
  },
  {
    timestamps: true
  }
);

// Create models
const Exercise = mongoose.model('Exercise', exerciseSchema);
const WorkoutPlan = mongoose.model('WorkoutPlan', workoutPlanSchema);
const Workout = mongoose.model('Workout', workoutSchema);

module.exports = { Exercise, WorkoutPlan, Workout };