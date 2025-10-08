# ZLECAf Trade Calculator - Système Commercial Africain

Application complète pour calculer les tarifs douaniers dans le cadre de la Zone de Libre-Échange Continental Africaine (ZLECAf).

## 🚀 Quick Start

### 1. Prepare the Environment

```bash
python backend/make_release.py --demo
```

### 2. Start the Backend

```bash
cd backend
python -m uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

### 3. Start the Frontend

```bash
cd frontend
npm run dev
```

### 4. Verify Installation

```bash
curl -s http://localhost:3000/api/health | jq
```

## 📋 Features

- **Tariff Calculator**: Calculate customs duties for intra-African trade
- **54 African Countries**: Complete coverage of ZLECAf member states
- **Rules of Origin**: Comprehensive rules for determining product origin
- **Trade Statistics**: Real-time statistics on intra-African trade
- **Country Profiles**: Economic data and trade information for each country
- **Health Monitoring**: API health check endpoint

## 🛠️ Setup

See [SETUP.md](SETUP.md) for detailed setup instructions.

### Prerequisites

- Python 3.8+
- Node.js 14+
- MongoDB (optional, for demo data)

### Environment Configuration

**Backend** (backend/.env):
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=zlecaf
CORS_ORIGINS=http://localhost:3000,http://localhost:8000
```

**Frontend** (frontend/.env):
```env
REACT_APP_BACKEND_URL=http://localhost:8000
```

## 📚 API Endpoints

- `GET /api/health` - System health check
- `GET /api/` - API welcome message
- `GET /api/countries` - List of 54 African countries
- `GET /api/country-profile/{country_code}` - Economic profile
- `GET /api/rules-of-origin/{hs_code}` - ZLECAf rules of origin
- `POST /api/calculate-tariff` - Calculate tariffs
- `GET /api/statistics` - Trade statistics

## 🧪 Testing

Run the automated test suite:

```bash
./test_setup.sh
```

## 📖 Documentation

- [Setup Guide](SETUP.md) - Detailed setup instructions
- [API Documentation](backend/server.py) - API endpoint documentation

## 🤝 Contributing

This is a demonstration application for the African Continental Free Trade Area (AfCFTA/ZLECAf).

## 📄 License

This project is licensed under the MIT License.
