# Lyra+ Ops — Cron hebdo & API Health

Ce patch ajoute un workflow planifié et une route API pour superviser vos datasets.

## Fonctionnalités

### 1. **Cron Hebdomadaire**
- **Fichier**: `.github/workflows/lyra_plus_ops.yml`
- **Déclenchement**: Chaque lundi à 06:15 UTC
- **Déclenchement manuel**: Via `workflow_dispatch` dans l'onglet Actions de GitHub
- **Actions**:
  - Génère les datasets via `python backend/make_release.py --demo`
  - Commit et push automatique des changements dans `frontend/public/data/`

### 2. **API Health**
- **Endpoint**: `/api/health`
- **Méthode**: GET
- **Réponse**: JSON avec le statut de disponibilité des fichiers de données
  ```json
  {
    "ok": true,
    "files": {
      "zlecaf_tariff_lines_by_country.json": true,
      "zlecaf_africa_vs_world_tariffs.xlsx": true,
      "zlecaf_rules_of_origin.json": true,
      "zlecaf_dismantling_schedule.csv": true,
      "zlecaf_tariff_origin_phase.json": true
    },
    "lastUpdated": "2024-01-15T14:30:00"
  }
  ```
- **Code HTTP**: 200 si tous les fichiers sont présents, 503 sinon

### 3. **Page Health Frontend**
- **Route**: `/health`
- **Fonctionnalité**: Affiche le statut de disponibilité de tous les fichiers de données
- **Mise à jour**: Affiche la date de dernière mise à jour des datasets

## Installation

Les fichiers suivants ont été ajoutés au projet:

```
.github/workflows/lyra_plus_ops.yml
backend/make_release.py
frontend/public/data/.gitkeep
frontend/src/components/Health.js
docs/LYRA_OPS.md
```

Les modifications ont été apportées aux fichiers:
- `backend/server.py` - Ajout de l'endpoint `/api/health`
- `frontend/src/App.js` - Ajout de la route `/health`

## Utilisation

### Génération Manuelle des Datasets

Pour générer les datasets localement:

```bash
# Mode démo (données de test)
python backend/make_release.py --demo

# Mode production (à implémenter)
python backend/make_release.py
```

### Test de l'API Health

Localement:
```bash
# Démarrer le backend
cd backend
uvicorn server:app --reload

# Dans un autre terminal
curl http://localhost:8000/api/health | jq
```

### Vérification de la Page Health

1. Démarrer le frontend: `npm start` (dans le dossier `frontend/`)
2. Accéder à http://localhost:3000/health
3. Vérifier que tous les fichiers sont marqués comme disponibles

### Déclenchement Manuel du Workflow

1. Aller dans l'onglet **Actions** de votre repository GitHub
2. Sélectionner le workflow **lyra-plus-ops**
3. Cliquer sur **Run workflow**
4. Confirmer

## Passage en Production

Par défaut, le workflow utilise le mode `--demo` qui génère des données de test.

Pour passer en production avec de vraies sources de données:

1. **Modifier `backend/make_release.py`**:
   - Implémenter la fonction `generate_production_data()`
   - Intégrer vos sources: e-Tariff, UNCTAD, OEC, etc.

2. **Modifier `.github/workflows/lyra_plus_ops.yml`**:
   ```yaml
   - name: Generate datasets (Lyra+ pipeline)
     run: |
       python backend/make_release.py  # Retirer --demo
   ```

3. **Ajouter les dépendances nécessaires**:
   - Mettre à jour `backend/requirements.txt` avec les packages nécessaires
   - Ajouter l'installation dans le workflow si besoin

## Badge de Statut (Optionnel)

Vous pouvez ajouter un badge dans votre `README.md` pour afficher le statut du workflow:

```markdown
![Lyra+ Ops](https://github.com/aouggad-web/zlecaf-project-/actions/workflows/lyra_plus_ops.yml/badge.svg)
```

## Monitoring

Pour un monitoring avancé, vous pouvez:

1. Ajouter un badge "Health" dans le README qui vérifie `/api/health`
2. Configurer des alertes GitHub Actions pour les échecs du workflow
3. Intégrer avec un service de monitoring externe (Datadog, New Relic, etc.)

## Troubleshooting

### Le workflow échoue

1. Vérifier les logs dans l'onglet Actions
2. S'assurer que `backend/make_release.py` fonctionne localement
3. Vérifier que les dépendances Python sont installées

### Les fichiers ne sont pas commités

1. Vérifier que `frontend/public/data/` n'est pas dans `.gitignore`
2. S'assurer que les fichiers sont bien générés par le script
3. Vérifier les permissions Git dans le workflow

### L'API Health retourne 503

1. Vérifier que les fichiers existent dans `frontend/public/data/`
2. Générer les datasets: `python backend/make_release.py --demo`
3. Redémarrer le serveur backend

## Support

Pour toute question ou problème, ouvrir une issue sur le repository GitHub.
