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
    def __init__(self, base_url="https://patch-manager.preview.emergentagent.com"):
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