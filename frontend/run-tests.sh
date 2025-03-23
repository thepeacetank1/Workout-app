#!/bin/bash

# Script to run specific tests

# Check if a test file is provided
if [ $# -eq 0 ]; then
  echo "Usage: $0 <testFileName>"
  echo "Example: $0 WorkoutPage"
  exit 1
fi

# Get the test file name from the argument
TEST_FILE=$1

# Run the test with Jest directly
echo "Running test for $TEST_FILE..."
npx jest "src/tests/.*$TEST_FILE.*" --verbose