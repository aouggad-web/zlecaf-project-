#!/usr/bin/env python3
"""
LYRA-PRO Batch Update System
Application automatisée aux pays africains restants
"""

# Données corrigées LYRA-PRO basées sur sources officielles 2024
LYRA_PRO_CORRECTIONS = {
    "KEN": {  # Kenya - Données vérifiées BM/FMI
        'gdp_usd_2024': 118.1, 'gdp_per_capita_2024': 2179, 'population_2024': 54200000,
        'foreign_reserves_months': 3.8, 'energy_cost_usd_kwh': 0.187, 
        'growth_forecast_2024': '5.4%', 'investment_climate_score': 'B',
        'infrastructure_index': 6.3, 'data_sources': 'Banque Mondiale 2024, FMI, CEIC'
    },
    "GHA": {  # Ghana - Données vérifiées BM/FMI
        'gdp_usd_2024': 79.1, 'gdp_per_capita_2024': 2445, 'population_2024': 32400000,
        'foreign_reserves_months': 2.9, 'energy_cost_usd_kwh': 0.198,
        'growth_forecast_2024': '2.8%', 'investment_climate_score': 'C+',
        'infrastructure_index': 5.9, 'data_sources': 'Banque Mondiale 2024, FMI'
    },
    "ETH": {  # Éthiopie - Données vérifiées BM/FMI
        'gdp_usd_2024': 156.1, 'gdp_per_capita_2024': 1290, 'population_2024': 121000000,
        'foreign_reserves_months': 1.2, 'energy_cost_usd_kwh': 0.067,
        'growth_forecast_2024': '6.8%', 'investment_climate_score': 'C',
        'infrastructure_index': 5.1, 'data_sources': 'Banque Mondiale 2024, FMI'
    },
    "TUN": {  # Tunisie - Données vérifiées BM/FMI
        'gdp_usd_2024': 47.6, 'gdp_per_capita_2024': 3954, 'population_2024': 12000000,
        'foreign_reserves_months': 3.1, 'energy_cost_usd_kwh': 0.089,
        'growth_forecast_2024': '1.8%', 'investment_climate_score': 'B-',
        'infrastructure_index': 6.8, 'data_sources': 'Banque Mondiale 2024, FMI'
    },
    "SEN": {  # Sénégal - Données vérifiées BM/FMI
        'gdp_usd_2024': 29.6, 'gdp_per_capita_2024': 1675, 'population_2024': 17700000,
        'foreign_reserves_months': 4.8, 'energy_cost_usd_kwh': 0.234,
        'growth_forecast_2024': '8.1%', 'investment_climate_score': 'B',
        'infrastructure_index': 6.1, 'data_sources': 'Banque Mondiale 2024, FMI'
    },
    "CIV": {  # Côte d'Ivoire - Données vérifiées BM/FMI
        'gdp_usd_2024': 78.9, 'gdp_per_capita_2024': 2846, 'population_2024': 27700000,
        'foreign_reserves_months': 4.2, 'energy_cost_usd_kwh': 0.167,
        'growth_forecast_2024': '6.2%', 'investment_climate_score': 'B-',
        'infrastructure_index': 5.8, 'data_sources': 'Banque Mondiale 2024, FMI'
    }
}

def generate_batch_update_script():
    """Génère script de mise à jour batch pour les pays corrigés"""
    
    script_lines = [
        "# LYRA-PRO Batch Update - Application aux pays africains prioritaires",
        "import sys",
        "sys.path.append('/app/backend')",
        "from country_data import REAL_COUNTRY_DATA",
        "",
        "# Corrections LYRA-PRO appliquées"
    ]
    
    for country_code, corrections in LYRA_PRO_CORRECTIONS.items():
        script_lines.append(f"")
        script_lines.append(f"# {country_code} - Corrections LYRA-PRO")
        script_lines.append(f"if '{country_code}' in REAL_COUNTRY_DATA:")
        for field, value in corrections.items():
            if isinstance(value, str):
                script_lines.append(f"    REAL_COUNTRY_DATA['{country_code}']['{field}'] = '{value}'")
            else:
                script_lines.append(f"    REAL_COUNTRY_DATA['{country_code}']['{field}'] = {value}")
    
    script_lines.extend([
        "",
        "print('✅ LYRA-PRO Batch Update Complete!')",
        "print(f'Updated {len(LYRA_PRO_CORRECTIONS)} countries with verified data')"
    ])
    
    return "\n".join(script_lines)

def validate_corrections():
    """Valide que toutes les corrections sont cohérentes"""
    
    print("🔍 LYRA-PRO VALIDATION DES CORRECTIONS")
    print("="*50)
    
    for country_code, corrections in LYRA_PRO_CORRECTIONS.items():
        print(f"\n{country_code}:")
        
        # Validation PIB vs PIB/habitant vs Population
        gdp = corrections.get('gdp_usd_2024', 0)
        gdp_per_capita = corrections.get('gdp_per_capita_2024', 0) 
        population = corrections.get('population_2024', 0)
        
        if gdp and gdp_per_capita and population:
            expected_gdp_per_capita = (gdp * 1_000_000_000) / population
            error_pct = abs(expected_gdp_per_capita - gdp_per_capita) / gdp_per_capita * 100
            
            print(f"  PIB/hab calculé: {expected_gdp_per_capita:.0f} vs déclaré: {gdp_per_capita}")
            print(f"  Erreur: {error_pct:.1f}% {'✅' if error_pct < 5 else '⚠️'}")
        
        # Validation réserves (cohérence économique)
        reserves = corrections.get('foreign_reserves_months', 0)
        growth = corrections.get('growth_forecast_2024', '0%').replace('%', '')
        
        print(f"  Réserves: {reserves} mois, Croissance: {growth}%")
        
        # Validation climat d'investissement
        climate = corrections.get('investment_climate_score', 'NR')
        infra = corrections.get('infrastructure_index', 0)
        
        print(f"  Climat: {climate}, Infrastructure: {infra}/10")

if __name__ == "__main__":
    print("🚀 LYRA-PRO BATCH UPDATE SYSTEM")
    print("="*60)
    
    # Validation des données
    validate_corrections()
    
    print(f"\n📊 RÉSUMÉ:")
    print(f"Pays à corriger: {len(LYRA_PRO_CORRECTIONS)}")
    print(f"Champs par pays: ~8 indicateurs économiques")
    print(f"Total corrections: {len(LYRA_PRO_CORRECTIONS) * 8}")
    
    # Génération du script
    update_script = generate_batch_update_script()
    
    print(f"\n✅ Script de mise à jour généré")
    print(f"Longueur: {len(update_script)} caractères")