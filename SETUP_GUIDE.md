# ZLECAf Setup Guide

This guide explains how to set up and run the ZLECAf project in demo mode.

## Prerequisites

- Python 3.x
- Node.js and npm
- Docker (for MongoDB)

## Quick Start

Follow these steps to run the ZLECAf application:

### 1. Configure Demo Environment

```bash
python backend/make_release.py --demo
```

This command will:
- Create `backend/.env` with MongoDB configuration
- Create `frontend/.env` with backend URL configuration
- Display next steps for running the application

### 2. Start MongoDB (if not already running)

```bash
docker run -d -p 27017:27017 --name zlecaf-mongo mongo:latest
```

### 3. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 4. Start Backend Server

```bash
cd backend
uvicorn server:app --reload --port 8000
```

The backend API will be available at `http://localhost:8000/api`

### 5. Install Frontend Dependencies

```bash
cd frontend
npm install --legacy-peer-deps
```

### 6. Start Frontend Server

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Verification

To verify that everything is working correctly:

```bash
curl -s http://localhost:3000/api/health | jq
```

Expected response:
```json
{
  "status": "healthy",
  "service": "ZLECAf API",
  "version": "2.0.0",
  "timestamp": "2025-10-08T15:24:16.382738"
}
```

## API Endpoints

The health check endpoint is available at:
- Through frontend proxy: `http://localhost:3000/api/health`
- Direct backend access: `http://localhost:8000/api/health`

## Architecture

### Frontend (Port 3000)
- React application built with Create React App
- Uses craco for configuration
- Proxies `/api` requests to backend on port 8000

### Backend (Port 8000)
- FastAPI application
- MongoDB for data persistence
- RESTful API with `/api` prefix

### Proxy Configuration
The frontend uses `src/setupProxy.js` to proxy API requests to the backend. This allows the frontend to make requests to `/api/*` which are automatically forwarded to `http://localhost:8000/api/*`.

## Environment Files

### Backend `.env`
```
MONGO_URL=mongodb://localhost:27017/
DB_NAME=zlecaf_demo
PORT=8000
HOST=0.0.0.0
```

### Frontend `.env`
```
REACT_APP_BACKEND_URL=http://localhost:8000
```

## Troubleshooting

### Port Already in Use
If port 3000 or 8000 is already in use, you can change the ports:

Backend:
```bash
uvicorn server:app --reload --port 8080
```

Frontend:
```bash
PORT=3001 npm run dev
```

### MongoDB Connection Issues
Make sure MongoDB is running:
```bash
docker ps | grep mongo
```

If not running, start it:
```bash
docker start zlecaf-mongo
```

### Module Not Found Errors
If you encounter module errors in the frontend:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

## Development

For development, run both backend and frontend in separate terminals:

Terminal 1 (Backend):
```bash
cd backend && uvicorn server:app --reload --port 8000
```

Terminal 2 (Frontend):
```bash
cd frontend && npm run dev
```

## Production Setup

For production deployment, use:
```bash
python backend/make_release.py --production
```

This will provide guidance for production configuration including:
- Production MongoDB URL
- SSL/TLS certificates
- Environment variable configuration
