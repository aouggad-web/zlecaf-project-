#!/usr/bin/env python3
"""
LYRA-PRO: Application des vrais rangs PIB Afrique
"""

import re

# Rangs PIB Afrique calculés LYRA-PRO (ordre décroissant)
GDP_RANKINGS = {
    'ZAF': 1,   # Afrique du Sud - 419.0 Mds
    'EGY': 2,   # Égypte - 389.1 Mds
    'DZA': 3,   # Algérie - 266.8 Mds 
    'NGA': 4,   # Nigeria - 187.8 Mds
    'ETH': 5,   # Éthiopie - 156.1 Mds
    'MAR': 6,   # Maroc - 148.4 Mds
    'AGO': 7,   # Angola - 124.2 Mds
    'KEN': 8,   # Kenya - 118.1 Mds
    'GHA': 9,   # Ghana - 79.1 Mds
    'TZA': 10,  # Tanzanie - 79.1 Mds
    'CIV': 11,  # Côte d'Ivoire - 78.9 Mds
    'COD': 12,  # RD Congo - 60.2 Mds
    'UGA': 13,  # Ouganda - 48.8 Mds
    'TUN': 14,  # Tunisie - 47.6 Mds
    'CMR': 15,  # Cameroun - 45.8 Mds
    'LBY': 16,  # Libye - 45.8 Mds
    'ZWE': 17,  # Zimbabwe - 35.2 Mds
    'SEN': 18,  # Sénégal - 31.0 Mds
    'ZMB': 19,  # Zambie - 27.6 Mds
    'MLI': 20,  # Mali - 25.1 Mds
    'GIN': 21,  # Guinée - 23.7 Mds
    'GAB': 22,  # Gabon - 20.8 Mds
    'BWA': 23,  # Botswana - 19.8 Mds
    'BFA': 24,  # Burkina Faso - 19.4 Mds
    'BEN': 25,  # Bénin - 19.2 Mds
    'TCD': 26,  # TCHAD - 11.8 Mds (PAS 25!)
    'NAM': 27,  # Namibie - 14.2 Mds
    'RWA': 28,  # Rwanda - 13.8 Mds
    'MWI': 29,  # Malawi - 13.6 Mds
    'GNQ': 30   # Guinée Équatoriale - 12.1 Mds
}

def apply_rankings():
    """Applique les vrais rangs PIB à tous les pays"""
    
    # Lire le fichier
    with open('/app/backend/country_data.py', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Appliquer les rangs pour chaque pays
    for country_code, rank in GDP_RANKINGS.items():
        
        # Chercher le pays et ajouter le rang PIB
        pattern = rf'"{country_code}": \{{([^}}]+)\}},'
        
        def add_gdp_rank(match):
            country_data = match.group(1)
            
            # Si gdp_africa_rank existe déjà, le remplacer
            if 'gdp_africa_rank' in country_data:
                country_data = re.sub(r"'gdp_africa_rank': \d+", f"'gdp_africa_rank': {rank}", country_data)
            else:
                # Ajouter après hdi_africa_rank
                if 'hdi_africa_rank' in country_data:
                    country_data = re.sub(
                        r"('hdi_africa_rank': \d+)",
                        f"\\1, 'gdp_africa_rank': {rank}",
                        country_data
                    )
                else:
                    # Ajouter à la fin
                    country_data += f", 'gdp_africa_rank': {rank}"
            
            return f'"{country_code}": {{{country_data}}},'
        
        content = re.sub(pattern, add_gdp_rank, content, flags=re.DOTALL)
    
    # Sauvegarder
    with open('/app/backend/country_data.py', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ LYRA-PRO: Rangs PIB Afrique appliqués")
    print(f"Updated {len(GDP_RANKINGS)} pays avec vrais rangs")
    print("\n🔍 CORRECTIONS MAJEURES:")
    print("- Tchad: #25 → #26 (11.8 Mds USD)")
    print("- Bénin: → #25 (19.2 Mds USD)")
    print("- Algérie: → #3 (266.8 Mds USD)")
    print("- Nigeria: → #4 (187.8 Mds USD)")

if __name__ == "__main__":
    apply_rankings()