#!/bin/bash

# Script to run component tests with less verbose output

# Check if a test file is provided
if [ $# -eq 0 ]; then
  echo "Running all component tests..."
  TEST_PATTERN="src/tests/components/"
else
  # Get the test file pattern from the argument
  TEST_PATTERN="src/tests/components/*$1*"
  echo "Running tests matching: $TEST_PATTERN"
fi

# Run test with less verbose output
npx jest "$TEST_PATTERN" --watchAll=false --silent