# ZLECAf Application - Quick Start Guide

## 🚀 One-Command Startup

```bash
./start.sh
```

That's it! The script will automatically:
- ✅ Start MongoDB in Docker
- ✅ Install all dependencies
- ✅ Start the backend API
- ✅ Start the frontend

## 📍 Access Points

After running `./start.sh`, access the application at:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🛑 Stopping the Application

```bash
./stop.sh
```

## 📋 Prerequisites

Before running, ensure you have installed:
- **Docker** - For MongoDB
- **Python 3.8+** - For backend
- **Node.js 16+** - For frontend

## ⚡ Features Available

1. **Tariff Calculator** - Calculate import/export tariffs between 54 African countries
2. **Statistics Dashboard** - View ZLECAf trade statistics and projections
3. **Rules of Origin** - Check origin requirements for products
4. **Country Profiles** - Detailed economic data for all member countries

## 🔧 Configuration

The startup script creates `.env` files automatically. To customize:

- **Backend**: Edit `backend/.env` (MongoDB, CORS settings)
- **Frontend**: Edit `frontend/.env` (API URL)

Example files are provided as `.env.example` in each directory.

## 📖 Need More Help?

See [RUN.md](./RUN.md) for detailed documentation including:
- Manual setup instructions
- Troubleshooting guide
- Environment variables reference
- Development tips

## ✨ What's Included

- Complete ZLECAf trade calculation system
- Real economic data for 54 African countries
- MongoDB for persistent storage
- FastAPI backend with automatic documentation
- Modern React frontend with Shadcn/UI components

Enjoy using the ZLECAf Application! 🌍
