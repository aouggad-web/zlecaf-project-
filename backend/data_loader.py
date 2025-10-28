"""
Data loader for ZLECAf 2024 enhanced commerce and economic data
"""
import pandas as pd
import json
from pathlib import Path
from typing import Dict, List, Optional

ROOT_DIR = Path(__file__).parent.parent

# Load the corrections and enhanced statistics
def load_corrections_data():
    """Load the 2024 corrections JSON with tariffs and enhanced statistics"""
    corrections_path = ROOT_DIR / "zlecaf_corrections_2024.json"
    with open(corrections_path, 'r', encoding='utf-8') as f:
        return json.load(f)

# Load the complete commerce data
def load_commerce_data():
    """Load the enriched 2024 commerce data for all 54 countries"""
    commerce_path = ROOT_DIR / "ZLECAf_ENRICHI_2024_COMMERCE.csv"
    df = pd.read_csv(commerce_path)
    return df

# Load the complete country economic data
def load_country_economic_data():
    """Load the complete economic data for 54 countries"""
    economic_path = ROOT_DIR / "ZLECAF_54_PAYS_DONNEES_COMPLETES.csv"
    df = pd.read_csv(economic_path)
    return df

# Get country profile from commerce data
def get_country_commerce_profile(country_code: str) -> Optional[Dict]:
    """Get detailed commerce profile for a specific country"""
    df = load_commerce_data()
    
    # Match by Code_ISO
    country_row = df[df['Code_ISO'] == country_code.upper()]
    
    if country_row.empty:
        return None
    
    row = country_row.iloc[0]
    
    # Extract export products
    export_products = []
    for i in range(1, 6):
        col = f'Export_Produit_{i}'
        if col in row and pd.notna(row[col]):
            export_products.append(row[col])
    
    # Extract import products
    import_products = []
    for i in range(1, 6):
        col = f'Import_Produit_{i}'
        if col in row and pd.notna(row[col]):
            import_products.append(row[col])
    
    # Extract trading partners
    export_partners = []
    for i in range(1, 3):
        col = f'Partenaire_Export_{i}'
        if col in row and pd.notna(row[col]):
            export_partners.append(row[col])
    
    import_partners = []
    for i in range(1, 3):
        col = f'Partenaire_Import_{i}'
        if col in row and pd.notna(row[col]):
            import_partners.append(row[col])
    
    # Extract credit ratings
    ratings = {
        'sp': row.get('S_P_Rating_2024', 'NR'),
        'moodys': row.get('Moodys_Rating_2024', 'NR'),
        'fitch': row.get('Fitch_Rating_2024', 'NR'),
        'scope': row.get('Scope_Rating_2024', 'NR'),
        'global_risk': row.get('Risque_Global_2024', 'Non évalué')
    }
    
    # Infrastructure data
    infrastructure = {
        'international_ports': int(row['Ports_Internationaux']) if pd.notna(row.get('Ports_Internationaux')) else 1,
        'domestic_ports': int(row['Ports_Domestiques']) if pd.notna(row.get('Ports_Domestiques')) else 2,
        'international_airports': int(row['Aeroports_Internationaux']) if pd.notna(row.get('Aeroports_Internationaux')) else 1,
        'domestic_airports': int(row['Aeroports_Domestiques']) if pd.notna(row.get('Aeroports_Domestiques')) else 5,
        'railways_km': int(row['Chemins_Fer_KM']) if pd.notna(row.get('Chemins_Fer_KM')) else 0,
        'external_debt_pct_gdp': float(row['Dette_Exterieure_Pct_PIB']) if pd.notna(row.get('Dette_Exterieure_Pct_PIB')) else 60.0,
        'energy_cost_usd_kwh': float(row['Cout_Energie_USD_kWh']) if pd.notna(row.get('Cout_Energie_USD_kWh')) else 0.20
    }
    
    return {
        'country': row['Pays'],
        'code': row['Code_ISO'],
        'gdp_2024_billion_usd': float(row['PIB_2024_Mds_USD']) if pd.notna(row['PIB_2024_Mds_USD']) else None,
        'population_2024_million': float(row['Population_2024_M']) if pd.notna(row['Population_2024_M']) else None,
        'gdp_per_capita_2024': float(row['PIB_par_habitant_2024_USD']) if pd.notna(row['PIB_par_habitant_2024_USD']) else None,
        'hdi_2024': float(row['IDH_2024']) if pd.notna(row['IDH_2024']) else None,
        'growth_rate_2024': float(row['Croissance_PIB_2024_Pct']) if pd.notna(row['Croissance_PIB_2024_Pct']) else None,
        'exports_2024_billion_usd': float(row['Exportations_2024_Mds_USD']) if pd.notna(row['Exportations_2024_Mds_USD']) else None,
        'imports_2024_billion_usd': float(row['Importations_2024_Mds_USD']) if pd.notna(row['Importations_2024_Mds_USD']) else None,
        'trade_balance_2024_billion_usd': float(row['Balance_Commerciale_2024_Mds_USD']) if pd.notna(row['Balance_Commerciale_2024_Mds_USD']) else None,
        'export_products': export_products,
        'import_products': import_products,
        'export_partners': export_partners,
        'import_partners': import_partners,
        'ratings': ratings,
        'infrastructure': infrastructure,
        'zlecaf_ratified': row.get('ZLECAf_Ratifie', 'Non'),
        'zlecaf_ratification_date': row.get('Date_Ratification_ZLECAf', None),
        'sources': row.get('Sources_Principales', ''),
        'last_updated': row.get('Derniere_MAJ', ''),
        'validation_status': row.get('STATUT_VALIDATION', '')
    }

# Get all countries trade performance data
def get_all_countries_trade_performance() -> List[Dict]:
    """Get trade performance data for all countries"""
    df = load_commerce_data()
    
    countries_data = []
    for _, row in df.iterrows():
        countries_data.append({
            'country': row['Pays'],
            'code': row['Code_ISO'],
            'gdp_2024': float(row['PIB_2024_Mds_USD']) if pd.notna(row['PIB_2024_Mds_USD']) else 0,
            'exports_2024': float(row['Exportations_2024_Mds_USD']) if pd.notna(row['Exportations_2024_Mds_USD']) else 0,
            'imports_2024': float(row['Importations_2024_Mds_USD']) if pd.notna(row['Importations_2024_Mds_USD']) else 0,
            'trade_balance_2024': float(row['Balance_Commerciale_2024_Mds_USD']) if pd.notna(row['Balance_Commerciale_2024_Mds_USD']) else 0,
            'hdi_2024': float(row['IDH_2024']) if pd.notna(row['IDH_2024']) else 0,
            'growth_rate_2024': float(row['Croissance_PIB_2024_Pct']) if pd.notna(row['Croissance_PIB_2024_Pct']) else 0
        })
    
    return countries_data

# Get enhanced statistics from corrections JSON
def get_enhanced_statistics() -> Dict:
    """Get enhanced statistics including projections and trade evolution"""
    corrections = load_corrections_data()
    return corrections.get('enhanced_statistics', {})

# Get tariff corrections
def get_tariff_corrections() -> Dict:
    """Get updated tariff rates for normal and zlecaf"""
    corrections = load_corrections_data()
    return corrections.get('tariff_corrections', {})

# Load customs data
def load_customs_data():
    """Load African customs administrations data"""
    customs_path = ROOT_DIR / "douanes_africaines.json"
    with open(customs_path, 'r', encoding='utf-8') as f:
        return json.load(f)

# Load infrastructure ranking data
def load_infrastructure_ranking():
    """Load African infrastructure ranking (IPL & AIDI)"""
    ranking_path = ROOT_DIR / "classement_infrastructure_afrique.json"
    with open(ranking_path, 'r', encoding='utf-8') as f:
        return json.load(f)

# Get customs info for a country
def get_country_customs_info(country_name: str) -> Optional[Dict]:
    """Get customs administration info for a specific country"""
    customs_data = load_customs_data()
    
    # Match by country name (case-insensitive)
    for entry in customs_data:
        if entry['pays'].lower() == country_name.lower():
            return {
                'administration': entry['administration_douaniere'],
                'website': entry['site_web'],
                'offices': entry['bureaux_importants']
            }
    return None

# Get infrastructure ranking for a country
def get_country_infrastructure_ranking(country_name: str) -> Optional[Dict]:
    """Get infrastructure ranking for a specific country"""
    ranking_data = load_infrastructure_ranking()
    
    # Match by country name (case-insensitive)
    for entry in ranking_data:
        if entry['pays'].lower() == country_name.lower():
            return {
                'africa_rank': entry['rang_afrique'],
                'lpi_infrastructure_score': entry['score_infrastructure_ipl'],
                'lpi_world_rank': entry['rang_mondial_ipl'],
                'aidi_transport_score': entry['score_transport_aidi']
            }
    return None
