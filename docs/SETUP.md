# Setup Instructions

This guide will help you set up the AfCFTA Trade Analysis System on your local machine or production server.

## Prerequisites

- Python 3.8 or higher
- MongoDB 4.0 or higher
- Node.js 14.x or higher (for frontend)
- pip (Python package manager)
- npm (Node package manager)

## Backend Setup

### 1. Clone the Repository

```bash
git clone https://github.com/aouggad-web/zlecaf-project-.git
cd zlecaf-project-
```

### 2. Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Database
MONGO_URL=mongodb://localhost:27017
DB_NAME=zlecaf_db

# Environment
ENVIRONMENT=development
DEBUG=true
LOG_LEVEL=INFO

# API Settings
API_PREFIX=/api
RATE_LIMIT_PER_MINUTE=60

# External APIs (optional)
ENABLE_EXTERNAL_APIS=true
WORLDBANK_API_URL=https://api.worldbank.org/v2
OEC_API_URL=https://api-v2.oec.world
```

### 5. Start MongoDB

Ensure MongoDB is running on your system:

```bash
# On Linux/Mac with systemd
sudo systemctl start mongod

# On Mac with Homebrew
brew services start mongodb-community

# Or run directly
mongod --dbpath /path/to/data
```

### 6. Run the Backend Server

```bash
cd backend
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

### 7. Verify Installation

Check the health endpoint:

```bash
curl http://localhost:8000/api/health
```

You should receive a JSON response with status information.

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

Create a `.env` file in the `frontend` directory:

```env
REACT_APP_API_URL=http://localhost:8000/api
```

### 3. Start Development Server

```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## Testing

### Run Unit Tests

```bash
# From project root
python -m pytest tests/unit/ -v
```

### Run Integration Tests

```bash
python -m pytest tests/integration/ -v
```

### Run All Tests

```bash
python -m pytest tests/ -v --cov=backend
```

## Production Deployment

### Backend Deployment

1. **Set production environment variables**:

```env
ENVIRONMENT=production
DEBUG=false
LOG_LEVEL=WARNING
```

2. **Use a production WSGI server**:

```bash
gunicorn -w 4 -k uvicorn.workers.UvicornWorker backend.server:app --bind 0.0.0.0:8000
```

3. **Setup reverse proxy** (nginx example):

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location / {
        root /path/to/frontend/build;
        try_files $uri /index.html;
    }
}
```

### Frontend Deployment

1. **Build for production**:

```bash
cd frontend
npm run build
```

2. **Deploy the `build` directory** to your hosting service (Netlify, Vercel, etc.)

## Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running: `systemctl status mongod`
- Check MongoDB logs: `tail -f /var/log/mongodb/mongod.log`
- Verify connection string in `.env`

### Port Already in Use

```bash
# Find process using port 8000
lsof -i :8000
# Kill the process
kill -9 <PID>
```

### Module Not Found Errors

```bash
# Ensure virtual environment is activated
source venv/bin/activate
# Reinstall dependencies
pip install -r backend/requirements.txt
```

### CORS Errors

Update `cors_origins` in settings or environment variables to include your frontend URL.

## Next Steps

- Read the [Usage Guide](USAGE.md) to learn how to use the API
- Check the [API Documentation](api/README.md) for endpoint details
- See the [Configuration Guide](CONFIGURATION.md) for advanced settings
