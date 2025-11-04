# Usage Guide

This guide demonstrates how to use the AfCFTA Trade Analysis System API.

## Overview

The AfCFTA Trade Analysis System provides a comprehensive API for:
- Calculating tariffs (MFN and AfCFTA preferential rates)
- Analyzing trade flows between African countries
- Accessing country economic profiles
- Retrieving rules of origin information
- Computing trade creation potential

## Base URL

```
http://localhost:8000/api  # Development
https://your-domain.com/api  # Production
```

## Authentication

Currently, the API is open and does not require authentication. Rate limiting applies based on IP address.

## Core Endpoints

### 1. Calculate Tariffs

Calculate both MFN and AfCFTA tariffs for a trade transaction.

**Endpoint**: `POST /api/calculate-tariff`

**Request Body**:
```json
{
  "origin_country": "KE",
  "destination_country": "NG",
  "hs_code": "010121",
  "value": 100000
}
```

**Response**:
```json
{
  "id": "uuid",
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
  "rules_of_origin": {...},
  "timestamp": "2024-01-15T10:00:00"
}
```

**Example with cURL**:
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

**Example with Python**:
```python
import requests

url = "http://localhost:8000/api/calculate-tariff"
data = {
    "origin_country": "KE",
    "destination_country": "NG",
    "hs_code": "010121",
    "value": 100000
}

response = requests.post(url, json=data)
result = response.json()
print(f"Savings: ${result['savings']:.2f}")
```

### 2. Get Country Profile

Retrieve detailed economic profile for an AfCFTA member country.

**Endpoint**: `GET /api/country-profile/{country_code}`

**Example**:
```bash
curl http://localhost:8000/api/country-profile/KE
```

**Response**:
```json
{
  "country_code": "KE",
  "country_name": "Kenya",
  "population": 54000000,
  "gdp_usd": 110000000000,
  "gdp_per_capita": 2037,
  "region": "East Africa",
  "projections": {
    "gdp_growth_forecast_2024": "5.5%",
    "development_index": 0.601,
    "key_sectors": [...]
  },
  "risk_ratings": {...}
}
```

### 3. Get Rules of Origin

Retrieve AfCFTA rules of origin for a specific HS code.

**Endpoint**: `GET /api/rules-of-origin/{hs_code}`

**Example**:
```bash
curl http://localhost:8000/api/rules-of-origin/010121
```

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
    "documentation_required": [...],
    "validity_period": "12 months"
  }
}
```

### 4. Get All Countries

List all 54 AfCFTA member countries.

**Endpoint**: `GET /api/countries`

**Example**:
```bash
curl http://localhost:8000/api/countries
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

### 5. Get Trade Statistics

Retrieve comprehensive AfCFTA trade statistics.

**Endpoint**: `GET /api/statistics`

**Example**:
```bash
curl http://localhost:8000/api/statistics
```

## Using the Core Modules

### AfCFTA Duty Calculator

```python
from backend.core.duty_calculator import AfCFTADutyCalculator

calculator = AfCFTADutyCalculator()

# Calculate AfCFTA duty
result = calculator.calculate_duty(
    value=10000.0,
    base_rate=15.0,
    category='B',  # Category B: 5-year elimination
    is_ldc=False
)

print(f"AfCFTA Rate: {result['afcfta_rate']}%")
print(f"AfCFTA Amount: ${result['afcfta_amount']:.2f}")
```

### MFN Duty Calculator

```python
from backend.core.mfn_calculator import MFNDutyCalculator

calculator = MFNDutyCalculator()

# Calculate MFN duty
result = calculator.calculate_duty(
    value=10000.0,
    hs_code="010121",
    country_code="KE"
)

print(f"MFN Rate: {result['mfn_rate']}%")
print(f"MFN Amount: ${result['mfn_amount']:.2f}")
```

### ICP Score Calculator

```python
from backend.core.icp_score import ICPScoreCalculator

calculator = ICPScoreCalculator()

# Calculate ICP score
result = calculator.calculate_score(
    origin_country={'code': 'KE', 'gdp_usd': 110e9, ...},
    destination_country={'code': 'NG', 'gdp_usd': 440e9, ...}
)

print(f"ICP Score: {result['icp_score']}")
print(f"Rating: {result['rating']}")
print(f"Recommendations: {result['recommendations']}")
```

### Trade Analyzer

```python
from backend.core.trade_analyzer import TradeAnalyzer

analyzer = TradeAnalyzer()

# Analyze bilateral trade
analysis = analyzer.analyze_bilateral_trade(
    origin_country={'code': 'KE', 'name': 'Kenya', ...},
    destination_country={'code': 'NG', 'name': 'Nigeria', ...},
    hs_code="010121",
    value=100000.0
)

print(f"Trade Intensity: {analysis['trade_intensity']}")
print(f"Market Assessment: {analysis['market_assessment']}")
```

### Data Processor

```python
from backend.core.data_processor import DataProcessor

processor = DataProcessor()

# Validate HS code
result = processor.validate_hs_code("010121")
if result['is_valid']:
    print(f"Valid HS code: {result['hs6']}")

# Validate country code
result = processor.validate_country_code("KE")
if result['is_valid']:
    print(f"Valid country: {result['cleaned']}")

# Validate trade value
result = processor.validate_trade_value(10000.0)
if result['is_valid']:
    print(f"Valid value: ${result['numeric_value']:.2f}")
```

## Error Handling

The API returns standard HTTP status codes:

- `200 OK`: Successful request
- `400 Bad Request`: Invalid input parameters
- `404 Not Found`: Resource not found
- `422 Unprocessable Entity`: Validation error
- `500 Internal Server Error`: Server error

**Error Response Format**:
```json
{
  "error": "Validation Error",
  "message": "Request validation failed",
  "details": [
    {
      "field": "hs_code",
      "message": "HS code must be exactly 6 digits",
      "type": "value_error"
    }
  ]
}
```

## Rate Limits

- Default: 60 requests per minute per IP address
- Exceeded limit returns: `429 Too Many Requests`

## Best Practices

1. **Validate Input**: Always validate HS codes and country codes before making requests
2. **Handle Errors**: Implement proper error handling for API failures
3. **Cache Results**: Cache frequently accessed data like country lists
4. **Use Batch Operations**: When possible, batch multiple calculations
5. **Monitor Usage**: Keep track of API usage to stay within rate limits

## Examples

### Calculate Savings for Multiple Products

```python
import requests

products = [
    {"hs_code": "010121", "value": 10000},
    {"hs_code": "080300", "value": 15000},
    {"hs_code": "610910", "value": 20000},
]

url = "http://localhost:8000/api/calculate-tariff"
total_savings = 0

for product in products:
    data = {
        "origin_country": "KE",
        "destination_country": "NG",
        "hs_code": product["hs_code"],
        "value": product["value"]
    }
    
    response = requests.post(url, json=data)
    result = response.json()
    total_savings += result['savings']
    
    print(f"Product {product['hs_code']}: ${result['savings']:.2f} savings")

print(f"\nTotal savings: ${total_savings:.2f}")
```

### Analyze Trade Opportunities

```python
import requests

# Get all countries
countries_url = "http://localhost:8000/api/countries"
countries = requests.get(countries_url).json()

# Analyze opportunities for Kenya
origin = "KE"
opportunities = []

for country in countries[:10]:  # Analyze first 10 countries
    if country['code'] == origin:
        continue
    
    data = {
        "origin_country": origin,
        "destination_country": country['code'],
        "hs_code": "080300",  # Bananas
        "value": 50000
    }
    
    response = requests.post("http://localhost:8000/api/calculate-tariff", json=data)
    result = response.json()
    
    opportunities.append({
        'country': country['name'],
        'savings': result['savings'],
        'savings_pct': result['savings_percentage']
    })

# Sort by savings
opportunities.sort(key=lambda x: x['savings'], reverse=True)

print("Top trade opportunities:")
for opp in opportunities[:5]:
    print(f"  {opp['country']}: ${opp['savings']:.2f} ({opp['savings_pct']:.1f}%)")
```

## Next Steps

- Read the [API Documentation](api/README.md) for complete endpoint reference
- Check the [Configuration Guide](CONFIGURATION.md) for advanced settings
- See the [Setup Instructions](SETUP.md) for installation help
