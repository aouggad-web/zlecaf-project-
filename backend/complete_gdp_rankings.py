#!/usr/bin/env python3
"""
LYRA-PRO: Finaliser TOUS les rangs PIB Afrique (54 pays)
"""

import re
import sys
sys.path.append('/app/backend')
from country_data import REAL_COUNTRY_DATA

def calculate_complete_rankings():
    """Calculer rangs PIB pour TOUS les 54 pays"""
    
    # Extraire tous les PIB
    countries_gdp = []
    
    for code, data in REAL_COUNTRY_DATA.items():
        gdp = data.get('gdp_usd_2024', 0)
        if gdp and gdp > 0:
            countries_gdp.append({
                'code': code,
                'name': data.get('name', code),
                'gdp': float(gdp)
            })
    
    # Trier par PIB décroissant
    countries_gdp.sort(key=lambda x: x['gdp'], reverse=True)
    
    # Créer dictionnaire complet des rangs
    complete_rankings = {}
    for rank, country in enumerate(countries_gdp, 1):
        complete_rankings[country['code']] = rank
    
    return complete_rankings, countries_gdp

def display_complete_ranking():
    """Afficher le classement complet"""
    
    rankings, sorted_countries = calculate_complete_rankings()
    
    print("🏆 CLASSEMENT PIB AFRIQUE COMPLET - 54 PAYS")
    print("="*60)
    
    for i, country in enumerate(sorted_countries):
        rank = i + 1
        print(f"#{rank:2d}. {country['name']:<30} {country['gdp']:>8.1f} Mds USD")
    
    print(f"\nTotal: {len(sorted_countries)} pays avec données PIB")
    
    return rankings

def apply_all_rankings():
    """Appliquer tous les rangs manquants"""
    
    rankings = display_complete_ranking()
    
    # Lire fichier
    with open('/app/backend/country_data.py', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Appliquer TOUS les rangs
    for country_code, rank in rankings.items():
        
        pattern = rf'"{country_code}": \{{([^}}]+)\}},'
        
        def update_rank(match):
            country_data = match.group(1)
            
            # Si rang existe, le remplacer
            if 'gdp_africa_rank' in country_data:
                country_data = re.sub(
                    r"'gdp_africa_rank': \d+", 
                    f"'gdp_africa_rank': {rank}", 
                    country_data
                )
            else:
                # Ajouter nouveau rang
                if 'hdi_africa_rank' in country_data:
                    country_data = re.sub(
                        r"('hdi_africa_rank': \d+)",
                        f"\\1, 'gdp_africa_rank': {rank}",
                        country_data
                    )
                else:
                    # Ajouter à la fin avant les sources
                    if 'data_sources' in country_data:
                        country_data = re.sub(
                            r"('data_sources': '[^']+')$",
                            f"'gdp_africa_rank': {rank}, \\1",
                            country_data
                        )
                    else:
                        country_data += f", 'gdp_africa_rank': {rank}"
            
            return f'"{country_code}": {{{country_data}}},'
        
        content = re.sub(pattern, update_rank, content, flags=re.DOTALL)
    
    # Sauvegarder
    with open('/app/backend/country_data.py', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"\n✅ LYRA-PRO: Rangs PIB appliqués à TOUS les {len(rankings)} pays")
    
    # Vérifications importantes
    print("\n🔍 TOP 10 CONFIRMÉ:")
    top_10 = [(code, rank) for code, rank in rankings.items() if rank <= 10]
    top_10.sort(key=lambda x: x[1])
    
    for code, rank in top_10:
        country_name = REAL_COUNTRY_DATA[code]['name']
        gdp = REAL_COUNTRY_DATA[code]['gdp_usd_2024']
        print(f"#{rank}. {country_name}: {gdp} Mds USD")

if __name__ == "__main__":
    apply_all_rankings()