# ZLECAf - African Continental Free Trade Area Calculator

A comprehensive trade calculator and information system for the African Continental Free Trade Area (ZLECAf).

## 🚀 Quick Start

```bash
# 1. Start MongoDB (using Docker)
docker run -d -p 27017:27017 --name mongodb-zlecaf mongo:7

# 2. Start the backend
./run-backend.sh

# 3. Open your browser
# Visit http://localhost:8000/docs for API documentation
```

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Get started in 30 seconds
- **[RUN_INSTRUCTIONS.md](RUN_INSTRUCTIONS.md)** - Comprehensive setup guide
- **API Docs** - http://localhost:8000/docs (when running)

## ✨ Features

### Backend API (Fully Functional) ✅
- 📊 Economic profiles for 54 African countries
- 💰 Tariff calculations between countries  
- 📋 Rules of origin by HS code
- 📈 Trade statistics
- 🔄 Real-time data from World Bank, IMF, and AU

### Frontend (Node.js 16-18 required)
- 🎨 Modern React interface with Shadcn UI
- 📱 Responsive design
- 🌍 Interactive country selection
- ⚠️ Note: Known issues with Node.js 20

## 🧪 Testing

```bash
# Test the local API
python3 test-local.py

# Or test the production API
python3 backend_test.py
```

## 🛠️ Technologies

- **Backend**: FastAPI, Python 3.12, Motor (MongoDB)
- **Frontend**: React 19, Tailwind CSS, Shadcn UI
- **Database**: MongoDB
- **Data Sources**: World Bank, IMF, African Union

## 📦 What's Included

- Full REST API for ZLECAf trade calculations
- 54 African countries with validated economic data
- Rules of origin database
- Tariff calculation engine
- Interactive API documentation

## 🌍 Supported Countries

All 54 African Union member states including:
- Nigeria, Egypt, South Africa, Algeria
- Kenya, Ghana, Morocco, Ethiopia
- And 46 more...

See full list: http://localhost:8000/api/countries

## 📄 License

This project contains economic data from official sources and is intended for educational and research purposes.

## 🤝 Contributing

Contributions are welcome! Please check the RUN_INSTRUCTIONS.md for development setup.

## 📞 Support

For issues or questions, please check the documentation files in this repository.
