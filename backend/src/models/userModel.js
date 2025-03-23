const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please enter your email'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please enter a password'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false
    },
    profilePicture: {
      type: String,
      default: ''
    },
    age: {
      type: Number,
      min: [13, 'You must be at least 13 years old'],
      max: [120, 'Age must be a valid number']
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer not to say']
    },
    height: {
      value: Number,
      unit: {
        type: String,
        enum: ['cm', 'in'],
        default: 'cm'
      }
    },
    weight: {
      value: Number,
      unit: {
        type: String,
        enum: ['kg', 'lb'],
        default: 'kg'
      }
    },
    preferredUnits: {
      weight: {
        type: String,
        enum: ['kg', 'lb'],
        default: 'kg'
      },
      distance: {
        type: String,
        enum: ['km', 'mi'],
        default: 'km'
      }
    },
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
    workoutPreferences: {
      preferredDays: [{
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      }],
      preferredTime: String,
      workoutDuration: Number,
      workoutTypes: [{
        type: String,
        enum: [
          'strength', 
          'cardio', 
          'hiit', 
          'yoga', 
          'pilates', 
          'cycling', 
          'running',
          'swimming',
          'crossfit',
          'bodyweight',
          'powerlifting',
          'olympic-lifting'
        ]
      }],
      equipmentAvailable: [{
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
          'full-gym'
        ]
      }]
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    passwordResetToken: String,
    passwordResetExpires: Date
  },
  {
    timestamps: true
  }
);

// Pre-save middleware to hash passwords
userSchema.pre('save', async function(next) {
  // Only hash password if it's modified
  if (!this.isModified('password')) return next();
  
  try {
    // Generate salt
    const salt = await bcrypt.genSalt(10);
    // Hash password
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;