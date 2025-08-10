@echo off
echo 🚀 Starting All-Rounder AI Teacher MERN Stack Application
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

:: Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version
echo ✅ npm version:
npm --version
echo.

:: Check if backend dependencies are installed
if not exist "backend\node_modules" (
    echo 📦 Installing backend dependencies...
    cd backend
    npm install
    cd ..
)

:: Check if frontend dependencies are installed
if not exist "frontend\node_modules" (
    echo 📦 Installing frontend dependencies...
    cd frontend
    npm install
    cd ..
)

:: Check if environment files exist
if not exist "backend\.env" (
    echo ⚠️  Backend .env file not found. Copying from .env.example...
    copy "backend\.env.example" "backend\.env"
    echo 📝 Please edit backend\.env and add your GEMINI_API_KEY
)

if not exist "frontend\.env" (
    echo ⚠️  Frontend .env file not found. Copying from .env.example...
    copy "frontend\.env.example" "frontend\.env"
)

echo.
echo 🎯 Starting both backend and frontend servers...
echo 🔧 Backend will run on: http://localhost:5000
echo 🌐 Frontend will run on: http://localhost:3000
echo.
echo 📚 Ready to teach any subject - Math, Science, Programming, and more!
echo Press Ctrl+C to stop both servers
echo.

:: Install root dependencies if needed
if not exist "node_modules" (
    npm install
)

:: Start both servers
npm run dev
