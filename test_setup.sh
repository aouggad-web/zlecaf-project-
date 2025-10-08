#!/bin/bash

# Test script for ZLECAf application setup
# This script validates that all components are properly configured

set -e

echo "========================================"
echo "ZLECAf Application Setup Test"
echo "========================================"
echo ""

# Test 1: Check backend make_release.py exists and works
echo "✓ Test 1: Checking make_release.py..."
python backend/make_release.py --check > /dev/null 2>&1 || {
    echo "  ✗ make_release.py failed"
    exit 1
}
echo "  ✓ make_release.py works"
echo ""

# Test 2: Check if backend server is running
echo "✓ Test 2: Checking backend server..."
if curl -s http://localhost:8000/api/health > /dev/null 2>&1; then
    echo "  ✓ Backend server is running on port 8000"
else
    echo "  ✗ Backend server is not responding"
    exit 1
fi
echo ""

# Test 3: Check health endpoint through frontend proxy
echo "✓ Test 3: Checking frontend proxy..."
if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "  ✓ Frontend proxy is working on port 3000"
else
    echo "  ✗ Frontend proxy is not responding"
    exit 1
fi
echo ""

# Test 4: Validate health endpoint response
echo "✓ Test 4: Validating health endpoint response..."
HEALTH_RESPONSE=$(curl -s http://localhost:3000/api/health)
if echo "$HEALTH_RESPONSE" | jq -e '.service' > /dev/null 2>&1; then
    SERVICE=$(echo "$HEALTH_RESPONSE" | jq -r '.service')
    VERSION=$(echo "$HEALTH_RESPONSE" | jq -r '.version')
    STATUS=$(echo "$HEALTH_RESPONSE" | jq -r '.status')
    echo "  ✓ Health endpoint returns valid JSON"
    echo "    - Service: $SERVICE"
    echo "    - Version: $VERSION"
    echo "    - Status: $STATUS"
else
    echo "  ✗ Health endpoint response is invalid"
    exit 1
fi
echo ""

# Test 5: Check other API endpoints
echo "✓ Test 5: Checking other API endpoints..."
if curl -s http://localhost:3000/api/ | jq -e '.message' > /dev/null 2>&1; then
    echo "  ✓ API root endpoint works"
else
    echo "  ✗ API root endpoint failed"
    exit 1
fi

if curl -s http://localhost:3000/api/countries | jq -e 'length' > /dev/null 2>&1; then
    COUNT=$(curl -s http://localhost:3000/api/countries | jq 'length')
    echo "  ✓ Countries endpoint works ($COUNT countries)"
else
    echo "  ✗ Countries endpoint failed"
    exit 1
fi
echo ""

echo "========================================"
echo "✓ All tests passed!"
echo "========================================"
echo ""
echo "Application is ready to use:"
echo "  - Backend: http://localhost:8000/api/"
echo "  - Frontend: http://localhost:3000"
echo "  - Health: http://localhost:3000/api/health"
echo ""
