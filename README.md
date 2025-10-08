# ZLECAf Trading System

![API Status](https://img.shields.io/badge/API-v2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Python](https://img.shields.io/badge/python-3.8+-blue)
![React](https://img.shields.io/badge/react-18.0+-61dafb)

Système commercial complet pour la Zone de Libre-Échange Continental Africaine (ZLECAf) - Complete trading system for the African Continental Free Trade Area.

## 📋 Overview

This comprehensive platform provides:
- **Tariff Calculations**: Calculate tariffs and duties for intra-African trade
- **Rules of Origin**: Access ZLECAf rules of origin by HS code
- **Country Profiles**: Detailed economic profiles of African member states
- **Trade Statistics**: Comprehensive statistics on African trade flows
- **Real-time Data**: Integration with World Bank and OEC APIs

## 🏥 Health Monitoring

The API includes a health check endpoint for monitoring service availability:

### Health Endpoint

```bash
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-10-08T14:30:00.000Z",
  "service": "ZLECAf API",
  "version": "2.0.0",
  "checks": {
    "database": {
      "status": "healthy",
      "message": "MongoDB connection successful"
    },
    "external_apis": {
      "world_bank": "configured",
      "oec": "configured"
    }
  }
}
```

**Status Badges:**
- 🟢 `healthy` - All systems operational
- 🔴 `unhealthy` - One or more systems failing

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Node.js 16+
- MongoDB

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env  # Configure your environment variables
python server.py
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

## 📚 API Documentation

### Base URL
```
http://localhost:8000/api
```

### Key Endpoints

#### 1. Health Check
```bash
GET /api/health
```
Monitor service health and availability.

#### 2. Countries List
```bash
GET /api/countries
```
Get list of all ZLECAf member countries.

#### 3. Country Profile
```bash
GET /api/country-profile/{country_code}
```
Get detailed economic profile for a specific country.

#### 4. Rules of Origin
```bash
GET /api/rules-of-origin/{hs_code}
```
Get ZLECAf rules of origin for a specific HS code.

#### 5. Tariff Calculation
```bash
POST /api/calculate-tariff
```
Calculate comprehensive tariff information.

#### 6. Statistics
```bash
GET /api/statistics
```
Get comprehensive ZLECAf trade statistics.

## 🎨 UI Components

The frontend uses custom React components including:
- **Badge**: Display status, categories, and labels
- **Card**: Container components for content sections
- **Progress**: Visual representation of data metrics
- **Tabs**: Organize content in different sections

### Badge Component Usage

```jsx
import { Badge } from './components/ui/badge';

// Different variants
<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Destructive</Badge>
```

## 🔧 Configuration

### Environment Variables

**Backend (.env):**
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=zlecaf_db
CORS_ORIGINS=http://localhost:3000
```

**Frontend:**
Configuration is managed through `package.json` and environment-specific files.

## 📊 Data Sources

- World Bank API - Economic indicators
- OEC (Observatory of Economic Complexity) - Trade data
- Official ZLECAf documentation - Rules of origin
- National statistical offices - Country-specific data

## 🧪 Testing

### Backend Tests
```bash
python backend_test.py
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support, please open an issue in the repository.
