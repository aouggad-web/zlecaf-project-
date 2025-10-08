# ZLECAf - Quick Start Guide

## TL;DR - Start in 30 seconds

```bash
# Start MongoDB
docker run -d -p 27017:27017 --name mongodb-zlecaf mongo:7

# Start Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8000 --reload
```

Then open http://localhost:8000/docs in your browser to explore the API.

## What is ZLECAf?

ZLECAf (Zone de Libre-Échange Continental Africain / African Continental Free Trade Area) is a comprehensive trade calculator and information system for African countries.

## Features

✅ **Backend API (Working)**
- 📊 54 African countries economic profiles
- 💰 Tariff calculations between countries
- 📋 Rules of origin by HS code
- 📈 Trade statistics
- 🔄 Real-time data from official sources

✅ **Interactive API Documentation**
- Swagger UI at http://localhost:8000/docs
- ReDoc at http://localhost:8000/redoc

⚠️ **Frontend** (Node.js compatibility issue)
- React application with modern UI
- Requires Node.js 16-18 (incompatible with Node.js 20)
- See RUN_INSTRUCTIONS.md for workarounds

## Quick API Examples

### Get all countries
```bash
curl http://localhost:8000/api/countries
```

### Get country profile (Algeria)
```bash
curl http://localhost:8000/api/country-profile/DZ
```

### Get rules of origin (HS Code 010121)
```bash
curl http://localhost:8000/api/rules-of-origin/010121
```

### Calculate tariff
```bash
curl -X POST http://localhost:8000/api/calculate-tariff \
  -H "Content-Type: application/json" \
  -d '{
    "origin_country": "NG",
    "destination_country": "EG",
    "hs_code": "010121",
    "value": 100000,
    "currency": "USD"
  }'
```

### Get statistics
```bash
curl http://localhost:8000/api/statistics
```

## Country Codes

Some examples:
- DZ: Algérie (Algeria)
- NG: Nigéria (Nigeria)
- EG: Égypte (Egypt)
- ZA: Afrique du Sud (South Africa)
- MA: Maroc (Morocco)
- KE: Kenya
- GH: Ghana
- ET: Éthiopie (Ethiopia)

See full list at http://localhost:8000/api/countries

## Technologies

- **Backend**: FastAPI, Python 3.12, Motor (async MongoDB)
- **Database**: MongoDB
- **Frontend**: React 19, Shadcn UI, Tailwind CSS
- **Data Sources**: World Bank, IMF, African Union

## Next Steps

1. ✅ Backend is ready to use at http://localhost:8000
2. 📖 Read full documentation in RUN_INSTRUCTIONS.md
3. 🧪 Run tests with `python3 backend_test.py`
4. 🔧 For frontend setup, see RUN_INSTRUCTIONS.md

## Support

For issues or questions:
- Check RUN_INSTRUCTIONS.md for detailed setup
- Review test_result.md for testing history
- All 54 countries have validated economic data
- API is production-ready and fully tested
