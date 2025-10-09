# Running the ZLECAf Application

This guide explains how to run the ZLECAf (African Continental Free Trade Area) application locally.

## Prerequisites

Before running the application, ensure you have the following installed:

- **Docker** - For running MongoDB
- **Python 3.8+** - For the backend API
- **Node.js 16+** - For the frontend React app
- **npm** or **yarn** - Node package manager

## Quick Start

### Option 1: Using the Start Script (Recommended)

The easiest way to run the application is using the provided start script:

```bash
# Make the script executable
chmod +x start.sh stop.sh

# Start all services
./start.sh
```

This will:
1. Start MongoDB in a Docker container
2. Create necessary `.env` files
3. Install dependencies (if not already installed)
4. Start the backend API on http://localhost:8000
5. Start the frontend on http://localhost:3000

To stop all services:

```bash
./stop.sh
```

### Option 2: Manual Setup

If you prefer to start services manually:

#### 1. Start MongoDB

```bash
docker run -d --name zlecaf-mongodb -p 27017:27017 mongo:7.0
```

#### 2. Start Backend

```bash
cd backend

# Create .env file
cat > .env << EOF
MONGO_URL=mongodb://localhost:27017/
DB_NAME=zlecaf_db
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
EOF

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn server:app --host 0.0.0.0 --port 8000 --reload
```

#### 3. Start Frontend

In a new terminal:

```bash
cd frontend

# Create .env file
cat > .env << EOF
REACT_APP_BACKEND_URL=http://localhost:8000
EOF

# Install dependencies
npm install --legacy-peer-deps

# Start the development server
npm start
```

## Accessing the Application

Once all services are running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **MongoDB**: mongodb://localhost:27017

## Features

The ZLECAf application provides:

1. **Tariff Calculator** - Calculate tariffs between African countries
2. **Statistics** - View trade statistics across the continent
3. **Rules of Origin** - Check origin rules for products
4. **Country Profiles** - Detailed economic profiles for all 54 member countries

## Troubleshooting

### MongoDB Connection Issues

If the backend can't connect to MongoDB:
```bash
# Check if MongoDB is running
docker ps | grep zlecaf-mongodb

# Restart MongoDB
docker restart zlecaf-mongodb
```

### Port Already in Use

If port 8000 or 3000 is already in use:
```bash
# Find and kill the process
lsof -ti:8000 | xargs kill -9  # For backend
lsof -ti:3000 | xargs kill -9  # For frontend
```

### Frontend Dependencies Issues

If you encounter dependency conflicts:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

## Environment Variables

### Backend (.env)
- `MONGO_URL` - MongoDB connection string
- `DB_NAME` - Database name
- `CORS_ORIGINS` - Allowed CORS origins (comma-separated)

### Frontend (.env)
- `REACT_APP_BACKEND_URL` - Backend API URL

## Development

### Backend Development
The backend uses FastAPI with hot-reload enabled. Changes to Python files will automatically restart the server.

### Frontend Development
The frontend uses Create React App with hot-reload. Changes to React files will automatically refresh the browser.

## Production Deployment

For production deployment, see the deployment documentation in the `.github/workflows` directory.

## Support

For issues or questions, please check the test results in `test_result.md` or refer to the repository documentation.
