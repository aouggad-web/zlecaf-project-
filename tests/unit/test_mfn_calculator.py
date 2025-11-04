"""
Unit tests for MFN Duty Calculator
"""

import pytest
import sys
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent.parent.parent / 'backend'
sys.path.insert(0, str(backend_path))

from core.mfn_calculator import MFNDutyCalculator


class TestMFNDutyCalculator:
    """Test suite for MFN duty calculator"""
    
    def setup_method(self):
        """Setup test fixtures"""
        self.calculator = MFNDutyCalculator()
    
    def test_get_mfn_rate_basic(self):
        """Test basic MFN rate retrieval"""
        rate = self.calculator.get_mfn_rate("010121", "KE")
        assert isinstance(rate, float)
        assert rate >= 0, "MFN rate should be non-negative"
    
    def test_get_mfn_rate_textiles(self):
        """Test MFN rate for textiles (typically higher)"""
        rate = self.calculator.get_mfn_rate("610910", "NG")
        assert rate > 0, "Textiles should have positive MFN rate"
    
    def test_get_mfn_rate_machinery(self):
        """Test MFN rate for machinery (typically lower)"""
        rate = self.calculator.get_mfn_rate("840999", "KE")
        assert rate >= 0, "Machinery MFN rate should be non-negative"
    
    def test_get_mfn_rate_country_adjustment(self):
        """Test country-specific adjustment"""
        # Nigeria has higher adjustment factor
        rate_ng = self.calculator.get_mfn_rate("010121", "NG")
        # South Africa has lower adjustment factor
        rate_za = self.calculator.get_mfn_rate("010121", "ZA")
        
        # Both should be valid rates
        assert rate_ng > 0
        assert rate_za > 0
    
    def test_calculate_duty_basic(self):
        """Test basic duty calculation"""
        result = self.calculator.calculate_duty(
            value=10000.0,
            hs_code="010121",
            country_code="KE"
        )
        
        assert 'mfn_rate' in result
        assert 'mfn_amount' in result
        assert 'hs_code' in result
        assert 'hs2_sector' in result
        assert 'country_code' in result
        assert result['hs_code'] == "010121"
        assert result['hs2_sector'] == "01"
        assert result['country_code'] == "KE"
    
    def test_calculate_duty_amount(self):
        """Test duty amount calculation"""
        result = self.calculator.calculate_duty(
            value=10000.0,
            hs_code="010121",
            country_code="KE"
        )
        
        expected_amount = 10000.0 * (result['mfn_rate'] / 100)
        assert abs(result['mfn_amount'] - expected_amount) < 0.01, \
            "Calculated duty amount should match expected"
    
    def test_calculate_duty_zero_value(self):
        """Test duty calculation with zero value"""
        result = self.calculator.calculate_duty(
            value=0.0,
            hs_code="010121",
            country_code="KE"
        )
        
        assert result['mfn_amount'] == 0.0, "Zero value should result in zero duty"
    
    def test_get_sector_info_agriculture(self):
        """Test sector info for agricultural products"""
        info = self.calculator.get_sector_info("010121")
        
        assert 'hs2' in info
        assert 'sector_name' in info
        assert 'base_mfn_rate' in info
        assert info['hs2'] == "01"
        assert isinstance(info['sector_name'], str)
        assert isinstance(info['base_mfn_rate'], float)
    
    def test_get_sector_info_machinery(self):
        """Test sector info for machinery"""
        info = self.calculator.get_sector_info("840999")
        
        assert info['hs2'] == "84"
        assert "Machinery" in info['sector_name'] or "machinery" in info['sector_name'].lower()
    
    def test_get_sector_info_textiles(self):
        """Test sector info for textiles"""
        info = self.calculator.get_sector_info("610910")
        
        assert info['hs2'] == "61"
        assert "Textile" in info['sector_name'] or "textile" in info['sector_name'].lower() or \
               "Apparel" in info['sector_name'] or "apparel" in info['sector_name'].lower()
    
    def test_default_mfn_rates_coverage(self):
        """Test that default MFN rates cover all HS2 sectors"""
        # Check that we have rates for major sectors
        major_sectors = ['01', '27', '39', '61', '72', '84', '85', '87']
        
        for sector in major_sectors:
            assert sector in self.calculator.DEFAULT_MFN_RATES, \
                f"Sector {sector} should have a default MFN rate"
    
    def test_country_adjustments_validity(self):
        """Test that country adjustments are reasonable"""
        for country, adjustment in self.calculator.COUNTRY_ADJUSTMENTS.items():
            assert 0.5 <= adjustment <= 2.0, \
                f"Country adjustment for {country} should be reasonable (0.5-2.0)"


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
