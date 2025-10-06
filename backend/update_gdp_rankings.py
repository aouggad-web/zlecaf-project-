
# LYRA-PRO: Mise à jour rangs PIB Afrique
GDP_AFRICA_RANKINGS = {
    'ZAF': 1, 'EGY': 2, 'DZA': 3, 'NGA': 4, 'ETH': 5, 'MAR': 6, 'AGO': 7, 'KEN': 8, 'GHA': 9, 'TZA': 10, 'CIV': 11, 'COD': 12, 'UGA': 13, 'TUN': 14, 'CMR': 15, 'LBY': 16, 'ZWE': 17, 'SEN': 18, 'ZMB': 19, 'MLI': 20, 'GIN': 21, 'GAB': 22, 'SDN': 23, 'BWA': 24, 'BFA': 25, 'BEN': 26, 'MOZ': 27, 'MDG': 28, 'NER': 29, 'MUS': 30, 'NAM': 31, 'RWA': 32, 'MWI': 33, 'COG': 34, 'GNQ': 35, 'TCD': 36, 'MRT': 37, 'TGO': 38, 'SOM': 39, 'SLE': 40, 'SWZ': 41, 'LBR': 42, 'DJI': 43, 'SSD': 44, 'BDI': 45, 'LSO': 46, 'CAF': 47, 'CPV': 48, 'GMB': 49, 'ERI': 50, 'SYC': 51, 'GNB': 52, 'COM': 53, 'STP': 54
}

# Application aux données pays
for country_code, rank in GDP_AFRICA_RANKINGS.items():
    if country_code in REAL_COUNTRY_DATA:
        REAL_COUNTRY_DATA[country_code]['gdp_africa_rank'] = rank

print(f"✅ Rangs PIB mis à jour pour {len(GDP_AFRICA_RANKINGS)} pays")
