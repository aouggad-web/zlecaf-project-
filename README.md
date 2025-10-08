# ZLECAf Calculator Project

African Continental Free Trade Area (AfCFTA) - Trade Calculator and Data Platform

## 🚀 New: Lyra Plus Feature

This project now includes the **Lyra Plus** enhancement with:
- ✅ Next.js ready page structure for modern SSR
- ✅ Automated data pipeline processing
- ✅ Comprehensive CI/CD with GitHub Actions

👉 **[View Lyra Plus Documentation](./LYRA_PLUS.md)**

## Overview

ZLECAf Calculator is a comprehensive platform for calculating tariffs and analyzing trade data within the African Continental Free Trade Area agreement.

### Key Features

- **Tariff Calculator**: Calculate duties with ZLECAf preferential rates
- **Trade Statistics**: Comprehensive AfCFTA trade data and analysis
- **Country Profiles**: Economic data for 54 African nations
- **Rules of Origin**: ZLECAf rules of origin documentation
- **Data Pipeline**: Automated processing and validation

## Project Structure

```
zlecaf-project-/
├── backend/              # FastAPI backend
│   ├── server.py         # Main API server
│   └── country_data.py   # Country economic data
├── frontend/             # React frontend
│   ├── src/              # React components
│   └── pages/            # Next.js ready pages
├── .github/workflows/    # CI/CD pipelines
│   ├── afcfta-ci.yml     # Main CI/CD
│   └── data-pipeline.yml # Data processing
├── pipeline_automation.py # Automated data pipeline
└── LYRA_PLUS.md          # Lyra Plus documentation

## Quick Start

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn server:app --reload
```

### Frontend

```bash
cd frontend
yarn install
yarn start
```

### Data Pipeline

```bash
python pipeline_automation.py
```

## CI/CD

GitHub Actions workflows automatically:
- Test backend and frontend code
- Validate data quality
- Build production artifacts
- Process data updates weekly

See [Lyra Plus Documentation](./LYRA_PLUS.md) for details.

## Contributing

Contributions are welcome! Please ensure:
- All tests pass
- Code follows project style
- Documentation is updated

## License

MIT License
