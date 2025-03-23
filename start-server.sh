#!/bin/bash

echo "Starting Workout App Server..."

# Change to the project directory
cd "$(dirname "$0")"

# Check MongoDB installation (optional)
check_install_mongodb() {
  echo "Checking MongoDB installation..."
  if ! command -v mongod &> /dev/null; then
    echo "MongoDB not found. The app will run in limited mode without database features."
    echo "To install MongoDB manually, visit: https://www.mongodb.com/docs/manual/installation/"
    return 1
  fi
  
  # Check if MongoDB is running, if not start it
  if ! pgrep -x "mongod" > /dev/null; then
    echo "MongoDB is installed but not running. The app will run in limited mode without database features."
    echo "To start MongoDB manually, run: sudo systemctl start mongod"
    return 1
  fi
  
  echo "MongoDB is ready."
  return 0
}

# Check MongoDB (optional, continue regardless)
check_install_mongodb || echo "MongoDB not available. The app will run in limited mode without database features."

# Start backend server
echo "Starting backend server..."
cd backend
npm install
npm run dev &
BACKEND_PID=$!

# Wait for backend to initialize
sleep 5

# Start frontend server
echo "Starting frontend server..."
cd ../frontend
npm install --legacy-peer-deps
npm start &
FRONTEND_PID=$!

# Function to handle script termination
function cleanup {
  echo "Shutting down servers..."
  kill $FRONTEND_PID
  kill $BACKEND_PID
  exit
}

# Register the cleanup function for script termination
trap cleanup SIGINT SIGTERM

echo "Servers are running. Press Ctrl+C to stop."

# Wait for termination
wait