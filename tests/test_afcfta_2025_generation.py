#!/usr/bin/env python3
"""
Tests for AfCFTA 2025 data generation
"""

import sys
import json
import csv
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from backend.country_data import REAL_COUNTRY_DATA


def test_script_existence():
    """Test 1: Script file exists"""
    print("\n" + "="*60)
    print("📋 TEST 1: Script existence")
    print("="*60)
    
    script_path = Path(__file__).parent.parent / 'backend' / 'generate_afcfta_2025_data.py'
    
    if script_path.exists():
        print(f"   ✅ Script exists: {script_path}")
        return True
    else:
        print(f"   ❌ Script missing: {script_path}")
        return False


def test_generated_files():
    """Test 2: Required files are generated"""
    print("\n" + "="*60)
    print("📋 TEST 2: Generated files")
    print("="*60)
    
    data_dir = Path(__file__).parent.parent / 'frontend' / 'public' / 'data'
    
    required_files = [
        'zlecaf_dismantling_matrix_2025.csv',
        'zlecaf_afcfta_rates_by_year_2025.csv',
        'zlecaf_immediate_dismantled_2025.csv',
        'zlecaf_afcfta_2025_metadata.json',
        'zlecaf_afcfta_dismantling_2025.xlsx',
    ]
    
    all_present = True
    for filename in required_files:
        file_path = data_dir / filename
        if file_path.exists():
            size = file_path.stat().st_size
            print(f"   ✅ {filename} ({size:,} bytes)")
        else:
            print(f"   ❌ {filename} MISSING")
            all_present = False
    
    return all_present


def test_dismantling_matrix_structure():
    """Test 3: Dismantling matrix has correct structure"""
    print("\n" + "="*60)
    print("📋 TEST 3: Dismantling matrix structure")
    print("="*60)
    
    file_path = Path(__file__).parent.parent / 'frontend' / 'public' / 'data' / 'zlecaf_dismantling_matrix_2025.csv'
    
    if not file_path.exists():
        print(f"   ⚠️  File not found")
        return False
    
    with open(file_path, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        headers = next(reader)
        
        # Check first two columns
        if headers[0] == 'hs6_code' and headers[1] == 'hs_description':
            print(f"   ✅ First two columns correct: {headers[0]}, {headers[1]}")
        else:
            print(f"   ❌ First two columns incorrect: {headers[0]}, {headers[1]}")
            return False
        
        # Check country columns (should have 54 countries)
        country_columns = headers[2:]
        if len(country_columns) == 54:
            print(f"   ✅ Has {len(country_columns)} country columns")
        else:
            print(f"   ⚠️  Has {len(country_columns)} country columns (expected 54)")
        
        # Count rows
        row_count = sum(1 for _ in reader)
        print(f"   ✅ Has {row_count} HS6 code rows")
        
    return True


def test_rates_by_year_structure():
    """Test 4: Rates by year has correct structure"""
    print("\n" + "="*60)
    print("📋 TEST 4: Rates by year structure")
    print("="*60)
    
    file_path = Path(__file__).parent.parent / 'frontend' / 'public' / 'data' / 'zlecaf_afcfta_rates_by_year_2025.csv'
    
    if not file_path.exists():
        print(f"   ⚠️  File not found")
        return False
    
    expected_headers = [
        'country', 'hs6_code', 'year', 'mfn_rate_pct',
        'afcfta_rate_pct', 'schedule', 'immediate_flag', 'source_url'
    ]
    
    with open(file_path, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        headers = next(reader)
        
        if headers == expected_headers:
            print(f"   ✅ Headers correct: {', '.join(headers)}")
        else:
            print(f"   ❌ Headers incorrect")
            print(f"      Expected: {', '.join(expected_headers)}")
            print(f"      Got: {', '.join(headers)}")
            return False
        
        # Count rows and check year range
        rows = list(reader)
        row_count = len(rows)
        print(f"   ✅ Has {row_count} data rows")
        
        # Check year range
        if rows:
            years = set(int(row[2]) for row in rows if row[2])
            if 2025 in years and 2035 in years:
                print(f"   ✅ Year range includes 2025-2035")
            else:
                print(f"   ⚠️  Year range: {min(years) if years else 'N/A'}-{max(years) if years else 'N/A'}")
        
    return True


def test_immediate_dismantled_structure():
    """Test 5: Immediate dismantled has correct structure"""
    print("\n" + "="*60)
    print("📋 TEST 5: Immediate dismantled structure")
    print("="*60)
    
    file_path = Path(__file__).parent.parent / 'frontend' / 'public' / 'data' / 'zlecaf_immediate_dismantled_2025.csv'
    
    if not file_path.exists():
        print(f"   ⚠️  File not found")
        return False
    
    expected_headers = [
        'country', 'hs6_code', 'start_year', 'initial_mfn_rate_pct',
        'schedule', 'notes', 'source_url'
    ]
    
    with open(file_path, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        headers = next(reader)
        
        if headers == expected_headers:
            print(f"   ✅ Headers correct")
        else:
            print(f"   ❌ Headers incorrect")
            return False
        
        # Count rows and check schedule
        rows = list(reader)
        row_count = len(rows)
        print(f"   ✅ Has {row_count} immediate positions")
        
        # Check that all schedules are "Immediate"
        if rows:
            schedules = set(row[4] for row in rows)
            if schedules == {'Immediate'}:
                print(f"   ✅ All schedules are 'Immediate'")
            else:
                print(f"   ⚠️  Found schedules: {schedules}")
        
    return True


def test_metadata_structure():
    """Test 6: Metadata JSON has correct structure"""
    print("\n" + "="*60)
    print("📋 TEST 6: Metadata structure")
    print("="*60)
    
    file_path = Path(__file__).parent.parent / 'frontend' / 'public' / 'data' / 'zlecaf_afcfta_2025_metadata.json'
    
    if not file_path.exists():
        print(f"   ⚠️  File not found")
        return False
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            metadata = json.load(f)
        
        print(f"   ✅ Valid JSON")
        
        # Check required fields
        required_fields = ['version', 'generated_at', 'description', 'period', 
                          'coverage', 'dismantling_categories', 'data_fields']
        
        for field in required_fields:
            if field in metadata:
                print(f"   ✅ Has '{field}' field")
            else:
                print(f"   ❌ Missing '{field}' field")
                return False
        
        # Check period
        if metadata['period']['start_year'] == 2025 and metadata['period']['end_year'] == 2035:
            print(f"   ✅ Period is 2025-2035")
        else:
            print(f"   ⚠️  Period: {metadata['period']}")
        
        # Check country count
        if metadata['coverage']['total_countries'] == 54:
            print(f"   ✅ Total countries: 54")
        else:
            print(f"   ⚠️  Total countries: {metadata['coverage']['total_countries']}")
        
    except json.JSONDecodeError as e:
        print(f"   ❌ Invalid JSON: {e}")
        return False
    
    return True


def test_documentation_exists():
    """Test 7: Documentation exists"""
    print("\n" + "="*60)
    print("📋 TEST 7: Documentation")
    print("="*60)
    
    doc_file = Path(__file__).parent.parent / 'docs' / 'AFCFTA_2025_DATA.md'
    
    if not doc_file.exists():
        print(f"   ❌ Documentation not found: {doc_file}")
        return False
    
    content = doc_file.read_text(encoding='utf-8')
    
    required_sections = [
        'Overview',
        'Generation',
        'Generated Files',
        'Dismantling Categories',
        'Coverage',
        'Usage Examples',
    ]
    
    all_present = True
    for section in required_sections:
        if section in content:
            print(f"   ✅ Section '{section}' present")
        else:
            print(f"   ⚠️  Section '{section}' potentially absent")
    
    print(f"   ✅ Documentation exists ({len(content):,} characters)")
    return True


def main():
    """Run all tests"""
    print("\n" + "="*70)
    print("🧪 TESTS: AFCFTA 2025 DATA GENERATION")
    print("="*70)
    
    tests = [
        ("Script existence", test_script_existence),
        ("Generated files", test_generated_files),
        ("Dismantling matrix structure", test_dismantling_matrix_structure),
        ("Rates by year structure", test_rates_by_year_structure),
        ("Immediate dismantled structure", test_immediate_dismantled_structure),
        ("Metadata structure", test_metadata_structure),
        ("Documentation", test_documentation_exists),
    ]
    
    results = []
    for name, test_func in tests:
        try:
            success = test_func()
            results.append((name, success))
        except Exception as e:
            print(f"\n❌ Error during test '{name}': {e}")
            import traceback
            traceback.print_exc()
            results.append((name, False))
    
    # Summary
    print("\n" + "="*70)
    print("📊 TEST SUMMARY")
    print("="*70)
    
    passed = sum(1 for _, success in results if success)
    total = len(results)
    
    for name, success in results:
        icon = "✅" if success else "❌"
        print(f"{icon} {name}")
    
    print("\n" + "="*70)
    print(f"Result: {passed}/{total} tests passed")
    print("="*70)
    
    if passed == total:
        print("✅ ALL TESTS PASSED!")
        return 0
    else:
        print("⚠️  Some tests failed")
        return 1


if __name__ == "__main__":
    sys.exit(main())
