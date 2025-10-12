# AfCFTA Trade Analysis System - Examples

This directory contains example scripts demonstrating how to use the AfCFTA Trade Analysis System.

## Available Examples

### 1. Complete Analysis Example (`complete_analysis_example.py`)

A comprehensive example demonstrating how to use all core modules together to perform a complete trade analysis between two African countries (Kenya → Nigeria).

**Features Demonstrated**:
- Data validation (HS codes, country codes, trade values)
- HS code classification and sector lookup
- MFN tariff calculation
- AfCFTA preferential tariff calculation
- Savings analysis
- Investment Climate & Potential (ICP) score calculation
- Bilateral trade analysis
- Trade creation potential estimation

**Run the example**:
```bash
cd /path/to/zlecaf-project-
python examples/complete_analysis_example.py
```

**Expected Output**:
```
======================================================================
  AfCFTA Complete Trade Analysis System - Example
======================================================================

======================================================================
  1. Data Validation
======================================================================
HS Code Validation: ✓ Valid
  - HS2: 01
  - HS4: 0101
  - HS6: 010121
...
```

The example will perform a complete analysis including:
- Validation of all input data
- HS code sector classification
- MFN and AfCFTA tariff calculations
- Savings estimation (40% savings in the example)
- ICP score calculation (49.58/100 Fair rating)
- Bilateral trade analysis
- Trade creation potential (11.70% increase)

## Example Output Explanation

### Tariff Comparison
- **MFN Rate**: Most Favored Nation tariff rate (standard WTO rate)
- **AfCFTA Rate**: Preferential AfCFTA rate (reduced based on dismantling schedule)
- **Savings**: Amount saved by using AfCFTA preferential rates

### ICP Score
- **Score Range**: 0-100
- **Rating Categories**: 
  - 80-100: Excellent
  - 70-80: Very Good
  - 60-70: Good
  - 50-60: Moderate
  - 40-50: Fair
  - <40: Limited

### Trade Creation Potential
Estimates the percentage increase in trade volume expected from tariff reductions.

## Creating Your Own Examples

### Basic Template

```python
import sys
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent.parent / 'backend'
sys.path.insert(0, str(backend_path))

# Import modules
from core.duty_calculator import AfCFTADutyCalculator
from core.mfn_calculator import MFNDutyCalculator

# Your code here
def main():
    # Initialize calculators
    afcfta_calc = AfCFTADutyCalculator()
    mfn_calc = MFNDutyCalculator()
    
    # Perform calculations
    mfn_result = mfn_calc.calculate_duty(
        value=10000.0,
        hs_code="010121",
        country_code="NG"
    )
    
    print(f"MFN Rate: {mfn_result['mfn_rate']}%")
    print(f"MFN Duty: ${mfn_result['mfn_amount']:,.2f}")

if __name__ == '__main__':
    main()
```

### Common Use Cases

#### 1. Calculate Tariff for Multiple Products

```python
from core.duty_calculator import AfCFTADutyCalculator
from core.mfn_calculator import MFNDutyCalculator

products = [
    {"hs_code": "010121", "value": 10000},
    {"hs_code": "080300", "value": 15000},
    {"hs_code": "610910", "value": 20000},
]

mfn_calc = MFNDutyCalculator()
afcfta_calc = AfCFTADutyCalculator()

total_savings = 0
for product in products:
    mfn = mfn_calc.calculate_duty(product["value"], product["hs_code"], "NG")
    category = afcfta_calc.get_category_for_hs_code(product["hs_code"], "NG")
    afcfta = afcfta_calc.calculate_duty(product["value"], mfn["mfn_rate"], category)
    
    savings = mfn["mfn_amount"] - afcfta["afcfta_amount"]
    total_savings += savings
    
    print(f"HS {product['hs_code']}: ${savings:,.2f} savings")

print(f"\nTotal savings: ${total_savings:,.2f}")
```

#### 2. Compare Multiple Trade Routes

```python
from core.icp_score import ICPScoreCalculator

icp_calc = ICPScoreCalculator()

# Define origin
origin = {'code': 'KE', 'name': 'Kenya', 'gdp_usd': 110e9}

# Define potential destinations
destinations = [
    {'code': 'NG', 'name': 'Nigeria', 'gdp_usd': 440e9},
    {'code': 'EG', 'name': 'Egypt', 'gdp_usd': 395e9},
    {'code': 'ZA', 'name': 'South Africa', 'gdp_usd': 350e9},
]

# Calculate ICP scores
results = []
for dest in destinations:
    score = icp_calc.calculate_score(origin, dest)
    results.append({
        'country': dest['name'],
        'score': score['icp_score'],
        'rating': score['rating']
    })

# Sort by score
results.sort(key=lambda x: x['score'], reverse=True)

print("Best trade opportunities:")
for r in results:
    print(f"  {r['country']}: {r['score']:.2f}/100 ({r['rating']})")
```

#### 3. Validate Trade Data

```python
from core.data_processor import DataProcessor

processor = DataProcessor()

# Validate a trade record
record = {
    'origin_country': 'ke',
    'destination_country': 'ng',
    'hs_code': '010121',
    'value': 10000.0
}

# Validate each field
hs_valid = processor.validate_hs_code(record['hs_code'])
origin_valid = processor.validate_country_code(record['origin_country'])
dest_valid = processor.validate_country_code(record['destination_country'])
value_valid = processor.validate_trade_value(record['value'])

if all([hs_valid['is_valid'], origin_valid['is_valid'], 
        dest_valid['is_valid'], value_valid['is_valid']]):
    # Normalize the record
    normalized = processor.normalize_trade_record(record)
    print("✓ Valid trade record")
    print(f"  Origin: {normalized['origin_country']}")
    print(f"  Destination: {normalized['destination_country']}")
    print(f"  HS Code: {normalized['hs_code']}")
    print(f"  Value: ${normalized['value_usd']:,.2f}")
else:
    print("✗ Invalid trade record")
```

## Running Examples

### Prerequisites

Make sure you have installed all dependencies:

```bash
cd /path/to/zlecaf-project-
pip install -r backend/requirements.txt
```

### Running from Command Line

```bash
# From project root
python examples/complete_analysis_example.py

# Or make it executable
chmod +x examples/complete_analysis_example.py
./examples/complete_analysis_example.py
```

### Running from Python

```python
import sys
sys.path.insert(0, '/path/to/zlecaf-project-/backend')

# Import and use modules
from core.duty_calculator import AfCFTADutyCalculator
# ... your code
```

## Additional Resources

- [Setup Instructions](../docs/SETUP.md)
- [Usage Guide](../docs/USAGE.md)
- [API Documentation](../docs/api/README.md)
- [Configuration Guide](../docs/CONFIGURATION.md)

## Support

For questions or issues:
- Check the [documentation](../docs/README.md)
- Open an issue on [GitHub](https://github.com/aouggad-web/zlecaf-project-/issues)
