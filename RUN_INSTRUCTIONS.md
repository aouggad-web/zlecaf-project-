# ZLECAf Application - Instructions d'Exécution

## Prérequis

### 1. MongoDB
L'application nécessite MongoDB en cours d'exécution. Vous avez plusieurs options :

#### Option A : MongoDB Local
```bash
# Ubuntu/Debian
sudo apt-get install mongodb
sudo systemctl start mongod

# macOS
brew install mongodb-community
brew services start mongodb-community
```

#### Option B : MongoDB avec Docker (Recommandé)
```bash
docker run -d -p 27017:27017 --name mongodb-zlecaf mongo:7
```

### 2. Python 3.8+
```bash
python3 --version  # Vérifier la version
```

### 3. Node.js 16+ (recommandé 16 ou 18)
```bash
node --version  # Vérifier la version
npm --version
```

**Note**: Il existe des problèmes de compatibilité connus avec Node.js 20 et react-scripts 5.0.1. Si vous rencontrez des erreurs, utilisez Node.js 16 ou 18.

## Démarrage Rapide

### Méthode 1 : Backend Seulement (Recommandé pour Node.js 20)
```bash
# Rendre le script exécutable
chmod +x run-backend.sh

# Lancer le backend uniquement
./run-backend.sh
```

Cette méthode démarre uniquement l'API backend. Vous pouvez ensuite :
- Tester l'API via http://localhost:8000/docs
- Utiliser l'API directement depuis votre propre frontend
- Exécuter les tests backend avec `python3 backend_test.py`

### Méthode 2 : Application Complète (si Node.js 16-18)
```bash
# Rendre le script exécutable
chmod +x run.sh

# Lancer l'application complète
./run.sh
```

### Méthode 3 : Démarrage Manuel

#### Backend
```bash
cd backend

# Créer un environnement virtuel
python3 -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt

# Démarrer le serveur
uvicorn server:app --host 0.0.0.0 --port 8000 --reload
```

#### Frontend (dans un nouveau terminal)
```bash
cd frontend

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm start
```

## Accès à l'Application

- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:8000
- **Documentation API** : http://localhost:8000/docs
- **Alternative Documentation** : http://localhost:8000/redoc

## Configuration

### Variables d'environnement Backend (backend/.env)
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=zlecaf_db
CORS_ORIGINS=http://localhost:3000
```

### Variables d'environnement Frontend (frontend/.env)
```
REACT_APP_BACKEND_URL=http://localhost:8000
```

## Tests

### Tester le Backend
```bash
# Depuis la racine du projet
python3 backend_test.py
```

### Tester le Frontend
```bash
cd frontend
npm test
```

## Dépannage

### Problèmes de compatibilité Node.js 20

Si vous rencontrez des erreurs comme `Cannot find module 'ajv/dist/compile/codegen'` ou `Cannot read properties of undefined (reading 'date')`, c'est dû à des incompatibilités entre Node.js 20 et react-scripts 5.0.1.

**Solutions** :
1. **Recommandé** : Utiliser seulement le backend avec `./run-backend.sh` et accéder à l'API via http://localhost:8000/docs
2. Downgrader à Node.js 16 ou 18 avec nvm :
   ```bash
   nvm install 16
   nvm use 16
   ```
3. Attendre une mise à jour de react-scripts ou migrer vers Vite

### MongoDB ne démarre pas
```bash
# Vérifier le statut avec Docker
docker ps -a | grep mongodb

# Démarrer le container
docker start mongodb-zlecaf

# Ou créer un nouveau container
docker run -d -p 27017:27017 --name mongodb-zlecaf mongo:7
```

### Port déjà utilisé
Si le port 8000 ou 3000 est déjà utilisé :

```bash
# Trouver et arrêter le processus
lsof -ti:8000 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

### Erreur CORS
Vérifiez que `CORS_ORIGINS` dans `backend/.env` inclut l'URL de votre frontend.

### Erreur de connexion API
Vérifiez que `REACT_APP_BACKEND_URL` dans `frontend/.env` pointe vers le bon serveur backend.

## Architecture

```
zlecaf-project-/
├── backend/
│   ├── server.py          # API FastAPI
│   ├── country_data.py    # Données des pays
│   ├── requirements.txt   # Dépendances Python
│   └── .env              # Configuration backend
├── frontend/
│   ├── src/
│   │   └── App.js        # Application React principale
│   ├── package.json      # Dépendances Node
│   └── .env             # Configuration frontend
├── run.sh               # Script de lancement
└── RUN_INSTRUCTIONS.md  # Ce fichier
```

## Fonctionnalités

L'application ZLECAf (Zone de Libre-Échange Continental Africain) offre :

1. **Calculateur Tarifaire** : Calcul des tarifs douaniers entre pays africains
2. **Profils Pays** : Données économiques des 54 pays membres
3. **Règles d'Origine** : Consultation des règles d'origine par code SH
4. **Statistiques** : Vue d'ensemble du commerce intra-africain

## Support

Pour toute question ou problème :
- Consultez la documentation API : http://localhost:8000/docs
- Vérifiez les logs du backend dans le terminal
- Vérifiez la console du navigateur pour les erreurs frontend
