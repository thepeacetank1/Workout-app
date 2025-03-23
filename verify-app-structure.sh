#!/bin/bash

echo "========================================="
echo "Workout App Structure Verification"
echo "========================================="

# Function to check if a file exists
check_file() {
  if [ -f "$1" ]; then
    echo "✅ $1 exists"
    return 0
  else
    echo "❌ $1 is missing"
    return 1
  fi
}

# Function to check if a directory exists
check_dir() {
  if [ -d "$1" ]; then
    echo "✅ $1 exists"
    return 0
  else
    echo "❌ $1 is missing"
    return 1
  fi
}

# Set base directories
FRONTEND_DIR="/home/cmlsrandolph/Documents/coding-projects/workout-app/frontend"
BACKEND_DIR="/home/cmlsrandolph/Documents/coding-projects/workout-app/backend"

# Check essential frontend files
echo -e "\nChecking essential frontend files..."
FRONTEND_FILES=(
  "src/index.tsx"
  "src/App.jsx"
  "src/index.css"
  "public/index.html"
  "public/manifest.json"
  "package.json"
)

for file in "${FRONTEND_FILES[@]}"; do
  check_file "$FRONTEND_DIR/$file"
done

# Check frontend component directories
echo -e "\nChecking frontend component directories..."
FRONTEND_DIRS=(
  "src/components"
  "src/components/layout"
  "src/components/pages"
  "src/store"
  "src/store/slices"
)

for dir in "${FRONTEND_DIRS[@]}"; do
  check_dir "$FRONTEND_DIR/$dir"
done

# Check frontend component files 
echo -e "\nChecking frontend component files..."
FRONTEND_COMPONENTS=(
  "src/components/layout/Header.tsx"
  "src/components/layout/MainLayout.tsx"
  "src/components/layout/Sidebar.tsx"
  "src/components/pages/HomePage.tsx"
  "src/components/pages/LoginPage.tsx"
  "src/store/index.ts"
  "src/store/slices/authSlice.ts"
  "src/store/slices/uiSlice.ts"
)

for file in "${FRONTEND_COMPONENTS[@]}"; do
  check_file "$FRONTEND_DIR/$file"
done

# Check essential backend files
echo -e "\nChecking essential backend files..."
BACKEND_FILES=(
  "src/index.js"
  "package.json"
  ".env"
)

for file in "${BACKEND_FILES[@]}"; do
  check_file "$BACKEND_DIR/$file"
done

# Check backend directories
echo -e "\nChecking backend directories..."
BACKEND_DIRS=(
  "src/controllers"
  "src/models"
  "src/routes"
  "src/middleware"
  "src/utils"
)

for dir in "${BACKEND_DIRS[@]}"; do
  check_dir "$BACKEND_DIR/$dir"
done

# Check for import errors in key frontend files
echo -e "\nChecking for import errors in key frontend files..."
cd "$FRONTEND_DIR" && npx eslint --no-ignore src/index.tsx src/App.jsx || echo "ESLint check failed"

echo -e "\n========================================="
echo "Structure verification completed"
echo "========================================="

# Return success if essential files and directories exist
if [ -f "$FRONTEND_DIR/src/index.tsx" ] && [ -f "$FRONTEND_DIR/src/App.jsx" ] && [ -f "$BACKEND_DIR/src/index.js" ]; then
  echo "✅ Essential structure verified"
  exit 0
else
  echo "❌ Some essential files are missing"
  exit 1
fi