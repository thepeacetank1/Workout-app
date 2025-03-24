# Workout App

A comprehensive fitness tracking application to monitor workouts, nutrition, and progress towards fitness goals.

## Features

- **User Authentication**: Secure signup and login
- **Workout Tracking**: Log exercises, sets, reps, and weights
- **Nutrition Tracking**: Track meals and nutritional intake
- **Goal Setting**: Set and monitor progress toward fitness goals
- **Progress Visualization**: View progress with charts and metrics
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- React with TypeScript
- Redux Toolkit for state management
- Chakra UI for responsive design
- React Router for navigation
- Axios for API requests
- Chart.js for data visualization

### Backend
- Node.js with Express
- MongoDB database with Mongoose ODM
- JWT authentication
- Winston for logging

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or remote)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/your-username/workout-app.git
   cd workout-app
   ```

2. Set up environment variables
   ```
   # In the backend directory, create a .env file with:
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/workout-app
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=7d
   ```

3. Install dependencies
   ```
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install --legacy-peer-deps
   ```

4. Start the application
   ```
   # In the root directory
   ./start-server.sh
   ```

5. Access the application
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

## Development

### Running Tests
```
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Linting
```
# Backend linting
cd backend
npm run lint

# Frontend linting
cd frontend
npm run lint
```

## Project Structure

The application follows a client-server architecture with separate frontend and backend codebases. See `project-structure.txt` for a detailed overview of the project organization.

## Deployment Checklist

Before deploying to production, ensure all items in the `Checklist.txt` file are addressed.

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.# Workout-app
