# API Documentation

Complete reference for the AfCFTA Trade Analysis System API.

## Base URL

```
Production: https://your-domain.com/api
Development: http://localhost:8000/api
```

## Table of Contents

- [Health & Status](#health--status)
- [Countries](#countries)
- [Tariff Calculations](#tariff-calculations)
- [Rules of Origin](#rules-of-origin)
- [Trade Statistics](#trade-statistics)
- [Error Responses](#error-responses)

## Health & Status

### Simple Health Check

Check if the API is running.

```
GET /health
```

**Response**:
```json
{
  "status": "healthy",
  "service": "ZLECAf API",
  "version": "2.0.0",
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

### Detailed Health Status

Get detailed system health information.

```
GET /health/status
```

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:00:00.000Z",
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

## Countries

### List All Countries

Get list of all 54 AfCFTA member countries.

```
GET /countries
```

**Response**:
```json
[
  {
    "code": "DZ",
    "name": "Algeria",
    "region": "North Africa",
    "iso3": "DZA",
    "wb_code": "DZA",
    "population": 44700000
  },
  ...
]
```

### Get Country Profile

Get detailed economic profile for a specific country.

```
GET /country-profile/{country_code}
```

**Parameters**:
- `country_code` (path, required): Two-letter country code (e.g., "KE")

**Response**:
```json
{
  "country_code": "KE",
  "country_name": "Kenya",
  "population": 54000000,
  "gdp_usd": 110000000000,
  "gdp_per_capita": 2037,
  "inflation_rate": 7.5,
  "region": "East Africa",
  "trade_profile": {
    "main_exports": ["Tea", "Coffee", "Flowers"],
    "main_imports": ["Petroleum", "Machinery", "Vehicles"]
  },
  "projections": {
    "gdp_growth_forecast_2024": "5.5%",
    "gdp_growth_projection_2025": "5.8%",
    "gdp_growth_projection_2026": "6.0%",
    "development_index": 0.601,
    "africa_rank": 7,
    "key_sectors": [...],
    "zlecaf_potential_level": "High",
    "zlecaf_opportunities": [...]
  },
  "risk_ratings": {
    "sp": "B+",
    "moodys": "B2",
    "fitch": "B+",
    "global_risk": "Moderate"
  }
}
```

## Tariff Calculations

### Calculate Tariff

Calculate MFN and AfCFTA tariffs for a trade transaction.

```
POST /calculate-tariff
```

**Request Body**:
```json
{
  "origin_country": "KE",
  "destination_country": "NG",
  "hs_code": "010121",
  "value": 100000
}
```

**Parameters**:
- `origin_country` (required): Origin country code (2 letters)
- `destination_country` (required): Destination country code (2 letters)
- `hs_code` (required): HS code (6 digits)
- `value` (required): Merchandise value in USD (positive number)

**Validation Rules**:
- Country codes must be 2 letters
- Both countries must be AfCFTA members
- Origin and destination must be different
- HS code must be exactly 6 digits
- Value must be greater than 0

**Response**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "origin_country": "KE",
  "destination_country": "NG",
  "hs_code": "010121",
  "value": 100000,
  "normal_tariff_rate": 15.0,
  "normal_tariff_amount": 15000.0,
  "zlecaf_tariff_rate": 7.5,
  "zlecaf_tariff_amount": 7500.0,
  "savings": 7500.0,
  "savings_percentage": 50.0,
  "rules_of_origin": {
    "rule": "Wholly obtained or substantially transformed",
    "requirement": "35% African value added",
    "regional_content": 35
  },
  "top_african_producers": [
    {
      "country_code": "KEN",
      "country_name": "Kenya",
      "export_value": 50000000,
      "year": 2021
    }
  ],
  "origin_country_data": {...},
  "destination_country_data": {...},
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

**Response Fields**:
- `id`: Unique calculation ID
- `normal_tariff_rate`: MFN tariff rate (%)
- `normal_tariff_amount`: MFN duty amount (USD)
- `zlecaf_tariff_rate`: AfCFTA preferential rate (%)
- `zlecaf_tariff_amount`: AfCFTA duty amount (USD)
- `savings`: Amount saved using AfCFTA (USD)
- `savings_percentage`: Percentage savings (%)
- `rules_of_origin`: Applicable AfCFTA rules
- `top_african_producers`: Top 5 African producers of the product
- `timestamp`: Calculation timestamp

## Rules of Origin

### Get Rules by HS Code

Get AfCFTA rules of origin for a specific HS code.

```
GET /rules-of-origin/{hs_code}
```

**Parameters**:
- `hs_code` (path, required): HS code (6 digits)

**Response**:
```json
{
  "hs_code": "010121",
  "sector_code": "01",
  "rules": {
    "rule": "Wholly obtained or substantially transformed",
    "requirement": "35% African value added",
    "regional_content": 35
  },
  "explanation": {
    "rule_type": "Wholly obtained or substantially transformed",
    "requirement": "35% African value added",
    "regional_content_minimum": "35%",
    "documentation_required": [
      "Certificate of origin AfCFTA",
      "Commercial invoice",
      "Packing list",
      "Supplier declaration"
    ],
    "validity_period": "12 months",
    "issuing_authority": "Competent authority of exporting country"
  }
}
```

**HS Code Sectors**:
- HS codes are classified into 97 sectors (HS2 level)
- Different sectors have different origin rules
- Regional content requirements vary by sector

## Trade Statistics

### Get Comprehensive Statistics

Get AfCFTA trade statistics and projections.

```
GET /statistics
```

**Response**:
```json
{
  "intra_african_trade": {
    "current_value_usd": 192000000000,
    "percentage_of_total": 14.5,
    "growth_rate_yoy": 5.2
  },
  "zlecaf_impact": {
    "average_tariff_reduction": 10.5,
    "estimated_trade_creation": "52 billion USD by 2025",
    "job_creation_potential": "1.2 million jobs"
  },
  "top_trading_pairs": [
    {
      "origin": "ZA",
      "destination": "NG",
      "trade_value_usd": 5000000000
    }
  ],
  "projections": {
    "2025": {
      "intra_african_trade_usd": 250000000000,
      "trade_creation_usd": 52000000000
    },
    "2030": {
      "intra_african_trade_usd": 300000000000,
      "trade_creation_usd": 90000000000
    }
  }
}
```

## Error Responses

The API uses standard HTTP status codes and returns structured error responses.

### Status Codes

- `200 OK`: Successful request
- `400 Bad Request`: Invalid request parameters
- `404 Not Found`: Resource not found
- `422 Unprocessable Entity`: Validation error
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

### Error Response Format

```json
{
  "error": "Error Type",
  "message": "Human-readable error message",
  "details": {
    "field": "field_name",
    "error": "Specific error detail"
  },
  "path": "/api/endpoint"
}
```

### Validation Error Example

```json
{
  "error": "Validation Error",
  "message": "Request validation failed",
  "details": [
    {
      "field": "hs_code",
      "message": "HS code must be exactly 6 digits",
      "type": "value_error"
    },
    {
      "field": "value",
      "message": "Value must be greater than 0",
      "type": "value_error"
    }
  ],
  "path": "/api/calculate-tariff"
}
```

### Country Not Found Example

```json
{
  "error": "Not Found",
  "message": "Country 'XX' not found or not an AfCFTA member",
  "path": "/api/country-profile/XX"
}
```

### Rate Limit Example

```json
{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Please try again later.",
  "retry_after": 60,
  "path": "/api/calculate-tariff"
}
```

## Rate Limiting

- **Default Limit**: 60 requests per minute per IP address
- **Rate Limit Headers**:
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Requests remaining
  - `X-RateLimit-Reset`: Unix timestamp when limit resets

## Best Practices

1. **Validate Input**: Check inputs before making requests
2. **Handle Errors**: Implement proper error handling
3. **Respect Rate Limits**: Monitor headers and implement backoff
4. **Cache Data**: Cache static data like country lists
5. **Use HTTPS**: Always use HTTPS in production

## Code Examples

### JavaScript/Node.js

```javascript
const axios = require('axios');

async function calculateTariff() {
  try {
    const response = await axios.post('http://localhost:8000/api/calculate-tariff', {
      origin_country: 'KE',
      destination_country: 'NG',
      hs_code: '010121',
      value: 100000
    });
    
    console.log(`Savings: $${response.data.savings}`);
  } catch (error) {
    if (error.response) {
      console.error('Error:', error.response.data.message);
    }
  }
}
```

### Python

```python
import requests

def calculate_tariff():
    url = 'http://localhost:8000/api/calculate-tariff'
    data = {
        'origin_country': 'KE',
        'destination_country': 'NG',
        'hs_code': '010121',
        'value': 100000
    }
    
    try:
        response = requests.post(url, json=data)
        response.raise_for_status()
        result = response.json()
        print(f"Savings: ${result['savings']:.2f}")
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
```

### cURL

```bash
# Calculate tariff
curl -X POST http://localhost:8000/api/calculate-tariff \
  -H "Content-Type: application/json" \
  -d '{
    "origin_country": "KE",
    "destination_country": "NG",
    "hs_code": "010121",
    "value": 100000
  }'

# Get country profile
curl http://localhost:8000/api/country-profile/KE

# Get rules of origin
curl http://localhost:8000/api/rules-of-origin/010121
```

## Support

For issues or questions:
- GitHub Issues: [Repository Issues](https://github.com/aouggad-web/zlecaf-project-/issues)
- Documentation: [docs/](../README.md)
