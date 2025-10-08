#!/bin/bash

# ZLECAf Backend Runner
# This script starts the backend API server

set -e

echo "🚀 Starting ZLECAf Backend API..."
echo "=================================="

# Check if MongoDB is running
echo "📊 Checking MongoDB connection..."

# Try to start MongoDB container if not running
if ! docker ps | grep -q mongodb-zlecaf; then
    echo "⚠️  MongoDB container not found. Starting it now..."
    
    # Check if container exists but is stopped
    if docker ps -a | grep -q mongodb-zlecaf; then
        echo "📦 Starting existing MongoDB container..."
        docker start mongodb-zlecaf
    else
        echo "📦 Creating new MongoDB container..."
        docker run -d -p 27017:27017 --name mongodb-zlecaf mongo:7
    fi
    
    echo "⏳ Waiting for MongoDB to be ready..."
    sleep 5
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

if [ ! -f "venv/.installed" ]; then
    echo "📦 Installing backend dependencies..."
    pip install -q -r requirements.txt
    touch venv/.installed
    echo "✅ Backend dependencies installed"
fi

echo "🌐 Starting backend server on http://localhost:8000"
echo ""
echo "=================================="
echo "✅ Backend is running!"
echo "=================================="
echo "API:      http://localhost:8000/api/"
echo "Docs:     http://localhost:8000/docs"
echo "ReDoc:    http://localhost:8000/redoc"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the server
uvicorn server:app --host 0.0.0.0 --port 8000 --reload
