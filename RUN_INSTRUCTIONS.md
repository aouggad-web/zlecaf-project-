# 🚀 ZLECAf Application - Run Instructions

## Quick Start

This guide will help you run the ZLECAf (African Continental Free Trade Area) application on your local machine.

## Prerequisites

- Python 3.12+
- Node.js 20+
- Docker (for MongoDB)

## Step 1: Clone the Repository

```bash
git clone https://github.com/aouggad-web/zlecaf-project-.git
cd zlecaf-project-
```

## Step 2: Start MongoDB

Using Docker (recommended):

```bash
docker run --name zlecaf-mongodb -d -p 27017:27017 mongo:7
```

## Step 3: Setup Backend

### Install Python Dependencies

```bash
cd backend
pip3 install -r requirements.txt
```

### Create Environment File

Create `backend/.env` with the following content:

```env
# MongoDB Configuration
MONGO_URL=mongodb://localhost:27017
DB_NAME=zlecaf_db

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### Start Backend Server

```bash
python3 -m uvicorn server:app --host 0.0.0.0 --port 8000 --reload
```

The backend API will be available at: http://localhost:8000

## Step 4: Setup Frontend

### Install Node Dependencies

```bash
cd frontend
npm install --legacy-peer-deps
```

### Fix AJV Module Issue (if needed)

```bash
npm install ajv@^8.12.0 --legacy-peer-deps
```

### Create Environment File

Create `frontend/.env` with the following content:

```env
# Backend API URL
REACT_APP_BACKEND_URL=http://localhost:8000
```

### Start Frontend Server

```bash
npm start
```

The frontend application will be available at: http://localhost:3000

## 🎯 Accessing the Application

Open your browser and navigate to: **http://localhost:3000**

## 📱 Application Features

### 1. **Calculator Tab**
- Select origin and destination countries
- Enter HS6 code (e.g., 010121)
- Input merchandise value in USD
- Calculate tariff savings with ZLECAf

### 2. **Statistics Tab**
- View total savings
- See import/export statistics
- Check ZLECAf projections for 2025 and 2030
- Access official data sources

### 3. **Rules of Origin Tab**
- Look up ZLECAf rules for specific HS codes
- View documentation requirements
- Check administrative information

### 4. **Country Profiles Tab**
- Select from 54 African countries
- View economic indicators (GDP, population, etc.)
- Check sovereign risk ratings
- See key sectors and trade data

## 🔧 Troubleshooting

### Backend Issues

**MongoDB Connection Error:**
- Ensure Docker container is running: `docker ps | grep zlecaf-mongodb`
- Restart MongoDB: `docker restart zlecaf-mongodb`

**Module Not Found:**
- Reinstall dependencies: `pip3 install -r requirements.txt`

### Frontend Issues

**Module Resolution Error:**
- Delete node_modules: `rm -rf node_modules package-lock.json`
- Reinstall: `npm install --legacy-peer-deps`
- Install ajv: `npm install ajv@^8.12.0 --legacy-peer-deps`

**API Connection Error:**
- Verify backend is running on port 8000
- Check `.env` file has correct `REACT_APP_BACKEND_URL`

## 🛑 Stopping the Application

### Stop Backend
Press `Ctrl+C` in the terminal running uvicorn

### Stop Frontend
Press `Ctrl+C` in the terminal running npm start

### Stop MongoDB
```bash
docker stop zlecaf-mongodb
```

### Remove MongoDB Container (optional)
```bash
docker rm zlecaf-mongodb
```

## 📊 API Endpoints

- `GET /api/` - Root endpoint
- `GET /api/countries` - List all 54 African countries
- `GET /api/country-profile/{country_code}` - Get country economic profile
- `POST /api/calculate-tariff` - Calculate tariff savings
- `GET /api/rules-of-origin/{hs_code}` - Get rules of origin for HS code
- `GET /api/statistics` - Get ZLECAf statistics

## 🌍 Supported Countries

The application includes all 54 African countries that are members of ZLECAf, with complete economic data, trade statistics, and risk ratings.

## 📝 Notes

- The application uses real economic data from official sources
- Statistics are based on World Bank, OEC, and African Union data
- Country profiles include GDP, population, development indices, and risk ratings
- Tariff calculations use official ZLECAf rates

## 🆘 Support

For issues or questions, please open an issue on the GitHub repository.

---

**Made with ❤️ for African Continental Free Trade**
