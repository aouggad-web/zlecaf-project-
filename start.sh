#!/bin/bash

# ZLECAf Application Startup Script
# This script starts the MongoDB, backend, and frontend services

set -e

echo "🚀 Starting ZLECAf Application..."
echo "=================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Start MongoDB if not already running
if ! docker ps | grep -q zlecaf-mongodb; then
    echo -e "${BLUE}📦 Starting MongoDB container...${NC}"
    if docker ps -a | grep -q zlecaf-mongodb; then
        docker start zlecaf-mongodb
    else
        docker run -d --name zlecaf-mongodb -p 27017:27017 mongo:7.0
    fi
    echo -e "${GREEN}✅ MongoDB started${NC}"
    sleep 3
else
    echo -e "${GREEN}✅ MongoDB already running${NC}"
fi

# Start backend
echo -e "${BLUE}🐍 Starting Backend API...${NC}"
cd backend
if [ ! -f ".env" ]; then
    echo "Creating backend .env file..."
    cat > .env << EOF
MONGO_URL=mongodb://localhost:27017/
DB_NAME=zlecaf_db
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
EOF
fi

# Install backend dependencies if needed
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi
source venv/bin/activate
pip install -q -r requirements.txt

# Start backend in background
echo "Starting FastAPI server on http://localhost:8000"
nohup uvicorn server:app --host 0.0.0.0 --port 8000 --reload > ../backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > ../backend.pid
cd ..
echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID)${NC}"
sleep 3

# Start frontend
echo -e "${BLUE}⚛️  Starting Frontend React App...${NC}"
cd frontend

if [ ! -f ".env" ]; then
    echo "Creating frontend .env file..."
    cat > .env << EOF
REACT_APP_BACKEND_URL=http://localhost:8000
EOF
fi

# Install frontend dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies..."
    npm install --legacy-peer-deps
fi

echo "Starting React development server on http://localhost:3000"
npm start > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > ../frontend.pid
cd ..
echo -e "${GREEN}✅ Frontend started (PID: $FRONTEND_PID)${NC}"

echo ""
echo "=================================="
echo -e "${GREEN}🎉 ZLECAf Application is running!${NC}"
echo "=================================="
echo ""
echo "📍 Services:"
echo "   - MongoDB:  mongodb://localhost:27017"
echo "   - Backend:  http://localhost:8000"
echo "   - Frontend: http://localhost:3000"
echo ""
echo "📋 Logs:"
echo "   - Backend:  backend.log"
echo "   - Frontend: frontend.log"
echo ""
echo "🛑 To stop all services, run: ./stop.sh"
echo ""
