# Taux de TVA et autres taxes par pays africain
# Sources: Réglementations nationales et communautaires 2025

# Taux de TVA standard par pays (en pourcentage)
VAT_RATES = {
    "DZ": 19.0,  # Algérie
    "AO": 14.0,  # Angola
    "BJ": 18.0,  # Bénin
    "BW": 14.0,  # Botswana
    "BF": 18.0,  # Burkina Faso
    "BI": 18.0,  # Burundi
    "CV": 15.0,  # Cap-Vert
    "CM": 19.25, # Cameroun
    "CF": 19.0,  # République Centrafricaine
    "TD": 18.0,  # Tchad
    "KM": 10.0,  # Comores
    "CG": 18.0,  # République du Congo
    "CD": 16.0,  # République Démocratique du Congo
    "CI": 18.0,  # Côte d'Ivoire
    "DJ": 10.0,  # Djibouti
    "EG": 14.0,  # Égypte
    "GQ": 15.0,  # Guinée Équatoriale
    "ER": 5.0,   # Érythrée
    "SZ": 15.0,  # Eswatini
    "ET": 15.0,  # Éthiopie
    "GA": 18.0,  # Gabon
    "GM": 15.0,  # Gambie
    "GH": 15.0,  # Ghana (Standard + NHIL + GETFund = 15% effective)
    "GN": 18.0,  # Guinée
    "GW": 15.0,  # Guinée-Bissau
    "KE": 16.0,  # Kenya
    "LS": 15.0,  # Lesotho
    "LR": 10.0,  # Libéria
    "LY": 0.0,   # Libye (pas de TVA)
    "MG": 20.0,  # Madagascar
    "MW": 16.5,  # Malawi
    "ML": 18.0,  # Mali
    "MR": 16.0,  # Mauritanie
    "MU": 15.0,  # Maurice
    "MA": 20.0,  # Maroc
    "MZ": 17.0,  # Mozambique
    "NA": 15.0,  # Namibie
    "NE": 19.0,  # Niger
    "NG": 7.5,   # Nigéria
    "RW": 18.0,  # Rwanda
    "ST": 15.0,  # São Tomé-et-Príncipe
    "SN": 18.0,  # Sénégal
    "SC": 15.0,  # Seychelles
    "SL": 15.0,  # Sierra Leone
    "SO": 0.0,   # Somalie
    "ZA": 15.0,  # Afrique du Sud
    "SS": 18.0,  # Soudan du Sud
    "SD": 17.0,  # Soudan
    "TZ": 18.0,  # Tanzanie
    "TG": 18.0,  # Togo
    "TN": 19.0,  # Tunisie
    "UG": 18.0,  # Ouganda
    "ZM": 16.0,  # Zambie
    "ZW": 14.5,  # Zimbabwe
}

# Redevance statistique (en pourcentage de la valeur CIF)
# Applicable dans certains pays
STATISTICAL_FEE = {
    "BJ": 1.0,
    "BF": 1.0,
    "CI": 1.0,
    "GN": 1.0,
    "ML": 1.0,
    "NE": 1.0,
    "SN": 1.0,
    "TG": 1.0,
    "CM": 1.0,
    "GA": 1.0,
    "TD": 1.0,
    "CF": 1.0,
    "CG": 1.0,
    "GQ": 1.0,
}

# Prélèvement Communautaire de Solidarité (PCS) - CEDEAO/UEMOA
# En pourcentage de la valeur CIF
COMMUNITY_LEVY = {
    "BJ": 0.5,
    "BF": 0.5,
    "CI": 0.5,
    "GN": 0.5,
    "GW": 0.5,
    "ML": 0.5,
    "NE": 0.5,
    "SN": 0.5,
    "TG": 0.5,
    "GM": 0.5,
    "GH": 0.5,
    "LR": 0.5,
    "NG": 0.5,
    "SL": 0.5,
}

# Prélèvement CEDEAO (en pourcentage de la valeur CIF)
ECOWAS_LEVY = {
    "BJ": 1.0,
    "BF": 1.0,
    "CI": 1.0,
    "GN": 1.0,
    "GW": 1.0,
    "ML": 1.0,
    "NE": 1.0,
    "SN": 1.0,
    "TG": 1.0,
    "GM": 1.0,
    "GH": 1.0,
    "LR": 1.0,
    "NG": 1.0,
    "SL": 1.0,
    "CV": 1.0,
}

def get_vat_rate(country_code: str) -> float:
    """Obtenir le taux de TVA pour un pays"""
    return VAT_RATES.get(country_code, 18.0)  # 18% par défaut

def get_statistical_fee_rate(country_code: str) -> float:
    """Obtenir le taux de redevance statistique"""
    return STATISTICAL_FEE.get(country_code, 0.0)

def get_community_levy_rate(country_code: str) -> float:
    """Obtenir le taux de prélèvement communautaire"""
    return COMMUNITY_LEVY.get(country_code, 0.0)

def get_ecowas_levy_rate(country_code: str) -> float:
    """Obtenir le taux de prélèvement CEDEAO"""
    return ECOWAS_LEVY.get(country_code, 0.0)

def calculate_all_taxes(value: float, customs_duty: float, country_code: str) -> dict:
    """
    Calculer toutes les taxes applicables
    
    Formule: Valeur marchandise + DD + TVA + Autres taxes
    
    Base taxable TVA = Valeur marchandise + Droits de douane + Autres taxes
    """
    # Redevance statistique (sur la valeur CIF)
    statistical_fee = value * (get_statistical_fee_rate(country_code) / 100)
    
    # Prélèvement communautaire (sur la valeur CIF)
    community_levy = value * (get_community_levy_rate(country_code) / 100)
    
    # Prélèvement CEDEAO (sur la valeur CIF)
    ecowas_levy = value * (get_ecowas_levy_rate(country_code) / 100)
    
    # Base taxable pour la TVA = Valeur + DD + autres taxes
    vat_base = value + customs_duty + statistical_fee + community_levy + ecowas_levy
    
    # TVA
    vat_rate = get_vat_rate(country_code)
    vat_amount = vat_base * (vat_rate / 100)
    
    # Total autres taxes (hors douane et TVA)
    other_taxes_total = statistical_fee + community_levy + ecowas_levy
    
    # Total général
    total_cost = value + customs_duty + vat_amount + other_taxes_total
    
    return {
        "vat_rate": vat_rate,
        "vat_amount": vat_amount,
        "statistical_fee_rate": get_statistical_fee_rate(country_code),
        "statistical_fee_amount": statistical_fee,
        "community_levy_rate": get_community_levy_rate(country_code),
        "community_levy_amount": community_levy,
        "ecowas_levy_rate": get_ecowas_levy_rate(country_code),
        "ecowas_levy_amount": ecowas_levy,
        "other_taxes_total": other_taxes_total,
        "vat_base": vat_base,
        "total_cost": total_cost
    }
