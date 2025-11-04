# Configuration Guide

This guide explains how to configure the AfCFTA Trade Analysis System for different environments and use cases.

## Configuration Files

### Environment Variables (.env)

The primary configuration method is through environment variables. Create a `.env` file in the `backend` directory.

**Example `.env` file**:

```env
# Application Settings
APP_NAME=AfCFTA Trade Analysis System
APP_VERSION=2.0.0
ENVIRONMENT=production
DEBUG=false

# API Settings
API_PREFIX=/api
RATE_LIMIT_PER_MINUTE=60

# Database
MONGO_URL=mongodb://localhost:27017
DB_NAME=zlecaf_db

# Logging
LOG_LEVEL=INFO
LOG_FORMAT=%(asctime)s - %(name)s - %(levelname)s - %(message)s

# Calculation Settings
AFCFTA_START_YEAR=2021
DEFAULT_TRADE_ELASTICITY=1.5

# External APIs
ENABLE_EXTERNAL_APIS=true
WORLDBANK_API_URL=https://api.worldbank.org/v2
OEC_API_URL=https://api-v2.oec.world
EXTERNAL_API_TIMEOUT=30

# Feature Flags
ENABLE_CACHING=true
ENABLE_RATE_LIMITING=true

# CORS
CORS_ORIGINS=http://localhost:3000,https://your-domain.com
```

## Configuration Sections

### 1. Application Settings

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `APP_NAME` | string | "AfCFTA Trade Analysis System" | Application name |
| `APP_VERSION` | string | "2.0.0" | Application version |
| `ENVIRONMENT` | string | "production" | Environment (development, production, test) |
| `DEBUG` | boolean | false | Enable debug mode |

**Environments**:
- `development`: Local development with debug enabled
- `production`: Production deployment with optimizations
- `test`: Testing environment

### 2. API Settings

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `API_PREFIX` | string | "/api" | API URL prefix |
| `RATE_LIMIT_PER_MINUTE` | integer | 60 | Maximum requests per minute per IP |

**Rate Limiting**:
- Adjust `RATE_LIMIT_PER_MINUTE` based on your traffic
- Set to 0 to disable rate limiting (not recommended in production)
- Consider different limits for authenticated vs. anonymous users

### 3. Database Settings

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `MONGO_URL` | string | "mongodb://localhost:27017" | MongoDB connection URL |
| `DB_NAME` | string | "zlecaf_db" | Database name |

**MongoDB Configuration**:

**Local Development**:
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=zlecaf_dev
```

**Production with Authentication**:
```env
MONGO_URL=mongodb://username:password@host:27017/?authSource=admin
DB_NAME=zlecaf_prod
```

**MongoDB Atlas**:
```env
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
DB_NAME=zlecaf_prod
```

### 4. Logging Settings

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `LOG_LEVEL` | string | "INFO" | Logging level |
| `LOG_FORMAT` | string | Standard format | Log message format |

**Log Levels** (from most to least verbose):
- `DEBUG`: Detailed information for debugging
- `INFO`: General informational messages
- `WARNING`: Warning messages for potential issues
- `ERROR`: Error messages for failures
- `CRITICAL`: Critical errors requiring immediate attention

**Recommended Levels by Environment**:
- Development: `DEBUG`
- Production: `WARNING` or `ERROR`
- Testing: `INFO`

### 5. Calculation Settings

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `AFCFTA_START_YEAR` | integer | 2021 | AfCFTA implementation start year |
| `DEFAULT_TRADE_ELASTICITY` | float | 1.5 | Default trade elasticity for projections |

**Trade Elasticity**:
- Higher values (2.0-3.0): More responsive trade to tariff changes
- Lower values (1.0-1.5): More conservative projections
- Adjust based on sector or historical data

### 6. External APIs

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `ENABLE_EXTERNAL_APIS` | boolean | true | Enable external API integrations |
| `WORLDBANK_API_URL` | string | World Bank API URL | World Bank API endpoint |
| `OEC_API_URL` | string | OEC API URL | Observatory of Economic Complexity API |
| `EXTERNAL_API_TIMEOUT` | integer | 30 | Timeout for external API calls (seconds) |

**Disabling External APIs**:
Set `ENABLE_EXTERNAL_APIS=false` to use only internal data. This improves response times but reduces data freshness.

### 7. Feature Flags

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `ENABLE_CACHING` | boolean | true | Enable response caching |
| `ENABLE_RATE_LIMITING` | boolean | true | Enable API rate limiting |
| `CACHE_TTL_SECONDS` | integer | 3600 | Cache time-to-live in seconds |

**Caching Strategy**:
- Enable in production for better performance
- Disable in development for real-time data
- Adjust TTL based on data volatility

### 8. CORS Configuration

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `CORS_ORIGINS` | string | "*" | Comma-separated list of allowed origins |

**CORS Examples**:

**Development (allow all)**:
```env
CORS_ORIGINS=*
```

**Production (specific origins)**:
```env
CORS_ORIGINS=https://your-domain.com,https://www.your-domain.com
```

## Country Profiles Configuration

Country profiles are managed through the `CountryProfileManager`. Configuration is done in code:

```python
from backend.config.country_profiles import CountryProfileManager

# Initialize with country data
manager = CountryProfileManager(countries_data)

# Check if country is LDC
is_ldc = manager.is_ldc("BF")  # Burkina Faso

# Get regional communities
communities = manager.get_regional_communities("KE")  # Kenya

# Get common communities between countries
common = manager.get_common_communities("KE", "UG")
```

### Adding Custom Country Data

To add or update country profiles, modify the country data source:

```python
# In backend/country_data.py
REAL_COUNTRY_DATA = {
    'KEN': {
        'iso3': 'KEN',
        'population_2024': 54000000,
        'gdp_usd_2024': 110000000000,
        'gdp_per_capita_2024': 2037,
        # ... more fields
    },
    # ... other countries
}
```

## HS Codes Configuration

HS code classifications are managed through the `HSCodeManager`:

```python
from backend.config.hs_codes import HSCodeManager

manager = HSCodeManager()

# Get sector information
info = manager.get_hs2_info("010121")

# Search sectors
results = manager.search_sectors("textile")

# Validate HS code
validation = manager.validate_hs_code("010121")
```

## Production Recommendations

### Security

1. **Never commit `.env` files** to version control
2. **Use strong database passwords** in production
3. **Enable HTTPS** for all API endpoints
4. **Restrict CORS origins** to known domains
5. **Enable rate limiting** to prevent abuse

### Performance

1. **Enable caching** with appropriate TTL
2. **Use connection pooling** for database
3. **Set appropriate rate limits** based on capacity
4. **Monitor external API usage** to avoid timeouts
5. **Use production WSGI server** (gunicorn, uvicorn)

### Monitoring

1. **Set log level to WARNING or ERROR** to reduce noise
2. **Configure log aggregation** (ELK, Splunk)
3. **Monitor API response times**
4. **Track rate limit violations**
5. **Set up health check monitoring**

### Example Production Configuration

```env
# Production settings
ENVIRONMENT=production
DEBUG=false
LOG_LEVEL=WARNING

# Security
CORS_ORIGINS=https://your-domain.com,https://api.your-domain.com

# Performance
ENABLE_CACHING=true
CACHE_TTL_SECONDS=7200
RATE_LIMIT_PER_MINUTE=120

# Database (use strong credentials)
MONGO_URL=mongodb://username:password@prod-mongo:27017/?authSource=admin
DB_NAME=zlecaf_prod

# External APIs (with timeouts)
ENABLE_EXTERNAL_APIS=true
EXTERNAL_API_TIMEOUT=15
```

## Development Configuration

```env
# Development settings
ENVIRONMENT=development
DEBUG=true
LOG_LEVEL=DEBUG

# Local database
MONGO_URL=mongodb://localhost:27017
DB_NAME=zlecaf_dev

# Relaxed CORS
CORS_ORIGINS=*

# Disable rate limiting for easier testing
ENABLE_RATE_LIMITING=false

# Fast external API timeouts
EXTERNAL_API_TIMEOUT=5
```

## Testing Configuration

```env
# Test settings
ENVIRONMENT=test
DEBUG=false
LOG_LEVEL=INFO

# Test database
MONGO_URL=mongodb://localhost:27017
DB_NAME=zlecaf_test

# Disable external APIs in tests
ENABLE_EXTERNAL_APIS=false

# Disable caching for fresh data
ENABLE_CACHING=false
```

## Configuration Validation

Run configuration validation:

```python
from backend.config.settings import get_settings

settings = get_settings()
validation = settings.validate_settings()

if not validation['is_valid']:
    print("Configuration errors:")
    for error in validation['errors']:
        print(f"  - {error}")

if validation['warnings']:
    print("Configuration warnings:")
    for warning in validation['warnings']:
        print(f"  - {warning}")
```

## Next Steps

- See [Setup Instructions](SETUP.md) for installation
- Read [Usage Guide](USAGE.md) for API usage
- Check [API Documentation](api/README.md) for endpoints
