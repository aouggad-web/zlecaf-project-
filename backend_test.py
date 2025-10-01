#!/usr/bin/env python3
"""
Test complet de l'API ZLECAf
Tests tous les endpoints principaux avec les cas suggérés
"""

import requests
import sys
import json
from datetime import datetime

class ZLECAfAPITester:
    def __init__(self, base_url="https://zlecaf-datamap.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'User-Agent': 'ZLECAf-Test-Client/1.0'
        })

    def log_test(self, name, success, details=""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        if details and success:
            print(f"   ℹ️  {details}")

    def test_api_root(self):
        """Test GET /api/ - Hello world endpoint"""
        try:
            response = self.session.get(f"{self.api_url}/")
            success = response.status_code == 200
            
            if success:
                data = response.json()
                message = data.get('message', '')
                self.log_test("API Root", True, f"Message: {message}")
            else:
                self.log_test("API Root", False, f"Status: {response.status_code}")
                
            return success
        except Exception as e:
            self.log_test("API Root", False, str(e))
            return False

    def test_get_countries(self):
        """Test GET /api/countries - Liste des 54 pays africains"""
        try:
            response = self.session.get(f"{self.api_url}/countries")
            success = response.status_code == 200
            
            if success:
                countries = response.json()
                if isinstance(countries, list) and len(countries) == 54:
                    # Vérifier quelques pays clés
                    country_codes = [c.get('code') for c in countries]
                    required_countries = ['MA', 'GH', 'DZ', 'NG', 'KE', 'ZA']
                    missing = [c for c in required_countries if c not in country_codes]
                    
                    if not missing:
                        self.log_test("Get Countries", True, f"54 pays trouvés, pays requis présents")
                    else:
                        self.log_test("Get Countries", False, f"Pays manquants: {missing}")
                        success = False
                else:
                    self.log_test("Get Countries", False, f"Expected 54 countries, got {len(countries) if isinstance(countries, list) else 'invalid format'}")
                    success = False
            else:
                self.log_test("Get Countries", False, f"Status: {response.status_code}")
                
            return success, countries if success else []
        except Exception as e:
            self.log_test("Get Countries", False, str(e))
            return False, []

    def test_calculate_tariff(self, origin, destination, hs_code, value, test_name):
        """Test POST /api/calculate-tariff avec un cas spécifique"""
        try:
            payload = {
                "origin_country": origin,
                "destination_country": destination,
                "hs_code": hs_code,
                "value": value
            }
            
            response = self.session.post(f"{self.api_url}/calculate-tariff", json=payload)
            success = response.status_code == 200
            
            if success:
                result = response.json()
                required_fields = [
                    'origin_country', 'destination_country', 'hs_code', 'value',
                    'normal_tariff_rate', 'normal_tariff_amount',
                    'zlecaf_tariff_rate', 'zlecaf_tariff_amount',
                    'savings', 'savings_percentage', 'rules_of_origin'
                ]
                
                missing_fields = [field for field in required_fields if field not in result]
                
                if not missing_fields:
                    savings = result.get('savings', 0)
                    savings_pct = result.get('savings_percentage', 0)
                    self.log_test(f"Calculate Tariff - {test_name}", True, 
                                f"Économies: ${savings:,.2f} ({savings_pct:.1f}%)")
                else:
                    self.log_test(f"Calculate Tariff - {test_name}", False, 
                                f"Champs manquants: {missing_fields}")
                    success = False
            else:
                error_detail = ""
                try:
                    error_data = response.json()
                    error_detail = error_data.get('detail', '')
                except:
                    error_detail = response.text[:100]
                
                self.log_test(f"Calculate Tariff - {test_name}", False, 
                            f"Status: {response.status_code}, Error: {error_detail}")
                
            return success, result if success else {}
        except Exception as e:
            self.log_test(f"Calculate Tariff - {test_name}", False, str(e))
            return False, {}

    def test_get_statistics(self):
        """Test GET /api/statistics"""
        try:
            response = self.session.get(f"{self.api_url}/statistics")
            success = response.status_code == 200
            
            if success:
                stats = response.json()
                required_sections = ['overview', 'trade_statistics', 'zlecaf_impact', 'projections']
                missing_sections = [section for section in required_sections if section not in stats]
                
                if not missing_sections:
                    overview = stats.get('overview', {})
                    total_savings = overview.get('total_savings', 0)
                    member_countries = overview.get('african_countries_members', 0)
                    self.log_test("Get Statistics", True, 
                                f"Pays membres: {member_countries}, Économies totales: ${total_savings:,.2f}")
                else:
                    self.log_test("Get Statistics", False, f"Sections manquantes: {missing_sections}")
                    success = False
            else:
                self.log_test("Get Statistics", False, f"Status: {response.status_code}")
                
            return success
        except Exception as e:
            self.log_test("Get Statistics", False, str(e))
            return False

    def test_country_profile(self, country_code, country_name):
        """Test GET /api/country-profile/{code}"""
        try:
            response = self.session.get(f"{self.api_url}/country-profile/{country_code}")
            success = response.status_code == 200
            
            if success:
                profile = response.json()
                required_fields = ['country_code', 'country_name', 'region', 'projections']
                missing_fields = [field for field in required_fields if field not in profile]
                
                if not missing_fields:
                    population = profile.get('population', 0)
                    region = profile.get('region', '')
                    self.log_test(f"Country Profile - {country_name}", True, 
                                f"Région: {region}, Population: {population:,}")
                else:
                    self.log_test(f"Country Profile - {country_name}", False, 
                                f"Champs manquants: {missing_fields}")
                    success = False
            else:
                self.log_test(f"Country Profile - {country_name}", False, f"Status: {response.status_code}")
                
            return success
        except Exception as e:
            self.log_test(f"Country Profile - {country_name}", False, str(e))
            return False

    def test_rules_of_origin(self, hs_code):
        """Test GET /api/rules-of-origin/{hs_code}"""
        try:
            response = self.session.get(f"{self.api_url}/rules-of-origin/{hs_code}")
            success = response.status_code == 200
            
            if success:
                rules = response.json()
                required_fields = ['hs_code', 'sector_code', 'rules', 'explanation']
                missing_fields = [field for field in required_fields if field not in rules]
                
                if not missing_fields:
                    rule_type = rules.get('rules', {}).get('rule', '')
                    requirement = rules.get('rules', {}).get('requirement', '')
                    self.log_test(f"Rules of Origin - {hs_code}", True, 
                                f"Type: {rule_type}, Exigence: {requirement}")
                else:
                    self.log_test(f"Rules of Origin - {hs_code}", False, 
                                f"Champs manquants: {missing_fields}")
                    success = False
            else:
                self.log_test(f"Rules of Origin - {hs_code}", False, f"Status: {response.status_code}")
                
            return success
        except Exception as e:
            self.log_test(f"Rules of Origin - {hs_code}", False, str(e))
            return False

    def test_newly_added_countries(self):
        """Test spécifique pour les pays nouvellement ajoutés"""
        newly_added_countries = [
            ("MU", "Maurice"),
            ("SC", "Seychelles"), 
            ("TD", "Tchad"),
            ("LY", "Libye")
        ]
        
        print("\n🔍 Test des pays nouvellement ajoutés:")
        for code, name in newly_added_countries:
            success = self.test_country_profile(code, name)
            if success:
                # Test des nouveaux champs spécifiques
                try:
                    response = self.session.get(f"{self.api_url}/country-profile/{code}")
                    if response.status_code == 200:
                        profile = response.json()
                        new_fields = [
                            'hdi_africa_rank', 'hdi_world_rank', 'external_debt_to_gdp_ratio',
                            'internal_debt_to_gdp_ratio', 'energy_cost_usd_kwh', 'infrastructure',
                            'competitive_export_products'
                        ]
                        
                        missing_new_fields = [field for field in new_fields if field not in profile]
                        if not missing_new_fields:
                            self.log_test(f"New Fields - {name}", True, 
                                        f"Tous les nouveaux champs présents")
                        else:
                            self.log_test(f"New Fields - {name}", False, 
                                        f"Champs manquants: {missing_new_fields}")
                except Exception as e:
                    self.log_test(f"New Fields - {name}", False, str(e))

    def test_data_integrity_all_countries(self):
        """Test d'intégrité des données pour tous les 54 pays"""
        print("\n🔍 Test d'intégrité des données pour tous les pays:")
        
        try:
            response = self.session.get(f"{self.api_url}/countries")
            if response.status_code == 200:
                countries = response.json()
                
                # Test un échantillon représentatif de tous les pays
                sample_countries = [
                    ("DZ", "Algérie"), ("EG", "Égypte"), ("MA", "Maroc"), ("TN", "Tunisie"),  # Afrique du Nord
                    ("NG", "Nigeria"), ("GH", "Ghana"), ("SN", "Sénégal"), ("CI", "Côte d'Ivoire"),  # Afrique de l'Ouest
                    ("KE", "Kenya"), ("ET", "Éthiopie"), ("TZ", "Tanzanie"), ("UG", "Ouganda"),  # Afrique de l'Est
                    ("ZA", "Afrique du Sud"), ("BW", "Botswana"), ("NA", "Namibie"),  # Afrique Australe
                    ("CM", "Cameroun"), ("CD", "République Démocratique du Congo"), ("AO", "Angola")  # Afrique Centrale
                ]
                
                for code, name in sample_countries:
                    try:
                        profile_response = self.session.get(f"{self.api_url}/country-profile/{code}")
                        if profile_response.status_code == 200:
                            profile = profile_response.json()
                            
                            # Vérifier les champs essentiels
                            essential_fields = ['country_code', 'country_name', 'region', 'population']
                            missing_essential = [field for field in essential_fields if field not in profile]
                            
                            if not missing_essential:
                                self.log_test(f"Data Integrity - {name}", True, 
                                            f"Champs essentiels présents")
                            else:
                                self.log_test(f"Data Integrity - {name}", False, 
                                            f"Champs essentiels manquants: {missing_essential}")
                        else:
                            self.log_test(f"Data Integrity - {name}", False, 
                                        f"Erreur HTTP: {profile_response.status_code}")
                    except Exception as e:
                        self.log_test(f"Data Integrity - {name}", False, str(e))
                        
        except Exception as e:
            self.log_test("Data Integrity Test", False, str(e))

    def test_performance_verification(self):
        """Test de performance des endpoints"""
        print("\n⚡ Test de performance:")
        
        import time
        
        # Test performance country profile
        start_time = time.time()
        response = self.session.get(f"{self.api_url}/country-profile/NG")
        country_profile_time = time.time() - start_time
        
        if response.status_code == 200 and country_profile_time < 5.0:
            self.log_test("Performance - Country Profile", True, 
                        f"Temps de réponse: {country_profile_time:.2f}s")
        else:
            self.log_test("Performance - Country Profile", False, 
                        f"Temps de réponse trop lent: {country_profile_time:.2f}s")
        
        # Test performance statistics
        start_time = time.time()
        response = self.session.get(f"{self.api_url}/statistics")
        stats_time = time.time() - start_time
        
        if response.status_code == 200 and stats_time < 3.0:
            self.log_test("Performance - Statistics", True, 
                        f"Temps de réponse: {stats_time:.2f}s")
        else:
            self.log_test("Performance - Statistics", False, 
                        f"Temps de réponse trop lent: {stats_time:.2f}s")

    def test_hdi_data_accuracy(self):
        """Test spécifique pour la précision des données HDI selon les valeurs UNDP officielles"""
        print("\n📊 Test de précision des données HDI:")
        
        # Données HDI officielles UNDP à vérifier
        expected_hdi_data = {
            "DZ": {"hdi_score": 0.763, "hdi_africa_rank": 13, "hdi_world_rank": 91, "name": "Algérie"},
            "MA": {"hdi_score": 0.710, "hdi_africa_rank": 21, "hdi_world_rank": 113, "name": "Maroc"},
            "EG": {"hdi_score": 0.727, "hdi_africa_rank": 17, "hdi_world_rank": 105, "name": "Égypte"},
            "NG": {"hdi_score": 0.548, "hdi_africa_rank": 38, "hdi_world_rank": 161, "name": "Nigeria"},
            "ZA": {"hdi_score": 0.710, "hdi_africa_rank": 22, "hdi_world_rank": 113, "name": "Afrique du Sud"},
            "KE": {"hdi_score": 0.601, "hdi_africa_rank": 31, "hdi_world_rank": 146, "name": "Kenya"}
        }
        
        hdi_test_passed = 0
        hdi_test_total = len(expected_hdi_data)
        
        for country_code, expected_data in expected_hdi_data.items():
            try:
                response = self.session.get(f"{self.api_url}/country-profile/{country_code}")
                
                if response.status_code == 200:
                    profile = response.json()
                    
                    # Vérifier la présence des champs HDI
                    hdi_fields = ['hdi_score', 'hdi_africa_rank', 'hdi_world_rank']
                    missing_fields = [field for field in hdi_fields if field not in profile]
                    
                    if missing_fields:
                        self.log_test(f"HDI Data - {expected_data['name']}", False, 
                                    f"Champs HDI manquants: {missing_fields}")
                        continue
                    
                    # Vérifier la précision des valeurs HDI
                    actual_hdi_score = profile.get('hdi_score')
                    actual_africa_rank = profile.get('hdi_africa_rank')
                    actual_world_rank = profile.get('hdi_world_rank')
                    
                    # Tolérance pour les scores HDI (±0.001)
                    hdi_score_match = (actual_hdi_score is not None and 
                                     abs(actual_hdi_score - expected_data['hdi_score']) <= 0.001)
                    
                    # Vérification exacte pour les rangs
                    africa_rank_match = actual_africa_rank == expected_data['hdi_africa_rank']
                    world_rank_match = actual_world_rank == expected_data['hdi_world_rank']
                    
                    if hdi_score_match and africa_rank_match and world_rank_match:
                        self.log_test(f"HDI Data - {expected_data['name']}", True, 
                                    f"HDI: {actual_hdi_score}, Afrique: #{actual_africa_rank}, Monde: #{actual_world_rank}")
                        hdi_test_passed += 1
                    else:
                        errors = []
                        if not hdi_score_match:
                            errors.append(f"HDI attendu: {expected_data['hdi_score']}, reçu: {actual_hdi_score}")
                        if not africa_rank_match:
                            errors.append(f"Rang Afrique attendu: {expected_data['hdi_africa_rank']}, reçu: {actual_africa_rank}")
                        if not world_rank_match:
                            errors.append(f"Rang Monde attendu: {expected_data['hdi_world_rank']}, reçu: {actual_world_rank}")
                        
                        self.log_test(f"HDI Data - {expected_data['name']}", False, 
                                    f"Données incorrectes: {'; '.join(errors)}")
                else:
                    self.log_test(f"HDI Data - {expected_data['name']}", False, 
                                f"Erreur HTTP: {response.status_code}")
                    
            except Exception as e:
                self.log_test(f"HDI Data - {expected_data['name']}", False, str(e))
        
        # Résumé du test HDI
        print(f"   📈 Résumé HDI: {hdi_test_passed}/{hdi_test_total} pays avec données HDI correctes")
        
        return hdi_test_passed == hdi_test_total

    def test_edge_cases(self):
        """Test des cas limites et gestion d'erreurs"""
        print("\n🚨 Test des cas limites:")
        
        # Test pays invalide
        response = self.session.get(f"{self.api_url}/country-profile/XX")
        if response.status_code == 404:
            self.log_test("Edge Case - Invalid Country", True, "Erreur 404 correcte")
        else:
            self.log_test("Edge Case - Invalid Country", False, 
                        f"Code de statut inattendu: {response.status_code}")
        
        # Test calcul tarif avec pays invalide
        payload = {
            "origin_country": "XX",
            "destination_country": "NG",
            "hs_code": "010121",
            "value": 1000
        }
        response = self.session.post(f"{self.api_url}/calculate-tariff", json=payload)
        if response.status_code == 400:
            self.log_test("Edge Case - Invalid Origin Country", True, "Erreur 400 correcte")
        else:
            self.log_test("Edge Case - Invalid Origin Country", False, 
                        f"Code de statut inattendu: {response.status_code}")
        
        # Test règles d'origine avec code SH invalide
        response = self.session.get(f"{self.api_url}/rules-of-origin/999999")
        if response.status_code == 404:
            self.log_test("Edge Case - Invalid HS Code", True, "Erreur 404 correcte")
        else:
            self.log_test("Edge Case - Invalid HS Code", False, 
                        f"Code de statut inattendu: {response.status_code}")

    def run_comprehensive_tests(self):
        """Exécuter tous les tests avec les cas suggérés"""
        print("🚀 Démarrage des tests complets de l'API ZLECAf")
        print(f"📍 URL de base: {self.base_url}")
        print("=" * 60)
        
        # Test 1: API Root
        self.test_api_root()
        
        # Test 2: Get Countries
        countries_success, countries = self.test_get_countries()
        
        # Test 3: Statistics
        self.test_get_statistics()
        
        # Test 4: Cas de calcul suggérés
        test_cases = [
            ("MA", "GH", "010121", 100000, "Maroc → Ghana (Animaux vivants)"),
            ("DZ", "NG", "180100", 50000, "Algérie → Nigeria (Cacao)"),
            ("KE", "ZA", "090111", 25000, "Kenya → Afrique du Sud (Café)")
        ]
        
        for origin, dest, hs_code, value, description in test_cases:
            self.test_calculate_tariff(origin, dest, hs_code, value, description)
        
        # Test 5: Profils pays pour les pays des cas de test
        test_countries = [
            ("MA", "Maroc"),
            ("GH", "Ghana"),
            ("DZ", "Algérie"),
            ("NG", "Nigeria"),
            ("KE", "Kenya"),
            ("ZA", "Afrique du Sud")
        ]
        
        for code, name in test_countries:
            self.test_country_profile(code, name)
        
        # Test 6: Règles d'origine pour les codes SH testés
        for _, _, hs_code, _, _ in test_cases:
            self.test_rules_of_origin(hs_code)
        
        # Test 7: Pays nouvellement ajoutés
        self.test_newly_added_countries()
        
        # Test 8: Intégrité des données pour tous les pays
        self.test_data_integrity_all_countries()
        
        # Test 9: Performance
        self.test_performance_verification()
        
        # Test 10: Précision des données HDI
        self.test_hdi_data_accuracy()
        
        # Test 11: Cas limites
        self.test_edge_cases()
        
        # Résultats finaux
        print("=" * 60)
        print(f"📊 RÉSULTATS FINAUX:")
        print(f"✅ Tests réussis: {self.tests_passed}/{self.tests_run}")
        print(f"❌ Tests échoués: {self.tests_run - self.tests_passed}/{self.tests_run}")
        
        success_rate = (self.tests_passed / self.tests_run) * 100 if self.tests_run > 0 else 0
        print(f"📈 Taux de réussite: {success_rate:.1f}%")
        
        if success_rate >= 90:
            print("🎉 API en excellent état!")
        elif success_rate >= 70:
            print("⚠️  API fonctionnelle avec quelques problèmes")
        else:
            print("🚨 API avec des problèmes majeurs")
        
        return self.tests_passed == self.tests_run

def main():
    """Point d'entrée principal"""
    tester = ZLECAfAPITester()
    success = tester.run_comprehensive_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())