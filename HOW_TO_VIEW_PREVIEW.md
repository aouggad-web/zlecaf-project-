# 🎬 How to View the ZLECAf Application Preview

## Quick Start (3 Steps)

### Step 1: Start MongoDB
```bash
docker run --name zlecaf-mongo -d -p 27017:27017 mongo:7.0
```

### Step 2: Start Backend
```bash
cd backend
cat > .env << 'EOF'
MONGO_URL=mongodb://localhost:27017
DB_NAME=zlecaf_db
EOF

pip3 install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8000
```

### Step 3: Start Frontend
```bash
cd frontend
cat > .env << 'EOF'
REACT_APP_BACKEND_URL=http://localhost:8000
EOF

npm install --force
npm start
```

## 🌐 Access the Application

Once all services are running:

- **Frontend (Main App):** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs (Swagger):** http://localhost:8000/docs

## 🎯 What to Try

### 1. Calculate a Tariff
1. Go to the **Calculateur** tab
2. Select **Origin Country:** Nigeria 🇳🇬
3. Select **Destination Country:** Egypt 🇪🇬
4. Enter **HS Code:** 010121
5. Enter **Value:** 100000
6. Click **"Calculer avec Données Officielles"**
7. See the $25,000 savings!

### 2. View Country Profiles
1. Click the **Profils Pays** tab
2. Click the country dropdown
3. Select any country (try Nigeria, South Africa, or Egypt)
4. View complete economic profile with:
   - GDP and population
   - Risk ratings from S&P, Moody's, Fitch
   - Growth projections
   - Key sectors
   - Trade data

### 3. Check Statistics
1. Click the **Statistiques** tab
2. View AfCFTA projections for 2025 and 2030
3. See official data sources

### 4. Lookup Rules of Origin
1. Click the **Règles d'Origine** tab
2. Enter an HS code (e.g., 010121)
3. Click **Consulter**
4. View the rules of origin requirements

## 🎨 Features to Explore

- **Language Toggle:** Switch between French (🇫🇷) and English (🇬🇧) in the top right
- **54 Countries:** All African Union member states available
- **Real-time Data:** Calculations happen instantly
- **Responsive Design:** Try resizing your browser window
- **Flag Emojis:** Easy country identification with flags

## 📱 Application Tabs

| Tab | Description | Key Features |
|-----|-------------|--------------|
| **Calculateur** | Tariff Calculator | Calculate tariffs, compare NPF vs ZLECAf rates, see savings |
| **Statistiques** | Statistics | AfCFTA projections, trade data, official sources |
| **Règles d'Origine** | Rules of Origin | HS code lookup, requirements, documentation |
| **Profils Pays** | Country Profiles | Economic data for all 54 countries |

## 🔍 Sample Test Data

Here are some examples to try:

**Example 1: Agricultural Products**
- Origin: Kenya 🇰🇪
- Destination: Tanzania 🇹🇿
- HS Code: 080300 (Bananas)
- Value: 50000

**Example 2: Manufacturing**
- Origin: South Africa 🇿🇦
- Destination: Nigeria 🇳🇬
- HS Code: 847989 (Machinery)
- Value: 200000

**Example 3: Textiles**
- Origin: Morocco 🇲🇦
- Destination: Ghana 🇬🇭
- HS Code: 620520 (Shirts)
- Value: 75000

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Check what's using port 3000 or 8000
lsof -ti:3000 | xargs kill -9  # Kill process on port 3000
lsof -ti:8000 | xargs kill -9  # Kill process on port 8000
```

### MongoDB Not Running
```bash
# Check if container is running
docker ps | grep zlecaf-mongo

# Restart if needed
docker restart zlecaf-mongo

# Check logs
docker logs zlecaf-mongo
```

### Frontend Won't Start
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install --force
npm start
```

### Backend Module Errors
```bash
cd backend
pip3 install -r requirements.txt --force-reinstall
```

## 📊 What You'll See

### Calculator Results
- Tariff comparison (NPF vs ZLECAf)
- Savings calculation
- Percentage reduction
- Rules of origin details
- Success notification

### Country Profile Data
- Basic info (GDP, population, region)
- Development indicators
- Sovereign risk ratings
- Growth projections
- Business environment
- Key sectors
- Trade data (exports/imports)
- AfCFTA potential

### Statistics Dashboard
- Total savings tracked
- AfCFTA projections:
  - 2025: 15% trade increase, 90% tariff elimination
  - 2030: 52% trade increase, 7% GDP increase
- Official data sources
- Last update date

## 🎬 Demo Flow

Follow this sequence for a complete demo:

1. **Start on Calculator** - Show the main feature
2. **Perform a Calculation** - Demonstrate savings
3. **View Statistics** - Show the big picture
4. **Explore a Country Profile** - Deep dive into data
5. **Check Rules of Origin** - Technical details
6. **Switch Language** - Bilingual support

## 📸 Visual Reference

All screenshots are available in the PR description showing:
- Clean calculator interface
- Statistics with projections
- Country selector with 54 nations
- Detailed country profile (Nigeria)
- Calculation results with savings

## ✨ Key Selling Points

- **Comprehensive:** All 54 AfCFTA member states
- **Official Data:** World Bank, UNCTAD, OEC, AfDB, IMF
- **Real-time:** Instant calculations
- **User-friendly:** Modern, clean interface
- **Bilingual:** French and English
- **Complete:** Profiles, statistics, rules, calculations

## 🎯 Perfect For

- Trade demonstrations
- Business planning
- Economic analysis
- Educational purposes
- Policy evaluation
- Investment decisions

---

**Enjoy exploring the ZLECAf application!** 🌍✨

For detailed technical documentation, see:
- **PREVIEW_GUIDE.md** - Complete setup guide
- **PREVIEW_SUMMARY.md** - Quick overview
- **README.md** - API documentation
