#!/usr/bin/env python3
"""
Script pour exporter toutes les données ZLECAf au format CSV
"""
import csv
import json
import sys
import os

# Ajouter le répertoire backend au path
sys.path.append('/app/backend')

from country_data import REAL_COUNTRY_DATA

# Extraire les données tarifaires directement du code
country_tariff_schedules = {
    "DZ": {  # Algérie - Tarifs corrigés (basés sur l'OMC 2024)
        "01": 0.30, "02": 0.30, "03": 0.15, "04": 0.25, "05": 0.10, "06": 0.20, "07": 0.30, "08": 0.30,
        "09": 0.20, "10": 0.20, "11": 0.25, "12": 0.15, "13": 0.10, "14": 0.05, "15": 0.25, "16": 0.35,
        "17": 0.30, "18": 0.25, "19": 0.30, "20": 0.35, "21": 0.30, "22": 0.50, "23": 0.25, "24": 0.60,
        "25": 0.05, "26": 0.00, "27": 0.05, "28": 0.15, "29": 0.15, "30": 0.05, "31": 0.15, "32": 0.20,
        "33": 0.25, "34": 0.15, "35": 0.15, "36": 0.10, "37": 0.10, "38": 0.20, "39": 0.25, "40": 0.20,
        "50": 0.20, "51": 0.20, "52": 0.20, "53": 0.15, "54": 0.20, "55": 0.20, "56": 0.20, "57": 0.20,
        "58": 0.25, "59": 0.20, "60": 0.25, "61": 0.186, "62": 0.186, "63": 0.30, "84": 0.15, "85": 0.15,
        "86": 0.10, "87": 0.35, "88": 0.10, "89": 0.15
    }
}

country_vat_rates = {
    "DZ": 0.19, "MA": 0.20, "EG": 0.14, "ZA": 0.15, "NG": 0.075, "GH": 0.125, "KE": 0.16,
    "TN": 0.19, "SN": 0.18, "CI": 0.18, "CM": 0.1925, "UG": 0.18, "TZ": 0.18, "ZM": 0.16,
    "default": 0.18
}

def export_countries_data():
    """Exporter les données des pays au format CSV"""
    
    # En-têtes pour le fichier CSV des pays
    headers = [
        'code_iso3',
        'nom_pays',
        'gdp_usd_2024',
        'gdp_per_capita_2024', 
        'population_2024',
        'external_debt_to_gdp_ratio',
        'external_debt_source',
        'internal_debt_to_gdp_ratio',
        'internal_debt_source',
        'hdi_score',
        'hdi_world_rank',
        'hdi_africa_rank'
    ]
    
    # Créer le fichier CSV des pays
    with open('/app/zlecaf_countries_data.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        
        for country_code, data in REAL_COUNTRY_DATA.items():
            row = [
                country_code,
                data.get('name', ''),
                data.get('gdp_usd_2024', ''),
                data.get('gdp_per_capita_2024', ''),
                data.get('population_2024', ''),
                data.get('external_debt_to_gdp_ratio', ''),
                data.get('external_debt_source', ''),
                data.get('internal_debt_to_gdp_ratio', ''), 
                data.get('internal_debt_source', ''),
                data.get('hdi_score', ''),
                data.get('hdi_world_rank', ''),
                data.get('hdi_africa_rank', '')
            ]
            writer.writerow(row)
    
    print(f"✅ Données des pays exportées: /app/zlecaf_countries_data.csv ({len(REAL_COUNTRY_DATA)} pays)")

def export_tariff_schedules():
    """Exporter les barèmes tarifaires par pays et code SH"""
    
    with open('/app/zlecaf_tariff_schedules.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['country_code', 'country_name', 'hs_code_2digits', 'tariff_rate_npf', 'tariff_rate_zlecaf'])
        
        for country_code, tariffs in country_tariff_schedules.items():
            country_name = REAL_COUNTRY_DATA.get(country_code, {}).get('name', country_code)
            
            for hs_code, rate in tariffs.items():
                zlecaf_rate = 0.05 if rate > 0 else 0.0  # ZLECAf: 5% temporaire ou 0%
                writer.writerow([
                    country_code,
                    country_name, 
                    hs_code,
                    rate,
                    zlecaf_rate
                ])
    
    print("✅ Barèmes tarifaires exportés: /app/zlecaf_tariff_schedules.csv")

def export_vat_rates():
    """Exporter les taux de TVA par pays"""
    
    with open('/app/zlecaf_vat_rates.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['country_code', 'country_name', 'vat_rate'])
        
        for country_code, vat_rate in country_vat_rates.items():
            if country_code != "default":
                country_name = REAL_COUNTRY_DATA.get(country_code, {}).get('name', country_code)
                writer.writerow([country_code, country_name, vat_rate])
    
    print("✅ Taux de TVA exportés: /app/zlecaf_vat_rates.csv")

def export_summary_stats():
    """Créer un fichier de statistiques résumées"""
    
    with open('/app/zlecaf_summary_stats.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['metric', 'value', 'description'])
        
        # Statistiques générales
        total_countries = len(REAL_COUNTRY_DATA)
        total_gdp = sum([float(data.get('gdp_usd_2024', 0)) for data in REAL_COUNTRY_DATA.values()])
        total_population = sum([int(data.get('population_2024', 0)) for data in REAL_COUNTRY_DATA.values()])
        
        # HDI stats
        hdi_scores = [data.get('hdi_score', 0) for data in REAL_COUNTRY_DATA.values() if data.get('hdi_score')]
        avg_hdi = sum(hdi_scores) / len(hdi_scores) if hdi_scores else 0
        
        stats = [
            ['total_countries', total_countries, 'Nombre total de pays africains dans ZLECAf'],
            ['total_gdp_billions_usd', round(total_gdp, 1), 'PIB total cumulé (milliards USD)'], 
            ['total_population_millions', round(total_population/1000000, 1), 'Population totale (millions)'],
            ['average_hdi', round(avg_hdi, 3), 'HDI moyen des pays africains'],
            ['tariff_lines_count', sum(len(tariffs) for tariffs in country_tariff_schedules.values()), 'Nombre de lignes tarifaires configurées'],
            ['countries_with_tariffs', len(country_tariff_schedules), 'Pays avec barèmes tarifaires configurés']
        ]
        
        for metric, value, description in stats:
            writer.writerow([metric, value, description])
    
    print("✅ Statistiques résumées exportées: /app/zlecaf_summary_stats.csv")

def main():
    """Exporter toutes les données"""
    print("🔄 Export des données ZLECAf en cours...")
    print()
    
    export_countries_data()
    export_tariff_schedules()  
    export_vat_rates()
    export_summary_stats()
    
    print()
    print("✅ Tous les fichiers CSV ont été créés avec succès!")
    print()
    print("📁 Fichiers générés:")
    print("  - zlecaf_countries_data.csv (données économiques et HDI)")
    print("  - zlecaf_tariff_schedules.csv (barèmes tarifaires)")  
    print("  - zlecaf_vat_rates.csv (taux de TVA)")
    print("  - zlecaf_summary_stats.csv (statistiques résumées)")

if __name__ == "__main__":
    main()