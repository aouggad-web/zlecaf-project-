# ZLECAf Project - African Continental Free Trade Area Calculator

A comprehensive web application for calculating tariffs and trade information under the African Continental Free Trade Area (ZLECAf).

## Project Structure

- **frontend/**: React application (Create React App with CRACO)
- **backend/**: FastAPI Python backend with MongoDB

## Setup Instructions

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Copy the environment example file and configure it:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` and set the backend URL:
   ```
   REACT_APP_BACKEND_URL=http://localhost:8000
   ```

4. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

5. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Copy the environment example file and configure it:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` and set your MongoDB connection and other variables:
   ```
   MONGO_URL=mongodb://localhost:27017
   DB_NAME=zlecaf_db
   CORS_ORIGINS=http://localhost:3000
   NODE_ENV=development
   ```

4. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Start the backend server:
   ```bash
   python server.py
   # or
   uvicorn server:app --reload
   ```

## Environment Variables

### Frontend Environment Variables

- `REACT_APP_BACKEND_URL`: URL of the backend API (required)
- `NODE_ENV`: Node environment (automatically set by react-scripts)
- `DISABLE_HOT_RELOAD`: Set to 'true' to disable hot reload (optional)

### Backend Environment Variables

- `MONGO_URL`: MongoDB connection string (required)
- `DB_NAME`: Database name for the application (required)
- `CORS_ORIGINS`: Comma-separated list of allowed CORS origins (default: '*')
- `NODE_ENV`: Environment mode - 'production' or 'development' (default: 'production')

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in both frontend and backend `.env` files
2. Update `REACT_APP_BACKEND_URL` to your production backend URL
3. Configure `CORS_ORIGINS` to only allow your frontend domain
4. Use a secure MongoDB connection string with authentication

## Features

- Tariff calculation for African countries
- Country economic profiles
- Trade statistics and projections
- Rules of origin information
- Multi-language support (French/English)

## Here are your Instructions
