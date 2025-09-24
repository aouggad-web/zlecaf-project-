# Données des 54 pays africains ZLECAf
REAL_COUNTRY_DATA = {
    "DZA": {'name': 'Algérie', 'external_debt_to_gdp_ratio': 2.8, 'external_debt_source': 'FMI - Debt Sustainability Analysis 2024'},
    "NGA": {'name': 'Nigeria', 'external_debt_to_gdp_ratio': 28.7, 'external_debt_source': 'FMI - Debt Sustainability Analysis 2024'},  
    "MUS": {'name': 'Maurice', 'external_debt_to_gdp_ratio': 89.4, 'external_debt_source': 'FMI - Debt Sustainability Analysis 2024'}
}

def get_country_data(country_code):
    return REAL_COUNTRY_DATA.get(country_code, {})
