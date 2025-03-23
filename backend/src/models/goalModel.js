const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    primaryGoal: {
      type: String,
      required: [true, 'Please select a primary goal'],
      enum: [
        'lose-weight',
        'gain-muscle',
        'improve-fitness',
        'increase-strength',
        'increase-endurance',
        'maintain-health',
        'prepare-event',
        'rehabilitate-injury'
      ]
    },
    secondaryGoals: [{
      type: String,
      enum: [
        'lose-weight',
        'gain-muscle',
        'improve-fitness',
        'increase-strength',
        'increase-endurance',
        'maintain-health',
        'prepare-event',
        'rehabilitate-injury',
        'improve-flexibility',
        'reduce-stress',
        'improve-sleep',
        'improve-nutrition'
      ]
    }],
    targetWeight: {
      value: Number,
      unit: {
        type: String,
        enum: ['kg', 'lb'],
        default: 'kg'
      }
    },
    weeklyWorkoutFrequency: {
      type: Number,
      min: [1, 'Must train at least once per week'],
      max: [7, 'Cannot train more than 7 days per week']
    },
    timeline: {
      startDate: {
        type: Date,
        default: Date.now
      },
      targetDate: Date
    },
    specificEvent: {
      name: String,
      date: Date,
      description: String
    },
    nutritionGoals: {
      dailyCalories: Number,
      macroSplit: {
        carbs: Number,  // Percentage
        protein: Number, // Percentage
        fat: Number      // Percentage
      },
      mealFrequency: Number
    },
    notes: String,
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal;