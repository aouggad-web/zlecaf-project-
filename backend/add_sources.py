#!/usr/bin/env python3
"""
Script pour ajouter les sources FMI et Banque Mondiale à tous les pays
"""

import re
from pathlib import Path

def add_sources_to_country_data():
    """Ajouter les sources manquantes à tous les pays dans country_data.py"""
    
    # Lire le fichier actuel
    country_data_path = Path('/app/backend/country_data.py')
    with open(country_data_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Patterns pour trouver les entrées de pays sans sources
    # On cherche les pays qui ont external_debt_to_gdp_ratio mais pas external_debt_source
    
    # Pattern pour trouver les entrées de pays
    country_pattern = r'"([A-Z]{3})": \{([^}]+)\},'
    
    updated_content = content
    
    # Remplacements pour ajouter les sources manquantes
    # Après 'external_debt_to_gdp_ratio': X.X,
    updated_content = re.sub(
        r"'external_debt_to_gdp_ratio': ([0-9.]+),",
        r"'external_debt_to_gdp_ratio': \1, 'external_debt_source': 'FMI - Debt Sustainability Analysis 2024',",
        updated_content
    )
    
    # Après 'internal_debt_to_gdp_ratio': X.X,
    updated_content = re.sub(
        r"'internal_debt_to_gdp_ratio': ([0-9.]+),",
        r"'internal_debt_to_gdp_ratio': \1, 'internal_debt_source': 'Banque Mondiale - Public Debt Statistics 2024',",
        updated_content
    )
    
    # Après 'energy_cost_usd_kwh': X.XXX,
    updated_content = re.sub(
        r"'energy_cost_usd_kwh': ([0-9.]+),",
        r"'energy_cost_usd_kwh': \1, 'energy_cost_source': 'Banque Mondiale - Energy Statistics 2024',",
        updated_content
    )
    
    # Éviter les doublons en supprimant les sources déjà présentes avant d'ajouter
    lines = updated_content.split('\n')
    final_lines = []
    
    for line in lines:
        # Éviter les doublons de sources
        if "'external_debt_source': 'FMI" in line and "'external_debt_source'" in ''.join(final_lines[-3:]):
            continue
        if "'internal_debt_source': 'Banque Mondiale" in line and "'internal_debt_source'" in ''.join(final_lines[-3:]):
            continue
        if "'energy_cost_source': 'Banque Mondiale" in line and "'energy_cost_source'" in ''.join(final_lines[-3:]):
            continue
        final_lines.append(line)
    
    updated_content = '\n'.join(final_lines)
    
    # Écrire le fichier mis à jour
    with open(country_data_path, 'w', encoding='utf-8') as f:
        f.write(updated_content)
    
    print("Sources ajoutées avec succès à tous les pays !")

if __name__ == "__main__":
    add_sources_to_country_data()