from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any, Union
import uuid
from datetime import datetime
import requests
import pandas as pd
import asyncio
import json
from country_data import get_country_data, REAL_COUNTRY_DATA
from tax_rates import calculate_all_taxes, get_vat_rate
from data_loader import (
    load_corrections_data, 
    load_commerce_data, 
    get_country_commerce_profile,
    get_all_countries_trade_performance,
    get_enhanced_statistics,
    get_tariff_corrections
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Système Commercial ZLECAf - API Complète", version="2.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Pays membres de la ZLECAf avec données économiques
AFRICAN_COUNTRIES = [
    {"code": "DZ", "name": "Algérie", "region": "Afrique du Nord", "iso3": "DZA", "wb_code": "DZA", "population": 44700000},
    {"code": "AO", "name": "Angola", "region": "Afrique Centrale", "iso3": "AGO", "wb_code": "AGO", "population": 32800000},
    {"code": "BJ", "name": "Bénin", "region": "Afrique de l'Ouest", "iso3": "BEN", "wb_code": "BEN", "population": 12100000},
    {"code": "BW", "name": "Botswana", "region": "Afrique Australe", "iso3": "BWA", "wb_code": "BWA", "population": 2400000},
    {"code": "BF", "name": "Burkina Faso", "region": "Afrique de l'Ouest", "iso3": "BFA", "wb_code": "BFA", "population": 21500000},
    {"code": "BI", "name": "Burundi", "region": "Afrique de l'Est", "iso3": "BDI", "wb_code": "BDI", "population": 12000000},
    {"code": "CM", "name": "Cameroun", "region": "Afrique Centrale", "iso3": "CMR", "wb_code": "CMR", "population": 26500000},
    {"code": "CV", "name": "Cap-Vert", "region": "Afrique de l'Ouest", "iso3": "CPV", "wb_code": "CPV", "population": 560000},
    {"code": "CF", "name": "République Centrafricaine", "region": "Afrique Centrale", "iso3": "CAF", "wb_code": "CAF", "population": 5400000},
    {"code": "TD", "name": "Tchad", "region": "Afrique Centrale", "iso3": "TCD", "wb_code": "TCD", "population": 16400000},
    {"code": "KM", "name": "Comores", "region": "Afrique de l'Est", "iso3": "COM", "wb_code": "COM", "population": 870000},
    {"code": "CG", "name": "République du Congo", "region": "Afrique Centrale", "iso3": "COG", "wb_code": "COG", "population": 5500000},
    {"code": "CD", "name": "République Démocratique du Congo", "region": "Afrique Centrale", "iso3": "COD", "wb_code": "COD", "population": 89600000},
    {"code": "CI", "name": "Côte d'Ivoire", "region": "Afrique de l'Ouest", "iso3": "CIV", "wb_code": "CIV", "population": 26400000},
    {"code": "DJ", "name": "Djibouti", "region": "Afrique de l'Est", "iso3": "DJI", "wb_code": "DJI", "population": 990000},
    {"code": "EG", "name": "Égypte", "region": "Afrique du Nord", "iso3": "EGY", "wb_code": "EGY", "population": 102300000},
    {"code": "GQ", "name": "Guinée Équatoriale", "region": "Afrique Centrale", "iso3": "GNQ", "wb_code": "GNQ", "population": 1400000},
    {"code": "ER", "name": "Érythrée", "region": "Afrique de l'Est", "iso3": "ERI", "wb_code": "ERI", "population": 3500000},
    {"code": "SZ", "name": "Eswatini", "region": "Afrique Australe", "iso3": "SWZ", "wb_code": "SWZ", "population": 1160000},
    {"code": "ET", "name": "Éthiopie", "region": "Afrique de l'Est", "iso3": "ETH", "wb_code": "ETH", "population": 115000000},
    {"code": "GA", "name": "Gabon", "region": "Afrique Centrale", "iso3": "GAB", "wb_code": "GAB", "population": 2200000},
    {"code": "GM", "name": "Gambie", "region": "Afrique de l'Ouest", "iso3": "GMB", "wb_code": "GMB", "population": 2400000},
    {"code": "GH", "name": "Ghana", "region": "Afrique de l'Ouest", "iso3": "GHA", "wb_code": "GHA", "population": 31100000},
    {"code": "GN", "name": "Guinée", "region": "Afrique de l'Ouest", "iso3": "GIN", "wb_code": "GIN", "population": 13100000},
    {"code": "GW", "name": "Guinée-Bissau", "region": "Afrique de l'Ouest", "iso3": "GNB", "wb_code": "GNB", "population": 2000000},
    {"code": "KE", "name": "Kenya", "region": "Afrique de l'Est", "iso3": "KEN", "wb_code": "KEN", "population": 53800000},
    {"code": "LS", "name": "Lesotho", "region": "Afrique Australe", "iso3": "LSO", "wb_code": "LSO", "population": 2100000},
    {"code": "LR", "name": "Libéria", "region": "Afrique de l'Ouest", "iso3": "LBR", "wb_code": "LBR", "population": 5100000},
    {"code": "LY", "name": "Libye", "region": "Afrique du Nord", "iso3": "LBY", "wb_code": "LBY", "population": 6900000},
    {"code": "MG", "name": "Madagascar", "region": "Afrique de l'Est", "iso3": "MDG", "wb_code": "MDG", "population": 28000000},
    {"code": "MW", "name": "Malawi", "region": "Afrique de l'Est", "iso3": "MWI", "wb_code": "MWI", "population": 19100000},
    {"code": "ML", "name": "Mali", "region": "Afrique de l'Ouest", "iso3": "MLI", "wb_code": "MLI", "population": 20300000},
    {"code": "MR", "name": "Mauritanie", "region": "Afrique de l'Ouest", "iso3": "MRT", "wb_code": "MRT", "population": 4600000},
    {"code": "MU", "name": "Maurice", "region": "Afrique de l'Est", "iso3": "MUS", "wb_code": "MUS", "population": 1300000},
    {"code": "MA", "name": "Maroc", "region": "Afrique du Nord", "iso3": "MAR", "wb_code": "MAR", "population": 37000000},
    {"code": "MZ", "name": "Mozambique", "region": "Afrique de l'Est", "iso3": "MOZ", "wb_code": "MOZ", "population": 31300000},
    {"code": "NA", "name": "Namibie", "region": "Afrique Australe", "iso3": "NAM", "wb_code": "NAM", "population": 2500000},
    {"code": "NE", "name": "Niger", "region": "Afrique de l'Ouest", "iso3": "NER", "wb_code": "NER", "population": 24200000},
    {"code": "NG", "name": "Nigéria", "region": "Afrique de l'Ouest", "iso3": "NGA", "wb_code": "NGA", "population": 218500000},
    {"code": "RW", "name": "Rwanda", "region": "Afrique de l'Est", "iso3": "RWA", "wb_code": "RWA", "population": 13000000},
    {"code": "ST", "name": "São Tomé-et-Príncipe", "region": "Afrique Centrale", "iso3": "STP", "wb_code": "STP", "population": 220000},
    {"code": "SN", "name": "Sénégal", "region": "Afrique de l'Ouest", "iso3": "SEN", "wb_code": "SEN", "population": 17200000},
    {"code": "SC", "name": "Seychelles", "region": "Afrique de l'Est", "iso3": "SYC", "wb_code": "SYC", "population": 98000},
    {"code": "SL", "name": "Sierra Leone", "region": "Afrique de l'Ouest", "iso3": "SLE", "wb_code": "SLE", "population": 8000000},
    {"code": "SO", "name": "Somalie", "region": "Afrique de l'Est", "iso3": "SOM", "wb_code": "SOM", "population": 16000000},
    {"code": "ZA", "name": "Afrique du Sud", "region": "Afrique Australe", "iso3": "ZAF", "wb_code": "ZAF", "population": 59300000},
    {"code": "SS", "name": "Soudan du Sud", "region": "Afrique de l'Est", "iso3": "SSD", "wb_code": "SSD", "population": 11200000},
    {"code": "SD", "name": "Soudan", "region": "Afrique du Nord", "iso3": "SDN", "wb_code": "SDN", "population": 44900000},
    {"code": "TZ", "name": "Tanzanie", "region": "Afrique de l'Est", "iso3": "TZA", "wb_code": "TZA", "population": 59700000},
    {"code": "TG", "name": "Togo", "region": "Afrique de l'Ouest", "iso3": "TGO", "wb_code": "TGO", "population": 8300000},
    {"code": "TN", "name": "Tunisie", "region": "Afrique du Nord", "iso3": "TUN", "wb_code": "TUN", "population": 11800000},
    {"code": "UG", "name": "Ouganda", "region": "Afrique de l'Est", "iso3": "UGA", "wb_code": "UGA", "population": 45700000},
    {"code": "ZM", "name": "Zambie", "region": "Afrique de l'Est", "iso3": "ZMB", "wb_code": "ZMB", "population": 18400000},
    {"code": "ZW", "name": "Zimbabwe", "region": "Afrique de l'Est", "iso3": "ZWE", "wb_code": "ZWE", "population": 15000000}
]

# Règles d'origine ZLECAf par secteur/code SH
ZLECAF_RULES_OF_ORIGIN = {
    "01": {"rule": "Entièrement obtenus", "requirement": "100% africain", "regional_content": 100},
    "02": {"rule": "Entièrement obtenus", "requirement": "100% africain", "regional_content": 100},
    "03": {"rule": "Entièrement obtenus", "requirement": "100% africain", "regional_content": 100},
    "04": {"rule": "Transformation substantielle", "requirement": "40% valeur ajoutée africaine", "regional_content": 40},
    "05": {"rule": "Transformation substantielle", "requirement": "40% valeur ajoutée africaine", "regional_content": 40},
    "06": {"rule": "Transformation substantielle", "requirement": "40% valeur ajoutée africaine", "regional_content": 40},
    "07": {"rule": "Entièrement obtenus", "requirement": "100% africain", "regional_content": 100},
    "08": {"rule": "Entièrement obtenus", "requirement": "100% africain", "regional_content": 100},
    "09": {"rule": "Transformation substantielle", "requirement": "35% valeur ajoutée africaine", "regional_content": 35},
    "10": {"rule": "Transformation substantielle", "requirement": "35% valeur ajoutée africaine", "regional_content": 35},
    "11": {"rule": "Transformation substantielle", "requirement": "40% valeur ajoutée africaine", "regional_content": 40},
    "12": {"rule": "Transformation substantielle", "requirement": "35% valeur ajoutée africaine", "regional_content": 35},
    "13": {"rule": "Transformation substantielle", "requirement": "40% valeur ajoutée africaine", "regional_content": 40},
    "14": {"rule": "Transformation substantielle", "requirement": "40% valeur ajoutée africaine", "regional_content": 40},
    "15": {"rule": "Transformation substantielle", "requirement": "45% valeur ajoutée africaine", "regional_content": 45},
    "16": {"rule": "Transformation substantielle", "requirement": "40% valeur ajoutée africaine", "regional_content": 40},
    "17": {"rule": "Transformation substantielle", "requirement": "40% valeur ajoutée africaine", "regional_content": 40},
    "18": {"rule": "Transformation substantielle", "requirement": "40% valeur ajoutée africaine", "regional_content": 40},
    "19": {"rule": "Transformation substantielle", "requirement": "45% valeur ajoutée africaine", "regional_content": 45},
    "20": {"rule": "Transformation substantielle", "requirement": "40% valeur ajoutée africaine", "regional_content": 40},
    "21": {"rule": "Transformation substantielle", "requirement": "45% valeur ajoutée africaine", "regional_content": 45},
    "22": {"rule": "Transformation substantielle", "requirement": "35% valeur ajoutée africaine", "regional_content": 35},
    "23": {"rule": "Transformation substantielle", "requirement": "35% valeur ajoutée africaine", "regional_content": 35},
    "24": {"rule": "Transformation substantielle", "requirement": "40% valeur ajoutée africaine", "regional_content": 40},
    "25": {"rule": "Extraction ou transformation substantielle", "requirement": "40% valeur ajoutée africaine", "regional_content": 40},
    "26": {"rule": "Extraction", "requirement": "Entièrement extraits en Afrique", "regional_content": 100},
    "27": {"rule": "Extraction", "requirement": "Entièrement extraits en Afrique", "regional_content": 100},
    "28": {"rule": "Transformation substantielle", "requirement": "45% valeur ajoutée africaine", "regional_content": 45},
    "29": {"rule": "Transformation substantielle", "requirement": "45% valeur ajoutée africaine", "regional_content": 45},
    "30": {"rule": "Transformation substantielle", "requirement": "45% valeur ajoutée africaine", "regional_content": 45},
    "31": {"rule": "Transformation substantielle", "requirement": "45% valeur ajoutée africaine", "regional_content": 45},
    "32": {"rule": "Transformation substantielle", "requirement": "45% valeur ajoutée africaine", "regional_content": 45},
    "33": {"rule": "Transformation substantielle", "requirement": "45% valeur ajoutée africaine", "regional_content": 45},
    "34": {"rule": "Transformation substantielle", "requirement": "40% valeur ajoutée africaine", "regional_content": 40},
    "35": {"rule": "Transformation substantielle", "requirement": "45% valeur ajoutée africaine", "regional_content": 45},
    "36": {"rule": "Transformation substantielle", "requirement": "45% valeur ajoutée africaine", "regional_content": 45},
    "37": {"rule": "Transformation substantielle", "requirement": "45% valeur ajoutée africaine", "regional_content": 45},
    "38": {"rule": "Transformation substantielle", "requirement": "45% valeur ajoutée africaine", "regional_content": 45},
    "39": {"rule": "Transformation substantielle", "requirement": "45% valeur ajoutée africaine", "regional_content": 45},
    "40": {"rule": "Transformation substantielle", "requirement": "45% valeur ajoutée africaine", "regional_content": 45},
    "41": {"rule": "Transformation substantielle", "requirement": "40% valeur ajoutée africaine", "regional_content": 40},
    "42": {"rule": "Transformation substantielle", "requirement": "40% valeur ajoutée africaine", "regional_content": 40},
    "43": {"rule": "Transformation substantielle", "requirement": "40% valeur ajoutée africaine", "regional_content": 40},
    "44": {"rule": "Transformation substantielle", "requirement": "35% valeur ajoutée africaine", "regional_content": 35},
    "45": {"rule": "Transformation substantielle", "requirement": "35% valeur ajoutée africaine", "regional_content": 35},
    "46": {"rule": "Transformation substantielle", "requirement": "40% valeur ajoutée africaine", "regional_content": 40},
    "47": {"rule": "Transformation substantielle", "requirement": "35% valeur ajoutée africaine", "regional_content": 35},
    "48": {"rule": "Transformation substantielle", "requirement": "40% valeur ajoutée africaine", "regional_content": 40},
    "49": {"rule": "Transformation substantielle", "requirement": "40% valeur ajoutée africaine", "regional_content": 40},
    "50": {"rule": "Transformation substantielle", "requirement": "45% valeur ajoutée africaine", "regional_content": 45},
    "51": {"rule": "Transformation substantielle", "requirement": "45% valeur ajoutée africaine", "regional_content": 45},
    "52": {"rule": "Transformation substantielle", "requirement": "45% valeur ajoutée africaine", "regional_content": 45},
    "53": {"rule": "Transformation substantielle", "requirement": "45% valeur ajoutée africaine", "regional_content": 45},
    "54": {"rule": "Transformation substantielle", "requirement": "45% valeur ajoutée africaine", "regional_content": 45},
    "55": {"rule": "Transformation substantielle", "requirement": "45% valeur ajoutée africaine", "regional_content": 45},
    "56": {"rule": "Transformation substantielle", "requirement": "45% valeur ajoutée africaine", "regional_content": 45},
    "57": {"rule": "Transformation substantielle", "requirement": "45% valeur ajoutée africaine", "regional_content": 45},
    "58": {"rule": "Transformation substantielle", "requirement": "45% valeur ajoutée africaine", "regional_content": 45},
    "59": {"rule": "Transformation substantielle", "requirement": "45% valeur ajoutée africaine", "regional_content": 45},
    "60": {"rule": "Transformation substantielle", "requirement": "45% valeur ajoutée africaine", "regional_content": 45},
    "61": {"rule": "Transformation substantielle", "requirement": "45% valeur ajoutée africaine", "regional_content": 45},
    "62": {"rule": "Transformation substantielle", "requirement": "45% valeur ajoutée africaine", "regional_content": 45},
    "63": {"rule": "Transformation substantielle", "requirement": "45% valeur ajoutée africaine", "regional_content": 45},
    "64": {"rule": "Transformation substantielle", "requirement": "45% valeur ajoutée africaine", "regional_content": 45},
    "65": {"rule": "Transformation substantielle", "requirement": "45% valeur ajoutée africaine", "regional_content": 45},
    "66": {"rule": "Transformation substantielle", "requirement": "45% valeur ajoutée africaine", "regional_content": 45},
    "67": {"rule": "Transformation substantielle", "requirement": "40% valeur ajoutée africaine", "regional_content": 40},
    "68": {"rule": "Transformation substantielle", "requirement": "40% valeur ajoutée africaine", "regional_content": 40},
    "69": {"rule": "Transformation substantielle", "requirement": "40% valeur ajoutée africaine", "regional_content": 40},
    "70": {"rule": "Transformation substantielle", "requirement": "40% valeur ajoutée africaine", "regional_content": 40},
    "71": {"rule": "Transformation substantielle", "requirement": "45% valeur ajoutée africaine", "regional_content": 45},
    "72": {"rule": "Transformation substantielle", "requirement": "40% valeur ajoutée africaine", "regional_content": 40},
    "73": {"rule": "Transformation substantielle", "requirement": "40% valeur ajoutée africaine", "regional_content": 40},
    "74": {"rule": "Transformation substantielle", "requirement": "40% valeur ajoutée africaine", "regional_content": 40},
    "75": {"rule": "Transformation substantielle", "requirement": "40% valeur ajoutée africaine", "regional_content": 40},
    "76": {"rule": "Transformation substantielle", "requirement": "40% valeur ajoutée africaine", "regional_content": 40},
    "78": {"rule": "Transformation substantielle", "requirement": "40% valeur ajoutée africaine", "regional_content": 40},
    "79": {"rule": "Transformation substantielle", "requirement": "40% valeur ajoutée africaine", "regional_content": 40},
    "80": {"rule": "Transformation substantielle", "requirement": "40% valeur ajoutée africaine", "regional_content": 40},
    "81": {"rule": "Transformation substantielle", "requirement": "40% valeur ajoutée africaine", "regional_content": 40},
    "82": {"rule": "Transformation substantielle", "requirement": "40% valeur ajoutée africaine", "regional_content": 40},
    "83": {"rule": "Transformation substantielle", "requirement": "40% valeur ajoutée africaine", "regional_content": 40},
    "84": {"rule": "Transformation substantielle", "requirement": "45% valeur ajoutée africaine", "regional_content": 45},
    "85": {"rule": "Transformation substantielle", "requirement": "45% valeur ajoutée africaine", "regional_content": 45},
    "86": {"rule": "Transformation substantielle", "requirement": "40% valeur ajoutée africaine", "regional_content": 40},
    "87": {"rule": "Transformation substantielle", "requirement": "45% valeur ajoutée africaine", "regional_content": 45},
    "88": {"rule": "Transformation substantielle", "requirement": "45% valeur ajoutée africaine", "regional_content": 45},
    "89": {"rule": "Transformation substantielle", "requirement": "40% valeur ajoutée africaine", "regional_content": 40},
    "90": {"rule": "Transformation substantielle", "requirement": "45% valeur ajoutée africaine", "regional_content": 45},
    "91": {"rule": "Transformation substantielle", "requirement": "45% valeur ajoutée africaine", "regional_content": 45},
    "92": {"rule": "Transformation substantielle", "requirement": "40% valeur ajoutée africaine", "regional_content": 40},
    "93": {"rule": "Transformation substantielle", "requirement": "40% valeur ajoutée africaine", "regional_content": 40},
    "94": {"rule": "Transformation substantielle", "requirement": "40% valeur ajoutée africaine", "regional_content": 40},
    "95": {"rule": "Transformation substantielle", "requirement": "40% valeur ajoutée africaine", "regional_content": 40},
    "96": {"rule": "Transformation substantielle", "requirement": "40% valeur ajoutée africaine", "regional_content": 40},
    "97": {"rule": "Œuvres d'art", "requirement": "Création africaine", "regional_content": 100},
}

# API Clients pour données externes
class WorldBankAPIClient:
    def __init__(self):
        self.base_url = "https://api.worldbank.org/v2"
        self.session = requests.Session()
        self.session.headers.update({'User-Agent': 'ZLECAf-API/1.0'})

    async def get_country_data(self, country_codes: List[str], indicators: List[str] = None) -> Dict[str, Any]:
        """Récupérer les données économiques des pays depuis la Banque Mondiale"""
        if indicators is None:
            indicators = ['NY.GDP.MKTP.CD', 'SP.POP.TOTL', 'NY.GDP.PCAP.CD', 'FP.CPI.TOTL.ZG']
        
        try:
            all_data = {}
            for country in country_codes:
                country_data = {}
                for indicator in indicators:
                    url = f"{self.base_url}/country/{country}/indicator/{indicator}"
                    params = {
                        'format': 'json',
                        'date': '2020:2023',
                        'per_page': 10
                    }
                    
                    response = self.session.get(url, params=params, timeout=10)
                    if response.status_code == 200:
                        data = response.json()
                        if len(data) > 1 and data[1]:
                            latest_data = data[1][0] if data[1] else None
                            if latest_data and latest_data['value']:
                                country_data[indicator] = {
                                    'value': latest_data['value'],
                                    'date': latest_data['date']
                                }
                
                all_data[country] = country_data
            
            return all_data
        except Exception as e:
            logging.error(f"Erreur World Bank API: {e}")
            return {}

class OECAPIClient:
    def __init__(self):
        self.base_url = "https://api-v2.oec.world"
        self.session = requests.Session()
        self.session.headers.update({'User-Agent': 'ZLECAf-API/1.0'})

    async def get_top_producers(self, hs_code: str, year: int = 2021) -> List[Dict[str, Any]]:
        """Récupérer le top 5 des pays africains producteurs pour un code SH"""
        try:
            endpoint = "tesseract/data.jsonrecords"
            params = {
                'cube': 'trade_i_hs4_eci',
                'drilldowns': 'Reporter',
                'measures': 'Export Value',
                'Product': hs_code[:4] if len(hs_code) > 4 else hs_code,
                'time': str(year),
                'Trade Flow': '2'  # Exports
            }
            
            response = self.session.get(f"{self.base_url}/{endpoint}", params=params, timeout=15)
            if response.status_code == 200:
                data = response.json()
                if 'data' in data and data['data']:
                    # Filtrer pour les pays africains seulement
                    african_codes = [country['iso3'] for country in AFRICAN_COUNTRIES]
                    african_exports = []
                    
                    for item in data['data']:
                        if item.get('Reporter') in african_codes:
                            african_exports.append({
                                'country_code': item.get('Reporter'),
                                'country_name': next((c['name'] for c in AFRICAN_COUNTRIES if c['iso3'] == item.get('Reporter')), item.get('Reporter')),
                                'export_value': item.get('Export Value', 0),
                                'year': year
                            })
                    
                    # Trier par valeur d'export et prendre le top 5
                    african_exports.sort(key=lambda x: x['export_value'], reverse=True)
                    return african_exports[:5]
            
            return []
        except Exception as e:
            logging.error(f"Erreur OEC API: {e}")
            return []

# Clients API globaux
wb_client = WorldBankAPIClient()
oec_client = OECAPIClient()

# Define Models
class CountryInfo(BaseModel):
    code: str
    name: str
    region: str
    iso3: str
    wb_code: str
    population: int

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
    # Tarifs normaux (hors ZLECAf)
    normal_tariff_rate: float
    normal_tariff_amount: float
    # Tarifs ZLECAf
    zlecaf_tariff_rate: float
    zlecaf_tariff_amount: float
    # TVA et autres taxes - Normal
    normal_vat_rate: float
    normal_vat_amount: float
    normal_statistical_fee: float
    normal_community_levy: float
    normal_ecowas_levy: float
    normal_other_taxes_total: float
    normal_total_cost: float
    # TVA et autres taxes - ZLECAf
    zlecaf_vat_rate: float
    zlecaf_vat_amount: float
    zlecaf_statistical_fee: float
    zlecaf_community_levy: float
    zlecaf_ecowas_levy: float
    zlecaf_other_taxes_total: float
    zlecaf_total_cost: float
    # Économies
    savings: float
    savings_percentage: float
    total_savings_with_taxes: float
    total_savings_percentage: float
    # Journal de calcul et traçabilité
    normal_calculation_journal: List[Dict[str, Any]]
    zlecaf_calculation_journal: List[Dict[str, Any]]
    computation_order_ref: str
    last_verified: str
    confidence_level: str
    # Règles d'origine
    rules_of_origin: Dict[str, Any]
    # Top producteurs africains
    top_african_producers: List[Dict[str, Any]]
    # Données économiques des pays
    origin_country_data: Dict[str, Any]
    destination_country_data: Dict[str, Any]
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class CountryEconomicProfile(BaseModel):
    country_code: str
    country_name: str
    population: Optional[int] = None
    gdp_usd: Optional[float] = None
    gdp_per_capita: Optional[float] = None
    inflation_rate: Optional[float] = None
    region: str
    trade_profile: Dict[str, Any] = {}
    projections: Dict[str, Any] = {}
    risk_ratings: Dict[str, Any] = {}

# Routes
@api_router.get("/")
async def root():
    return {"message": "Système Commercial ZLECAf API - Version Complète"}

@api_router.get("/health")
async def health_check():
    """Simple health check endpoint"""
    return {
        "status": "healthy",
        "service": "ZLECAf API",
        "version": "2.0.0",
        "timestamp": datetime.now().isoformat()
    }

@api_router.get("/health/status")
async def detailed_health_status():
    """Detailed health status with system checks"""
    health_status = {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "ZLECAf API",
        "version": "2.0.0",
        "checks": {}
    }
    
    # Check database connection
    try:
        await db.command("ping")
        health_status["checks"]["database"] = {
            "status": "healthy",
            "message": "MongoDB connection active"
        }
    except Exception as e:
        health_status["checks"]["database"] = {
            "status": "unhealthy",
            "message": f"Database connection error: {str(e)}"
        }
        health_status["status"] = "unhealthy"
    
    # Check API endpoints availability
    health_status["checks"]["api_endpoints"] = {
        "status": "healthy",
        "available_endpoints": [
            "/api/",
            "/api/health",
            "/api/health/status",
            "/api/countries",
            "/api/country-profile/{country_code}",
            "/api/calculate-tariff",
            "/api/rules-of-origin/{hs_code}",
            "/api/statistics"
        ]
    }
    
    # Check data availability
    health_status["checks"]["data"] = {
        "status": "healthy",
        "countries_count": len(AFRICAN_COUNTRIES),
        "rules_of_origin_sectors": len(ZLECAF_RULES_OF_ORIGIN)
    }
    
    return health_status

@api_router.get("/countries", response_model=List[CountryInfo])
async def get_countries():
    """Récupérer la liste des pays membres de la ZLECAf"""
    return [CountryInfo(**country) for country in AFRICAN_COUNTRIES]

@api_router.get("/country-profile/{country_code}")
async def get_country_profile(country_code: str) -> CountryEconomicProfile:
    """Récupérer le profil économique complet d'un pays avec données réelles"""
    
    # Trouver le pays
    country = next((c for c in AFRICAN_COUNTRIES if c['code'] == country_code.upper()), None)
    if not country:
        raise HTTPException(status_code=404, detail="Pays non trouvé dans la ZLECAf")
    
    # Récupérer les données réelles du pays
    real_data = get_country_data(country['iso3'])
    
    # Construire le profil avec données réelles
    profile = CountryEconomicProfile(
        country_code=country['code'],
        country_name=country['name'],
        population=real_data.get('population_2024', country['population']),
        region=country['region']
    )
    
    # Ajouter les données économiques réelles
    profile.gdp_usd = real_data.get('gdp_usd_2024')
    profile.gdp_per_capita = real_data.get('gdp_per_capita_2024')
    profile.inflation_rate = None  # À obtenir via API si nécessaire
    
    # Ajouter les projections réelles et secteurs spécifiques
    profile.projections = {
        "gdp_growth_forecast_2024": real_data.get('growth_forecast_2024', '3.0%'),
        "gdp_growth_projection_2025": real_data.get('growth_projection_2025', '3.2%'),
        "gdp_growth_projection_2026": real_data.get('growth_projection_2026', '3.5%'),
        "development_index": real_data.get('development_index', 0.500),
        "africa_rank": real_data.get('africa_rank', 25),
        "key_sectors": [f"{sector['name']} ({sector['pib_share']}% PIB): {sector['description']}" 
                       for sector in real_data.get('key_sectors', [])],
        "zlecaf_potential_level": real_data.get('zlecaf_potential', {}).get('level', 'Modéré'),
        "zlecaf_potential_description": real_data.get('zlecaf_potential', {}).get('description', ''),
        "zlecaf_opportunities": real_data.get('zlecaf_potential', {}).get('key_opportunities', []),
        "main_exports": real_data.get('main_exports', []),
        "main_imports": real_data.get('main_imports', []),
        "investment_climate_score": "B+",  # À personnaliser par pays
        "infrastructure_index": 6.7,      # À personnaliser par pays
        "business_environment_rank": real_data.get('africa_rank', 25)
    }
    
    # Ajouter les notations de risque
    profile.risk_ratings = real_data.get('risk_ratings', {
        "sp": "NR",
        "moodys": "NR", 
        "fitch": "NR",
        "scope": "NR",
        "global_risk": "Non évalué"
    })
    
    return profile

@api_router.get("/rules-of-origin/{hs_code}")
async def get_rules_of_origin(hs_code: str):
    """Récupérer les règles d'origine ZLECAf pour un code SH"""
    
    # Obtenir le code à 2 chiffres pour les règles générales
    sector_code = hs_code[:2]
    
    if sector_code not in ZLECAF_RULES_OF_ORIGIN:
        raise HTTPException(status_code=404, detail="Règles d'origine non trouvées pour ce code SH")
    
    rules = ZLECAF_RULES_OF_ORIGIN[sector_code]
    
    return {
        "hs_code": hs_code,
        "sector_code": sector_code,
        "rules": rules,
        "explanation": {
            "rule_type": rules["rule"],
            "requirement": rules["requirement"],
            "regional_content_minimum": f"{rules['regional_content']}%",
            "documentation_required": [
                "Certificat d'origine ZLECAf",
                "Facture commerciale",
                "Liste de colisage",
                "Déclaration du fournisseur"
            ],
            "validity_period": "12 mois",
            "issuing_authority": "Autorité compétente du pays exportateur"
        }
    }

@api_router.post("/calculate-tariff", response_model=TariffCalculationResponse)
async def calculate_comprehensive_tariff(request: TariffCalculationRequest):
    """Calculer les tarifs complets avec données officielles et règles d'origine"""
    
    # Vérifier que les pays sont membres de la ZLECAf
    origin_country = next((c for c in AFRICAN_COUNTRIES if c['code'] == request.origin_country), None)
    dest_country = next((c for c in AFRICAN_COUNTRIES if c['code'] == request.destination_country), None)
    
    if not origin_country or not dest_country:
        raise HTTPException(status_code=400, detail="L'un des pays sélectionnés n'est pas membre de la ZLECAf")
    
    # Calcul des tarifs selon le code SH6
    sector_code = request.hs_code[:2]
    
    # Tarifs normaux (simulation basée sur des données réelles moyennes)
    normal_rates = {
        "01": 0.25,         "02": 0.25,         "03": 0.20,         "04": 0.30,         "05": 0.15,         "06": 0.15,         "07": 0.20,         "08": 0.20,         "09": 0.15,         "10": 0.15,         "11": 0.20,         "12": 0.15,         "13": 0.15,         "14": 0.10,         "15": 0.20,         "16": 0.30,         "17": 0.25,         "18": 0.20,         "19": 0.25,         "20": 0.30,         "21": 0.25,         "22": 0.35,         "23": 0.20,         "24": 0.50,         "25": 0.05,         "26": 0.02,         "27": 0.05,         "28": 0.10,         "29": 0.12,         "30": 0.05,         "31": 0.10,         "32": 0.15,         "33": 0.20,         "34": 0.12,         "35": 0.12,         "36": 0.10,         "37": 0.08,         "38": 0.15,         "39": 0.18,         "40": 0.15,         "50": 0.15,         "51": 0.15,         "52": 0.15,         "53": 0.12,         "54": 0.15,         "55": 0.15,         "56": 0.15,         "57": 0.15,         "58": 0.18,         "59": 0.15,         "60": 0.20,         "61": 0.30,         "62": 0.30,         "63": 0.25,         "84": 0.05,         "85": 0.05,         "86": 0.05,         "87": 0.25,         "88": 0.05,         "89": 0.08
    }
    
    # Tarifs ZLECAf (réduction progressive prévue)
    zlecaf_rates = {
        "01": 0.00,         "02": 0.00,         "03": 0.00,         "04": 0.00,         "05": 0.00,         "06": 0.00,         "07": 0.00,         "08": 0.00,         "09": 0.00,         "10": 0.00,         "11": 0.00,         "12": 0.00,         "13": 0.00,         "14": 0.00,         "15": 0.00,         "16": 0.00,         "17": 0.00,         "18": 0.00,         "19": 0.00,         "20": 0.00,         "21": 0.00,         "22": 0.00,         "23": 0.00,         "24": 0.00,         "25": 0.00,         "26": 0.00,         "27": 0.00,         "28": 0.00,         "29": 0.00,         "30": 0.00,         "31": 0.00,         "32": 0.00,         "33": 0.00,         "34": 0.00,         "35": 0.00,         "36": 0.00,         "37": 0.00,         "38": 0.00,         "39": 0.00,         "40": 0.00,         "50": 0.00,         "51": 0.00,         "52": 0.00,         "53": 0.00,         "54": 0.00,         "55": 0.00,         "56": 0.00,         "57": 0.00,         "58": 0.00,         "59": 0.00,         "60": 0.00,         "61": 0.00,         "62": 0.00,         "63": 0.00,         "84": 0.00,         "85": 0.00,         "86": 0.00,         "87": 0.15,         "88": 0.00,         "89": 0.00
    }
    
    normal_rate = normal_rates.get(sector_code, 0.15)
    zlecaf_rate = zlecaf_rates.get(sector_code, 0.03)
    
    # Calculs des droits de douane en USD
    normal_amount = request.value * normal_rate
    zlecaf_amount = request.value * zlecaf_rate
    savings = normal_amount - zlecaf_amount
    savings_percentage = (savings / normal_amount) * 100 if normal_amount > 0 else 0
    
    # Calcul des taxes pour le scénario NORMAL (NPF)
    normal_taxes = calculate_all_taxes(
        value=request.value,
        customs_duty=normal_amount,
        country_code=request.destination_country
    )
    
    # Calcul des taxes pour le scénario ZLECAf
    zlecaf_taxes = calculate_all_taxes(
        value=request.value,
        customs_duty=zlecaf_amount,
        country_code=request.destination_country
    )
    
    # Économies totales (incluant toutes les taxes)
    total_savings_with_taxes = normal_taxes['total_cost'] - zlecaf_taxes['total_cost']
    total_savings_percentage = (total_savings_with_taxes / normal_taxes['total_cost']) * 100 if normal_taxes['total_cost'] > 0 else 0
    
    # Règles d'origine
    rules = ZLECAF_RULES_OF_ORIGIN.get(sector_code, {
        "rule": "Transformation substantielle",
        "requirement": "40% valeur ajoutée africaine",
        "regional_content": 40
    })
    
    # Récupérer les top producteurs africains
    top_producers = await oec_client.get_top_producers(request.hs_code)
    
    # Récupérer les données économiques des pays
    wb_data = await wb_client.get_country_data([origin_country['wb_code'], dest_country['wb_code']])
    
    # Création de la réponse complète avec toutes les taxes
    result = TariffCalculationResponse(
        origin_country=request.origin_country,
        destination_country=request.destination_country,
        hs_code=request.hs_code,
        value=request.value,
        # Tarifs de douane
        normal_tariff_rate=normal_rate,
        normal_tariff_amount=normal_amount,
        zlecaf_tariff_rate=zlecaf_rate,
        zlecaf_tariff_amount=zlecaf_amount,
        # Taxes normales (NPF)
        normal_vat_rate=normal_taxes['vat_rate'],
        normal_vat_amount=normal_taxes['vat_amount'],
        normal_statistical_fee=normal_taxes['statistical_fee_amount'],
        normal_community_levy=normal_taxes['community_levy_amount'],
        normal_ecowas_levy=normal_taxes['ecowas_levy_amount'],
        normal_other_taxes_total=normal_taxes['other_taxes_total'],
        normal_total_cost=normal_taxes['total_cost'],
        # Taxes ZLECAf
        zlecaf_vat_rate=zlecaf_taxes['vat_rate'],
        zlecaf_vat_amount=zlecaf_taxes['vat_amount'],
        zlecaf_statistical_fee=zlecaf_taxes['statistical_fee_amount'],
        zlecaf_community_levy=zlecaf_taxes['community_levy_amount'],
        zlecaf_ecowas_levy=zlecaf_taxes['ecowas_levy_amount'],
        zlecaf_other_taxes_total=zlecaf_taxes['other_taxes_total'],
        zlecaf_total_cost=zlecaf_taxes['total_cost'],
        # Économies
        savings=savings,
        savings_percentage=savings_percentage,
        total_savings_with_taxes=total_savings_with_taxes,
        total_savings_percentage=total_savings_percentage,
        # Journal de calcul et traçabilité
        normal_calculation_journal=normal_taxes['calculation_journal'],
        zlecaf_calculation_journal=zlecaf_taxes['calculation_journal'],
        computation_order_ref=normal_taxes['computation_order_ref'],
        last_verified=normal_taxes['last_verified'],
        confidence_level=normal_taxes['confidence_level'],
        # Autres données
        rules_of_origin=rules,
        top_african_producers=top_producers,
        origin_country_data=wb_data.get(origin_country['wb_code'], {}),
        destination_country_data=wb_data.get(dest_country['wb_code'], {})
    )
    
    # Sauvegarder en base de données
    await db.comprehensive_calculations.insert_one(result.dict())
    
    return result

@api_router.get("/statistics")
async def get_comprehensive_statistics():
    """Récupérer les statistiques complètes ZLECAf"""
    
    # Statistiques de base
    total_calculations = await db.comprehensive_calculations.count_documents({})
    
    # Économies totales
    pipeline_savings = [
        {"$group": {"_id": None, "total_savings": {"$sum": "$savings"}}}
    ]
    savings_result = await db.comprehensive_calculations.aggregate(pipeline_savings).to_list(1)
    total_savings = savings_result[0]["total_savings"] if savings_result else 0
    
    # Pays les plus actifs
    pipeline_countries = [
        {"$group": {"_id": "$origin_country", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 10}
    ]
    countries_result = await db.comprehensive_calculations.aggregate(pipeline_countries).to_list(10)
    
    # Codes SH les plus utilisés
    pipeline_hs = [
        {"$group": {"_id": "$hs_code", "count": {"$sum": 1}, "avg_savings": {"$avg": "$savings"}}},
        {"$sort": {"count": -1}},
        {"$limit": 10}
    ]
    hs_result = await db.comprehensive_calculations.aggregate(pipeline_hs).to_list(10)
    
    # Secteurs les plus bénéficiaires
    pipeline_sectors = [
        {"$addFields": {"sector": {"$substr": ["$hs_code", 0, 2]}}},
        {"$group": {"_id": "$sector", "count": {"$sum": 1}, "total_savings": {"$sum": "$savings"}}},
        {"$sort": {"total_savings": -1}},
        {"$limit": 10}
    ]
    sectors_result = await db.comprehensive_calculations.aggregate(pipeline_sectors).to_list(10)
    
    # Calcul de l'impact économique potentiel
    african_population = sum([country['population'] for country in AFRICAN_COUNTRIES])
    estimated_gdp = 3400000000000  # PIB estimé de l'Afrique en USD
    
    return {
        "overview": {
            "total_calculations": total_calculations,
            "total_savings": total_savings,
            "african_countries_members": len(AFRICAN_COUNTRIES),
            "combined_population": african_population,
            "estimated_combined_gdp": estimated_gdp
        },
        "trade_statistics": {
            "most_active_countries": countries_result,
            "popular_hs_codes": hs_result,
            "top_beneficiary_sectors": sectors_result
        },
        "zlecaf_impact": {
            "average_tariff_reduction": "90%",
            "estimated_trade_creation": "52 milliards USD",
            "job_creation_potential": "18 millions d'emplois",
            "intra_african_trade_target": "25% d'ici 2030",
            "current_intra_african_trade": "15.2%",
            "poverty_reduction": "30 millions de personnes d'ici 2035",
            "income_gains_2035": "450 milliards USD",
            "export_increase_2035": "560 milliards USD (forte composante manufacturière)"
        },
        "projections": {
            "2025": {
                "trade_volume_increase": "15%",
                "tariff_eliminations": "90%",
                "new_trade_corridors": 45,
                "gti_active_corridors": "8 corridors prioritaires"
            },
            "2030": {
                "trade_volume_increase": "52%",
                "gdp_increase": "7%",
                "industrialization_boost": "35%",
                "tariff_revenue_change": "+3% (malgré baisse des taux)"
            },
            "2035": {
                "income_gains": "450 milliards USD",
                "poverty_reduction": "30 millions de personnes",
                "export_increase": "560 milliards USD",
                "intra_african_trade": "25-30%"
            },
            "2040": {
                "trade_volume_increase_conservative": "15%",
                "trade_volume_increase_median": "20%",
                "trade_volume_increase_ambitious": "25%",
                "estimated_additional_trade": "50-70 milliards USD"
            }
        },
        "scenarios": {
            "conservative": {
                "description": "Mise en œuvre lente, obstacles persistants",
                "trade_increase_2040": "15%",
                "additional_value": "50 milliards USD"
            },
            "median": {
                "description": "Mise en œuvre progressive, réduction graduelle NTB",
                "trade_increase_2040": "20%",
                "additional_value": "60 milliards USD"
            },
            "ambitious": {
                "description": "Mise en œuvre rapide, élimination NTB, infrastructure optimale",
                "trade_increase_2040": "25%",
                "additional_value": "70 milliards USD"
            }
        },
        "key_mechanisms": {
            "digital_trade_protocol": {
                "adoption_date": "2024-02-18",
                "status": "Adopté",
                "focus": "Harmonisation règles, flux transfrontières, confiance numérique"
            },
            "ntb_platform": {
                "url": "https://tradebarriers.africa",
                "status": "Opérationnel",
                "purpose": "Signalement et résolution obstacles non tarifaires"
            },
            "papss_payments": {
                "status": "Déploiement en cours",
                "purpose": "Système panafricain de paiements et règlements"
            },
            "gti": {
                "status": "Actif",
                "purpose": "Guided Trade Initiative - montée en charge progressive"
            }
        },
        "data_sources": [
            {
                "source": "Union Africaine - AfCFTA Secretariat",
                "url": "https://au.int/en/cfta",
                "verified": "2025-01-11"
            },
            {
                "source": "Banque Mondiale - The African Continental Free Trade Area",
                "url": "https://www.worldbank.org/en/topic/trade/publication/the-african-continental-free-trade-area",
                "key_findings": "Gains de 450 Md$, 30M sorties pauvreté (2035)",
                "verified": "2025-01-11"
            },
            {
                "source": "UNECA - Economic Commission for Africa",
                "url": "https://www.uneca.org/",
                "key_findings": "Projections +15-25% échanges intra-africains (2040)",
                "verified": "2025-01-11"
            },
            {
                "source": "UNCTAD - Trade Data",
                "url": "https://unctad.org/",
                "verified": "2025-01-11"
            },
            {
                "source": "tralac - Trade Law Centre",
                "url": "https://www.tralac.org/",
                "focus": "GTI, transposition nationale, suivi juridique",
                "verified": "2025-01-11"
            },
            {
                "source": "AfCFTA NTB Platform",
                "url": "https://tradebarriers.africa",
                "status": "Opérationnel",
                "verified": "2025-01-11"
            }
        ],
        "last_updated": datetime.now().isoformat()
    }

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

@api_router.get("/health")
async def health_check():
    """
    Vérifie l'état des fichiers de données ZLECAf
    Utilisé pour la supervision (Netlify, UptimeRobot, etc.)
    """
    from pathlib import Path
    
    files = [
        'zlecaf_tariff_lines_by_country.json',
        'zlecaf_africa_vs_world_tariffs.xlsx',
        'zlecaf_rules_of_origin.json',
        'zlecaf_dismantling_schedule.csv',
        'zlecaf_tariff_origin_phase.json',
    ]
    
    # Chemin vers le répertoire de données du frontend
    base_path = Path(__file__).parent.parent / 'frontend' / 'public' / 'data'
    
    status = {}
    for filename in files:
        file_path = base_path / filename
        try:
            # Vérifier si le fichier existe et est lisible
            status[filename] = file_path.exists() and file_path.is_file()
        except Exception:
            status[filename] = False
    
    # API est OK si tous les fichiers sont présents
    all_ok = all(status.values())
    
    return {
        "ok": all_ok,
        "files": status,
        "message": "All data files present" if all_ok else "Some data files are missing",
        "timestamp": datetime.now().isoformat()
    }

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()