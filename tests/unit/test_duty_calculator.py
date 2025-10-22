"""
Unit tests for AfCFTA Duty Calculator
"""

import pytest
import sys
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent.parent.parent / 'backend'
sys.path.insert(0, str(backend_path))

from core.duty_calculator import AfCFTADutyCalculator


class TestAfCFTADutyCalculator:
    """Test suite for AfCFTA duty calculator"""
    
    def setup_method(self):
        """Setup test fixtures"""
        self.calculator = AfCFTADutyCalculator()
    
    def test_calculate_afcfta_rate_category_a(self):
        """Test Category A - immediate elimination"""
        rate = self.calculator.calculate_afcfta_rate(
            base_rate=10.0,
            category=AfCFTADutyCalculator.CATEGORY_A,
            is_ldc=False
        )
        assert rate == 0.0, "Category A should result in 0% tariff"
    
    def test_calculate_afcfta_rate_category_b(self):
        """Test Category B - 5 year elimination"""
        rate = self.calculator.calculate_afcfta_rate(
            base_rate=10.0,
            category=AfCFTADutyCalculator.CATEGORY_B,
            is_ldc=False
        )
        # Should be reduced linearly over 5 years
        expected_max = 10.0
        expected_min = 0.0
        assert expected_min <= rate <= expected_max, "Category B rate should be between 0% and base rate"
    
    def test_calculate_afcfta_rate_category_c(self):
        """Test Category C - 10 year elimination"""
        rate = self.calculator.calculate_afcfta_rate(
            base_rate=15.0,
            category=AfCFTADutyCalculator.CATEGORY_C,
            is_ldc=False
        )
        # Should be reduced linearly over 10 years
        assert 0.0 <= rate <= 15.0, "Category C rate should be between 0% and base rate"
    
    def test_calculate_afcfta_rate_zero_base(self):
        """Test with zero base rate"""
        rate = self.calculator.calculate_afcfta_rate(
            base_rate=0.0,
            category=AfCFTADutyCalculator.CATEGORY_B,
            is_ldc=False
        )
        assert rate == 0.0, "Zero base rate should result in 0% tariff"
    
    def test_calculate_duty_basic(self):
        """Test basic duty calculation"""
        result = self.calculator.calculate_duty(
            value=10000.0,
            base_rate=10.0,
            category=AfCFTADutyCalculator.CATEGORY_A,
            is_ldc=False
        )
        
        assert 'afcfta_rate' in result
        assert 'afcfta_amount' in result
        assert 'base_rate' in result
        assert 'category' in result
        assert result['base_rate'] == 10.0
        assert result['category'] == AfCFTADutyCalculator.CATEGORY_A
    
    def test_calculate_duty_category_a_amount(self):
        """Test duty amount for Category A"""
        result = self.calculator.calculate_duty(
            value=10000.0,
            base_rate=10.0,
            category=AfCFTADutyCalculator.CATEGORY_A,
            is_ldc=False
        )
        
        assert result['afcfta_rate'] == 0.0
        assert result['afcfta_amount'] == 0.0
    
    def test_get_category_for_hs_code_agriculture(self):
        """Test category determination for agricultural products"""
        category = self.calculator.get_category_for_hs_code("010121", "NG")
        assert category in [
            AfCFTADutyCalculator.CATEGORY_A,
            AfCFTADutyCalculator.CATEGORY_B,
            AfCFTADutyCalculator.CATEGORY_C,
            AfCFTADutyCalculator.CATEGORY_D
        ]
    
    def test_get_category_for_hs_code_machinery(self):
        """Test category determination for machinery"""
        category = self.calculator.get_category_for_hs_code("840999", "KE")
        assert category in [
            AfCFTADutyCalculator.CATEGORY_A,
            AfCFTADutyCalculator.CATEGORY_B,
            AfCFTADutyCalculator.CATEGORY_C,
            AfCFTADutyCalculator.CATEGORY_D
        ]
    
    def test_estimate_savings(self):
        """Test savings estimation"""
        result = self.calculator.estimate_savings(
            value=10000.0,
            mfn_rate=10.0,
            afcfta_rate=5.0
        )
        
        assert 'mfn_amount' in result
        assert 'afcfta_amount' in result
        assert 'savings_amount' in result
        assert 'savings_percentage' in result
        
        assert result['mfn_amount'] == 1000.0
        assert result['afcfta_amount'] == 500.0
        assert result['savings_amount'] == 500.0
        assert result['savings_percentage'] == 50.0
    
    def test_estimate_savings_no_benefit(self):
        """Test savings when AfCFTA rate equals MFN rate"""
        result = self.calculator.estimate_savings(
            value=10000.0,
            mfn_rate=10.0,
            afcfta_rate=10.0
        )
        
        assert result['savings_amount'] == 0.0
        assert result['savings_percentage'] == 0.0
        assert result['is_beneficial'] is False
    
    def test_estimate_savings_full_elimination(self):
        """Test savings with full tariff elimination"""
        result = self.calculator.estimate_savings(
            value=10000.0,
            mfn_rate=15.0,
            afcfta_rate=0.0
        )
        
        assert result['savings_amount'] == 1500.0
        assert result['savings_percentage'] == 100.0
        assert result['is_beneficial'] is True


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
