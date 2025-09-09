from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Pays membres de la ZLECAf
AFRICAN_COUNTRIES = [
    {"code": "DZ", "name": "Algérie", "region": "Afrique du Nord"},
    {"code": "AO", "name": "Angola", "region": "Afrique Centrale"},
    {"code": "BJ", "name": "Bénin", "region": "Afrique de l'Ouest"},
    {"code": "BW", "name": "Botswana", "region": "Afrique Australe"},
    {"code": "BF", "name": "Burkina Faso", "region": "Afrique de l'Ouest"},
    {"code": "BI", "name": "Burundi", "region": "Afrique de l'Est"},
    {"code": "CM", "name": "Cameroun", "region": "Afrique Centrale"},
    {"code": "CV", "name": "Cap-Vert", "region": "Afrique de l'Ouest"},
    {"code": "CF", "name": "République Centrafricaine", "region": "Afrique Centrale"},
    {"code": "TD", "name": "Tchad", "region": "Afrique Centrale"},
    {"code": "KM", "name": "Comores", "region": "Afrique de l'Est"},
    {"code": "CG", "name": "République du Congo", "region": "Afrique Centrale"},
    {"code": "CD", "name": "République Démocratique du Congo", "region": "Afrique Centrale"},
    {"code": "CI", "name": "Côte d'Ivoire", "region": "Afrique de l'Ouest"},
    {"code": "DJ", "name": "Djibouti", "region": "Afrique de l'Est"},
    {"code": "EG", "name": "Égypte", "region": "Afrique du Nord"},
    {"code": "GQ", "name": "Guinée Équatoriale", "region": "Afrique Centrale"},
    {"code": "ER", "name": "Érythrée", "region": "Afrique de l'Est"},
    {"code": "SZ", "name": "Eswatini", "region": "Afrique Australe"},
    {"code": "ET", "name": "Éthiopie", "region": "Afrique de l'Est"},
    {"code": "GA", "name": "Gabon", "region": "Afrique Centrale"},
    {"code": "GM", "name": "Gambie", "region": "Afrique de l'Ouest"},
    {"code": "GH", "name": "Ghana", "region": "Afrique de l'Ouest"},
    {"code": "GN", "name": "Guinée", "region": "Afrique de l'Ouest"},
    {"code": "GW", "name": "Guinée-Bissau", "region": "Afrique de l'Ouest"},
    {"code": "KE", "name": "Kenya", "region": "Afrique de l'Est"},
    {"code": "LS", "name": "Lesotho", "region": "Afrique Australe"},
    {"code": "LR", "name": "Libéria", "region": "Afrique de l'Ouest"},
    {"code": "LY", "name": "Libye", "region": "Afrique du Nord"},
    {"code": "MG", "name": "Madagascar", "region": "Afrique de l'Est"},
    {"code": "MW", "name": "Malawi", "region": "Afrique de l'Est"},
    {"code": "ML", "name": "Mali", "region": "Afrique de l'Ouest"},
    {"code": "MR", "name": "Mauritanie", "region": "Afrique de l'Ouest"},
    {"code": "MU", "name": "Maurice", "region": "Afrique de l'Est"},
    {"code": "MA", "name": "Maroc", "region": "Afrique du Nord"},
    {"code": "MZ", "name": "Mozambique", "region": "Afrique de l'Est"},
    {"code": "NA", "name": "Namibie", "region": "Afrique Australe"},
    {"code": "NE", "name": "Niger", "region": "Afrique de l'Ouest"},
    {"code": "NG", "name": "Nigéria", "region": "Afrique de l'Ouest"},
    {"code": "RW", "name": "Rwanda", "region": "Afrique de l'Est"},
    {"code": "ST", "name": "São Tomé-et-Príncipe", "region": "Afrique Centrale"},
    {"code": "SN", "name": "Sénégal", "region": "Afrique de l'Ouest"},
    {"code": "SC", "name": "Seychelles", "region": "Afrique de l'Est"},
    {"code": "SL", "name": "Sierra Leone", "region": "Afrique de l'Ouest"},
    {"code": "SO", "name": "Somalie", "region": "Afrique de l'Est"},
    {"code": "ZA", "name": "Afrique du Sud", "region": "Afrique Australe"},
    {"code": "SS", "name": "Soudan du Sud", "region": "Afrique de l'Est"},
    {"code": "SD", "name": "Soudan", "region": "Afrique du Nord"},
    {"code": "TZ", "name": "Tanzanie", "region": "Afrique de l'Est"},
    {"code": "TG", "name": "Togo", "region": "Afrique de l'Ouest"},
    {"code": "TN", "name": "Tunisie", "region": "Afrique du Nord"},
    {"code": "UG", "name": "Ouganda", "region": "Afrique de l'Est"},
    {"code": "ZM", "name": "Zambie", "region": "Afrique de l'Est"},
    {"code": "ZW", "name": "Zimbabwe", "region": "Afrique de l'Est"}
]

# Define Models
class CountryInfo(BaseModel):
    code: str
    name: str
    region: str

class TariffCalculationRequest(BaseModel):
    origin_country: str
    destination_country: str
    hs_code: str
    value: float

class TariffCalculationResponse(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    origin_country: str
    destination_country: str
    hs_code: str
    value: float
    tariff_rate: float
    tariff_amount: float
    zlecaf_rate: float
    zlecaf_amount: float
    savings: float
    savings_percentage: float
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ZLECAfStatistics(BaseModel):
    total_calculations: int
    total_savings: float
    most_traded_countries: List[dict]
    popular_hs_codes: List[dict]

# Routes
@api_router.get("/")
async def root():
    return {"message": "Système Commercial ZLECAf API"}

@api_router.get("/countries", response_model=List[CountryInfo])
async def get_countries():
    """Récupérer la liste des pays membres de la ZLECAf"""
    return AFRICAN_COUNTRIES

@api_router.post("/calculate-tariff", response_model=TariffCalculationResponse)
async def calculate_tariff(request: TariffCalculationRequest):
    """Calculer les tarifs et bénéfices ZLECAf"""
    
    # Vérification que les pays sont membres de la ZLECAf
    origin_exists = any(country["code"] == request.origin_country for country in AFRICAN_COUNTRIES)
    dest_exists = any(country["code"] == request.destination_country for country in AFRICAN_COUNTRIES)
    
    if not origin_exists or not dest_exists:
        raise HTTPException(status_code=400, detail="L'un des pays sélectionnés n'est pas membre de la ZLECAf")
    
    # Calcul des tarifs (simulation basée sur le code SH6)
    # Tarif normal (avant ZLECAf) - simulation
    base_tariff_rate = 0.15  # 15% par défaut
    
    # Ajustement selon le code SH
    hs_first_two = request.hs_code[:2] if len(request.hs_code) >= 2 else "00"
    
    # Différents taux selon les catégories de produits
    if hs_first_two in ["01", "02", "03"]:  # Produits alimentaires
        base_tariff_rate = 0.20
        zlecaf_rate = 0.05
    elif hs_first_two in ["84", "85"]:  # Machines et équipements
        base_tariff_rate = 0.10
        zlecaf_rate = 0.02
    elif hs_first_two in ["62", "63"]:  # Textiles
        base_tariff_rate = 0.25
        zlecaf_rate = 0.07
    else:
        base_tariff_rate = 0.15
        zlecaf_rate = 0.04
    
    # Calculs
    tariff_amount = request.value * base_tariff_rate
    zlecaf_amount = request.value * zlecaf_rate
    savings = tariff_amount - zlecaf_amount
    savings_percentage = (savings / tariff_amount) * 100 if tariff_amount > 0 else 0
    
    # Création de la réponse
    result = TariffCalculationResponse(
        origin_country=request.origin_country,
        destination_country=request.destination_country,
        hs_code=request.hs_code,
        value=request.value,
        tariff_rate=base_tariff_rate,
        tariff_amount=tariff_amount,
        zlecaf_rate=zlecaf_rate,
        zlecaf_amount=zlecaf_amount,
        savings=savings,
        savings_percentage=savings_percentage
    )
    
    # Sauvegarder en base de données
    await db.tariff_calculations.insert_one(result.dict())
    
    return result

@api_router.get("/statistics", response_model=ZLECAfStatistics)
async def get_statistics():
    """Récupérer les statistiques ZLECAf"""
    
    # Compter le total des calculs
    total_calculations = await db.tariff_calculations.count_documents({})
    
    # Calculer les économies totales
    pipeline_savings = [
        {"$group": {"_id": None, "total_savings": {"$sum": "$savings"}}}
    ]
    savings_result = await db.tariff_calculations.aggregate(pipeline_savings).to_list(1)
    total_savings = savings_result[0]["total_savings"] if savings_result else 0
    
    # Pays les plus utilisés
    pipeline_countries = [
        {"$group": {"_id": "$origin_country", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 5}
    ]
    countries_result = await db.tariff_calculations.aggregate(pipeline_countries).to_list(5)
    
    # Codes SH les plus populaires
    pipeline_hs = [
        {"$group": {"_id": "$hs_code", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 5}
    ]
    hs_result = await db.tariff_calculations.aggregate(pipeline_hs).to_list(5)
    
    return ZLECAfStatistics(
        total_calculations=total_calculations,
        total_savings=total_savings,
        most_traded_countries=countries_result,
        popular_hs_codes=hs_result
    )

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()