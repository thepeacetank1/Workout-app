const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { logger } = require('./utils/logger');
const userRoutes = require('./routes/userRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const nutritionRoutes = require('./routes/nutritionRoutes');
const goalRoutes = require('./routes/goalRoutes');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/goals', goalRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Start server regardless of MongoDB connection
const PORT = process.env.PORT || 5000;

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  // Check if port is in use
  const net = require('net');
  const server = net.createServer();
  
  server.once('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      logger.warn(`Port ${PORT} is already in use. The server will be available at the existing instance.`);
    } else {
      logger.error(`Error checking port: ${err.message}`);
    }
    server.close();
  });
  
  server.once('listening', () => {
    server.close();
    // Port is free, start the app
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  });
  
  server.listen(PORT);
}

// Add a health check endpoint that doesn't require MongoDB
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', mongodb: mongoose.connection.readyState === 1 });
});

// Add a route to handle mock data responses when DB is not available
app.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1 && 
      (req.path.startsWith('/api/workouts') || 
       req.path.startsWith('/api/nutrition') || 
       req.path.startsWith('/api/goals'))) {
    return res.status(200).json({
      message: 'Using mock data - MongoDB is not connected',
      data: []
    });
  }
  next();
});

// Connect to database in the background
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/workout-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000 // 5 second timeout
  })
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch((error) => {
    logger.error('MongoDB connection error:', error);
    logger.info('Running in limited mode without database. Some features will not work correctly.');
  });

module.exports = app;