# ZLECAf Data Directory

Ce répertoire contient les jeux de données ZLECAf générés automatiquement par le workflow Lyra+ Ops.

## Fichiers - Démonstration

- `zlecaf_tariff_lines_by_country.json` - Lignes tarifaires par pays
- `zlecaf_africa_vs_world_tariffs.xlsx` - Comparaison tarifs ZLECAf vs monde
- `zlecaf_rules_of_origin.json` - Règles d'origine par secteur
- `zlecaf_dismantling_schedule.csv` - Calendrier de démantèlement tarifaire
- `zlecaf_tariff_origin_phase.json` - Données intégrées (tarifs + origine + phases)

## Fichiers - AfCFTA 2025+ (Nouveaux)

### Matrices de démantèlement et taux 2025-2035

- `zlecaf_dismantling_matrix_2025.csv` - Matrice large (HS6 × Pays)
- `zlecaf_afcfta_rates_by_year_2025.csv` - Taux par année (format long)
- `zlecaf_immediate_dismantled_2025.csv` - Positions démantèlement immédiat
- `zlecaf_afcfta_2025_metadata.json` - Métadonnées et documentation
- `zlecaf_afcfta_dismantling_2025.xlsx` - Classeur Excel (4 feuilles)

📖 **Documentation complète** : `docs/AFCFTA_2025_DATA.md`

## Génération

Ces fichiers sont automatiquement générés et mis à jour :

### Données de démonstration
- **Automatiquement** : Chaque lundi à 06:15 UTC via GitHub Actions
- **Manuellement** : `python backend/make_release.py --demo`

### Données AfCFTA 2025+
- **Manuellement** : `python backend/make_release.py --afcfta-2025`
- **Direct** : `python backend/generate_afcfta_2025_data.py`

## Mode Production

En mode production, ces fichiers seront générés à partir des sources officielles :
- e-Tariff Portal (schedules tarifaires)
- UNCTAD TRAINS (données commerciales)
- OEC Atlas (complexité économique)
- Douanes nationales (API officielles)

Voir `docs/LYRA_OPS.md` et `docs/AFCFTA_2025_DATA.md` pour plus de détails.
