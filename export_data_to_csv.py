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
from server import country_tariff_schedules, country_vat_rates

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