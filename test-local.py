#!/usr/bin/env python3
"""
Quick test script for local ZLECAf API
"""

import requests
import sys

BASE_URL = "http://localhost:8000/api"

def test_api():
    """Test the main API endpoints"""
    tests_passed = 0
    tests_failed = 0
    
    print("🧪 Testing ZLECAf Local API")
    print("=" * 60)
    
    # Test 1: Root endpoint
    print("\n1. Testing API root...")
    try:
        response = requests.get(f"{BASE_URL}/", timeout=5)
        if response.status_code == 200 and "ZLECAf" in response.json().get("message", ""):
            print("   ✅ Root endpoint working")
            tests_passed += 1
        else:
            print("   ❌ Root endpoint failed")
            tests_failed += 1
    except Exception as e:
        print(f"   ❌ Error: {e}")
        tests_failed += 1
    
    # Test 2: Countries list
    print("\n2. Testing countries list...")
    try:
        response = requests.get(f"{BASE_URL}/countries", timeout=5)
        countries = response.json()
        if response.status_code == 200 and len(countries) == 54:
            print(f"   ✅ All 54 countries loaded")
            tests_passed += 1
        else:
            print(f"   ❌ Expected 54 countries, got {len(countries)}")
            tests_failed += 1
    except Exception as e:
        print(f"   ❌ Error: {e}")
        tests_failed += 1
    
    # Test 3: Country profile
    print("\n3. Testing country profile (Algeria - DZ)...")
    try:
        response = requests.get(f"{BASE_URL}/country-profile/DZ", timeout=5)
        profile = response.json()
        if response.status_code == 200 and profile.get("country_name") == "Algérie":
            print(f"   ✅ Algeria profile loaded")
            print(f"      GDP: ${profile.get('gdp_usd', 0):,.0f} billion")
            print(f"      Population: {profile.get('population', 0):,}")
            tests_passed += 1
        else:
            print("   ❌ Country profile failed")
            tests_failed += 1
    except Exception as e:
        print(f"   ❌ Error: {e}")
        tests_failed += 1
    
    # Test 4: Rules of origin
    print("\n4. Testing rules of origin (HS 010121)...")
    try:
        response = requests.get(f"{BASE_URL}/rules-of-origin/010121", timeout=5)
        rules = response.json()
        if response.status_code == 200 and rules.get("hs_code") == "010121":
            print(f"   ✅ Rules of origin loaded")
            print(f"      Rule: {rules.get('rules', {}).get('rule')}")
            tests_passed += 1
        else:
            print("   ❌ Rules of origin failed")
            tests_failed += 1
    except Exception as e:
        print(f"   ❌ Error: {e}")
        tests_failed += 1
    
    # Test 5: Tariff calculation
    print("\n5. Testing tariff calculation...")
    try:
        payload = {
            "origin_country": "NG",
            "destination_country": "EG",
            "hs_code": "010121",
            "value": 100000,
            "currency": "USD"
        }
        response = requests.post(f"{BASE_URL}/calculate-tariff", json=payload, timeout=5)
        calc = response.json()
        if response.status_code == 200 and "savings" in calc:
            print(f"   ✅ Tariff calculation working")
            print(f"      Savings: ${calc.get('savings', 0):,.2f}")
            tests_passed += 1
        else:
            print("   ❌ Tariff calculation failed")
            tests_failed += 1
    except Exception as e:
        print(f"   ❌ Error: {e}")
        tests_failed += 1
    
    # Test 6: Statistics
    print("\n6. Testing statistics...")
    try:
        response = requests.get(f"{BASE_URL}/statistics", timeout=5)
        stats = response.json()
        if response.status_code == 200:
            print(f"   ✅ Statistics loaded")
            tests_passed += 1
        else:
            print("   ❌ Statistics failed")
            tests_failed += 1
    except Exception as e:
        print(f"   ❌ Error: {e}")
        tests_failed += 1
    
    # Summary
    print("\n" + "=" * 60)
    print(f"📊 RESULTS: {tests_passed} passed, {tests_failed} failed")
    print("=" * 60)
    
    if tests_failed == 0:
        print("🎉 All tests passed! API is working perfectly.")
        return 0
    else:
        print("⚠️  Some tests failed. Check the output above.")
        return 1

if __name__ == "__main__":
    sys.exit(test_api())
