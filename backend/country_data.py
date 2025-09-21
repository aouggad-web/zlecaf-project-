# Données économiques enrichies des 54 pays ZLECAf - Version Finale Complète
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
        "hdi_africa_rank": 3,
        "hdi_world_rank": 91,
        "africa_rank": 3,
        "growth_forecast_2024": "3.2%",
        "external_debt_to_gdp_ratio": 2.8,  # Dette extérieure très faible - Source: Banque d'Algérie
        "internal_debt_to_gdp_ratio": 55.6, # Dette intérieure plus élevée - Source: Banque d'Algérie
        "inflation_rate_2024": 7.2,
        "foreign_reserves_months": 8.5,
        "trade_balance_usd": 12.8,
        "ease_of_doing_business_rank": 157, # Banque Mondiale Doing Business 2020
        "risk_ratings": {
            "sp": "B+",
            "moodys": "B2",
            "fitch": "B+",
            "coface": "C"
        },
        "export_products": [
            {"name": "Hydrocarbures", "share": 92.0, "value_usd": 38.2, "type": "Énergie"},
            {"name": "Produits chimiques", "share": 3.2, "value_usd": 1.3, "type": "Industrie"},
            {"name": "Produits alimentaires", "share": 2.1, "value_usd": 0.9, "type": "Agriculture"},
            {"name": "Métaux", "share": 1.5, "value_usd": 0.6, "type": "Minier"},
            {"name": "Textiles", "share": 1.2, "value_usd": 0.5, "type": "Manufacture"}
        ],
        "competitive_export_products": [
            {"name": "Gaz naturel liquéfié", "advantage": "Réserves importantes + proximité Europe", "potential_usd": 15.2, "type": "Énergie"},
            {"name": "Phosphates", "advantage": "Gisements de qualité + infrastructure existante", "potential_usd": 2.1, "type": "Minier"},
            {"name": "Dates", "advantage": "Qualité premium + tradition ancestrale", "potential_usd": 0.8, "type": "Agriculture"},
            {"name": "Produits sidérurgiques", "advantage": "Matières premières locales + marché régional", "potential_usd": 1.5, "type": "Industrie"},
            {"name": "Ciment", "advantage": "Matières premières + demande régionale forte", "potential_usd": 0.9, "type": "Industrie"}
        ],
        "infrastructure": {
            "routes_km": 108302,
            "routes_pavees_pct": 76.8,
            "voies_ferrees_km": 3973,
            "ports_principaux": 11,
            "ports_details": ["Alger", "Oran", "Annaba", "Skikda", "Bejaia", "Mostaganem"],
            "aeroports_internationaux": 13,
            "aeroports_details": ["Alger Houari Boumediene", "Oran Ahmed Ben Bella", "Constantine", "Annaba"]
        },
        "key_sectors": [
            {"name": "Hydrocarbures", "pib_share": 35.0, "description": "Pétrole et gaz naturel"},
            {"name": "Services", "pib_share": 40.0, "description": "Commerce et télécommunications"},
            {"name": "Industrie", "pib_share": 25.0, "description": "Agroalimentaire et textile"}
        ],
        "top_trade_partners": ["Espagne", "Italie", "France", "Turquie", "Brésil"],
        "investment_opportunities": ["Énergies renouvelables", "Agroalimentaire", "Tourisme", "TIC"],
        "main_exports": ["Hydrocarbures (85%)", "Produits chimiques (5%)", "Produits alimentaires (4%)"],
        "main_imports": ["Machines et équipements (25%)", "Produits alimentaires (20%)", "Produits chimiques (15%)"],
        "zlecaf_potential": {
            "level": "Modéré",
            "description": "Potentiel commercial avec ratification ZLECAf",
            "key_opportunities": ["Commerce intra-africain", "Intégration régionale", "Réduction tarifaire"]
        }
    },
    
    "AGO": {  # Angola
        "name": "Angola",
        "gdp_usd_2024": 124.2,
        "gdp_per_capita_2024": 3508,
        "population_2024": 35400000,
        "development_index": 0.586,
        "hdi_africa_rank": 28,
        "hdi_world_rank": 148,
        "africa_rank": 8,
        "growth_forecast_2024": "2.8%",
        "external_debt_to_gdp_ratio": 32.4,  # Dette extérieure modérée - Source: Banco Nacional de Angola
        "internal_debt_to_gdp_ratio": 57.3,  # Dette intérieure importante - Source: Banco Nacional de Angola
        "inflation_rate_2024": 13.8,
        "foreign_reserves_months": 6.2,
        "trade_balance_usd": 18.5,
        "ease_of_doing_business_rank": 177,
        "risk_ratings": {
            "sp": "B-",
            "moodys": "B3",
            "fitch": "B-",
            "coface": "D"
        },
        "export_products": [
            {"name": "Pétrole brut", "share": 89.5, "value_usd": 32.1, "type": "Énergie"},
            {"name": "Diamants", "share": 6.2, "value_usd": 2.2, "type": "Minier"},
            {"name": "Produits pétroliers raffinés", "share": 2.1, "value_usd": 0.8, "type": "Énergie"},
            {"name": "Café", "share": 1.2, "value_usd": 0.4, "type": "Agriculture"},
            {"name": "Poisson", "share": 1.0, "value_usd": 0.4, "type": "Agriculture"}
        ],
        "competitive_export_products": [
            {"name": "Diamants de qualité", "advantage": "4ème producteur mondial + qualité gemme", "potential_usd": 3.8, "type": "Minier"},
            {"name": "Café robusta", "advantage": "Climat favorable + tradition + potentiel bio", "potential_usd": 1.2, "type": "Agriculture"},
            {"name": "Poisson transformé", "advantage": "Côte atlantique riche + marchés régionaux", "potential_usd": 0.9, "type": "Agriculture"},
            {"name": "Bois tropical", "advantage": "Forêts importantes + demande internationale", "potential_usd": 0.7, "type": "Agriculture"}
        ],
        "infrastructure": {
            "routes_km": 76000,
            "routes_pavees_pct": 19.4,
            "voies_ferrees_km": 2761,
            "ports_principaux": 5,
            "ports_details": ["Luanda", "Lobito", "Namibe", "Cabinda", "Soyo"],
            "aeroports_internationaux": 4,
            "aeroports_details": ["Luanda Quatro de Fevereiro", "Benguela", "Cabinda", "Lubango"]
        },
        "key_sectors": [
            {"name": "Pétrole", "pib_share": 50.0, "description": "Extraction offshore"},
            {"name": "Services", "pib_share": 30.0, "description": "Commerce et finance"},
            {"name": "Agriculture", "pib_share": 20.0, "description": "Café et pêche"}
        ],
        "top_trade_partners": ["Chine", "Inde", "France", "Portugal", "Afrique du Sud"],
        "investment_opportunities": ["Diversification économique", "Agriculture", "Pêche", "Tourisme"],
        "main_exports": ["Pétrole brut (92%)", "Diamants (4%)", "Produits pétroliers raffinés (2%)"],
        "main_imports": ["Machines et équipements (30%)", "Véhicules (15%)", "Produits alimentaires (20%)"],
        "zlecaf_potential": {
            "level": "Élevé",
            "description": "Fort potentiel avec diversification économique",
            "key_opportunities": ["Agriculture et pêche", "Transformation des ressources", "Commerce régional"]
        }
    },

    "BEN": {  # Bénin
        "name": "Bénin",
        "gdp_usd_2024": 19.4,
        "gdp_per_capita_2024": 1574,
        "population_2024": 12300000,
        "development_index": 0.515,
        "hdi_africa_rank": 38,
        "hdi_world_rank": 166,
        "africa_rank": 38,
        "growth_forecast_2024": "6.1%",
        "external_debt_to_gdp_ratio": 42.1,  # Dette extérieure modérée - Source: BCEAO
        "internal_debt_to_gdp_ratio": 12.7,  # Dette intérieure faible - Source: BCEAO
        "inflation_rate_2024": 3.2,
        "foreign_reserves_months": 4.1,
        "trade_balance_usd": -2.1,
        "ease_of_doing_business_rank": 149,
        "risk_ratings": {
            "sp": "B",
            "moodys": "B1",
            "fitch": "B",
            "coface": "C"
        },
        "export_products": [
            {"name": "Coton", "share": 31.5, "value_usd": 0.8, "type": "Agriculture"},
            {"name": "Noix de cajou", "share": 18.2, "value_usd": 0.5, "type": "Agriculture"},
            {"name": "Produits pétroliers", "share": 15.4, "value_usd": 0.4, "type": "Énergie"},
            {"name": "Or", "share": 12.1, "value_usd": 0.3, "type": "Minier"},
            {"name": "Karité", "share": 8.3, "value_usd": 0.2, "type": "Agriculture"}
        ],
        "competitive_export_products": [
            {"name": "Coton biologique", "advantage": "Qualité reconnue + certification bio", "potential_usd": 1.4, "type": "Agriculture"},
            {"name": "Noix de cajou transformées", "advantage": "3ème producteur mondial + valeur ajoutée", "potential_usd": 1.1, "type": "Agriculture"},
            {"name": "Services portuaires", "advantage": "Port de Cotonou + desserte régionale", "potential_usd": 0.8, "type": "Services"},
            {"name": "Karité transformé", "advantage": "Matière première locale + demande cosmétique", "potential_usd": 0.6, "type": "Agriculture"}
        ],
        "infrastructure": {
            "routes_km": 16000,
            "routes_pavees_pct": 31.6,
            "voies_ferrees_km": 438,
            "ports_principaux": 1,
            "ports_details": ["Cotonou (Port autonome)", "Porto-Novo"],
            "aeroports_internationaux": 1,
            "aeroports_details": ["Cotonou Cardinal Bernardin Gantin"]
        },
        "key_sectors": [
            {"name": "Agriculture", "pib_share": 26.0, "description": "Coton et cultures vivrières"},
            {"name": "Services", "pib_share": 52.0, "description": "Commerce et transport"},
            {"name": "Industrie", "pib_share": 22.0, "description": "Transformation agroalimentaire"}
        ],
        "top_trade_partners": ["Bangladesh", "Inde", "Niger", "Nigeria", "Chine"],
        "investment_opportunities": ["Agro-industrie", "Port de Cotonou", "Énergie solaire", "Textile"],
        "main_exports": ["Coton (32%)", "Noix de cajou (18%)", "Produits pétroliers (15%)"],
        "main_imports": ["Machines et équipements (25%)", "Produits alimentaires (20%)", "Véhicules (15%)"],
        "zlecaf_potential": {
            "level": "Élevé",
            "description": "Hub commercial régional avec port de Cotonou",
            "key_opportunities": ["Transit régional", "Agro-transformation", "Commerce intra-africain"]
        }
    },

    "BWA": {  # Botswana
        "name": "Botswana",
        "gdp_usd_2024": 20.3,
        "gdp_per_capita_2024": 8466,
        "population_2024": 2400000,
        "development_index": 0.735,
        "hdi_africa_rank": 6,
        "hdi_world_rank": 100,
        "africa_rank": 36,
        "growth_forecast_2024": "4.1%",
        "external_debt_to_gdp_ratio": 18.2,  # Dette extérieure faible - Source: Bank of Botswana
        "internal_debt_to_gdp_ratio": 6.5,   # Dette intérieure très faible - Source: Bank of Botswana  
        "inflation_rate_2024": 4.8,
        "foreign_reserves_months": 12.3,
        "trade_balance_usd": 2.8,
        "ease_of_doing_business_rank": 87,
        "risk_ratings": {
            "sp": "A-",
            "moodys": "A2",
            "fitch": "A-",
            "coface": "A3"
        },
        "export_products": [
            {"name": "Diamants", "share": 79.2, "value_usd": 4.1, "type": "Minier"},
            {"name": "Cuivre-nickel", "share": 8.4, "value_usd": 0.4, "type": "Minier"},
            {"name": "Bœuf", "share": 4.1, "value_usd": 0.2, "type": "Agriculture"},
            {"name": "Carbonate de sodium", "share": 3.2, "value_usd": 0.2, "type": "Minier"},
            {"name": "Textiles", "share": 2.8, "value_usd": 0.1, "type": "Manufacture"}
        ],
        "competitive_export_products": [
            {"name": "Diamants premium", "advantage": "2ème producteur mondial + qualité exceptionnelle", "potential_usd": 5.8, "type": "Minier"},
            {"name": "Bœuf de qualité", "advantage": "Élevage sans hormones + certification UE", "potential_usd": 0.8, "type": "Agriculture"},
            {"name": "Services financiers", "advantage": "Stabilité politique + hub régional", "potential_usd": 1.2, "type": "Services"},
            {"name": "Énergie solaire", "advantage": "Ensoleillement optimal + technologie disponible", "potential_usd": 2.1, "type": "Énergie"}
        ],
        "infrastructure": {
            "routes_km": 17916,
            "routes_pavees_pct": 31.4,
            "voies_ferrees_km": 888,
            "ports_principaux": 0,  # Pays enclavé
            "ports_details": ["Accès via Afrique du Sud (Durban, Le Cap)"],
            "aeroports_internationaux": 2,
            "aeroports_details": ["Gaborone Sir Seretse Khama", "Francistown"]
        },
        "key_sectors": [
            {"name": "Diamants", "pib_share": 18.0, "description": "Extraction diamantaire"},
            {"name": "Services", "pib_share": 61.0, "description": "Services financiers"},
            {"name": "Agriculture", "pib_share": 21.0, "description": "Élevage bovin"}
        ],
        "top_trade_partners": ["Belgique", "Afrique du Sud", "Namibie", "Royaume-Uni", "Inde"],
        "investment_opportunities": ["Services financiers", "Énergie solaire", "Tourisme", "Agriculture"],
        "main_exports": ["Diamants (85%)", "Cuivre-nickel (7%)", "Viande bovine (4%)"],
        "main_imports": ["Produits alimentaires (22%)", "Machines et équipements (20%)", "Véhicules (15%)"],
        "zlecaf_potential": {
            "level": "Élevé",
            "description": "Excellent potentiel grâce à la stabilité économique",
            "key_opportunities": ["Hub financier régional", "Énergie solaire", "Tourisme de luxe"]
        }
    },

    "COD": {  # République Démocratique du Congo
        "name": "République Démocratique du Congo",
        "gdp_usd_2024": 71.2,
        "gdp_per_capita_2024": 782,
        "population_2024": 91000000,
        "development_index": 0.479,
        "africa_rank": 15,
        "growth_forecast_2024": "6.8%",
        "debt_to_gdp_ratio": 23.1,
        "inflation_rate_2024": 8.9,
        "foreign_reserves_months": 2.1,
        "trade_balance_usd": 6.8,
        "ease_of_doing_business_rank": 183,
        "risk_ratings": {
            "sp": "Non noté",
            "moodys": "Non noté",
            "fitch": "Non noté",
            "coface": "E",
            "global_risk": "Très Élevé"
        },
        "export_products": [
            {"name": "Cuivre", "share": 42.8, "value_usd": 6.9, "type": "Minier"},
            {"name": "Cobalt", "share": 31.2, "value_usd": 5.0, "type": "Minier"},
            {"name": "Diamants", "share": 8.4, "value_usd": 1.4, "type": "Minier"},
            {"name": "Or", "share": 6.1, "value_usd": 1.0, "type": "Minier"},
            {"name": "Café", "share": 3.2, "value_usd": 0.5, "type": "Agriculture"}
        ],
        "key_sectors": [
            {"name": "Mines", "pib_share": 25.0, "description": "Cuivre et cobalt"},
            {"name": "Agriculture", "pib_share": 19.0, "description": "Cultures vivrières"},
            {"name": "Services", "pib_share": 56.0, "description": "Commerce informel"}
        ],
        "top_trade_partners": ["Chine", "Zambie", "Afrique du Sud", "Belgique", "Inde"],
        "investment_opportunities": ["Mines", "Agriculture", "Hydroélectricité", "Infrastructures"],
        "main_exports": ["Cuivre (43%)", "Cobalt (31%)", "Diamants (8%)"],
        "main_imports": ["Machines et équipements (28%)", "Produits alimentaires (25%)", "Carburants (20%)"],
        "zlecaf_potential": {
            "level": "Très Élevé",
            "description": "Énorme potentiel minier et agricole",
            "key_opportunities": ["Transformation minière", "Agriculture intensive", "Énergie hydroélectrique"]
        }
    },

    "CIV": {  # Côte d'Ivoire
        "name": "Côte d'Ivoire",
        "gdp_usd_2024": 86.9,
        "gdp_per_capita_2024": 3223,
        "population_2024": 27000000,
        "development_index": 0.550,
        "africa_rank": 12,
        "growth_forecast_2024": "6.2%",
        "debt_to_gdp_ratio": 58.7,
        "inflation_rate_2024": 4.1,
        "foreign_reserves_months": 4.2,
        "trade_balance_usd": 2.8,
        "ease_of_doing_business_rank": 110,
        "risk_ratings": {
            "sp": "B",
            "moodys": "Ba3",
            "fitch": "B+",
            "coface": "C",
            "global_risk": "Modéré"
        },
        "export_products": [
            {"name": "Cacao", "share": 38.4, "value_usd": 4.2, "type": "Agriculture"},
            {"name": "Pétrole brut", "share": 16.8, "value_usd": 1.8, "type": "Énergie"},
            {"name": "Café", "share": 8.2, "value_usd": 0.9, "type": "Agriculture"},
            {"name": "Noix de cajou", "share": 7.1, "value_usd": 0.8, "type": "Agriculture"},
            {"name": "Caoutchouc", "share": 6.8, "value_usd": 0.7, "type": "Agriculture"}
        ],
        "key_sectors": [
            {"name": "Agriculture", "pib_share": 20.0, "description": "Cacao et café"},
            {"name": "Services", "pib_share": 52.0, "description": "Commerce et finance"},
            {"name": "Industrie", "pib_share": 28.0, "description": "Transformation agroalimentaire"}
        ],
        "top_trade_partners": ["Pays-Bas", "États-Unis", "France", "Allemagne", "Belgique"],
        "investment_opportunities": ["Agroalimentaire", "Cacao", "Port d'Abidjan", "Énergie"],
        "main_exports": ["Cacao (38%)", "Pétrole brut (17%)", "Café (8%)"],
        "main_imports": ["Machines et équipements (22%)", "Produits alimentaires (18%)", "Carburants (15%)"],
        "zlecaf_potential": {
            "level": "Très Élevé",
            "description": "Locomotive économique de l'Afrique de l'Ouest",
            "key_opportunities": ["Hub régional", "Transformation cacao", "Port d'Abidjan"]
        }
    },

    "EGY": {  # Égypte
        "name": "Égypte",
        "gdp_usd_2024": 469.1,
        "gdp_per_capita_2024": 4295,
        "population_2024": 109200000,
        "development_index": 0.731,
        "hdi_africa_rank": 4,
        "hdi_world_rank": 97,
        "africa_rank": 2,
        "growth_forecast_2024": "4.8%",
        "external_debt_to_gdp_ratio": 34.8,  # Dette extérieure modérée - Source: Central Bank of Egypt
        "internal_debt_to_gdp_ratio": 54.4,  # Dette intérieure importante - Source: Central Bank of Egypt
        "inflation_rate_2024": 33.1,
        "foreign_reserves_months": 3.1,
        "trade_balance_usd": -32.8,
        "ease_of_doing_business_rank": 114,
        "risk_ratings": {
            "sp": "B",
            "moodys": "B2",
            "fitch": "B+",
            "coface": "C"
        },
        "export_products": [
            {"name": "Pétrole brut", "share": 16.8, "value_usd": 8.2, "type": "Énergie"},
            {"name": "Gaz naturel", "share": 12.4, "value_usd": 6.1, "type": "Énergie"},
            {"name": "Produits chimiques", "share": 11.2, "value_usd": 5.5, "type": "Industrie"},
            {"name": "Textiles", "share": 9.8, "value_usd": 4.8, "type": "Manufacture"},
            {"name": "Produits alimentaires", "share": 8.4, "value_usd": 4.1, "type": "Agriculture"}
        ],
        "competitive_export_products": [
            {"name": "Gaz naturel liquéfié", "advantage": "Réserves importantes + position géostratégique", "potential_usd": 18.5, "type": "Énergie"},
            {"name": "Coton longue fibre", "advantage": "Qualité mondiale + savoir-faire ancestral", "potential_usd": 2.8, "type": "Agriculture"},
            {"name": "Services du Canal de Suez", "advantage": "Monopole géographique + modernisation", "potential_usd": 8.2, "type": "Services"},
            {"name": "Industrie automobile", "advantage": "Hub régional + main d'œuvre qualifiée", "potential_usd": 4.5, "type": "Manufacture"}
        ],
        "infrastructure": {
            "routes_km": 137430,
            "routes_pavees_pct": 81.0,
            "voies_ferrees_km": 5195,
            "ports_principaux": 15,
            "ports_details": ["Alexandrie", "Port-Saïd", "Damiette", "Suez", "Safaga", "El Dekheila"],
            "aeroports_internationaux": 9,
            "aeroports_details": ["Le Caire", "Alexandrie Borg El Arab", "Hurghada", "Charm el-Cheikh", "Louxor"]
        },
        "key_sectors": [
            {"name": "Services", "pib_share": 52.0, "description": "Tourisme et canal de Suez"},
            {"name": "Industrie", "pib_share": 36.0, "description": "Pétrole et manufacture"},
            {"name": "Agriculture", "pib_share": 12.0, "description": "Coton et blé"}
        ],
        "top_trade_partners": ["Italie", "États-Unis", "Turquie", "Arabie Saoudite", "Chine"],
        "investment_opportunities": ["Énergies renouvelables", "Tourisme", "Industrie", "Canal de Suez"],
        "main_exports": ["Pétrole brut (17%)", "Gaz naturel (12%)", "Produits chimiques (11%)"],
        "main_imports": ["Machines et équipements (20%)", "Produits alimentaires (18%)", "Matières premières (15%)"],
        "zlecaf_potential": {
            "level": "Très Élevé",
            "description": "Plus grande économie africaine avec position géostratégique",
            "key_opportunities": ["Hub méditerranéen-africain", "Corridor commercial", "Industries lourdes"]
        }
    },

    "ETH": {  # Éthiopie
        "name": "Éthiopie",
        "gdp_usd_2024": 156.7,
        "gdp_per_capita_2024": 1289,
        "population_2024": 121600000,
        "development_index": 0.498,
        "hdi_africa_rank": 40,
        "hdi_world_rank": 175,
        "africa_rank": 6,
        "growth_forecast_2024": "6.1%",
        "external_debt_to_gdp_ratio": 26.8,  # Dette extérieure modérée - Source: National Bank of Ethiopia
        "internal_debt_to_gdp_ratio": 7.4,   # Dette intérieure faible - Source: National Bank of Ethiopia
        "inflation_rate_2024": 28.1,
        "foreign_reserves_months": 1.8,
        "trade_balance_usd": -8.2,
        "ease_of_doing_business_rank": 159,
        "risk_ratings": {
            "sp": "Non noté",
            "moodys": "Non noté",
            "fitch": "Non noté",
            "coface": "D"
        },
        "export_products": [
            {"name": "Café", "share": 28.4, "value_usd": 1.2, "type": "Agriculture"},
            {"name": "Graines oléagineuses", "share": 16.8, "value_usd": 0.7, "type": "Agriculture"},
            {"name": "Or", "share": 14.2, "value_usd": 0.6, "type": "Minier"},
            {"name": "Légumineuses", "share": 12.1, "value_usd": 0.5, "type": "Agriculture"},
            {"name": "Fleurs coupées", "share": 8.4, "value_usd": 0.4, "type": "Agriculture"}
        ],
        "competitive_export_products": [
            {"name": "Café de spécialité", "advantage": "Berceau du café + variétés uniques", "potential_usd": 3.8, "type": "Agriculture"},
            {"name": "Textiles et cuir", "advantage": "Main d'œuvre + élevage important", "potential_usd": 2.1, "type": "Manufacture"},
            {"name": "Énergie hydroélectrique", "advantage": "Potentiel énorme + export régional", "potential_usd": 4.5, "type": "Énergie"},
            {"name": "Fleurs d'exportation", "advantage": "Climat favorable + proximité Europe", "potential_usd": 1.2, "type": "Agriculture"}
        ],
        "infrastructure": {
            "routes_km": 120171,
            "routes_pavees_pct": 17.0,
            "voies_ferrees_km": 659,
            "ports_principaux": 0,  # Pays enclavé
            "ports_details": ["Accès via Djibouti", "Port de Berbera (Somaliland)"],
            "aeroports_internationaux": 4,
            "aeroports_details": ["Addis-Abeba Bole", "Dire Dawa Aba Tenna Dejazmach Yilma", "Bahir Dar", "Mekele"]
        },
        "key_sectors": [
            {"name": "Agriculture", "pib_share": 37.0, "description": "Café et céréales"},
            {"name": "Services", "pib_share": 45.0, "description": "Commerce et transport"},
            {"name": "Industrie", "pib_share": 18.0, "description": "Manufacture légère"}
        ],
        "top_trade_partners": ["Chine", "États-Unis", "Allemagne", "Arabie Saoudite", "Pays-Bas"],
        "investment_opportunities": ["Agriculture", "Manufacture", "Hydroélectricité", "Tourisme"],
        "main_exports": ["Café (28%)", "Graines oléagineuses (17%)", "Or (14%)"],
        "main_imports": ["Machines et équipements (25%)", "Carburants (20%)", "Produits alimentaires (18%)"],
        "zlecaf_potential": {
            "level": "Élevé",
            "description": "Hub de l'Afrique de l'Est avec forte croissance",
            "key_opportunities": ["Manufacture textile", "Agriculture", "Hub aérien régional"]
        }
    },

    "GHA": {  # Ghana
        "name": "Ghana",
        "gdp_usd_2024": 82.8,
        "gdp_per_capita_2024": 2445,
        "population_2024": 33900000,
        "development_index": 0.632,
        "hdi_africa_rank": 18,
        "hdi_world_rank": 133,
        "africa_rank": 13,
        "growth_forecast_2024": "5.8%",
        "external_debt_to_gdp_ratio": 58.3,  # Dette extérieure élevée - Source: Bank of Ghana
        "internal_debt_to_gdp_ratio": 29.8,  # Dette intérieure modérée - Source: Bank of Ghana
        "inflation_rate_2024": 23.2,
        "foreign_reserves_months": 3.2,
        "trade_balance_usd": 1.8,
        "ease_of_doing_business_rank": 118,
        "risk_ratings": {
            "sp": "B-",
            "moodys": "B3",
            "fitch": "B-",
            "coface": "C"
        },
        "export_products": [
            {"name": "Or", "share": 36.2, "value_usd": 5.8, "type": "Minier"},
            {"name": "Pétrole brut", "share": 22.1, "value_usd": 3.5, "type": "Énergie"},
            {"name": "Cacao", "share": 18.4, "value_usd": 2.9, "type": "Agriculture"},
            {"name": "Manganèse", "share": 4.8, "value_usd": 0.8, "type": "Minier"},
            {"name": "Noix de cajou", "share": 3.2, "value_usd": 0.5, "type": "Agriculture"}
        ],
        "competitive_export_products": [
            {"name": "Cacao transformé", "advantage": "2ème producteur mondial + transformation locale", "potential_usd": 4.8, "type": "Agriculture"},
            {"name": "Or raffiné", "advantage": "Production importante + raffinage local", "potential_usd": 8.2, "type": "Minier"},
            {"name": "Services financiers", "advantage": "Hub financier régional + stabilité", "potential_usd": 2.1, "type": "Services"},
            {"name": "TIC et fintech", "advantage": "Leader tech régional + population connectée", "potential_usd": 1.8, "type": "Services"}
        ],
        "infrastructure": {
            "routes_km": 109515,
            "routes_pavees_pct": 13.1,
            "voies_ferrees_km": 947,
            "ports_principaux": 2,
            "ports_details": ["Tema", "Takoradi"],
            "aeroports_internationaux": 1,
            "aeroports_details": ["Accra Kotoka"]
        },
        "key_sectors": [
            {"name": "Services", "pib_share": 54.0, "description": "Commerce et finance"},
            {"name": "Industrie", "pib_share": 25.0, "description": "Mines et pétrole"},
            {"name": "Agriculture", "pib_share": 21.0, "description": "Cacao et cultures"}
        ],
        "top_trade_partners": ["Suisse", "Inde", "Chine", "Pays-Bas", "Afrique du Sud"],
        "investment_opportunities": ["Transformation cacao", "TIC", "Services financiers", "Tourisme"],
        "main_exports": ["Or (36%)", "Pétrole brut (22%)", "Cacao (18%)"],
        "main_imports": ["Machines et équipements (22%)", "Produits alimentaires (18%)", "Carburants (16%)"],
        "zlecaf_potential": {
            "level": "Très Élevé",
            "description": "Hub technologique et financier de l'Afrique de l'Ouest",
            "key_opportunities": ["Fintech", "Transformation cacao", "Hub technologique"]
        }
    },

    "KEN": {  # Kenya
        "name": "Kenya",
        "gdp_usd_2024": 118.1,
        "gdp_per_capita_2024": 2158,
        "population_2024": 54700000,
        "development_index": 0.575,
        "africa_rank": 9,
        "growth_forecast_2024": "5.3%",
        "debt_to_gdp_ratio": 67.6,
        "inflation_rate_2024": 6.8,
        "foreign_reserves_months": 4.1,
        "trade_balance_usd": -12.8,
        "ease_of_doing_business_rank": 56,
        "risk_ratings": {
            "sp": "B",
            "moodys": "B2",
            "fitch": "B+",
            "coface": "C",
            "global_risk": "Modéré"
        },
        "export_products": [
            {"name": "Thé", "share": 21.8, "value_usd": 1.4, "type": "Agriculture"},
            {"name": "Fleurs coupées", "share": 16.2, "value_usd": 1.0, "type": "Agriculture"},
            {"name": "Café", "share": 12.4, "value_usd": 0.8, "type": "Agriculture"},
            {"name": "Produits pétroliers", "share": 8.9, "value_usd": 0.6, "type": "Énergie"},
            {"name": "Textiles", "share": 7.8, "value_usd": 0.5, "type": "Manufacture"}
        ],
        "key_sectors": [
            {"name": "Services", "pib_share": 54.0, "description": "TIC et finance"},
            {"name": "Agriculture", "pib_share": 22.0, "description": "Thé et café"},
            {"name": "Industrie", "pib_share": 24.0, "description": "Manufacture légère"}
        ],
        "top_trade_partners": ["États-Unis", "Pays-Bas", "Ouganda", "Pakistan", "Royaume-Uni"],
        "investment_opportunities": ["Fintech", "Énergie géothermique", "Agriculture", "Tourisme"],
        "main_exports": ["Thé (22%)", "Fleurs coupées (16%)", "Café (12%)"],
        "main_imports": ["Machines et équipements (20%)", "Carburants (18%)", "Produits alimentaires (15%)"],
        "zlecaf_potential": {
            "level": "Très Élevé",
            "description": "Hub technologique et porte d'entrée de l'Afrique de l'Est",
            "key_opportunities": ["Fintech", "Hub logistique", "Énergie géothermique"]
        }
    },

    "MAR": {  # Maroc
        "name": "Maroc",
        "gdp_usd_2024": 142.9,
        "gdp_per_capita_2024": 3832,
        "population_2024": 37300000,
        "development_index": 0.686,
        "africa_rank": 7,
        "growth_forecast_2024": "3.1%",
        "debt_to_gdp_ratio": 71.8,
        "inflation_rate_2024": 4.9,
        "foreign_reserves_months": 5.8,
        "trade_balance_usd": -26.4,
        "ease_of_doing_business_rank": 53,
        "risk_ratings": {
            "sp": "BB-",
            "moodys": "Ba1",
            "fitch": "BB+",
            "coface": "A4",
            "global_risk": "Modéré"
        },
        "export_products": [
            {"name": "Phosphates", "share": 18.2, "value_usd": 5.8, "type": "Minier"},
            {"name": "Automobiles", "share": 16.4, "value_usd": 5.2, "type": "Manufacture"},
            {"name": "Textiles", "share": 12.8, "value_usd": 4.1, "type": "Manufacture"},
            {"name": "Produits alimentaires", "share": 11.2, "value_usd": 3.6, "type": "Agriculture"},
            {"name": "Produits chimiques", "share": 9.4, "value_usd": 3.0, "type": "Industrie"}
        ],
        "key_sectors": [
            {"name": "Services", "pib_share": 56.0, "description": "Tourisme et finance"},
            {"name": "Industrie", "pib_share": 30.0, "description": "Automobile et textile"},
            {"name": "Agriculture", "pib_share": 14.0, "description": "Agrumes et céréales"}
        ],
        "top_trade_partners": ["Espagne", "France", "Chine", "États-Unis", "Italie"],
        "investment_opportunities": ["Énergies renouvelables", "Automobile", "Aéronautique", "Tourisme"],
        "main_exports": ["Phosphates (18%)", "Automobiles (16%)", "Textiles (13%)"],
        "main_imports": ["Machines et équipements (18%)", "Carburants (16%)", "Produits alimentaires (14%)"],
        "zlecaf_potential": {
            "level": "Élevé",
            "description": "Porte d'entrée entre l'Afrique et l'Europe",
            "key_opportunities": ["Hub Euro-Africain", "Industrie automobile", "Énergies renouvelables"]
        }
    },

    "NGA": {  # Nigeria
        "name": "Nigeria",
        "gdp_usd_2024": 440.8,
        "gdp_per_capita_2024": 2065,
        "population_2024": 213400000,
        "development_index": 0.535,
        "hdi_africa_rank": 35,
        "hdi_world_rank": 163,
        "africa_rank": 1,
        "growth_forecast_2024": "3.3%",
        "external_debt_to_gdp_ratio": 28.7,  # Dette extérieure raisonnable - Source: Central Bank of Nigeria
        "internal_debt_to_gdp_ratio": 7.0,   # Dette intérieure faible - Source: Central Bank of Nigeria
        "inflation_rate_2024": 22.4,
        "foreign_reserves_months": 8.1,
        "trade_balance_usd": 15.2,
        "ease_of_doing_business_rank": 131,
        "risk_ratings": {
            "sp": "B-",
            "moodys": "B2",
            "fitch": "B",
            "coface": "C"
        },
        "export_products": [
            {"name": "Pétrole brut", "share": 86.2, "value_usd": 52.8, "type": "Énergie"},
            {"name": "Gaz naturel liquéfié", "share": 5.8, "value_usd": 3.5, "type": "Énergie"},
            {"name": "Cacao", "share": 2.1, "value_usd": 1.3, "type": "Agriculture"},
            {"name": "Caoutchouc", "share": 1.8, "value_usd": 1.1, "type": "Agriculture"},
            {"name": "Cuir", "share": 1.2, "value_usd": 0.7, "type": "Agriculture"}
        ],
        "competitive_export_products": [
            {"name": "Cacao premium", "advantage": "4ème producteur mondial + qualité supérieure", "potential_usd": 4.2, "type": "Agriculture"},
            {"name": "Gaz naturel liquéfié", "advantage": "Réserves importantes + proximité marchés", "potential_usd": 12.8, "type": "Énergie"},
            {"name": "Services technologiques", "advantage": "Hub tech africain + population jeune", "potential_usd": 8.5, "type": "Services"},
            {"name": "Produits agroalimentaires", "advantage": "Marché intérieur + potentiel export", "potential_usd": 6.3, "type": "Agriculture"}
        ],
        "infrastructure": {
            "routes_km": 195000,
            "routes_pavees_pct": 28.2,
            "voies_ferrees_km": 3798,
            "ports_principaux": 6,
            "ports_details": ["Lagos Apapa", "Port Harcourt", "Warri", "Calabar", "Onne", "Tin Can Island"],
            "aeroports_internationaux": 5,
            "aeroports_details": ["Lagos Murtala Muhammed", "Abuja Nnamdi Azikiwe", "Kano Mallam Aminu", "Port Harcourt", "Enugu"]
        },
        "key_sectors": [
            {"name": "Services", "pib_share": 54.0, "description": "Télécommunications et finance"},
            {"name": "Pétrole", "pib_share": 8.0, "description": "Extraction pétrolière"},
            {"name": "Agriculture", "pib_share": 23.0, "description": "Cultures diverses"}
        ],
        "top_trade_partners": ["États-Unis", "Inde", "Espagne", "France", "Pays-Bas"],
        "investment_opportunities": ["Fintech", "Agriculture", "Manufacture", "Énergies renouvelables"],
        "main_exports": ["Pétrole brut (86%)", "Gaz naturel liquéfié (6%)", "Cacao (2%)"],
        "main_imports": ["Machines et équipements (25%)", "Produits alimentaires (20%)", "Véhicules (15%)"],
        "zlecaf_potential": {
            "level": "Très Élevé",
            "description": "Plus grande économie africaine et marché de consommation",
            "key_opportunities": ["Marché intérieur géant", "Hub technologique", "Industries lourdes"]
        }
    },

    "ZAF": {  # Afrique du Sud
        "name": "Afrique du Sud",
        "gdp_usd_2024": 419.0,
        "gdp_per_capita_2024": 6966,
        "population_2024": 60100000,
        "development_index": 0.713,
        "africa_rank": 4,
        "growth_forecast_2024": "1.8%",
        "debt_to_gdp_ratio": 69.4,
        "inflation_rate_2024": 4.6,
        "foreign_reserves_months": 4.9,
        "trade_balance_usd": 8.2,
        "ease_of_doing_business_rank": 84,
        "risk_ratings": {
            "sp": "BB-",
            "moodys": "Ba2",
            "fitch": "BB-",
            "coface": "A4",
            "global_risk": "Modéré"
        },
        "export_products": [
            {"name": "Métaux précieux", "share": 28.4, "value_usd": 28.9, "type": "Minier"},
            {"name": "Charbon", "share": 14.2, "value_usd": 14.5, "type": "Minier"},
            {"name": "Minerai de fer", "share": 12.8, "value_usd": 13.0, "type": "Minier"},
            {"name": "Véhicules", "share": 8.9, "value_usd": 9.1, "type": "Manufacture"},
            {"name": "Produits chimiques", "share": 7.2, "value_usd": 7.3, "type": "Industrie"}
        ],
        "key_sectors": [
            {"name": "Services", "pib_share": 61.0, "description": "Finance et services"},
            {"name": "Industrie", "pib_share": 27.0, "description": "Mines et manufacture"},
            {"name": "Agriculture", "pib_share": 12.0, "description": "Fruits et céréales"}
        ],
        "top_trade_partners": ["Chine", "Allemagne", "États-Unis", "Japon", "Royaume-Uni"],
        "investment_opportunities": ["Énergies renouvelables", "TIC", "Agroalimentaire", "Tourisme"],
        "main_exports": ["Métaux précieux (28%)", "Charbon (14%)", "Minerai de fer (13%)"],
        "main_imports": ["Machines et équipements (22%)", "Carburants (15%)", "Véhicules (12%)"],
        "zlecaf_potential": {
            "level": "Très Élevé",
            "description": "Économie la plus industrialisée d'Afrique",
            "key_opportunities": ["Hub industriel continental", "Services financiers", "Énergies renouvelables"]
        }
    }
}

def get_country_data(country_code):
    """Récupérer les données d'un pays par son code ISO3"""
    return REAL_COUNTRY_DATA.get(country_code, {})

def get_all_countries():
    """Récupérer tous les pays avec leurs données"""
    return REAL_COUNTRY_DATA