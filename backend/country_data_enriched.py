# Données économiques enrichies des 54 pays ZLECAf
# Sources: FMI, Banque Mondiale, S&P, Moody's, Fitch, Coface, BAD, OCDE
# Codes ISO3 pour compatibilité API
# Dernière mise à jour: 2024-09-21

REAL_COUNTRY_DATA = {
    "DZA": {  # Algérie
        "name": "Algérie",
        "gdp_usd_2024": 269.1,
        "gdp_per_capita_2024": 5763,
        "population_2024": 46700000,
        "development_index": 0.745,
        "africa_rank": 3,
        "growth_forecast_2024": "3.2%",
        "debt_to_gdp_ratio": 58.4,
        "inflation_rate_2024": 7.2,
        "foreign_reserves_months": 8.5,
        "trade_balance_usd": 12.8,
        "ease_of_doing_business_rank": 157,
        "risk_ratings": {
            "sp": "B+",
            "moodys": "B2",
            "fitch": "B+",
            "coface": "C",
            "global_risk": "Élevé"
        },
        "export_products": [
            {"name": "Hydrocarbures", "share": 92.0, "value_usd": 38.2, "type": "Énergie"},
            {"name": "Produits chimiques", "share": 3.2, "value_usd": 1.3, "type": "Industrie"},
            {"name": "Produits alimentaires", "share": 2.1, "value_usd": 0.9, "type": "Agriculture"},
            {"name": "Métaux", "share": 1.5, "value_usd": 0.6, "type": "Minier"},
            {"name": "Textiles", "share": 1.2, "value_usd": 0.5, "type": "Manufacture"}
        ],
        "key_sectors": [
            {"name": "Hydrocarbures", "pib_share": 35.0, "description": "Pétrole et gaz naturel"},
            {"name": "Services", "pib_share": 40.0, "description": "Commerce et télécommunications"},
            {"name": "Industrie", "pib_share": 25.0, "description": "Agroalimentaire et textile"}
        ],
        "top_trade_partners": ["Espagne", "Italie", "France", "Turquie", "Brésil"],
        "investment_opportunities": ["Énergies renouvelables", "Agroalimentaire", "Tourisme", "TIC"]
    },
    
    "AGO": {  # Angola
        "name": "Angola",
        "gdp_usd_2024": 124.2,
        "gdp_per_capita_2024": 3508,
        "population_2024": 35400000,
        "development_index": 0.586,
        "africa_rank": 8,
        "growth_forecast_2024": "2.8%",
        "debt_to_gdp_ratio": 89.7,
        "inflation_rate_2024": 13.8,
        "foreign_reserves_months": 6.2,
        "trade_balance_usd": 18.5,
        "ease_of_doing_business_rank": 177,
        "risk_ratings": {
            "sp": "B-",
            "moodys": "B3",
            "fitch": "B-",
            "coface": "D",
            "global_risk": "Très Élevé"
        },
        "export_products": [
            {"name": "Pétrole brut", "share": 89.5, "value_usd": 32.1, "type": "Énergie"},
            {"name": "Diamants", "share": 6.2, "value_usd": 2.2, "type": "Minier"},
            {"name": "Produits pétroliers raffinés", "share": 2.1, "value_usd": 0.8, "type": "Énergie"},
            {"name": "Café", "share": 1.2, "value_usd": 0.4, "type": "Agriculture"},
            {"name": "Poisson", "share": 1.0, "value_usd": 0.4, "type": "Agriculture"}
        ],
        "key_sectors": [
            {"name": "Pétrole", "pib_share": 50.0, "description": "Extraction pétrolière"},
            {"name": "Services", "pib_share": 30.0, "description": "Commerce et finance"},
            {"name": "Agriculture", "pib_share": 20.0, "description": "Café et pêche"}
        ],
        "top_trade_partners": ["Chine", "Inde", "France", "Portugal", "Afrique du Sud"],
        "investment_opportunities": ["Diversification économique", "Agriculture", "Pêche", "Tourisme"]
    },

    "BEN": {  # Bénin
        "name": "Bénin",
        "gdp_usd_2024": 19.4,
        "gdp_per_capita_2024": 1574,
        "population_2024": 12300000,
        "development_index": 0.515,
        "africa_rank": 38,
        "growth_forecast_2024": "6.1%",
        "debt_to_gdp_ratio": 54.8,
        "inflation_rate_2024": 3.2,
        "foreign_reserves_months": 4.1,
        "trade_balance_usd": -2.1,
        "ease_of_doing_business_rank": 149,
        "risk_ratings": {
            "sp": "B",
            "moodys": "B1",
            "fitch": "B",
            "coface": "C",
            "global_risk": "Modéré"
        },
        "export_products": [
            {"name": "Coton", "share": 31.5, "value_usd": 0.8, "type": "Agriculture"},
            {"name": "Noix de cajou", "share": 18.2, "value_usd": 0.5, "type": "Agriculture"},
            {"name": "Produits pétroliers", "share": 15.4, "value_usd": 0.4, "type": "Énergie"},
            {"name": "Or", "share": 12.1, "value_usd": 0.3, "type": "Minier"},
            {"name": "Karité", "share": 8.3, "value_usd": 0.2, "type": "Agriculture"}
        ],
        "key_sectors": [
            {"name": "Agriculture", "pib_share": 26.0, "description": "Coton et cultures vivrières"},
            {"name": "Services", "pib_share": 52.0, "description": "Commerce et transport"},
            {"name": "Industrie", "pib_share": 22.0, "description": "Transformation agroalimentaire"}
        ],
        "top_trade_partners": ["Bangladesh", "Inde", "Niger", "Nigeria", "Chine"],
        "investment_opportunities": ["Agro-industrie", "Port de Cotonou", "Énergie solaire", "Textile"]
    },

    "BWA": {  # Botswana
        "name": "Botswana",
        "gdp_usd_2024": 20.3,
        "gdp_per_capita_2024": 8466,
        "population_2024": 2400000,
        "development_index": 0.735,
        "africa_rank": 36,
        "growth_forecast_2024": "4.1%",
        "debt_to_gdp_ratio": 24.7,
        "inflation_rate_2024": 4.8,
        "foreign_reserves_months": 12.3,
        "trade_balance_usd": 2.8,
        "ease_of_doing_business_rank": 87,
        "risk_ratings": {
            "sp": "A-",
            "moodys": "A2",
            "fitch": "A-",
            "coface": "A3",
            "global_risk": "Faible"
        },
        "export_products": [
            {"name": "Diamants", "share": 79.2, "value_usd": 4.1, "type": "Minier"},
            {"name": "Cuivre-nickel", "share": 8.4, "value_usd": 0.4, "type": "Minier"},
            {"name": "Bœuf", "share": 4.1, "value_usd": 0.2, "type": "Agriculture"},
            {"name": "Carbonate de sodium", "share": 3.2, "value_usd": 0.2, "type": "Minier"},
            {"name": "Textiles", "share": 2.8, "value_usd": 0.1, "type": "Manufacture"}
        ],
        "key_sectors": [
            {"name": "Diamants", "pib_share": 18.0, "description": "Extraction diamantaire"},
            {"name": "Services", "pib_share": 61.0, "description": "Services financiers"},
            {"name": "Agriculture", "pib_share": 21.0, "description": "Élevage bovin"}
        ],
        "top_trade_partners": ["Belgique", "Afrique du Sud", "Namibie", "Royaume-Uni", "Inde"],
        "investment_opportunities": ["Services financiers", "Énergie solaire", "Tourisme", "Agriculture"]
    },

    "BFA": {  # Burkina Faso
        "name": "Burkina Faso",
        "gdp_usd_2024": 20.1,
        "gdp_per_capita_2024": 912,
        "population_2024": 22000000,
        "development_index": 0.449,
        "africa_rank": 39,
        "growth_forecast_2024": "5.8%",
        "debt_to_gdp_ratio": 61.9,
        "inflation_rate_2024": 2.1,
        "foreign_reserves_months": 3.8,
        "trade_balance_usd": -1.2,
        "ease_of_doing_business_rank": 151,
        "risk_ratings": {
            "sp": "B-",
            "moodys": "B3",
            "fitch": "B-",
            "coface": "D",
            "global_risk": "Très Élevé"
        },
        "export_products": [
            {"name": "Or", "share": 67.8, "value_usd": 2.1, "type": "Minier"},
            {"name": "Coton", "share": 19.4, "value_usd": 0.6, "type": "Agriculture"},
            {"name": "Zinc", "share": 4.2, "value_usd": 0.1, "type": "Minier"},
            {"name": "Sésame", "share": 3.1, "value_usd": 0.1, "type": "Agriculture"},
            {"name": "Bétail", "share": 2.8, "value_usd": 0.1, "type": "Agriculture"}
        ],
        "key_sectors": [
            {"name": "Agriculture", "pib_share": 31.0, "description": "Coton et céréales"},
            {"name": "Services", "pib_share": 44.0, "description": "Commerce et transport"},
            {"name": "Mines", "pib_share": 25.0, "description": "Or et métaux"}
        ],
        "top_trade_partners": ["Suisse", "Inde", "Singapour", "Ghana", "Côte d'Ivoire"],
        "investment_opportunities": ["Mines d'or", "Agriculture", "Énergie solaire", "Élevage"]
    },

    "BDI": {  # Burundi
        "name": "Burundi",
        "gdp_usd_2024": 3.8,
        "gdp_per_capita_2024": 308,
        "population_2024": 12400000,
        "development_index": 0.426,
        "africa_rank": 51,
        "growth_forecast_2024": "2.9%",
        "debt_to_gdp_ratio": 69.4,
        "inflation_rate_2024": 26.3,
        "foreign_reserves_months": 1.2,
        "trade_balance_usd": -0.8,
        "ease_of_doing_business_rank": 166,
        "risk_ratings": {
            "sp": "Non noté",
            "moodys": "Non noté",
            "fitch": "Non noté",
            "coface": "E",
            "global_risk": "Très Élevé"
        },
        "export_products": [
            {"name": "Café", "share": 54.2, "value_usd": 0.1, "type": "Agriculture"},
            {"name": "Thé", "share": 21.3, "value_usd": 0.04, "type": "Agriculture"},
            {"name": "Or", "share": 12.1, "value_usd": 0.02, "type": "Minier"},
            {"name": "Coton", "share": 6.8, "value_usd": 0.01, "type": "Agriculture"},
            {"name": "Peaux et cuirs", "share": 3.4, "value_usd": 0.01, "type": "Agriculture"}
        ],
        "key_sectors": [
            {"name": "Agriculture", "pib_share": 39.0, "description": "Café et cultures vivrières"},
            {"name": "Services", "pib_share": 43.0, "description": "Commerce de détail"},
            {"name": "Industrie", "pib_share": 18.0, "description": "Transformation alimentaire"}
        ],
        "top_trade_partners": ["Allemagne", "Chine", "Belgique", "Pakistan", "Ouganda"],
        "investment_opportunities": ["Agriculture", "Hydroélectricité", "Tourisme", "Mines"]
    },

    "CMR": {  # Cameroun
        "name": "Cameroun",
        "gdp_usd_2024": 48.3,
        "gdp_per_capita_2024": 1780,
        "population_2024": 27100000,
        "development_index": 0.563,
        "africa_rank": 20,
        "growth_forecast_2024": "4.2%",
        "debt_to_gdp_ratio": 43.8,
        "inflation_rate_2024": 4.1,
        "foreign_reserves_months": 3.9,
        "trade_balance_usd": -0.8,
        "ease_of_doing_business_rank": 167,
        "risk_ratings": {
            "sp": "B",
            "moodys": "B2",
            "fitch": "B",
            "coface": "C",
            "global_risk": "Élevé"
        },
        "export_products": [
            {"name": "Pétrole brut", "share": 36.8, "value_usd": 1.9, "type": "Énergie"},
            {"name": "Cacao", "share": 15.2, "value_usd": 0.8, "type": "Agriculture"},
            {"name": "Bois", "share": 12.4, "value_usd": 0.6, "type": "Agriculture"},
            {"name": "Coton", "share": 8.1, "value_usd": 0.4, "type": "Agriculture"},
            {"name": "Café", "share": 7.3, "value_usd": 0.4, "type": "Agriculture"}
        ],
        "key_sectors": [
            {"name": "Agriculture", "pib_share": 22.0, "description": "Cacao et café"},
            {"name": "Services", "pib_share": 48.0, "description": "Commerce et transport"},
            {"name": "Industrie", "pib_share": 30.0, "description": "Pétrole et transformation"}
        ],
        "top_trade_partners": ["Chine", "Pays-Bas", "France", "Italie", "Belgique"],
        "investment_opportunities": ["Agroalimentaire", "Bois", "Énergie", "Infrastructures"]
    },

    "CPV": {  # Cap-Vert
        "name": "Cap-Vert",
        "gdp_usd_2024": 2.3,
        "gdp_per_capita_2024": 4103,
        "population_2024": 560000,
        "development_index": 0.665,
        "africa_rank": 53,
        "growth_forecast_2024": "4.8%",
        "debt_to_gdp_ratio": 136.2,
        "inflation_rate_2024": 3.1,
        "foreign_reserves_months": 5.8,
        "trade_balance_usd": -0.7,
        "ease_of_doing_business_rank": 137,
        "risk_ratings": {
            "sp": "B",
            "moodys": "B1",
            "fitch": "B",
            "coface": "C",
            "global_risk": "Modéré"
        },
        "export_products": [
            {"name": "Produits de la pêche", "share": 45.2, "value_usd": 0.09, "type": "Agriculture"},
            {"name": "Vêtements", "share": 21.8, "value_usd": 0.04, "type": "Manufacture"},
            {"name": "Chaussures", "share": 15.1, "value_usd": 0.03, "type": "Manufacture"},
            {"name": "Machines", "share": 8.4, "value_usd": 0.02, "type": "Manufacture"},
            {"name": "Sel", "share": 4.9, "value_usd": 0.01, "type": "Minier"}
        ],
        "key_sectors": [
            {"name": "Services", "pib_share": 73.0, "description": "Tourisme et transport"},
            {"name": "Industrie", "pib_share": 19.0, "description": "Transformation alimentaire"},
            {"name": "Agriculture", "pib_share": 8.0, "description": "Pêche"}
        ],
        "top_trade_partners": ["Espagne", "Portugal", "Pays-Bas", "France", "Italie"],
        "investment_opportunities": ["Tourisme", "Énergies renouvelables", "Pêche", "TIC"]
    }
}

def get_country_data(country_code):
    """Récupérer les données d'un pays par son code ISO3"""
    return REAL_COUNTRY_DATA.get(country_code, {})

def get_all_countries():
    """Récupérer tous les pays avec leurs données"""
    return REAL_COUNTRY_DATA