# ZLECAf Application Preview Guide

## 🚀 Application Overview

This is a comprehensive web application for the African Continental Free Trade Area (AfCFTA/ZLECAf) that provides tariff calculations, country profiles, trade statistics, and rules of origin information for all 54 African member states.

## 📋 Prerequisites

- **Backend Requirements:**
  - Python 3.12+
  - MongoDB (Docker container or local installation)
  - All dependencies listed in `backend/requirements.txt`

- **Frontend Requirements:**
  - Node.js 20+ and npm
  - All dependencies listed in `frontend/package.json`

## 🛠️ Setup Instructions

### Step 1: Set Up MongoDB

Using Docker (recommended):
```bash
docker run --name zlecaf-mongo -d -p 27017:27017 mongo:7.0
```

### Step 2: Configure Backend

1. Create environment file:
```bash
cd backend
cat > .env << EOF
MONGO_URL=mongodb://localhost:27017
DB_NAME=zlecaf_db
EOF
```

2. Install dependencies:
```bash
pip3 install -r requirements.txt
```

3. Start the backend server:
```bash
uvicorn server:app --host 0.0.0.0 --port 8000
```

The backend API will be available at: `http://localhost:8000`

### Step 3: Configure Frontend

1. Create environment file:
```bash
cd frontend
cat > .env << EOF
REACT_APP_BACKEND_URL=http://localhost:8000
EOF
```

2. Install dependencies:
```bash
npm install --force
```

3. Start the development server:
```bash
npm start
```

The frontend will be available at: `http://localhost:3000`

## 🎯 Application Features

### 1. **Tariff Calculator** (Calculateur)
- Calculate tariffs between any two African countries
- Compare NPF (Most Favored Nation) rates vs ZLECAf rates
- See potential savings from AfCFTA implementation
- View rules of origin requirements
- Support for all HS6 codes

### 2. **Statistics** (Statistiques)
- Total savings tracked via ZLECAf
- AfCFTA projections for 2025 and 2030
- Trade volume increases
- Tariff elimination progress
- Official data sources from:
  - African Union - AfCFTA Secretariat
  - World Bank - World Development Indicators
  - UNCTAD - Tariff data
  - OEC - Atlas of Economic Complexity
  - AfDB - African Economic Outlook
  - IMF - Regional Economic Outlook

### 3. **Rules of Origin** (Règles d'Origine)
- Search by HS6 code
- View specific requirements for products
- Understand regional content minimums
- See required documentation
- Access competent authorities information

### 4. **Country Profiles** (Profils Pays)
- Complete economic profiles for all 54 member states
- GDP and population data
- Sovereign risk ratings (S&P, Moody's, Fitch, Scope)
- Growth projections (2024-2026)
- Business environment indicators
- Key economic sectors
- Main exports and imports
- AfCFTA potential assessment

## 🌍 Supported Countries

All 54 African Union member states including:
- Algeria (DZ), Angola (AO), Benin (BJ), Botswana (BW)
- Nigeria (NG), Egypt (EG), South Africa (ZA), Kenya (KE)
- Morocco (MA), Ghana (GH), Ethiopia (ET), Tanzania (TZ)
- And 42 more countries...

## 🔧 API Endpoints

### Core Endpoints
- `GET /api/` - API welcome message
- `GET /api/countries` - List all 54 member countries
- `GET /api/country-profile/{country_code}` - Get country profile
- `POST /api/calculate-tariff` - Calculate tariffs
- `GET /api/rules-of-origin/{hs_code}` - Get rules of origin
- `GET /api/statistics` - Get trade statistics

### Health Endpoints
- `GET /api/health` - Simple health check
- `GET /api/health/status` - Detailed health status

## 🎨 Technology Stack

- **Backend:** FastAPI (Python), MongoDB
- **Frontend:** React 19, Shadcn/UI components, Tailwind CSS
- **Data Sources:** World Bank API, UNCTAD, OEC API

## 📸 Preview Screenshots

The application features a modern, responsive design with:
- Clean navigation tabs
- Interactive country selectors with flags 🇳🇬 🇪🇬 🇿🇦
- Real-time calculations
- Comprehensive data visualization
- Bilingual support (French/English)

## 🧪 Testing the Application

1. **Test Tariff Calculation:**
   - Select Origin: Nigeria (🇳🇬)
   - Select Destination: Egypt (🇪🇬)
   - Enter HS Code: 010121
   - Enter Value: 100000
   - Click "Calculate"
   - Expected: $25,000 savings (100% economy)

2. **Test Country Profile:**
   - Go to "Profils Pays" tab
   - Select any country (e.g., Nigeria)
   - View complete economic data

3. **Test Statistics:**
   - Go to "Statistiques" tab
   - View AfCFTA projections and data sources

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB container is running: `docker ps`
- Check logs: `docker logs zlecaf-mongo`
- Restart if needed: `docker restart zlecaf-mongo`

### Frontend Dependency Issues
- Try clearing cache: `rm -rf node_modules package-lock.json`
- Reinstall: `npm install --force`

### Backend Module Errors
- Verify Python version: `python3 --version` (should be 3.12+)
- Reinstall dependencies: `pip3 install -r requirements.txt`

## 📝 Notes

- First calculation may take a few seconds as the database initializes
- All data is from official sources and regularly updated
- The application supports both French and English languages
- MongoDB stores calculation history for statistics tracking

## 🔗 Useful Links

- African Union AfCFTA: https://au-afcfta.org/
- World Bank Data: https://data.worldbank.org/
- UNCTAD: https://unctad.org/

---

**Status:** ✅ Application fully functional and ready for preview
**Last Updated:** October 10, 2025
