#!/usr/bin/env python3
"""
Script de création de release pour ZLECAf
Gère les configurations de démo et production
"""

import argparse
import os
import sys
from pathlib import Path

def create_demo_env():
    """Créer le fichier .env pour la démo"""
    backend_dir = Path(__file__).parent
    env_file = backend_dir / '.env'
    
    # Configuration démo avec MongoDB local
    demo_config = """# Configuration Demo ZLECAf
MONGO_URL=mongodb://localhost:27017/
DB_NAME=zlecaf_demo
PORT=8000
HOST=0.0.0.0
"""
    
    with open(env_file, 'w') as f:
        f.write(demo_config)
    
    print(f"✅ Fichier .env créé pour la démo: {env_file}")
    return env_file

def create_frontend_env():
    """Créer le fichier .env pour le frontend"""
    frontend_dir = Path(__file__).parent.parent / 'frontend'
    env_file = frontend_dir / '.env'
    
    # Configuration frontend pour pointer vers le backend local
    frontend_config = """# Configuration Frontend ZLECAf
REACT_APP_BACKEND_URL=http://localhost:8000
"""
    
    with open(env_file, 'w') as f:
        f.write(frontend_config)
    
    print(f"✅ Fichier .env créé pour le frontend: {env_file}")
    return env_file

def setup_demo():
    """Configuration complète pour la démo"""
    print("🚀 Configuration de la démo ZLECAf")
    print("=" * 60)
    
    # Créer les fichiers .env
    backend_env = create_demo_env()
    frontend_env = create_frontend_env()
    
    print("\n📝 Prochaines étapes:")
    print("1. Démarrer MongoDB (si pas déjà fait):")
    print("   docker run -d -p 27017:27017 mongo:latest")
    print("\n2. Démarrer le backend:")
    print("   cd backend && uvicorn server:app --reload --port 8000")
    print("\n3. Dans un autre terminal, démarrer le frontend:")
    print("   cd frontend && npm run dev")
    print("\n4. Accéder à l'application:")
    print("   Frontend: http://localhost:3000")
    print("   Backend API: http://localhost:8000/api")
    print("   Health Check: http://localhost:8000/api/health")
    print("\n✅ Configuration de la démo terminée!")

def setup_production():
    """Configuration pour la production"""
    print("🏭 Configuration de production")
    print("=" * 60)
    print("⚠️  La configuration de production nécessite:")
    print("  - URL MongoDB de production")
    print("  - Certificats SSL/TLS")
    print("  - Configuration des variables d'environnement")
    print("\nVeuillez configurer manuellement les fichiers .env")

def main():
    parser = argparse.ArgumentParser(
        description='Script de création de release pour ZLECAf'
    )
    parser.add_argument(
        '--demo',
        action='store_true',
        help='Créer une configuration de démo'
    )
    parser.add_argument(
        '--production',
        action='store_true',
        help='Créer une configuration de production'
    )
    
    args = parser.parse_args()
    
    if args.demo:
        setup_demo()
    elif args.production:
        setup_production()
    else:
        parser.print_help()
        print("\n💡 Utilisez --demo ou --production pour configurer l'environnement")
        sys.exit(1)

if __name__ == "__main__":
    main()
