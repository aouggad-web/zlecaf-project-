# AfCFTA Dismantling Matrix and Rates Data 2025-2035

## Overview

This document describes the structure and usage of AfCFTA dismantling matrix and tariff rates data files generated for the period 2025-2035.

## Generation

### Command Line
```bash
# Generate AfCFTA 2025 data files
python backend/make_release.py --afcfta-2025

# Or run the script directly
python backend/generate_afcfta_2025_data.py
```

### Requirements
- Python 3.7+
- openpyxl (for XLSX generation): `pip install openpyxl`

## Generated Files

### 1. zlecaf_dismantling_matrix_2025.csv

**Format**: Wide format (HS6 codes × Countries)

**Structure**:
- **Column 1**: `hs6_code` - 6-digit Harmonized System code
- **Column 2**: `hs_description` - Product description
- **Columns 3-56**: ISO3 country codes (54 African Union countries)

**Purpose**: 
Template for data entry of dismantling schedules per country and HS6 code.

**Usage**:
Fill blank cells with one of the following values:
- `A` - Category A (linear reduction to 0% over 5 years)
- `B` - Category B (linear reduction to 0% over 10 years)
- `C` - Category C (linear reduction to 0% over 13 years)
- `Sensitive` - Linear reduction to 0% over 15 years
- `Excluded` - Excluded from liberalization
- `Immediate` - 0% from start date

**Example**:
```csv
hs6_code,hs_description,AGO,BDI,BEN,...
010121,HS Chapter 01,A,B,Immediate,...
010129,HS Chapter 01,B,A,A,...
```

### 2. zlecaf_afcfta_rates_by_year_2025.csv

**Format**: Long format (one row per Country-HS6-Year combination)

**Columns**:
- `country` - ISO3 country code
- `hs6_code` - 6-digit HS code
- `year` - Year (2025-2035)
- `mfn_rate_pct` - Most Favored Nation rate (%)
- `afcfta_rate_pct` - AfCFTA preferential rate (%)
- `schedule` - Dismantling schedule (A, B, C, Sensitive, Excluded, Immediate)
- `immediate_flag` - 1 if immediate dismantling, 0 otherwise
- `source_url` - Source URL for verification

**Purpose**: 
Time series data for tariff evolution under AfCFTA.

**Usage**:
Fill blank fields with actual rates from national tariff schedules. Use the Lyra+ pipeline to automate data collection from:
- e-Tariff Portal (official tariff schedules)
- UNCTAD TRAINS (trade data)
- National customs authorities

**Example**:
```csv
country,hs6_code,year,mfn_rate_pct,afcfta_rate_pct,schedule,immediate_flag,source_url
AGO,010121,2025,20.0,20.0,A,0,https://...
AGO,010121,2026,20.0,16.0,A,0,https://...
AGO,010121,2027,20.0,12.0,A,0,https://...
```

### 3. zlecaf_immediate_dismantled_2025.csv

**Format**: Subset of positions with immediate dismantling

**Columns**:
- `country` - ISO3 country code
- `hs6_code` - 6-digit HS code
- `start_year` - Year of implementation (2025)
- `initial_mfn_rate_pct` - MFN rate before AfCFTA (%)
- `schedule` - "Immediate"
- `notes` - Additional information
- `source_url` - Source URL for verification

**Purpose**: 
Quick reference for positions that are liberalized immediately (0% from start).

**Example**:
```csv
country,hs6_code,start_year,initial_mfn_rate_pct,schedule,notes,source_url
AGO,010121,2025,5.0,Immediate,Immediate dismantling - 0% from start,https://...
```

### 4. zlecaf_afcfta_2025_metadata.json

**Format**: JSON metadata file

**Contents**:
- Version and generation timestamp
- Data coverage (countries, HS6 codes, period)
- Dismantling category definitions
- Field descriptions
- Data entry instructions
- Statistics

**Purpose**: 
Documentation and validation reference for the dataset.

### 5. zlecaf_afcfta_dismantling_2025.xlsx

**Format**: Excel workbook with multiple sheets

**Sheets**:
1. **dismantling_matrix** - Wide format matrix (same as CSV)
2. **rates_by_year_sample** - Sample long-format rates (first 5 countries × 10 HS6)
3. **immediate_sample** - Sample immediate positions
4. **metadata** - Generation info, instructions, category definitions

**Purpose**: 
Consolidated workbook for easy viewing and data entry in Excel.

## Dismantling Categories

| Category | Description | Duration | Notes |
|----------|-------------|----------|-------|
| **A** | Linear reduction | 5 years | Fastest track |
| **B** | Linear reduction | 10 years | Standard track |
| **C** | Linear reduction | 13 years | Extended track |
| **Sensitive** | Linear reduction | 15 years | Sensitive products |
| **Excluded** | No liberalization | N/A | Permanently excluded |
| **Immediate** | 0% from start | 0 years | No phase-out needed |

## Coverage

### Countries (54 AU Members)
All 54 African Union member states are included:
- AGO (Angola), BDI (Burundi), BEN (Benin), BFA (Burkina Faso), BWA (Botswana), ...
- Full list available in metadata JSON

### HS6 Codes
- **Current version**: 58 sample codes for demonstration
- **Production version**: Should include all 5000+ HS6 codes from HS 2022 nomenclature

### Time Period
- Start: 2025
- End: 2035
- Total: 11 years

## Data Pipeline

### Current State
This is a **template generator** that creates blank tables for data entry.

### Production Implementation

For production use, integrate with:

1. **e-Tariff Portal** (WCO/WTO)
   - Official tariff schedules
   - Real-time updates

2. **UNCTAD TRAINS** (United Nations)
   - Trade Analysis Information System
   - Comprehensive tariff database

3. **OEC Observatory** (MIT)
   - Economic Complexity Index
   - Trade flow data

4. **National Customs**
   - Direct integration with customs APIs
   - Official national schedules

## Usage Examples

### Example 1: Fill Dismantling Matrix

```python
import pandas as pd

# Load the matrix
df = pd.read_csv('zlecaf_dismantling_matrix_2025.csv')

# Fill schedule for Morocco (MAR) - HS 010121
df.loc[df['hs6_code'] == '010121', 'MAR'] = 'A'

# Save updated matrix
df.to_csv('zlecaf_dismantling_matrix_2025_filled.csv', index=False)
```

### Example 2: Generate Rate Schedule

```python
import pandas as pd

# Load rates
df = pd.read_csv('zlecaf_afcfta_rates_by_year_2025.csv')

# Fill rates for Category A (5-year linear reduction)
mask = (df['country'] == 'AGO') & (df['hs6_code'] == '010121')
initial_rate = 20.0

for year in range(2025, 2031):
    reduction = (year - 2025) * (initial_rate / 5)
    afcfta_rate = max(0, initial_rate - reduction)
    
    df.loc[mask & (df['year'] == year), 'mfn_rate_pct'] = initial_rate
    df.loc[mask & (df['year'] == year), 'afcfta_rate_pct'] = afcfta_rate
    df.loc[mask & (df['year'] == year), 'schedule'] = 'A'
    df.loc[mask & (df['year'] == year), 'immediate_flag'] = 0

df.to_csv('zlecaf_afcfta_rates_by_year_2025_filled.csv', index=False)
```

### Example 3: Query Immediate Positions

```python
import pandas as pd

# Load immediate positions
df = pd.read_csv('zlecaf_immediate_dismantled_2025.csv')

# Get all immediate positions for Angola
ago_immediate = df[df['country'] == 'AGO']
print(f"Angola has {len(ago_immediate)} immediate dismantling positions")
```

## Validation Rules

1. **HS6 codes**: Must be exactly 6 digits
2. **Country codes**: Must be valid ISO3 codes (54 AU members)
3. **Years**: Must be in range 2025-2035
4. **Rates**: Must be between 0 and 100 (percentages)
5. **Schedule types**: Must be one of {A, B, C, Sensitive, Excluded, Immediate}
6. **Immediate flag**: Must be 1 when afcfta_rate_pct = 0 from start_year
7. **Rate reduction**: AfCFTA rate must decrease monotonically year-over-year

## Future Enhancements

1. **Full HS nomenclature**: Include all 5000+ HS6 codes
2. **Real data integration**: Connect to e-Tariff, UNCTAD TRAINS, OEC
3. **Automated validation**: Check consistency across files
4. **API integration**: Expose data via REST API
5. **Visualization**: Interactive dashboards for tariff evolution
6. **Rules of origin**: Link with AfCFTA Annex 2 rules
7. **Certificate of origin**: Digital verification system

## References

- [AfCFTA Agreement](https://au.int/en/cfta)
- [AfCFTA Online Portal](https://afcfta.au.int/)
- [WTO Tariff Analysis Online](https://tao.wto.org/)
- [UNCTAD TRAINS](https://trainsonline.unctad.org/)
- [WCO Harmonized System](http://www.wcoomd.org/en/topics/nomenclature/overview.aspx)

## Support

For questions or issues:
- Repository: https://github.com/aouggad-web/zlecaf-project-
- Documentation: `docs/LYRA_OPS.md`
- Data pipeline: `backend/generate_afcfta_2025_data.py`

---

**Last updated**: 2025-10-12  
**Version**: 1.0.0
