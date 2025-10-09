#!/bin/bash

# ZLECAf Application Stop Script
# This script stops all running services

echo "🛑 Stopping ZLECAf Application..."
echo "=================================="

# Stop backend
if [ -f "backend.pid" ]; then
    BACKEND_PID=$(cat backend.pid)
    if ps -p $BACKEND_PID > /dev/null; then
        echo "Stopping Backend (PID: $BACKEND_PID)..."
        kill $BACKEND_PID
        rm backend.pid
        echo "✅ Backend stopped"
    else
        echo "Backend not running"
        rm backend.pid
    fi
else
    echo "No backend.pid file found"
fi

# Stop frontend
if [ -f "frontend.pid" ]; then
    FRONTEND_PID=$(cat frontend.pid)
    if ps -p $FRONTEND_PID > /dev/null; then
        echo "Stopping Frontend (PID: $FRONTEND_PID)..."
        kill $FRONTEND_PID
        rm frontend.pid
        echo "✅ Frontend stopped"
    else
        echo "Frontend not running"
        rm frontend.pid
    fi
else
    echo "No frontend.pid file found"
fi

# Stop MongoDB
if docker ps | grep -q zlecaf-mongodb; then
    echo "Stopping MongoDB container..."
    docker stop zlecaf-mongodb
    echo "✅ MongoDB stopped"
else
    echo "MongoDB not running"
fi

echo ""
echo "=================================="
echo "✅ All services stopped!"
echo "=================================="
