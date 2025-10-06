#!/usr/bin/env python3
"""
LYRA-PRO: Calcul automatique des rangs PIB Afrique
Élimination définitive des valeurs figées
"""

import sys
sys.path.append('/app/backend')
from country_data import REAL_COUNTRY_DATA

def calculate_africa_gdp_rankings():
    """Calcule les vrais rangs PIB pour tous les pays africains"""
    
    # Extraire PIB pour tous les pays avec données
    countries_with_gdp = []
    
    for country_code, data in REAL_COUNTRY_DATA.items():
        gdp = data.get('gdp_usd_2024')
        if gdp and gdp > 0:
            countries_with_gdp.append({
                'code': country_code,
                'name': data.get('name', country_code),
                'gdp': float(gdp)
            })
    
    # Trier par PIB décroissant pour calculer les rangs
    countries_with_gdp.sort(key=lambda x: x['gdp'], reverse=True)
    
    # Assigner les rangs
    gdp_rankings = {}
    for rank, country in enumerate(countries_with_gdp, 1):
        gdp_rankings[country['code']] = {
            'rank': rank,
            'gdp': country['gdp'],
            'name': country['name']
        }
    
    return gdp_rankings

def display_rankings():
    """Affiche le classement PIB Afrique"""
    
    rankings = calculate_africa_gdp_rankings()
    
    print("🏆 CLASSEMENT PIB AFRIQUE 2024 (LYRA-PRO)")
    print("="*50)
    
    # Trier par rang pour affichage
    sorted_rankings = sorted(rankings.items(), key=lambda x: x[1]['rank'])
    
    for country_code, data in sorted_rankings[:15]:  # Top 15
        print(f"#{data['rank']:2d}. {data['name']:<25} {data['gdp']:>8.1f} Mds USD")
    
    print("...")
    
    # Afficher aussi les derniers
    for country_code, data in sorted_rankings[-5:]:  # Bottom 5
        print(f"#{data['rank']:2d}. {data['name']:<25} {data['gdp']:>8.1f} Mds USD")
    
    print(f"\nTotal pays avec données PIB: {len(rankings)}")
    
    # Vérifications spécifiques
    print("\n🔍 VÉRIFICATIONS CLÉS:")
    
    key_countries = ['DZA', 'EGY', 'NGA', 'ZAF', 'TCD']
    for code in key_countries:
        if code in rankings:
            data = rankings[code]
            print(f"{data['name']:15} → Rang #{data['rank']:2d} ({data['gdp']} Mds)")
    
    return rankings

def generate_update_script(rankings):
    """Génère script pour mettre à jour tous les rangs"""
    
    print("\n📝 SCRIPT DE MISE À JOUR GÉNÉRÉ:")
    print("="*40)
    
    updates = []
    for country_code, data in rankings.items():
        updates.append(f"'{country_code}': {data['rank']}")
    
    script = f"""
# LYRA-PRO: Mise à jour rangs PIB Afrique
GDP_AFRICA_RANKINGS = {{
    {', '.join(updates)}
}}

# Application aux données pays
for country_code, rank in GDP_AFRICA_RANKINGS.items():
    if country_code in REAL_COUNTRY_DATA:
        REAL_COUNTRY_DATA[country_code]['gdp_africa_rank'] = rank

print(f"✅ Rangs PIB mis à jour pour {{len(GDP_AFRICA_RANKINGS)}} pays")
"""
    
    return script

if __name__ == "__main__":
    print("🚀 LYRA-PRO GDP RANKING CALCULATOR")
    print("="*60)
    
    rankings = display_rankings()
    
    script = generate_update_script(rankings)
    
    # Sauvegarder le script
    with open('/app/backend/update_gdp_rankings.py', 'w', encoding='utf-8') as f:
        f.write(script)
    
    print("\n✅ Script de mise à jour sauvegardé: update_gdp_rankings.py")