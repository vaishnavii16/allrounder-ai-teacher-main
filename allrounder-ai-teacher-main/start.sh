#!/bin/bash

echo "🚀 Starting All-Rounder AI Teacher MERN Stack Application"
echo ""

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if Node.js is installed
if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command_exists npm; then
    echo "❌ npm is not installed. Please install npm"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Check if backend dependencies are installed
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

# Check if frontend dependencies are installed
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

# Check if environment files exist
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Backend .env file not found. Copying from .env.example..."
    cp backend/.env.example backend/.env
    echo "📝 Please edit backend/.env and add your GEMINI_API_KEY"
fi

if [ ! -f "frontend/.env" ]; then
    echo "⚠️  Frontend .env file not found. Copying from .env.example..."
    cp frontend/.env.example frontend/.env
fi

echo ""
echo "🎯 Starting both backend and frontend servers..."
echo "🔧 Backend will run on: http://localhost:5000"
echo "🌐 Frontend will run on: http://localhost:3000"
echo ""
echo "📚 Ready to teach any subject - Math, Science, Programming, and more!"
echo "Press Ctrl+C to stop both servers"
echo ""

# Install root dependencies if needed
if [ ! -d "node_modules" ]; then
    npm install
fi

# Start both servers
npm run dev
