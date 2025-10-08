#!/bin/bash

# ZLECAf Application Runner
# This script starts both the backend and frontend servers

set -e

echo "🚀 Starting ZLECAf Application..."
echo "=================================="

# Check if MongoDB is running
echo "📊 Checking MongoDB connection..."
if ! mongosh --eval "db.version()" >/dev/null 2>&1; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first:"
    echo "   sudo systemctl start mongod"
    echo "   OR"
    echo "   docker run -d -p 27017:27017 --name mongodb mongo:latest"
    exit 1
fi

echo "✅ MongoDB is running"

# Start Backend
echo ""
echo "🔧 Starting Backend (FastAPI)..."
cd backend
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate
pip install -q -r requirements.txt

echo "✅ Backend dependencies installed"
echo "🌐 Starting backend server on http://localhost:8000"
uvicorn server:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 3

# Start Frontend
echo ""
echo "🎨 Starting Frontend (React)..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

echo "✅ Frontend dependencies installed"
echo "🌐 Starting frontend server on http://localhost:3000"
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "=================================="
echo "✅ Application is running!"
echo "=================================="
echo "Backend:  http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all servers"

# Trap to kill both processes on exit
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT

# Wait for both processes
wait
