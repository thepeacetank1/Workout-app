#!/bin/bash

echo "========================================="
echo "Workout App Dependency Check"
echo "========================================="

# Check for node.js and npm
echo "Checking for Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "✅ Node.js is installed: $NODE_VERSION"
else
    echo "❌ Node.js is not installed. Please install Node.js."
    exit 1
fi

echo "Checking for npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo "✅ npm is installed: $NPM_VERSION"
else
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

# Check for MongoDB
echo "Checking for MongoDB..."
if command -v mongod &> /dev/null; then
    MONGO_VERSION=$(mongod --version | grep "db version" | sed 's/db version v//')
    echo "✅ MongoDB is installed: $MONGO_VERSION"
else
    echo "⚠️ MongoDB executable not found. Is MongoDB installed?"
    echo "   Note: MongoDB might be running as a service or Docker container."
fi

# Check if MongoDB is running (with timeout)
echo "Checking MongoDB connection..."
if command -v mongosh &> /dev/null; then
    # Use timeout to limit connection attempt to 3 seconds
    if timeout 3 mongosh --eval "db.version()" --quiet &> /dev/null; then
        echo "✅ MongoDB is running"
    else
        echo "❌ MongoDB is installed but not running."
        echo "   Start MongoDB with: sudo systemctl start mongod"
    fi
else
    echo "⚠️ mongosh not found. Can't verify if MongoDB is running."
    echo "   Installing MongoDB will be handled in the start-server.sh script."
fi

# Check backend dependencies
echo -e "\nChecking backend dependencies..."
cd backend
if [ -f "package.json" ]; then
    echo "✅ backend/package.json exists"
    
    # Check for essential dependencies
    echo "Checking essential backend dependencies:"
    for pkg in express mongoose jsonwebtoken bcryptjs cors dotenv morgan winston; do
        if grep -q "\"$pkg\":" package.json; then
            echo "✅ $pkg is listed in package.json"
        else
            echo "❌ $pkg is missing in package.json"
        fi
    done
    
    # Check if node_modules exists
    if [ -d "node_modules" ]; then
        echo "✅ backend/node_modules exists"
    else
        echo "❌ backend/node_modules is missing. Run 'npm install' in the backend directory."
    fi
else
    echo "❌ backend/package.json is missing"
fi

# Check frontend dependencies
echo -e "\nChecking frontend dependencies..."
cd ../frontend
if [ -f "package.json" ]; then
    echo "✅ frontend/package.json exists"
    
    # Check for essential dependencies
    echo "Checking essential frontend dependencies:"
    for pkg in react react-dom react-router-dom @chakra-ui/react @reduxjs/toolkit react-redux axios; do
        if grep -q "\"$pkg\":" package.json; then
            echo "✅ $pkg is listed in package.json"
        else
            echo "❌ $pkg is missing in package.json"
        fi
    done
    
    # Check if node_modules exists
    if [ -d "node_modules" ]; then
        echo "✅ frontend/node_modules exists"
    else
        echo "❌ frontend/node_modules is missing. Run 'npm install --legacy-peer-deps' in the frontend directory."
    fi
    
    # Check if public/index.html exists
    if [ -f "public/index.html" ]; then
        echo "✅ frontend/public/index.html exists"
    else
        echo "❌ frontend/public/index.html is missing"
    fi
else
    echo "❌ frontend/package.json is missing"
fi

# Check for required files
echo -e "\nChecking essential files..."
cd ..

# Backend files
for file in backend/src/index.js backend/.env; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file is missing"
    fi
done

# Frontend files
for file in frontend/src/App.tsx frontend/public/index.html; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file is missing"
    fi
done

# Check for index.js or index.tsx (support both JavaScript and TypeScript)
if [ -f "frontend/src/index.js" ]; then
    echo "✅ frontend/src/index.js exists"
elif [ -f "frontend/src/index.tsx" ]; then
    echo "✅ frontend/src/index.tsx exists"
else
    echo "❌ frontend entry file is missing (looked for index.js or index.tsx)"
fi

# Check for startup script
for file in start-server.sh restart-server.sh; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
        # Check execute permissions
        if [ -x "$file" ]; then
            echo "✅ $file has execute permissions"
        else
            echo "❌ $file is missing execute permissions. Run: chmod +x $file"
        fi
    else
        echo "❌ $file is missing"
    fi
done

echo -e "\n========================================="
echo "Dependency check completed"
echo "========================================="