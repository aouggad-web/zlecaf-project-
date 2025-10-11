# Customs Information Feature

## Overview

The Customs Information feature provides detailed customs administration data for African countries in the ZLECAf system. This feature allows users to easily access official customs websites, administration names, and important customs offices for member countries.

## Data Structure

Each country with customs information includes the following fields:

```json
{
  "pays": "Country name",
  "administration_douaniere": "Official customs administration name",
  "site_web": "Official customs website URL",
  "bureaux_importants": [
    "Important customs office 1 (Type)",
    "Important customs office 2 (Type)",
    "Important customs office 3 (Type)"
  ]
}
```

### Field Descriptions

- **pays**: The name of the country in French
- **administration_douaniere**: The official name of the country's customs authority
- **site_web**: The URL of the official customs website
- **bureaux_importants**: A list of key customs offices, including ports, airports, and land border crossings

## API Integration

### Endpoint

The customs information is included in the country profile endpoint:

```
GET /api/country-profile/{country_code}
```

### Response Example

```json
{
  "country_code": "MA",
  "country_name": "Maroc",
  "population": 37800000,
  "gdp_usd": 142.0,
  "region": "Afrique du Nord",
  "customs_information": {
    "pays": "Maroc",
    "administration_douaniere": "Administration des Douanes et Impôts Indirects (ADII)",
    "site_web": "https://www.douane.gov.ma/",
    "bureaux_importants": [
      "Port de Tanger Med (Port)",
      "Port de Casablanca (Port)",
      "Aéroport Mohammed V de Casablanca (Aéroport)"
    ]
  },
  "projections": { ... },
  "risk_ratings": { ... }
}
```

### Handling Countries Without Customs Information

For countries that don't yet have customs information in the system, the `customs_information` field will be `null`:

```json
{
  "country_code": "BJ",
  "country_name": "Bénin",
  "customs_information": null,
  ...
}
```

## Currently Available Countries

The following countries have customs information available:

1. **Morocco (MA)** - Administration des Douanes et Impôts Indirects (ADII)
2. **Kenya (KE)** - Kenya Revenue Authority (KRA) - Customs and Border Control
3. **Nigeria (NG)** - Nigeria Customs Service (NCS)
4. **South Africa (ZA)** - South African Revenue Service (SARS) - Customs Division
5. **Egypt (EG)** - Egyptian Customs Authority

## Data Format Standards

### Important Offices Format

Each important office entry follows this format:
```
"Office Name (Type)"
```

Types include:
- **(Port)** - Seaports
- **(Aéroport)** - International airports
- **(Frontière terrestre)** - Land border crossings

### Example

```
"Port de Mombasa (Port)"
"Aéroport international Jomo Kenyatta de Nairobi (Aéroport)"
"Poste frontalier de Malaba (Frontière terrestre avec l'Ouganda)"
```

## Usage in Client Applications

### JavaScript/TypeScript Example

```typescript
interface CustomsInformation {
  pays: string;
  administration_douaniere: string;
  site_web: string;
  bureaux_importants: string[];
}

interface CountryProfile {
  country_code: string;
  country_name: string;
  customs_information?: CustomsInformation | null;
  // ... other fields
}

// Fetch country profile with customs information
const response = await fetch('/api/country-profile/MA');
const profile: CountryProfile = await response.json();

if (profile.customs_information) {
  console.log('Customs Website:', profile.customs_information.site_web);
  console.log('Important Offices:', profile.customs_information.bureaux_importants);
}
```

### Python Example

```python
import requests

# Fetch country profile
response = requests.get('https://your-api.com/api/country-profile/MA')
profile = response.json()

# Access customs information
if profile.get('customs_information'):
    customs = profile['customs_information']
    print(f"Administration: {customs['administration_douaniere']}")
    print(f"Website: {customs['site_web']}")
    
    print("\nImportant Offices:")
    for office in customs['bureaux_importants']:
        print(f"  - {office}")
```

## Testing

The feature includes comprehensive tests covering:

1. **Structure validation** - Ensures all required fields are present
2. **Multiple countries** - Validates data for all countries with customs info
3. **Graceful handling** - Verifies countries without data return null
4. **Data format** - Checks that office entries include type indicators
5. **Country-specific details** - Tests specific customs information per country

Run tests with:
```bash
pytest tests/test_customs_information.py -v
```

## Adding Customs Information for New Countries

To add customs information for a new country:

1. Open `backend/country_data.py`
2. Locate the country's data entry (using ISO3 code)
3. Add a `customs_information` section with the required fields:

```python
"ISO3": {
    "name": "Country Name",
    # ... existing fields ...
    "customs_information": {
        "pays": "Country Name",
        "administration_douaniere": "Official Name",
        "site_web": "https://customs.website.com/",
        "bureaux_importants": [
            "Office 1 (Type)",
            "Office 2 (Type)",
            "Office 3 (Type)"
        ]
    }
}
```

4. Run tests to validate the data:
```bash
pytest tests/test_customs_information.py
```

## Future Enhancements

Potential improvements for this feature:

1. Add contact information (phone, email) for customs offices
2. Include operating hours for major customs offices
3. Add geolocation data for customs offices
4. Provide additional services available at each office
5. Include processing times and typical wait times
6. Add customs procedures and documentation requirements per country

## Related Documentation

- [API Documentation](../README.md)
- [Country Data Structure](ZLECAF_COUNTRIES_DATA_EXTRACTION.md)
- [Testing Guide](../tests/test_customs_information.py)

## Support

For questions or issues related to customs information:
- Open an issue on the GitHub repository
- Contact the development team
- Refer to the test cases for usage examples
