# Données économiques réelles par pays (Sources: PNUD, Banque Mondiale, BAD, FMI, sites gouvernementaux)
# Dernière mise à jour: Septembre 2024

REAL_COUNTRY_DATA = {
    'NG': {  # Nigeria
        'name': 'Nigéria',
        'gdp_usd_2024': 244000000000,  # 244 milliards USD (NBS 2024)
        'gdp_per_capita_2024': 1140,   # USD
        'development_index': 0.535,    # PNUD 2024
        'africa_rank': 15,
        'population_2024': 218500000,
        'growth_forecast_2024': '3.1%',
        'growth_projection_2025': '3.8%',
        'growth_projection_2026': '4.1%',
        'key_sectors': [
            {'name': 'Services', 'pib_share': 53.0, 'description': 'Technologies de l\'information, finance, télécommunications'},
            {'name': 'Agriculture', 'pib_share': 25.8, 'description': 'Cultures céréalières, tubercules, élevage'},
            {'name': 'Industrie', 'pib_share': 21.2, 'description': 'Pétrole et gaz, industrie manufacturière'}
        ],
        'zlecaf_potential': {
            'level': 'Très élevé',
            'description': 'Plus grande économie d\'Afrique avec fort potentiel manufacturier et de services. Position stratégique pour accès aux marchés CEDEAO et d\'Afrique centrale.',
            'key_opportunities': [
                'Hub manufacturier régional',
                'Exportation de services technologiques',
                'Transformation agroalimentaire',
                'Industries pétrolières et pétrochimiques'
            ]
        },
        'main_exports': ['Pétrole brut', 'Gaz naturel', 'Cacao', 'Produits pétrochimiques'],
        'main_imports': ['Machines', 'Produits chimiques', 'Véhicules', 'Produits alimentaires']
    },
    
    'CF': {  # République Centrafricaine
        'name': 'République Centrafricaine',
        'gdp_usd_2024': 2750000000,    # 2.75 milliards USD
        'gdp_per_capita_2024': 510,    # USD
        'development_index': 0.414,    # PNUD 2024
        'africa_rank': 52,
        'population_2024': 5400000,
        'growth_forecast_2024': '1.4%',
        'growth_projection_2025': '1.8%',
        'growth_projection_2026': '2.2%',
        'key_sectors': [
            {'name': 'Agriculture', 'pib_share': 53.0, 'description': 'Manioc, maïs, bananes, café, coton, élevage'},
            {'name': 'Services', 'pib_share': 27.0, 'description': 'Commerce, transport, administration publique'},
            {'name': 'Industrie', 'pib_share': 20.0, 'description': 'Exploitation forestière, mines (diamants, or)'}
        ],
        'zlecaf_potential': {
            'level': 'Modéré - Long terme',
            'description': 'Potentiel important en ressources naturelles (forêt, mines) mais défis sécuritaires et infrastructurels limitent développement à court terme.',
            'key_opportunities': [
                'Exploitation forestière durable',
                'Mines artisanales vers industrielles',
                'Agriculture de subsistance vers commerciale',
                'Transit vers Tchad et Soudan'
            ]
        },
        'main_exports': ['Bois', 'Diamants', 'Or', 'Café', 'Coton'],
        'main_imports': ['Produits pétroliers', 'Machines', 'Produits alimentaires', 'Médicaments']
    },
    
    'MU': {  # Maurice
        'name': 'Maurice',
        'gdp_usd_2024': 15800000000,   # 15.8 milliards USD
        'gdp_per_capita_2024': 12450,  # USD
        'development_index': 0.796,    # PNUD 2024 
        'africa_rank': 1,
        'population_2024': 1270000,
        'growth_forecast_2024': '4.2%',
        'growth_projection_2025': '4.5%',
        'growth_projection_2026': '4.8%',
        'key_sectors': [
            {'name': 'Services', 'pib_share': 75.0, 'description': 'Services financiers, tourisme, technologies de l\'information'},
            {'name': 'Industrie', 'pib_share': 22.0, 'description': 'Textile, agroalimentaire, chimie'},
            {'name': 'Agriculture', 'pib_share': 3.0, 'description': 'Canne à sucre, thé, légumes'}
        ],
        'zlecaf_potential': {
            'level': 'Très élevé',
            'description': 'Centre financier offshore avancé avec économie diversifiée. Porte d\'entrée privilégiée pour investissements vers l\'Afrique continentale.',
            'key_opportunities': [
                'Hub financier et d\'investissement',
                'Services aux entreprises continentales',
                'Technologies et innovation',
                'Tourisme d\'affaires régional'
            ]
        },
        'main_exports': ['Produits textiles', 'Sucre', 'Poissons', 'Services financiers'],
        'main_imports': ['Produits manufacturés', 'Pétrole', 'Produits alimentaires', 'Machines']
    }
}

# Fonction pour obtenir les données d'un pays
def get_country_data(country_code):
    """Retourne les données économiques réelles d'un pays ou des données par défaut"""
    return REAL_COUNTRY_DATA.get(country_code, {
        'name': f'Pays {country_code}',
        'gdp_usd_2024': 10000000000,
        'gdp_per_capita_2024': 1000,
        'development_index': 0.500,
        'africa_rank': 25,
        'population_2024': 10000000,
        'growth_forecast_2024': '3.0%',
        'growth_projection_2025': '3.2%',
        'growth_projection_2026': '3.5%',
        'key_sectors': [
            {'name': 'Agriculture', 'pib_share': 30.0, 'description': 'Cultures vivrières et d\'exportation'},
            {'name': 'Services', 'pib_share': 45.0, 'description': 'Commerce, transport, télécommunications'},
            {'name': 'Industrie', 'pib_share': 25.0, 'description': 'Industrie manufacturière et extractive'}
        ],
        'zlecaf_potential': {
            'level': 'Modéré',
            'description': 'Potentiel de développement avec la mise en œuvre de la ZLECAf.',
            'key_opportunities': [
                'Développement agricole',
                'Industrie de transformation',
                'Services régionaux',
                'Commerce intra-africain'
            ]
        },
        'main_exports': ['Produits agricoles', 'Ressources naturelles'],
        'main_imports': ['Produits manufacturés', 'Machines', 'Carburants']
    })