# ZLECAf Trade Calculator / Calculateur Commercial ZLECAf

![API Status](https://img.shields.io/badge/API-Online-success)
![Version](https://img.shields.io/badge/version-2.0.0-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Connected-green)
![License](https://img.shields.io/badge/license-MIT-orange)

A comprehensive tariff calculator and trade information system for the African Continental Free Trade Area (AfCFTA/ZLECAf).

## 🌐 Live Preview & Deployment

### 🔗 Access the Application

- **Frontend App**: https://aouggad-web.github.io/zlecaf-project-/
- **Backend API**: https://etape-suivante.preview.emergentagent.com/api

The React application is automatically deployed to GitHub Pages on every push to the main branch that modifies the `frontend/` directory.

### 📋 Deployment Status

The application uses GitHub Actions for continuous deployment:
- **Workflow**: `.github/workflows/deploy-react-app.yml`
- **Triggers**: 
  - Push to `main` branch with changes to `frontend/**`
  - Manual workflow dispatch via GitHub Actions tab
- **Build Time**: ~2-3 minutes
- **Status**: Check the [Actions tab](https://github.com/aouggad-web/zlecaf-project-/actions) for deployment status

### ✅ Verify the Deployment

After deployment completes, verify the app is working:

1. **Open the App**: Visit https://aouggad-web.github.io/zlecaf-project-/
2. **Check All Tabs**: Navigate through all 4 tabs (Calculateur, Statistiques, Règles d'Origine, Profils Pays)
3. **Test API Connection**: The app should display data from the backend API
4. **Check Console**: Open browser DevTools (F12) to check for errors

### 🔧 Manual Deployment

To trigger a deployment manually:
1. Go to the [Actions tab](https://github.com/aouggad-web/zlecaf-project-/actions)
2. Select "Build and Deploy React App to GitHub Pages" workflow
3. Click "Run workflow" button
4. Select the `main` branch and click "Run workflow"

## 🚀 Features

- **Tariff Calculations**: Calculate tariffs between 54 African countries
- **Rules of Origin**: Access ZLECAf rules of origin by HS code
- **Country Profiles**: Detailed economic profiles for all member states
- **Trade Statistics**: Comprehensive trade statistics and projections
- **Real-time Data**: Integration with World Bank and OEC APIs

## 📊 API Endpoints

### Health & Observability

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Simple health check |
| `/api/health/status` | GET | Detailed health status with system checks |

The health endpoints provide real-time monitoring of:
- Database connectivity (MongoDB)
- API endpoints availability
- Data integrity checks
- Service version information

### Core Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/` | GET | API welcome message |
| `/api/countries` | GET | List all 54 ZLECAf member countries |
| `/api/country-profile/{country_code}` | GET | Get detailed country economic profile |
| `/api/calculate-tariff` | POST | Calculate tariffs between countries |
| `/api/rules-of-origin/{hs_code}` | GET | Get rules of origin for HS code |
| `/api/statistics` | GET | Get comprehensive ZLECAf statistics |

## 🏥 Health Monitoring

### Health Check Response

**Endpoint**: `GET /api/health`

```json
{
  "status": "healthy",
  "service": "ZLECAf API",
  "version": "2.0.0",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

### Detailed Status Response

**Endpoint**: `GET /api/health/status`

```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "service": "ZLECAf API",
  "version": "2.0.0",
  "checks": {
    "database": {
      "status": "healthy",
      "message": "MongoDB connection active"
    },
    "api_endpoints": {
      "status": "healthy",
      "available_endpoints": [...]
    },
    "data": {
      "status": "healthy",
      "countries_count": 54,
      "rules_of_origin_sectors": 97
    }
  }
}
```

## 🔧 Technology Stack

- **Backend**: FastAPI (Python)
- **Frontend**: React with Shadcn/UI components
- **Database**: MongoDB
- **External APIs**: World Bank API, OEC API

## 📦 Data Sources

- World Bank - World Development Indicators
- UNCTAD - Tariff data
- OEC - Atlas of Economic Complexity
- AfDB - African Economic Outlook
- IMF - Regional Economic Outlook

## 🌍 Coverage

- **54 African Countries**
- **97 HS2 Sectors** with rules of origin
- **Real-time Trade Data**
- **Economic Projections** through 2030

## 🚦 Status Badges Explained

- ![API Status](https://img.shields.io/badge/API-Online-success) - API is operational
- ![MongoDB](https://img.shields.io/badge/MongoDB-Connected-green) - Database connection active
- ![Version](https://img.shields.io/badge/version-2.0.0-blue) - Current API version

## 📈 Monitoring Best Practices

1. **Regular Health Checks**: Poll `/api/health` endpoint every 30 seconds
2. **Detailed Status**: Check `/api/health/status` for comprehensive diagnostics
3. **Database Monitoring**: Monitor MongoDB connection status
4. **API Response Times**: Track endpoint response times
5. **Error Rates**: Monitor 4xx and 5xx response rates

## 🔍 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/aouggad-web/zlecaf-project-.git
   cd zlecaf-project-
   ```

2. **Setup Frontend**
   ```bash
   cd frontend
   cp .env.example .env
   yarn install
   yarn start
   ```
   The app will open at http://localhost:3000

3. **Setup Backend** (Optional - for local API development)
   ```bash
   cd backend
   pip install -r requirements.txt
   # Create .env with MONGO_URL and DB_NAME
   uvicorn server:app --reload --port 8000
   ```

### API Testing

#### Check API Health

```bash
curl https://etape-suivante.preview.emergentagent.com/api/health
```

#### Get All Countries

```bash
curl https://etape-suivante.preview.emergentagent.com/api/countries
```

#### Calculate Tariff

```bash
curl -X POST https://etape-suivante.preview.emergentagent.com/api/calculate-tariff \
  -H "Content-Type: application/json" \
  -d '{
    "origin_country": "KE",
    "destination_country": "GH",
    "hs_code": "080300",
    "value": 10000
  }'
```

## 🐛 Troubleshooting

### Frontend Issues

**Problem**: App shows blank page or doesn't load
- **Solution**: Clear browser cache and hard reload (Ctrl+Shift+R or Cmd+Shift+R)
- **Check**: Open DevTools console (F12) for JavaScript errors

**Problem**: Data not loading (empty dropdowns, no statistics)
- **Solution**: Check that the backend API is online at https://etape-suivante.preview.emergentagent.com/api/health
- **Workaround**: CORS errors are expected in some development environments

**Problem**: Build fails in GitHub Actions
- **Solution**: Check the Actions logs for specific errors
- **Common causes**: Missing dependencies, invalid environment variables, or syntax errors

### Local Development Issues

**Problem**: `yarn start` fails
- **Solution**: Delete `node_modules` and `yarn.lock`, then run `yarn install` again
- **Check**: Ensure you have Node.js 18+ installed

**Problem**: Environment variables not working
- **Solution**: Make sure you have a `.env` file in the `frontend/` directory (copy from `.env.example`)
- **Note**: You must restart the dev server after changing `.env` file

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.
