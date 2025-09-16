#!/usr/bin/env python3
"""
Tests complets pour l'API ZLECAf - Système Commercial Africain
Tests tous les endpoints avec données réelles et vérifications complètes
"""

import requests
import json
import sys
import os
from datetime import datetime
from typing import Dict, Any, List

# Configuration de l'API
BASE_URL = "https://etape-suivante.preview.emergentagent.com/api"
TIMEOUT = 30

class ZLECAfAPITester:
    def __init__(self):
        self.base_url = BASE_URL
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'User-Agent': 'ZLECAf-API-Tester/1.0'
        })
        self.results = []
        
    def log_result(self, test_name: str, success: bool, message: str, details: Dict = None):
        """Enregistrer le résultat d'un test"""
        result = {
            'test': test_name,
            'success': success,
            'message': message,
            'timestamp': datetime.now().isoformat(),
            'details': details or {}
        }
        self.results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {test_name}: {message}")
        if details and not success:
            print(f"   Détails: {details}")
    
    def test_api_root(self):
        """Test GET /api/ - Point d'entrée de l'API"""
        try:
            response = self.session.get(f"{self.base_url}/", timeout=TIMEOUT)
            
            if response.status_code == 200:
                data = response.json()
                if 'message' in data and 'ZLECAf' in data['message']:
                    self.log_result(
                        "API Root Endpoint", 
                        True, 
                        "Point d'entrée accessible avec message ZLECAf",
                        {'response': data}
                    )
                else:
                    self.log_result(
                        "API Root Endpoint", 
                        False, 
                        "Réponse ne contient pas le message ZLECAf attendu",
                        {'response': data}
                    )
            else:
                self.log_result(
                    "API Root Endpoint", 
                    False, 
                    f"Code de statut incorrect: {response.status_code}",
                    {'status_code': response.status_code, 'response': response.text}
                )
                
        except Exception as e:
            self.log_result(
                "API Root Endpoint", 
                False, 
                f"Erreur de connexion: {str(e)}",
                {'error': str(e)}
            )
    
    def test_countries_list(self):
        """Test GET /api/countries - Liste des 54 pays membres ZLECAf"""
        try:
            response = self.session.get(f"{self.base_url}/countries", timeout=TIMEOUT)
            
            if response.status_code == 200:
                countries = response.json()
                
                # Vérifier que c'est une liste
                if not isinstance(countries, list):
                    self.log_result(
                        "Countries List", 
                        False, 
                        "La réponse n'est pas une liste",
                        {'response_type': type(countries).__name__}
                    )
                    return
                
                # Vérifier le nombre de pays (54 membres ZLECAf)
                if len(countries) != 54:
                    self.log_result(
                        "Countries List", 
                        False, 
                        f"Nombre de pays incorrect: {len(countries)} au lieu de 54",
                        {'count': len(countries)}
                    )
                    return
                
                # Vérifier la structure des données
                required_fields = ['code', 'name', 'region', 'iso3', 'wb_code', 'population']
                sample_country = countries[0]
                missing_fields = [field for field in required_fields if field not in sample_country]
                
                if missing_fields:
                    self.log_result(
                        "Countries List", 
                        False, 
                        f"Champs manquants dans les données pays: {missing_fields}",
                        {'sample_country': sample_country}
                    )
                    return
                
                # Vérifier des pays spécifiques
                country_codes = [country['code'] for country in countries]
                expected_countries = ['NG', 'MA', 'MU', 'ZA', 'EG', 'KE']
                missing_countries = [code for code in expected_countries if code not in country_codes]
                
                if missing_countries:
                    self.log_result(
                        "Countries List", 
                        False, 
                        f"Pays importants manquants: {missing_countries}",
                        {'missing': missing_countries}
                    )
                    return
                
                self.log_result(
                    "Countries List", 
                    True, 
                    f"Liste complète de {len(countries)} pays avec structure correcte",
                    {'sample_countries': countries[:3]}
                )
                
            else:
                self.log_result(
                    "Countries List", 
                    False, 
                    f"Code de statut incorrect: {response.status_code}",
                    {'status_code': response.status_code}
                )
                
        except Exception as e:
            self.log_result(
                "Countries List", 
                False, 
                f"Erreur lors de la récupération des pays: {str(e)}",
                {'error': str(e)}
            )
    
    def test_country_profiles(self):
        """Test GET /api/country-profile/{country_code} - Profils économiques avec nouvelles données"""
        # Tests spécifiques avec nouvelles données validées
        test_countries_data = {
            'NG': {'expected_gdp': 374.984, 'expected_pop': 227883000, 'name': 'Nigéria'},
            'DZ': {'expected_gdp': 269.128, 'expected_pop': 46700000, 'name': 'Algérie'},
            'ZA': {'expected_gdp': 377.782, 'expected_pop': 63212000, 'name': 'Afrique du Sud'},
            'EG': {'expected_gdp': 331.59, 'expected_pop': 114536000, 'name': 'Égypte'}
        }
        
        for country_code, expected_data in test_countries_data.items():
            try:
                response = self.session.get(f"{self.base_url}/country-profile/{country_code}", timeout=TIMEOUT)
                
                if response.status_code == 200:
                    profile = response.json()
                    
                    # Vérifier les champs obligatoires
                    required_fields = ['country_code', 'country_name', 'region', 'projections']
                    missing_fields = [field for field in required_fields if field not in profile]
                    
                    if missing_fields:
                        self.log_result(
                            f"Country Profile {country_code}", 
                            False, 
                            f"Champs manquants: {missing_fields}",
                            {'profile': profile}
                        )
                        continue
                    
                    # Vérifier les données économiques spécifiques
                    gdp_check = profile.get('gdp_usd') == expected_data['expected_gdp']
                    pop_check = profile.get('population') == expected_data['expected_pop']
                    name_check = profile.get('country_name') == expected_data['name']
                    
                    if not gdp_check:
                        self.log_result(
                            f"Country Profile {country_code}", 
                            False, 
                            f"PIB incorrect: {profile.get('gdp_usd')} au lieu de {expected_data['expected_gdp']}",
                            {'actual_gdp': profile.get('gdp_usd'), 'expected_gdp': expected_data['expected_gdp']}
                        )
                        continue
                    
                    if not pop_check:
                        self.log_result(
                            f"Country Profile {country_code}", 
                            False, 
                            f"Population incorrecte: {profile.get('population')} au lieu de {expected_data['expected_pop']}",
                            {'actual_pop': profile.get('population'), 'expected_pop': expected_data['expected_pop']}
                        )
                        continue
                    
                    # Vérifier les projections
                    if 'projections' not in profile or not isinstance(profile['projections'], dict):
                        self.log_result(
                            f"Country Profile {country_code}", 
                            False, 
                            "Projections manquantes ou format incorrect",
                            {'projections': profile.get('projections')}
                        )
                        continue
                    
                    # Vérifier les données ZLECAf
                    projections = profile['projections']
                    zlecaf_fields = ['zlecaf_potential_level', 'zlecaf_opportunities']
                    has_zlecaf_data = any(field in projections for field in zlecaf_fields)
                    
                    if not has_zlecaf_data:
                        self.log_result(
                            f"Country Profile {country_code}", 
                            False, 
                            "Données ZLECAf manquantes dans les projections",
                            {'projections': projections}
                        )
                        continue
                    
                    self.log_result(
                        f"Country Profile {country_code}", 
                        True, 
                        f"Profil validé avec nouvelles données - {expected_data['name']}: PIB {expected_data['expected_gdp']}Mds, Pop {expected_data['expected_pop']}M",
                        {
                            'country': profile['country_name'],
                            'gdp': profile.get('gdp_usd'),
                            'population': profile.get('population'),
                            'zlecaf_level': projections.get('zlecaf_potential_level')
                        }
                    )
                    
                elif response.status_code == 404:
                    self.log_result(
                        f"Country Profile {country_code}", 
                        False, 
                        f"Pays {country_code} non trouvé",
                        {'status_code': response.status_code}
                    )
                else:
                    self.log_result(
                        f"Country Profile {country_code}", 
                        False, 
                        f"Code de statut incorrect: {response.status_code}",
                        {'status_code': response.status_code}
                    )
                    
            except Exception as e:
                self.log_result(
                    f"Country Profile {country_code}", 
                    False, 
                    f"Erreur lors de la récupération du profil: {str(e)}",
                    {'error': str(e)}
                )
    
    def test_rules_of_origin(self):
        """Test GET /api/rules-of-origin/{hs_code} - Règles d'origine"""
        test_codes = ['010121', '847989']
        
        for hs_code in test_codes:
            try:
                response = self.session.get(f"{self.base_url}/rules-of-origin/{hs_code}", timeout=TIMEOUT)
                
                if response.status_code == 200:
                    rules = response.json()
                    
                    # Vérifier les champs obligatoires
                    required_fields = ['hs_code', 'sector_code', 'rules', 'explanation']
                    missing_fields = [field for field in required_fields if field not in rules]
                    
                    if missing_fields:
                        self.log_result(
                            f"Rules of Origin {hs_code}", 
                            False, 
                            f"Champs manquants: {missing_fields}",
                            {'rules': rules}
                        )
                        continue
                    
                    # Vérifier la structure des règles
                    rules_data = rules['rules']
                    required_rule_fields = ['rule', 'requirement', 'regional_content']
                    missing_rule_fields = [field for field in required_rule_fields if field not in rules_data]
                    
                    if missing_rule_fields:
                        self.log_result(
                            f"Rules of Origin {hs_code}", 
                            False, 
                            f"Champs manquants dans les règles: {missing_rule_fields}",
                            {'rules_data': rules_data}
                        )
                        continue
                    
                    # Vérifier l'explication
                    explanation = rules['explanation']
                    required_explanation_fields = ['rule_type', 'requirement', 'regional_content_minimum', 'documentation_required']
                    missing_explanation_fields = [field for field in required_explanation_fields if field not in explanation]
                    
                    if missing_explanation_fields:
                        self.log_result(
                            f"Rules of Origin {hs_code}", 
                            False, 
                            f"Champs manquants dans l'explication: {missing_explanation_fields}",
                            {'explanation': explanation}
                        )
                        continue
                    
                    # Vérifier la cohérence des données
                    if rules['hs_code'] != hs_code:
                        self.log_result(
                            f"Rules of Origin {hs_code}", 
                            False, 
                            f"Code SH incohérent: {rules['hs_code']} != {hs_code}",
                            {'returned_code': rules['hs_code']}
                        )
                        continue
                    
                    self.log_result(
                        f"Rules of Origin {hs_code}", 
                        True, 
                        f"Règles d'origine complètes pour {hs_code} - {rules_data['rule']}",
                        {
                            'rule_type': rules_data['rule'],
                            'regional_content': rules_data['regional_content'],
                            'requirement': rules_data['requirement']
                        }
                    )
                    
                elif response.status_code == 404:
                    self.log_result(
                        f"Rules of Origin {hs_code}", 
                        False, 
                        f"Règles non trouvées pour le code SH {hs_code}",
                        {'status_code': response.status_code}
                    )
                else:
                    self.log_result(
                        f"Rules of Origin {hs_code}", 
                        False, 
                        f"Code de statut incorrect: {response.status_code}",
                        {'status_code': response.status_code}
                    )
                    
            except Exception as e:
                self.log_result(
                    f"Rules of Origin {hs_code}", 
                    False, 
                    f"Erreur lors de la récupération des règles: {str(e)}",
                    {'error': str(e)}
                )
    
    def test_tariff_calculation(self):
        """Test POST /api/calculate-tariff - Calcul complet des tarifs avec nouvelles données"""
        # Payload de test spécifique mentionné dans la demande
        test_payload = {
            "origin_country": "NG",
            "destination_country": "EG",
            "hs_code": "010121",
            "value": 100000
        }
        
        try:
            response = self.session.post(
                f"{self.base_url}/calculate-tariff", 
                json=test_payload, 
                timeout=TIMEOUT
            )
            
            if response.status_code == 200:
                calculation = response.json()
                
                # Vérifier les champs obligatoires
                required_fields = [
                    'id', 'origin_country', 'destination_country', 'hs_code', 'value',
                    'normal_tariff_rate', 'normal_tariff_amount', 'zlecaf_tariff_rate', 
                    'zlecaf_tariff_amount', 'savings', 'savings_percentage', 'rules_of_origin'
                ]
                missing_fields = [field for field in required_fields if field not in calculation]
                
                if missing_fields:
                    self.log_result(
                        "Tariff Calculation", 
                        False, 
                        f"Champs manquants dans le calcul: {missing_fields}",
                        {'calculation': calculation}
                    )
                    return
                
                # Vérifier la cohérence des données d'entrée
                input_checks = [
                    calculation['origin_country'] == test_payload['origin_country'],
                    calculation['destination_country'] == test_payload['destination_country'],
                    calculation['hs_code'] == test_payload['hs_code'],
                    calculation['value'] == test_payload['value']
                ]
                
                if not all(input_checks):
                    self.log_result(
                        "Tariff Calculation", 
                        False, 
                        "Données d'entrée incohérentes dans la réponse",
                        {
                            'input': test_payload,
                            'output': {k: calculation[k] for k in ['origin_country', 'destination_country', 'hs_code', 'value']}
                        }
                    )
                    return
                
                # Vérifier la logique des calculs
                expected_normal_amount = calculation['value'] * calculation['normal_tariff_rate']
                expected_zlecaf_amount = calculation['value'] * calculation['zlecaf_tariff_rate']
                expected_savings = expected_normal_amount - expected_zlecaf_amount
                
                calculation_checks = [
                    abs(calculation['normal_tariff_amount'] - expected_normal_amount) < 0.01,
                    abs(calculation['zlecaf_tariff_amount'] - expected_zlecaf_amount) < 0.01,
                    abs(calculation['savings'] - expected_savings) < 0.01,
                    calculation['zlecaf_tariff_rate'] < calculation['normal_tariff_rate'],
                    calculation['savings'] > 0,
                    calculation['savings_percentage'] > 0
                ]
                
                if not all(calculation_checks):
                    self.log_result(
                        "Tariff Calculation", 
                        False, 
                        "Erreurs dans la logique de calcul des tarifs",
                        {
                            'normal_rate': calculation['normal_tariff_rate'],
                            'zlecaf_rate': calculation['zlecaf_tariff_rate'],
                            'normal_amount': calculation['normal_tariff_amount'],
                            'zlecaf_amount': calculation['zlecaf_tariff_amount'],
                            'savings': calculation['savings'],
                            'savings_percentage': calculation['savings_percentage']
                        }
                    )
                    return
                
                # Vérifier les règles d'origine
                if not isinstance(calculation['rules_of_origin'], dict):
                    self.log_result(
                        "Tariff Calculation", 
                        False, 
                        "Règles d'origine manquantes ou format incorrect",
                        {'rules_of_origin': calculation['rules_of_origin']}
                    )
                    return
                
                # Vérifier la présence d'un ID unique
                if not calculation['id'] or len(calculation['id']) < 10:
                    self.log_result(
                        "Tariff Calculation", 
                        False, 
                        "ID de calcul manquant ou invalide",
                        {'id': calculation['id']}
                    )
                    return
                
                self.log_result(
                    "Tariff Calculation", 
                    True, 
                    f"Calcul tarifaire réussi - Économies: {calculation['savings']:.2f} USD ({calculation['savings_percentage']:.1f}%)",
                    {
                        'normal_tariff': f"{calculation['normal_tariff_rate']*100:.1f}%",
                        'zlecaf_tariff': f"{calculation['zlecaf_tariff_rate']*100:.1f}%",
                        'savings_usd': calculation['savings'],
                        'savings_percent': calculation['savings_percentage'],
                        'calculation_id': calculation['id']
                    }
                )
                
            elif response.status_code == 400:
                self.log_result(
                    "Tariff Calculation", 
                    False, 
                    "Erreur de validation des données d'entrée",
                    {'status_code': response.status_code, 'response': response.text}
                )
            else:
                self.log_result(
                    "Tariff Calculation", 
                    False, 
                    f"Code de statut incorrect: {response.status_code}",
                    {'status_code': response.status_code, 'response': response.text}
                )
                
        except Exception as e:
            self.log_result(
                "Tariff Calculation", 
                False, 
                f"Erreur lors du calcul tarifaire: {str(e)}",
                {'error': str(e), 'payload': test_payload}
            )
    
    def test_statistics(self):
        """Test GET /api/statistics - Statistiques complètes ZLECAf"""
        try:
            response = self.session.get(f"{self.base_url}/statistics", timeout=TIMEOUT)
            
            if response.status_code == 200:
                stats = response.json()
                
                # Vérifier les sections principales
                required_sections = ['overview', 'trade_statistics', 'zlecaf_impact', 'projections']
                missing_sections = [section for section in required_sections if section not in stats]
                
                if missing_sections:
                    self.log_result(
                        "Statistics", 
                        False, 
                        f"Sections manquantes: {missing_sections}",
                        {'stats': stats}
                    )
                    return
                
                # Vérifier la section overview
                overview = stats['overview']
                required_overview_fields = ['total_calculations', 'african_countries_members', 'combined_population', 'estimated_combined_gdp']
                missing_overview_fields = [field for field in required_overview_fields if field not in overview]
                
                if missing_overview_fields:
                    self.log_result(
                        "Statistics", 
                        False, 
                        f"Champs manquants dans overview: {missing_overview_fields}",
                        {'overview': overview}
                    )
                    return
                
                # Vérifier les valeurs logiques
                if overview['african_countries_members'] != 54:
                    self.log_result(
                        "Statistics", 
                        False, 
                        f"Nombre de pays membres incorrect: {overview['african_countries_members']} au lieu de 54",
                        {'members_count': overview['african_countries_members']}
                    )
                    return
                
                if overview['combined_population'] < 1000000000:  # Au moins 1 milliard
                    self.log_result(
                        "Statistics", 
                        False, 
                        f"Population combinée trop faible: {overview['combined_population']}",
                        {'population': overview['combined_population']}
                    )
                    return
                
                # Vérifier l'impact ZLECAf
                zlecaf_impact = stats['zlecaf_impact']
                required_impact_fields = ['average_tariff_reduction', 'estimated_trade_creation', 'job_creation_potential']
                missing_impact_fields = [field for field in required_impact_fields if field not in zlecaf_impact]
                
                if missing_impact_fields:
                    self.log_result(
                        "Statistics", 
                        False, 
                        f"Champs manquants dans zlecaf_impact: {missing_impact_fields}",
                        {'zlecaf_impact': zlecaf_impact}
                    )
                    return
                
                # Vérifier les projections
                projections = stats['projections']
                if '2025' not in projections or '2030' not in projections:
                    self.log_result(
                        "Statistics", 
                        False, 
                        "Projections 2025 et 2030 manquantes",
                        {'projections': projections}
                    )
                    return
                
                # Vérifier les sources de données
                if 'data_sources' not in stats or not isinstance(stats['data_sources'], list):
                    self.log_result(
                        "Statistics", 
                        False, 
                        "Sources de données manquantes ou format incorrect",
                        {'data_sources': stats.get('data_sources')}
                    )
                    return
                
                self.log_result(
                    "Statistics", 
                    True, 
                    f"Statistiques complètes - {overview['african_countries_members']} pays, {overview['total_calculations']} calculs",
                    {
                        'countries': overview['african_countries_members'],
                        'calculations': overview['total_calculations'],
                        'population': overview['combined_population'],
                        'gdp': overview['estimated_combined_gdp'],
                        'tariff_reduction': zlecaf_impact['average_tariff_reduction']
                    }
                )
                
            else:
                self.log_result(
                    "Statistics", 
                    False, 
                    f"Code de statut incorrect: {response.status_code}",
                    {'status_code': response.status_code}
                )
                
        except Exception as e:
            self.log_result(
                "Statistics", 
                False, 
                f"Erreur lors de la récupération des statistiques: {str(e)}",
                {'error': str(e)}
            )
    
    def run_all_tests(self):
        """Exécuter tous les tests"""
        print(f"🚀 Début des tests de l'API ZLECAf")
        print(f"📍 Base URL: {self.base_url}")
        print(f"⏰ Timeout: {TIMEOUT}s")
        print("=" * 80)
        
        # Exécuter tous les tests
        self.test_api_root()
        self.test_countries_list()
        self.test_country_profiles()
        self.test_rules_of_origin()
        self.test_tariff_calculation()
        self.test_statistics()
        
        # Résumé des résultats
        print("\n" + "=" * 80)
        print("📊 RÉSUMÉ DES TESTS")
        print("=" * 80)
        
        total_tests = len(self.results)
        passed_tests = sum(1 for result in self.results if result['success'])
        failed_tests = total_tests - passed_tests
        
        print(f"Total des tests: {total_tests}")
        print(f"✅ Réussis: {passed_tests}")
        print(f"❌ Échoués: {failed_tests}")
        print(f"📈 Taux de réussite: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print(f"\n🔍 TESTS ÉCHOUÉS:")
            for result in self.results:
                if not result['success']:
                    print(f"   • {result['test']}: {result['message']}")
        
        print("\n" + "=" * 80)
        return passed_tests == total_tests

def main():
    """Fonction principale"""
    tester = ZLECAfAPITester()
    success = tester.run_all_tests()
    
    # Sauvegarder les résultats détaillés
    with open('/app/test_results_detailed.json', 'w', encoding='utf-8') as f:
        json.dump(tester.results, f, indent=2, ensure_ascii=False)
    
    print(f"\n📄 Résultats détaillés sauvegardés dans: /app/test_results_detailed.json")
    
    if success:
        print("🎉 Tous les tests ont réussi!")
        sys.exit(0)
    else:
        print("⚠️  Certains tests ont échoué. Voir les détails ci-dessus.")
        sys.exit(1)

if __name__ == "__main__":
    main()