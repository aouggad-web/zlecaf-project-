<file>
      <absolute_file_name>/app/backend/country_data.py</absolute_file_name>
      <content"># Données économiques réelles par pays (Sources: PNUD, Banque Mondiale, BAD, FMI, sites gouvernementaux)
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
    
    'SN': {  # Sénégal
        'name': 'Sénégal',
        'gdp_usd_2024': 27500000000,   # 27.5 milliards USD
        'gdp_per_capita_2024': 1590,   # USD
        'development_index': 0.511,    # PNUD 2024
        'africa_rank': 22,
        'population_2024': 17200000,
        'growth_forecast_2024': '5.3%',
        'growth_projection_2025': '6.2%',
        'growth_projection_2026': '6.8%',
        'key_sectors': [
            {'name': 'Services', 'pib_share': 58.0, 'description': 'Tourisme, télécommunications, services financiers'},
            {'name': 'Industrie', 'pib_share': 24.0, 'description': 'Phosphates, agroalimentaire, hydrocarbures (en développement)'},
            {'name': 'Agriculture', 'pib_share': 18.0, 'description': 'Arachides, mil, sorgho, pêche'}
        ],
        'zlecaf_potential': {
            'level': 'Élevé',
            'description': 'Hub financier régional avec infrastructure développée. Potentiel gazier et position géographique stratégique pour commerce atlantique.',
            'key_opportunities': [
                'Centre financier et de services régional',
                'Transformation des phosphates',
                'Industrie agroalimentaire',
                'Tourisme et économie bleue'
            ]
        },
        'main_exports': ['Phosphates', 'Poissons', 'Arachides', 'Produits chimiques'],
        'main_imports': ['Pétrole', 'Machines', 'Riz', 'Véhicules']
    },
    
    'CI': {  # Côte d'Ivoire  
        'name': 'Côte d\'Ivoire',
        'gdp_usd_2024': 78400000000,   # 78.4 milliards USD
        'gdp_per_capita_2024': 2970,   # USD
        'development_index': 0.550,    # PNUD 2024
        'africa_rank': 12,
        'population_2024': 26400000,
        'growth_forecast_2024': '6.0%',
        'growth_projection_2025': '6.5%',
        'growth_projection_2026': '6.8%',
        'key_sectors': [
            {'name': 'Services', 'pib_share': 61.6, 'description': 'Télécommunications, transports, commerce, finances'},
            {'name': 'Industrie', 'pib_share': 23.7, 'description': 'Agroalimentaire, mines, énergie, BTP'},  
            {'name': 'Agriculture', 'pib_share': 14.8, 'description': 'Cacao (leader mondial), café, cajou, cultures vivrières'}
        ],
        'zlecaf_potential': {
            'level': 'Très élevé',
            'description': 'Leader mondial du cacao avec secteur agroalimentaire développé. Hub économique de l\'Afrique de l\'Ouest avec infrastructures modernes.',
            'key_opportunities': [
                'Transformation du cacao et café',
                'Hub logistique sous-régional',
                'Industries extractives et énergétiques',
                'Agrobusiness et export agricole'
            ]
        },
        'main_exports': ['Cacao', 'Café', 'Noix de cajou', 'Or', 'Pétrole'],
        'main_imports': ['Pétrole raffiné', 'Machines', 'Médicaments', 'Véhicules']
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
    
    'ZA': {  # Afrique du Sud
        'name': 'Afrique du Sud',
        'gdp_usd_2024': 419000000000,  # 419 milliards USD
        'gdp_per_capita_2024': 7055,   # USD
        'development_index': 0.713,    # PNUD 2024
        'africa_rank': 2,
        'population_2024': 59300000,
        'growth_forecast_2024': '1.2%',
        'growth_projection_2025': '1.6%',
        'growth_projection_2026': '2.0%',
        'key_sectors': [
            {'name': 'Services', 'pib_share': 68.0, 'description': 'Services financiers, immobilier, commerce, télécommunications'},
            {'name': 'Industrie', 'pib_share': 29.0, 'description': 'Mines (or, platine, charbon), manufacturier, énergie'},
            {'name': 'Agriculture', 'pib_share': 3.0, 'description': 'Vins, fruits, céréales, élevage'}
        ],
        'zlecaf_potential': {
            'level': 'Très élevé',
            'description': 'Économie la plus industrialisée d\'Afrique avec secteur financier développé. Position de leader pour investissements et transferts technologiques.',
            'key_opportunities': [
                'Hub d\'investissement continental',
                'Exportation de technologies et services',
                'Industries manufacturières avancées',
                'Secteur minier et énergétique'
            ]
        },
        'main_exports': ['Platine', 'Or', 'Charbon', 'Machines', 'Véhicules'],
        'main_imports': ['Pétrole', 'Machines', 'Véhicules', 'Produits chimiques']
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
    },
    
    'NE': {  # Niger
        'name': 'Niger',
        'gdp_usd_2024': 15600000000,   # 15.6 milliards USD
        'gdp_per_capita_2024': 640,    # USD
        'development_index': 0.394,    # PNUD 2024
        'africa_rank': 53,
        'population_2024': 24200000,
        'growth_forecast_2024': '2.1%',
        'growth_projection_2025': '2.5%',
        'growth_projection_2026': '2.8%',
        'key_sectors': [
            {'name': 'Agriculture', 'pib_share': 40.0, 'description': 'Mil, sorgho, niébé, arachides, élevage'},
            {'name': 'Services', 'pib_share': 35.0, 'description': 'Commerce, transport, administration'},
            {'name': 'Industrie', 'pib_share': 25.0, 'description': 'Uranium, or, pétrole (en développement)'}
        ],
        'zlecaf_potential': {
            'level': 'Modéré',
            'description': 'Richesses minières importantes (uranium, or) et position de transit stratégique. Défis sécuritaires et climatiques limitent le potentiel à court terme.',
            'key_opportunities': [
                'Exploitation minière (uranium, or)',
                'Hub de transit Sahel-Maghreb',
                'Élevage et exportation animale',
                'Énergies renouvelables (solaire)'
            ]
        },
        'main_exports': ['Uranium', 'Or', 'Animaux vivants', 'Niébé'],
        'main_imports': ['Produits pétroliers', 'Machines', 'Céréales', 'Médicaments']
    },
    
    'TD': {  # Tchad
        'name': 'Tchad',
        'gdp_usd_2024': 18200000000,   # 18.2 milliards USD
        'gdp_per_capita_2024': 1110,   # USD
        'development_index': 0.398,    # PNUD 2024
        'africa_rank': 54,
        'population_2024': 16400000,
        'growth_forecast_2024': '1.8%',
        'growth_projection_2025': '2.2%',
        'growth_projection_2026': '2.6%',
        'key_sectors': [
            {'name': 'Agriculture', 'pib_share': 48.0, 'description': 'Coton, mil, sorgho, arachides, élevage'},
            {'name': 'Industrie', 'pib_share': 32.0, 'description': 'Pétrole, mines, agroalimentaire'},
            {'name': 'Services', 'pib_share': 20.0, 'description': 'Commerce, transport, télécommunications'}
        ],
        'zlecaf_potential': {
            'level': 'Modéré',
            'description': 'Ressources pétrolières et minières importantes, agriculture extensive. Position géographique stratégique mais instabilité politique freine développement.',
            'key_opportunities': [
                'Industrie pétrolière et raffinage',
                'Agriculture commerciale (coton)',
                'Élevage et export vers Nigeria/Cameroun',
                'Hub logistique Sahel-Afrique Centrale'
            ]
        },
        'main_exports': ['Pétrole brut', 'Coton', 'Animaux vivants', 'Gomme arabique'],
        'main_imports': ['Machines', 'Produits alimentaires', 'Médicaments', 'Véhicules']
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
</content>
    </file>