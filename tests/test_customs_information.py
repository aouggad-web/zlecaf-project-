#!/usr/bin/env python3
"""
Test customs information in country profiles
"""
import sys
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent.parent / "backend"
sys.path.insert(0, str(backend_path))

from country_data import get_country_data


def test_customs_information_structure():
    """Test that customs information has the correct structure"""
    # Test with Morocco which has customs information
    mar_data = get_country_data('MAR')
    
    assert 'customs_information' in mar_data
    customs = mar_data['customs_information']
    assert isinstance(customs, dict)
    
    # Verify required fields
    assert 'pays' in customs
    assert 'administration_douaniere' in customs
    assert 'site_web' in customs
    assert 'bureaux_importants' in customs
    
    # Verify data types
    assert isinstance(customs['pays'], str)
    assert isinstance(customs['administration_douaniere'], str)
    assert isinstance(customs['site_web'], str)
    assert isinstance(customs['bureaux_importants'], list)
    assert len(customs['bureaux_importants']) > 0


def test_multiple_countries_with_customs():
    """Test that multiple countries have customs information"""
    countries_with_customs = {
        'MAR': 'Maroc',
        'KEN': 'Kenya', 
        'NGA': 'Nigéria',
        'ZAF': 'Afrique du Sud',
        'EGY': 'Égypte'
    }
    
    for iso3, expected_name in countries_with_customs.items():
        data = get_country_data(iso3)
        
        assert 'customs_information' in data, \
            f"{expected_name} should have customs information"
        
        customs = data['customs_information']
        assert customs['pays'] == expected_name, \
            f"Country name mismatch for {iso3}"
        assert customs['site_web'].startswith('http'), \
            f"Website URL should start with http for {iso3}"


def test_country_without_customs():
    """Test that countries without customs information handle it gracefully"""
    # Test with a country that doesn't have customs information
    ben_data = get_country_data('BEN')  # Benin
    
    assert 'name' in ben_data
    assert ben_data['name'] == 'Bénin'
    
    # Should not have customs_information key or it should be None
    if 'customs_information' in ben_data:
        assert ben_data['customs_information'] is None


def test_customs_information_in_country_data():
    """Test that customs information is correctly stored in country data"""
    # Test Morocco data directly
    mar_data = get_country_data('MAR')
    
    assert 'customs_information' in mar_data
    customs = mar_data['customs_information']
    
    assert customs['pays'] == 'Maroc'
    assert 'ADII' in customs['administration_douaniere']
    assert 'douane.gov.ma' in customs['site_web']
    assert len(customs['bureaux_importants']) == 3
    
    # Verify at least one important office
    assert any('Tanger Med' in bureau for bureau in customs['bureaux_importants'])


def test_bureaux_importants_format():
    """Test that important offices follow expected format"""
    countries_with_customs = ['MAR', 'KEN', 'NGA', 'ZAF', 'EGY']
    
    for iso3 in countries_with_customs:
        data = get_country_data(iso3)
        if 'customs_information' in data:
            bureaux = data['customs_information']['bureaux_importants']
            
            # Each bureau should be a non-empty string
            for bureau in bureaux:
                assert isinstance(bureau, str)
                assert len(bureau) > 0
                # Should contain type indicator like (Port), (Aéroport), or (Frontière)
                assert any(indicator in bureau for indicator in ['Port', 'Aéroport', 'Frontière'])


def test_morocco_specific_customs_details():
    """Test Morocco-specific customs information details"""
    mar_data = get_country_data('MAR')
    customs = mar_data['customs_information']
    
    # Verify Morocco-specific details
    assert customs['pays'] == 'Maroc'
    assert 'ADII' in customs['administration_douaniere']
    assert 'douane.gov.ma' in customs['site_web']
    
    # Check for specific important offices
    bureaux = customs['bureaux_importants']
    assert len(bureaux) == 3
    assert any('Tanger Med' in b for b in bureaux)
    assert any('Casablanca' in b for b in bureaux)
    assert any('Mohammed V' in b for b in bureaux)
