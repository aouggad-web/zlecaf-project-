# Lyra Plus Feature Documentation

## Overview

The **Lyra Plus** enhancement brings modern infrastructure, automated data pipelines, and robust CI/CD to the ZLECAf (African Continental Free Trade Area) calculator project.

## Features

### 1. Next.js Ready Pages Structure

The frontend now includes a `pages/` directory structure compatible with Next.js:

```
frontend/pages/
├── index.jsx          # Home page
├── calculator.jsx     # Tariff calculator page
├── statistics.jsx     # Trade statistics page
└── api/              # API routes directory
    └── README.md
```

**Benefits:**
- Server-side rendering (SSR) ready
- Improved SEO capabilities
- Better performance with static generation
- API routes for serverless functions

**Migration Path:**
The current React application can be gradually migrated to Next.js while maintaining functionality. Each page component is structured with:
- Server-side props placeholders
- Client-side fallbacks
- Compatible component structure

### 2. Automated Data Pipeline

**New Pipeline Script:** `pipeline_automation.py`

This orchestration script automates the entire data processing workflow:

```bash
python pipeline_automation.py
```

**Pipeline Steps:**
1. ✅ File validation - Ensures all required data files are present
2. ✅ Tariff corrections - Applies official ZLECAf tariff schedules
3. ✅ Data integration - Merges validated country data
4. ✅ Quality verification - Validates data integrity
5. ✅ Detailed checks - Performs comprehensive verification

**Output:**
- JSON results file with execution summary
- Detailed logs for each step
- Error tracking and reporting

### 3. Comprehensive CI/CD

#### AfCFTA CI/CD Pipeline (`.github/workflows/afcfta-ci.yml`)

Runs on every push and pull request:

- **Backend Testing**
  - Python linting with flake8
  - Pytest execution
  - Code quality checks

- **Frontend Testing**
  - Node.js/Yarn setup
  - ESLint validation
  - React test suite

- **Data Validation**
  - Data quality verification
  - JSON structure validation
  - Tariff data checks

- **Integration Tests**
  - MongoDB service setup
  - Backend API testing
  - Endpoint validation

- **Build Process**
  - Frontend production build
  - Artifact generation
  - Build optimization

#### Data Pipeline Workflow (`.github/workflows/data-pipeline.yml`)

Scheduled and manual execution:

- **Weekly Schedule:** Runs every Monday at 00:00 UTC
- **Manual Trigger:** Via workflow_dispatch with force update option

**Features:**
- Automated data updates
- Tariff schedule validation
- Quality assurance checks
- Report generation
- Artifact retention (30 days)

## Usage

### Running the Data Pipeline Locally

```bash
# Full pipeline execution
python pipeline_automation.py

# Individual steps
python apply_corrections.py
python integrate_validated_data.py
python verify_data_quality.py
```

### CI/CD Workflows

**Automatic Triggers:**
- Push to `main`, `develop`, or `feature/**` branches
- Pull requests to `main` or `develop`

**Manual Triggers:**
```bash
# Via GitHub Actions UI
# Go to Actions → Select workflow → Run workflow
```

### Next.js Migration (Future)

To complete the Next.js migration:

1. Install Next.js dependencies:
```bash
cd frontend
yarn add next@latest react@latest react-dom@latest
```

2. Update `package.json` scripts:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

3. Move existing components to the pages structure
4. Configure `next.config.js` (already present)
5. Update imports and routing

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Lyra Plus Stack                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌───────────────┐      ┌──────────────┐                    │
│  │   Next.js     │──────│  FastAPI     │                    │
│  │   Frontend    │      │  Backend     │                    │
│  │   (Ready)     │      │              │                    │
│  └───────────────┘      └──────────────┘                    │
│         │                       │                            │
│         │                       │                            │
│  ┌───────────────────────────────────────┐                  │
│  │      Data Pipeline Automation         │                  │
│  │  - Tariff Corrections                 │                  │
│  │  - Data Integration                   │                  │
│  │  - Quality Verification               │                  │
│  └───────────────────────────────────────┘                  │
│                    │                                         │
│         ┌──────────┴──────────┐                            │
│         │                     │                             │
│  ┌──────▼──────┐      ┌──────▼──────┐                     │
│  │  GitHub     │      │   Data      │                      │
│  │  Actions CI │      │   Sources   │                      │
│  │             │      │   (CSV/XLS) │                      │
│  └─────────────┘      └─────────────┘                      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Configuration

### Environment Variables

**Backend:**
- `MONGO_URL`: MongoDB connection string
- `DB_NAME`: Database name
- `API_URL`: Backend API URL

**Frontend:**
- `NEXT_PUBLIC_API_URL`: Public API endpoint
- `NEXT_PUBLIC_SITE_URL`: Site URL for SSR

### CI/CD Configuration

Edit workflow files in `.github/workflows/`:
- `afcfta-ci.yml`: Main CI/CD pipeline
- `data-pipeline.yml`: Data processing automation

## Monitoring

### Pipeline Results

Pipeline execution generates JSON reports:
```bash
pipeline_results_YYYYMMDD_HHMMSS.json
```

Example output:
```json
{
  "started_at": "2025-10-08T12:00:00",
  "completed_at": "2025-10-08T12:05:30",
  "steps": [...],
  "success": true,
  "errors": []
}
```

### GitHub Actions

Monitor workflow execution:
1. Go to repository → Actions tab
2. Select workflow run
3. View logs and artifacts
4. Download reports

## Troubleshooting

### Pipeline Errors

**Missing Files:**
```bash
# Check required files
ls -la zlecaf_corrections_2024.json
ls -la validation_master.xlsx
```

**Python Dependencies:**
```bash
pip install -r backend/requirements.txt
pip install pandas openpyxl requests
```

### CI/CD Issues

**Build Failures:**
- Check workflow logs in GitHub Actions
- Verify all tests pass locally
- Ensure dependencies are up to date

**Data Pipeline Failures:**
- Check data file integrity
- Verify JSON structure
- Review validation reports

## Future Enhancements

1. **Complete Next.js Migration**
   - Full SSR implementation
   - API routes setup
   - Image optimization

2. **Enhanced Data Pipeline**
   - Real-time data updates
   - API integrations
   - Automated reporting

3. **Advanced CI/CD**
   - Deployment automation
   - Performance testing
   - Security scanning

## Support

For issues or questions:
- Check workflow logs in GitHub Actions
- Review pipeline result files
- Consult API documentation

## Version History

- **v1.0.0** (2025-10-08): Initial Lyra Plus release
  - Next.js ready structure
  - Automated data pipeline
  - Comprehensive CI/CD

---

**Lyra Plus** - Empowering AfCFTA with modern infrastructure 🚀
