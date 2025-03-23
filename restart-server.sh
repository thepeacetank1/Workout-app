#!/bin/bash

echo "Restarting Workout App Server..."

# Change to the project directory
cd "$(dirname "$0")"

# Find processes listening on specific ports
echo "Stopping existing server processes..."
BACKEND_PID=$(lsof -t -i:5000 2>/dev/null)
FRONTEND_PID=$(lsof -t -i:3000 2>/dev/null)

# Kill processes safely
if [ ! -z "$BACKEND_PID" ]; then
  echo "Stopping backend server (PID: $BACKEND_PID)..."
  kill $BACKEND_PID 2>/dev/null || echo "Backend server not running"
fi

if [ ! -z "$FRONTEND_PID" ]; then
  echo "Stopping frontend server (PID: $FRONTEND_PID)..."
  kill $FRONTEND_PID 2>/dev/null || echo "Frontend server not running"
fi

# As a fallback, try to kill by process pattern (more targeted)
pkill -f "node.*workout-app/backend" || true
pkill -f "node.*workout-app/frontend" || true

# Wait for processes to terminate
sleep 2

# Start the server again
./start-server.sh