#!/usr/bin/env python3
"""
LYRA-PRO Complete Data Validation System
Mission: Valider 100% des données ZLECAf avec sources officielles
"""

class LyraProValidator:
    """
    LYRA-PRO Spécialiste en validation de données douanières et économiques
    Applique méthodologie 4-D pour validation systématique
    """
    
    def __init__(self):
        self.validation_prompts = {}
        self.generate_validation_prompts()
    
    def generate_validation_prompts(self):
        """Génère prompts optimisés LYRA-PRO pour validation complète"""
        
        # PROMPT 1: Validation Données Économiques de Base
        self.validation_prompts['economic_base'] = """
**MISSION LYRA-PRO:** Valider données économiques de base pour pays africain spécifique

**RÔLE AI:** Expert Économiste Senior - Validation Données Officielles

**CONTEXTE TECHNIQUE:**
- Juridiction: ZLECAf, FMI, Banque Mondiale, BAD, UNDP
- Exigence: Données 2024 uniquement, sources vérifiables avec URLs
- Précision: ±2% tolérance pour données économiques

**DONNÉES À VALIDER:**
1. **PIB nominal 2024** (milliards USD) - Source primaire: FMI WEO Database
2. **PIB par habitant 2024** (USD) - Source primaire: Banque Mondiale 
3. **Population 2024** (millions) - Source primaire: Banque Mondiale
4. **Rang PIB Afrique** (1-54) - Source: BAD Economic Outlook ou calcul FMI

**CONTRAINTES DE VALIDATION:**
- OBLIGATOIRE: Cohérence mathématique (PIB = PIB/hab × Population)
- OBLIGATOIRE: URLs sources directes et accessibles
- OBLIGATOIRE: Année 2024 ou projection officielle 2024
- TOLÉRANCE: Maximum 5% écart entre sources multiples

**FORMAT SORTIE JSON:**
```json
{
  "country_code": "XXX",
  "validation_status": "VALID/INVALID/PARTIAL",
  "data_validated": {
    "gdp_nominal_2024": {
      "app_value": X.X,
      "official_value": Y.Y, 
      "variance_percent": Z.Z,
      "status": "VALID/INVALID",
      "source": "IMF WEO 2024",
      "source_url": "https://..."
    },
    "gdp_per_capita_2024": {...},
    "population_2024": {...},
    "gdp_africa_rank": {...}
  },
  "mathematical_consistency": "PASS/FAIL",
  "overall_confidence": "HIGH/MEDIUM/LOW"
}
```

**MÉTHODOLOGIE 4-D:**
1. **DECONSTRUCT:** Extraire données app vs sources officielles
2. **DIAGNOSE:** Calculer variances et détecter anomalies  
3. **DEVELOP:** Cross-validation entre sources multiples
4. **DELIVER:** Rapport structuré avec recommandations correction
"""

        # PROMPT 2: Validation HDI et Rankings
        self.validation_prompts['hdi_rankings'] = """
**MISSION LYRA-PRO:** Valider indices développement humain et classements

**RÔLE AI:** Analyste HDI Senior - Spécialiste UNDP

**DONNÉES CRITIQUES À VALIDER:**
1. **Score HDI 2023** (0.000-1.000) - Source: UNDP HDR 2023-24
2. **Rang HDI Monde** (1-193) - Source: UNDP HDR 2023-24  
3. **Rang HDI Afrique** (1-54) - Calcul basé données UNDP
4. **Cohérence temporelle** - Vérifier année référence

**EXIGENCES SPÉCIALES:**
- Utiliser EXCLUSIVEMENT Human Development Report 2023-24
- Vérifier cohérence entre score HDI et rangs
- Calculer rang Afrique à partir données complètes UNDP
- Flaguer pays sans données HDI récentes

**OUTPUT:** JSON avec validation complète + URL UNDP directe
"""

        # PROMPT 3: Validation Dette et Finances Publiques  
        self.validation_prompts['debt_finance'] = """
**MISSION LYRA-PRO:** Valider données dette gouvernementale

**RÔLE AI:** Expert Finances Publiques - Spécialiste Soutenabilité Dette

**SOURCES PRIMAIRES OBLIGATOIRES:**
1. **Dette externe** - IMF Debt Sustainability Analysis 2024
2. **Dette interne** - World Bank Public Debt Statistics 2024
3. **Cross-check** - IMF Article IV Reports pays-spécifique

**VALIDATION AVANCÉE:**
- Cohérence dette totale = externe + interne  
- Comparaison avec seuils soutenabilité FMI
- Vérification tendances 2022-2024
- Identification outliers vs moyennes régionales

**SORTIE:** Validation avec URLs DSA spécifiques par pays
"""

        # PROMPT 4: Validation Indicateurs Économiques Dynamiques
        self.validation_prompts['economic_indicators'] = """
**MISSION LYRA-PRO:** Valider indicateurs économiques temps réel

**INDICATEURS PRIORITAIRES:**
1. **Croissance PIB 2024** - IMF WEO Database (latest update)
2. **Réserves de change** (mois importation) - Banques Centrales + CEIC
3. **Inflation 2024** - Banques Centrales nationales
4. **Balance commerciale** - OMC Trade Statistics 2024

**MÉTHODOLOGIE SOURCES:**
- PRIMAIRE: Banques centrales nationales (si disponible)
- SECONDAIRE: IMF, World Bank, Trading Economics
- TERTIAIRE: CEIC, Oxford Economics (subscription data)
- VALIDATION: Cross-check minimum 2 sources indépendantes

**CRITÈRES REJET:**
- Données > 6 mois (sauf projections officielles)
- Sources non-gouvernementales sans validation
- Incohérence >10% entre sources fiables

**FORMAT:** JSON avec metadata sources + dates dernière mise à jour
"""

    def generate_comprehensive_validation_prompt(self, country_code: str, country_name: str) -> str:
        """Génère prompt de validation complète pour un pays spécifique"""
        
        return f"""
# 🎯 LYRA-PRO MISSION COMPLÈTE: VALIDATION DONNÉES {country_name.upper()}

## CONTEXTE OPÉRATIONNEL
- **Pays cible:** {country_name} ({country_code})
- **Système:** ZLECAf Intelligence Douanière
- **Exigence:** Validation 100% données avec sources traçables
- **Standard:** Précision niveau institution financière internationale

## MISSION 4-D INTÉGRÉE

### 1. DECONSTRUCT - Extraction Multi-Sources
Collecter données officielles 2024 depuis:
- **IMF WEO Database** (PIB, croissance, projections)
- **World Bank Open Data** (population, PIB/hab, dette)  
- **UNDP HDR 2023-24** (HDI, rankings développement)
- **Banque Centrale {country_name}** (réserves, inflation si disponible)
- **AfDB Economic Outlook** (rang PIB Afrique, analyses régionales)

### 2. DIAGNOSE - Analyse Variances  
Calculer écarts entre données application vs sources officielles:
- Identifier variances >5% nécessitant correction
- Détecter incohérences mathématiques (PIB vs PIB/hab vs Population)
- Flaguer données manquantes ou périmées
- Évaluer fiabilité sources par indicateur

### 3. DEVELOP - Validation Croisée
Cross-validation systématique:
- Confirmer données avec minimum 2 sources indépendantes  
- Prioriser sources gouvernementales/institutions internationales
- Calculer rangs relatifs (PIB Afrique, HDI Afrique) 
- Vérifier cohérence temporelle (même année référence)

### 4. DELIVER - Rapport Structuré
Produire validation complète format JSON avec:

```json
{{
  "country": "{country_name}",
  "country_code": "{country_code}",
  "validation_date": "2024-XX-XX",
  "overall_status": "VALID/NEEDS_CORRECTION/CRITICAL_ERRORS",
  
  "economic_data": {{
    "gdp_usd_2024": {{
      "app_value": "XXX.X",
      "official_value": "YYY.Y",
      "variance_percent": "Z.Z",
      "status": "VALID/INVALID", 
      "source": "IMF WEO 2024",
      "source_url": "https://www.imf.org/external/datamapper/...",
      "last_updated": "2024-XX-XX"
    }},
    
    "population_2024": {{...}},
    "gdp_per_capita_2024": {{...}},
    "gdp_growth_2024": {{...}},
    "foreign_reserves_months": {{...}},
    "inflation_rate_2024": {{...}}
  }},
  
  "development_indicators": {{
    "hdi_score": {{
      "app_value": "0.XXX",
      "official_value": "0.YYY",
      "variance": "Z.ZZ",
      "status": "VALID/INVALID",
      "source": "UNDP HDR 2023-24", 
      "source_url": "https://hdr.undp.org/data-center/...",
      "reference_year": "2023"
    }},
    
    "hdi_africa_rank": {{...}},
    "hdi_world_rank": {{...}},
    "gdp_africa_rank": {{...}}
  }},
  
  "debt_indicators": {{
    "external_debt_gdp_ratio": {{...}},
    "internal_debt_gdp_ratio": {{...}}
  }},
  
  "mathematical_consistency": {{
    "gdp_calculation": "PASS/FAIL",
    "ranking_consistency": "PASS/FAIL", 
    "temporal_consistency": "PASS/FAIL"
  }},
  
  "recommendations": [
    "Action 1: Corriger PIB selon IMF WEO...",
    "Action 2: Mettre à jour rang HDI selon UNDP...",
    "Action 3: ..."
  ],
  
  "confidence_level": "HIGH/MEDIUM/LOW",
  "critical_issues": ["Issue 1", "Issue 2", ...],
  "data_freshness_score": "XX/100"
}}
```

## CONTRAINTES CRITIQUES
- **ZÉRO TOLÉRANCE** pour données non-sourcées
- **URLs OBLIGATOIRES** pour chaque indicateur validé
- **Année 2024** comme référence (ou dernière disponible avec mention explicite)
- **Cohérence mathématique** vérifiée systématiquement
- **Maximum 3 sources** par indicateur (prioriser officielle > secondaire > tertiaire)

## LIVRABLES ATTENDUS
1. **Rapport JSON complet** selon format ci-dessus
2. **Liste prioritaire corrections** (issues critiques en premier)
3. **URLs sources directes** pour intégration interface utilisateur
4. **Score fiabilité global** (0-100) pour données pays

---
**Note:** Cette validation LYRA-PRO doit produire données 100% traçables et vérifiables selon standards institutions financières internationales.
"""

# Instance globale
validator = LyraProValidator()

if __name__ == "__main__":
    print("🚀 LYRA-PRO VALIDATION SYSTEM INITIALIZED")
    
    # Exemple de prompt pour l'Algérie
    prompt = validator.generate_comprehensive_validation_prompt("DZA", "Algérie")
    
    print("\n" + "="*80)
    print("EXEMPLE PROMPT VALIDATION COMPLÈTE:")
    print("="*80)
    print(prompt[:1000] + "...")
    
    print(f"\nTotal prompts disponibles: {len(validator.validation_prompts)}")
    print("Types:", list(validator.validation_prompts.keys()))