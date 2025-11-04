# AfCFTA Trade Analysis System - Documentation

Welcome to the documentation for the AfCFTA Trade Analysis System. This comprehensive system provides tools for calculating tariffs, analyzing trade flows, and assessing investment opportunities within the African Continental Free Trade Area.

## 📚 Documentation Index

### Getting Started

1. **[Setup Instructions](SETUP.md)** - Complete installation guide
   - Prerequisites and dependencies
   - Backend and frontend setup
   - Development and production deployment
   - Troubleshooting common issues

2. **[Usage Guide](USAGE.md)** - How to use the system
   - API endpoint examples
   - Code samples in Python and JavaScript
   - Common use cases and workflows
   - Best practices

3. **[Configuration Guide](CONFIGURATION.md)** - System configuration
   - Environment variables
   - Database configuration
   - Feature flags and settings
   - Production recommendations

### API Reference

4. **[API Documentation](api/README.md)** - Complete API reference
   - All endpoints with examples
   - Request/response formats
   - Error handling
   - Rate limiting

## 🚀 Quick Start

### Installation

```bash
# Clone repository
git clone https://github.com/aouggad-web/zlecaf-project-.git
cd zlecaf-project-

# Install backend dependencies
cd backend
pip install -r requirements.txt

# Start the server
uvicorn server:app --reload
```

### First API Call

```bash
curl -X POST http://localhost:8000/api/calculate-tariff \
  -H "Content-Type: application/json" \
  -d '{
    "origin_country": "KE",
    "destination_country": "NG",
    "hs_code": "010121",
    "value": 100000
  }'
```

## 🏗️ System Architecture

### Core Components

1. **Core Calculation System** (`backend/core/`)
   - AfCFTA duty calculator
   - MFN duty calculator
   - ICP score calculator
   - Trade analyzer
   - Data processor

2. **API System** (`backend/api/`)
   - Request validators
   - Error handlers
   - Endpoint routing

3. **Configuration Management** (`backend/config/`)
   - Country profiles manager
   - HS codes database
   - Settings management

### Data Flow

```
Client Request
    ↓
API Validation Layer
    ↓
Core Calculation Engine
    ↓
Data Processing
    ↓
Response Formatting
    ↓
Client Response
```

## 📊 Key Features

### Tariff Calculations
- **MFN Tariffs**: Calculate Most Favored Nation tariff rates
- **AfCFTA Preferential Rates**: Apply AfCFTA tariff dismantling schedule
- **Savings Analysis**: Compute potential savings from using AfCFTA

### Trade Analysis
- **Bilateral Trade Analysis**: Analyze trade between country pairs
- **Trade Creation Potential**: Estimate trade creation from tariff reductions
- **Market Opportunities**: Identify high-potential trade partners

### Country Intelligence
- **Economic Profiles**: Access detailed country economic data
- **Regional Integration**: Understand regional community memberships
- **Investment Climate**: Assess investment potential with ICP scores

### Rules of Origin
- **Sector-Specific Rules**: Access AfCFTA rules of origin by HS code
- **Compliance Requirements**: Understand documentation needs
- **Regional Content**: Calculate value-added requirements

## 🧪 Testing

The system includes comprehensive tests:

```bash
# Run all tests
python -m pytest tests/ -v

# Run specific test suites
python -m pytest tests/unit/ -v          # Unit tests
python -m pytest tests/integration/ -v   # Integration tests
python -m pytest tests/config/ -v        # Configuration tests
```

**Test Coverage**:
- ✅ 52 tests passing
- ✅ Unit tests for all core modules
- ✅ Configuration validation tests
- ✅ API integration tests

## 📖 Code Examples

### Calculate AfCFTA Duty

```python
from backend.core.duty_calculator import AfCFTADutyCalculator

calculator = AfCFTADutyCalculator()
result = calculator.calculate_duty(
    value=10000.0,
    base_rate=15.0,
    category='B',
    is_ldc=False
)

print(f"AfCFTA Rate: {result['afcfta_rate']}%")
print(f"Savings: ${result['afcfta_amount']:.2f}")
```

### Analyze Trade Flow

```python
from backend.core.trade_analyzer import TradeAnalyzer

analyzer = TradeAnalyzer()
analysis = analyzer.analyze_bilateral_trade(
    origin_country={'code': 'KE', 'name': 'Kenya'},
    destination_country={'code': 'NG', 'name': 'Nigeria'},
    hs_code="010121",
    value=100000.0
)

print(f"Market Size: {analysis['market_assessment']['size_category']}")
```

### Calculate ICP Score

```python
from backend.core.icp_score import ICPScoreCalculator

calculator = ICPScoreCalculator()
result = calculator.calculate_score(
    origin_country={'code': 'KE', 'gdp_usd': 110e9},
    destination_country={'code': 'NG', 'gdp_usd': 440e9}
)

print(f"ICP Score: {result['icp_score']}")
print(f"Rating: {result['rating']}")
```

## 🌍 Coverage

### Geographic Coverage
- **54 AfCFTA Member Countries**
- All African regions (North, East, West, Central, Southern)
- Regional Economic Communities (ECOWAS, EAC, SADC, COMESA, CEMAC, AMU)

### Product Coverage
- **97 HS2 Sectors** with specific rules of origin
- Full HS6 classification support
- Sector-specific tariff rates and categories

### Data Sources
- World Bank - Economic indicators
- UNCTAD - Tariff data
- AfDB - African Economic Outlook
- IMF - Regional projections
- OEC - Trade complexity data

## 🔧 Technology Stack

- **Backend**: Python 3.8+, FastAPI, Pydantic
- **Database**: MongoDB
- **Frontend**: React, Shadcn/UI
- **Testing**: pytest
- **Documentation**: Markdown

## 📝 Best Practices

### Development
1. Use virtual environments for Python dependencies
2. Run tests before committing changes
3. Follow the existing code structure
4. Document new features in code comments

### Production
1. Use environment-specific configurations
2. Enable HTTPS for all API endpoints
3. Set appropriate rate limits
4. Monitor API usage and performance
5. Use production-grade WSGI server (gunicorn)

### Security
1. Never commit `.env` files
2. Use strong database passwords
3. Restrict CORS origins in production
4. Enable rate limiting
5. Regularly update dependencies

## 🆘 Support

### Getting Help

1. **Documentation**: Check this documentation first
2. **Issues**: Open a GitHub issue for bugs
3. **Discussions**: Use GitHub discussions for questions

### Common Issues

See [Setup Instructions - Troubleshooting](SETUP.md#troubleshooting) for solutions to common issues.

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Submit a pull request

## 📚 Additional Resources

- [AfCFTA Official Website](https://au-afcfta.org/)
- [World Bank Open Data](https://data.worldbank.org/)
- [UNCTAD Trade Statistics](https://unctadstat.unctad.org/)
- [HS Code Classification](https://www.wcoomd.org/en/topics/nomenclature/overview.aspx)

## 📞 Contact

For issues and questions:
- GitHub: [aouggad-web/zlecaf-project-](https://github.com/aouggad-web/zlecaf-project-)
- Issues: [GitHub Issues](https://github.com/aouggad-web/zlecaf-project-/issues)

---

**Last Updated**: 2024-01-15
**Version**: 2.0.0
