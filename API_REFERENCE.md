# ZLECAf API Reference

Base URL: `http://localhost:8000/api`

## Endpoints

### 1. API Root
**GET** `/api/`

Returns API information and version.

**Response:**
```json
{
  "message": "Système Commercial ZLECAf API - Version Complète"
}
```

---

### 2. List Countries
**GET** `/api/countries`

Returns the list of all 54 African countries in the ZLECAf.

**Response:**
```json
[
  {
    "code": "DZ",
    "name": "Algérie",
    "region": "Afrique du Nord",
    "iso3": "DZA",
    "wb_code": "DZA",
    "population": 44700000
  },
  ...
]
```

**Example:**
```bash
curl http://localhost:8000/api/countries
```

---

### 3. Get Country Profile
**GET** `/api/country-profile/{country_code}`

Returns detailed economic profile for a specific country.

**Parameters:**
- `country_code` (path) - Two-letter country code (e.g., DZ, NG, EG)

**Response:**
```json
{
  "country_code": "DZ",
  "country_name": "Algérie",
  "population": 46700000,
  "gdp_usd": 269.128,
  "gdp_per_capita": 5765.0,
  "region": "Afrique du Nord",
  "trade_profile": {
    "exports_2024_mds_usd": 45.2,
    "imports_2024_mds_usd": 38.9,
    "trade_balance_2024_mds_usd": 6.3,
    "main_exports": ["Hydrocarbures", "Produits chimiques"],
    "main_imports": ["Machines", "Produits alimentaires"]
  },
  "projections": {
    "gdp_growth_forecast_2024": "3.8%",
    "gdp_growth_projection_2025": "4.1%",
    "gdp_growth_projection_2026": "4.3%"
  },
  "risk_ratings": {
    "sp": "BBB-",
    "moodys": "Ba1",
    "fitch": "BBB-"
  }
}
```

**Example:**
```bash
curl http://localhost:8000/api/country-profile/DZ
```

---

### 4. Get Rules of Origin
**GET** `/api/rules-of-origin/{hs_code}`

Returns the ZLECAf rules of origin for a specific Harmonized System (HS) code.

**Parameters:**
- `hs_code` (path) - 6-digit HS code (e.g., 010121)

**Response:**
```json
{
  "hs_code": "010121",
  "sector_code": "01",
  "rules": {
    "rule": "Entièrement obtenus",
    "requirement": "100% africain",
    "regional_content": 100
  },
  "explanation": {
    "rule_type": "Entièrement obtenus",
    "requirement": "100% africain",
    "regional_content_minimum": "100%",
    "documentation_required": [
      "Certificat d'origine ZLECAf",
      "Facture commerciale",
      "Liste de colisage",
      "Document de transport"
    ]
  }
}
```

**Example:**
```bash
curl http://localhost:8000/api/rules-of-origin/010121
```

---

### 5. Calculate Tariff
**POST** `/api/calculate-tariff`

Calculates comprehensive tariff information between two countries.

**Request Body:**
```json
{
  "origin_country": "NG",
  "destination_country": "EG",
  "hs_code": "010121",
  "value": 100000,
  "currency": "USD"
}
```

**Response:**
```json
{
  "id": "calc_xxx",
  "origin_country": "NG",
  "destination_country": "EG",
  "hs_code": "010121",
  "value": 100000,
  "currency": "USD",
  "normal_tariff_rate": 20.0,
  "zlecaf_tariff_rate": 0.0,
  "normal_tariff_amount": 20000.0,
  "zlecaf_tariff_amount": 0.0,
  "savings": 25000.0,
  "savings_percentage": 75.0,
  "rules_of_origin": {
    "rule": "Entièrement obtenus",
    "requirement": "100% africain",
    "regional_content": 100
  }
}
```

**Example:**
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

---

### 6. Get Statistics
**GET** `/api/statistics`

Returns comprehensive ZLECAf trade statistics.

**Response:**
```json
{
  "member_countries": 54,
  "combined_population": 1350000000,
  "combined_gdp_billions_usd": 3400.0,
  "total_calculations": 5,
  "total_savings": 64500.0,
  "most_active_countries": [
    {"country": "NG", "count": 2},
    {"country": "DZ", "count": 1}
  ],
  "trade_evolution_2023_2024": {
    "intra_african_trade_2023_mds_usd": 188.5,
    "intra_african_trade_2024_mds_usd": 195.2,
    "growth_rate_percent": 3.6
  },
  "projections": {
    "trade_increase_2025_percent": 15,
    "gdp_impact_2030_percent": 52,
    "jobs_creation_millions": 35
  }
}
```

**Example:**
```bash
curl http://localhost:8000/api/statistics
```

---

## Country Codes

| Code | Country | Region |
|------|---------|--------|
| DZ | Algérie (Algeria) | Afrique du Nord |
| AO | Angola | Afrique Centrale |
| BJ | Bénin | Afrique de l'Ouest |
| BW | Botswana | Afrique Australe |
| EG | Égypte (Egypt) | Afrique du Nord |
| ET | Éthiopie (Ethiopia) | Afrique de l'Est |
| GH | Ghana | Afrique de l'Ouest |
| KE | Kenya | Afrique de l'Est |
| MA | Maroc (Morocco) | Afrique du Nord |
| NG | Nigéria (Nigeria) | Afrique de l'Ouest |
| ZA | Afrique du Sud (South Africa) | Afrique Australe |
| ... | (44 more countries) | ... |

Full list available at: `GET /api/countries`

---

## Status Codes

- `200` - Success
- `400` - Bad Request (invalid parameters)
- `404` - Not Found (country or HS code not found)
- `422` - Validation Error
- `500` - Internal Server Error

---

## Interactive Documentation

When the server is running, you can access interactive documentation at:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

---

## Rate Limiting

Currently, there is no rate limiting on the API.

---

## Data Sources

The API uses official data from:
- World Bank Open Data
- International Monetary Fund (IMF)
- African Union
- African Development Bank
- Observatory of Economic Complexity (OEC)
