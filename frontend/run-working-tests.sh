#!/bin/bash

# Script to run all working tests

cd "$(dirname "$0")"

echo "Running all working tests..."
npx jest "src/tests/(SimpleTest|file-imports|api|store/basicStore|store/authSlice|components/SimpleComponent)\.test\.(js|tsx?)"