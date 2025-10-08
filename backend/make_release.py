#!/usr/bin/env python3
"""
Script pour préparer et initialiser l'environnement de l'application ZLECAf.
Peut être utilisé pour créer des données de démonstration et vérifier la configuration.
"""

import argparse
import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
import json
from datetime import datetime

# Charger les variables d'environnement
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')


async def check_database_connection():
    """Vérifier la connexion à la base de données"""
    try:
        mongo_url = os.environ.get('MONGO_URL')
        if not mongo_url:
            print("❌ MONGO_URL non définie dans .env")
            return False
        
        client = AsyncIOMotorClient(mongo_url, serverSelectionTimeoutMS=5000)
        db = client[os.environ.get('DB_NAME', 'zlecaf')]
        
        # Test de ping
        await db.command('ping')
        print("✅ Connexion à MongoDB établie")
        
        # Afficher les collections existantes
        collections = await db.list_collection_names()
        print(f"📦 Collections existantes: {', '.join(collections) if collections else 'aucune'}")
        
        client.close()
        return True
    except Exception as e:
        print(f"⚠️  Erreur de connexion à MongoDB: {e}")
        print("ℹ️  L'application peut fonctionner sans MongoDB pour certaines fonctionnalités")
        return False


async def create_demo_data():
    """Créer des données de démonstration dans la base de données"""
    try:
        mongo_url = os.environ.get('MONGO_URL')
        client = AsyncIOMotorClient(mongo_url)
        db = client[os.environ.get('DB_NAME', 'zlecaf')]
        
        print("\n🚀 Création de données de démonstration...")
        
        # Créer quelques calculs de démonstration
        demo_calculations = [
            {
                "calculation_id": "demo-001",
                "origin_country": "MA",
                "destination_country": "SN",
                "hs_code": "847989",
                "product_value": 50000,
                "normal_tariff": 2500,
                "zlecaf_tariff": 0,
                "savings": 2500,
                "created_at": datetime.now().isoformat()
            },
            {
                "calculation_id": "demo-002",
                "origin_country": "KE",
                "destination_country": "TZ",
                "hs_code": "010121",
                "product_value": 10000,
                "normal_tariff": 2500,
                "zlecaf_tariff": 0,
                "savings": 2500,
                "created_at": datetime.now().isoformat()
            },
            {
                "calculation_id": "demo-003",
                "origin_country": "ZA",
                "destination_country": "NG",
                "hs_code": "620342",
                "product_value": 25000,
                "normal_tariff": 7500,
                "zlecaf_tariff": 0,
                "savings": 7500,
                "created_at": datetime.now().isoformat()
            }
        ]
        
        # Insérer les calculs de démonstration
        for calc in demo_calculations:
            result = await db.comprehensive_calculations.update_one(
                {"calculation_id": calc["calculation_id"]},
                {"$set": calc},
                upsert=True
            )
            print(f"✅ Calcul de démo {calc['calculation_id']} créé/mis à jour")
        
        # Afficher les statistiques
        count = await db.comprehensive_calculations.count_documents({})
        print(f"\n📊 Total de calculs dans la base: {count}")
        
        client.close()
        print("✅ Données de démonstration créées avec succès")
        return True
    except Exception as e:
        print(f"❌ Erreur lors de la création des données: {e}")
        return False


async def verify_environment():
    """Vérifier que toutes les variables d'environnement nécessaires sont présentes"""
    print("\n🔍 Vérification de l'environnement...")
    
    required_vars = ['MONGO_URL', 'DB_NAME']
    optional_vars = ['CORS_ORIGINS']
    
    all_ok = True
    for var in required_vars:
        value = os.environ.get(var)
        if value:
            # Masquer les infos sensibles
            if 'URL' in var or 'PASSWORD' in var:
                display_value = value[:10] + "..." if len(value) > 10 else "***"
            else:
                display_value = value
            print(f"✅ {var}: {display_value}")
        else:
            print(f"❌ {var}: non définie")
            all_ok = False
    
    for var in optional_vars:
        value = os.environ.get(var)
        if value:
            print(f"ℹ️  {var}: {value}")
        else:
            print(f"⚠️  {var}: non définie (optionnel)")
    
    return all_ok


def main():
    """Fonction principale"""
    parser = argparse.ArgumentParser(description='Initialiser l\'environnement ZLECAf')
    parser.add_argument('--demo', action='store_true', help='Créer des données de démonstration')
    parser.add_argument('--check', action='store_true', help='Vérifier uniquement la configuration')
    
    args = parser.parse_args()
    
    print("=" * 70)
    print("🌍 ZLECAf Release Manager")
    print("=" * 70)
    
    # Vérifier l'environnement
    env_ok = asyncio.run(verify_environment())
    
    if not env_ok:
        print("\n❌ Environnement incomplet. Créez un fichier .env avec les variables nécessaires.")
        sys.exit(1)
    
    # Vérifier la connexion à la base de données
    db_ok = asyncio.run(check_database_connection())
    
    if not db_ok and args.demo:
        print("\n❌ MongoDB requis pour créer des données de démonstration.")
        sys.exit(1)
    
    # Créer des données de démo si demandé
    if args.demo:
        demo_ok = asyncio.run(create_demo_data())
        if not demo_ok:
            sys.exit(1)
    
    if args.check:
        print("\n✅ Toutes les vérifications ont réussi!")
        sys.exit(0)
    
    print("\n" + "=" * 70)
    print("✅ Release préparée avec succès!")
    print("=" * 70)
    print("\nPour démarrer l'application:")
    print("  Backend:  cd backend && python -m uvicorn server:app --reload --host 0.0.0.0 --port 8000")
    print("  Frontend: cd frontend && npm run dev")
    print("\nEndpoints disponibles:")
    print("  Health:   http://localhost:8000/api/health")
    print("  API Root: http://localhost:8000/api/")
    print("  Frontend: http://localhost:3000")
    print("=" * 70)


if __name__ == "__main__":
    main()
