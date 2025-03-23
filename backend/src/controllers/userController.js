const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { logger } = require('../utils/logger');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_not_for_production', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    logger.error(`Error in registerUser: ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).select('+password');

    // Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    logger.error(`Error in loginUser: ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    // User is attached to req by auth middleware
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        height: user.height,
        weight: user.weight,
        preferredUnits: user.preferredUnits,
        dietaryRestrictions: user.dietaryRestrictions,
        workoutPreferences: user.workoutPreferences,
        isAdmin: user.isAdmin
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    logger.error(`Error in getUserProfile: ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      
      // Only set password if provided in request
      if (req.body.password) {
        user.password = req.body.password;
      }

      // Update other fields if provided
      if (req.body.age) user.age = req.body.age;
      if (req.body.gender) user.gender = req.body.gender;
      if (req.body.height) user.height = req.body.height;
      if (req.body.weight) user.weight = req.body.weight;
      if (req.body.preferredUnits) user.preferredUnits = req.body.preferredUnits;
      if (req.body.dietaryRestrictions) user.dietaryRestrictions = req.body.dietaryRestrictions;
      if (req.body.workoutPreferences) user.workoutPreferences = req.body.workoutPreferences;
      if (req.body.profilePicture) user.profilePicture = req.body.profilePicture;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        age: updatedUser.age,
        gender: updatedUser.gender,
        height: updatedUser.height,
        weight: updatedUser.weight,
        preferredUnits: updatedUser.preferredUnits,
        dietaryRestrictions: updatedUser.dietaryRestrictions,
        workoutPreferences: updatedUser.workoutPreferences,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser._id)
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    logger.error(`Error in updateUserProfile: ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
};