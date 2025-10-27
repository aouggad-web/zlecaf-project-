"""
Unit tests for Data Processor
"""

import pytest
import sys
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent.parent.parent / 'backend'
sys.path.insert(0, str(backend_path))

from core.data_processor import DataProcessor


class TestDataProcessor:
    """Test suite for data processor"""
    
    def setup_method(self):
        """Setup test fixtures"""
        self.processor = DataProcessor()
    
    def test_validate_hs_code_valid(self):
        """Test validation of valid HS code"""
        result = self.processor.validate_hs_code("010121")
        
        assert result['is_valid'] is True
        assert result['cleaned'] == "010121"
        assert len(result['errors']) == 0
        assert result['hs2'] == "01"
        assert result['hs4'] == "0101"
        assert result['hs6'] == "010121"
    
    def test_validate_hs_code_invalid_length(self):
        """Test validation of HS code with invalid length"""
        result = self.processor.validate_hs_code("0101")
        
        assert result['is_valid'] is False
        assert len(result['errors']) > 0
    
    def test_validate_hs_code_non_numeric(self):
        """Test validation of non-numeric HS code"""
        result = self.processor.validate_hs_code("01012A")
        
        assert result['is_valid'] is False
        assert len(result['errors']) > 0
    
    def test_validate_hs_code_with_spaces(self):
        """Test validation handles spaces"""
        result = self.processor.validate_hs_code(" 010121 ")
        
        assert result['is_valid'] is True
        assert result['cleaned'] == "010121"
    
    def test_validate_country_code_valid(self):
        """Test validation of valid country code"""
        result = self.processor.validate_country_code("KE")
        
        assert result['is_valid'] is True
        assert result['cleaned'] == "KE"
        assert len(result['errors']) == 0
    
    def test_validate_country_code_lowercase(self):
        """Test validation converts to uppercase"""
        result = self.processor.validate_country_code("ke")
        
        assert result['is_valid'] is True
        assert result['cleaned'] == "KE"
    
    def test_validate_country_code_invalid_length(self):
        """Test validation of country code with invalid length"""
        result = self.processor.validate_country_code("KEN")
        
        assert result['is_valid'] is False
        assert len(result['errors']) > 0
    
    def test_validate_country_code_with_valid_list(self):
        """Test validation with valid countries list"""
        valid_countries = ["KE", "NG", "GH"]
        
        result = self.processor.validate_country_code("KE", valid_countries)
        assert result['is_valid'] is True
        
        result = self.processor.validate_country_code("US", valid_countries)
        assert result['is_valid'] is False
    
    def test_validate_trade_value_valid(self):
        """Test validation of valid trade value"""
        result = self.processor.validate_trade_value(10000.0)
        
        assert result['is_valid'] is True
        assert result['numeric_value'] == 10000.0
        assert len(result['errors']) == 0
    
    def test_validate_trade_value_string(self):
        """Test validation converts string to number"""
        result = self.processor.validate_trade_value("10000.50")
        
        assert result['is_valid'] is True
        assert result['numeric_value'] == 10000.50
    
    def test_validate_trade_value_negative(self):
        """Test validation rejects negative values"""
        result = self.processor.validate_trade_value(-1000.0)
        
        assert result['is_valid'] is False
        assert len(result['errors']) > 0
    
    def test_validate_trade_value_with_min_max(self):
        """Test validation with min and max bounds"""
        result = self.processor.validate_trade_value(5000.0, min_value=1000.0, max_value=10000.0)
        assert result['is_valid'] is True
        
        result = self.processor.validate_trade_value(500.0, min_value=1000.0)
        assert result['is_valid'] is False
        
        result = self.processor.validate_trade_value(15000.0, max_value=10000.0)
        assert result['is_valid'] is False
    
    def test_normalize_trade_record(self):
        """Test normalization of trade record"""
        record = {
            'origin_country': 'ke',
            'destination_country': 'ng',
            'hs_code': '010121',
            'value': 10000.0,
            'currency': 'USD'
        }
        
        normalized = self.processor.normalize_trade_record(record)
        
        assert normalized['origin_country'] == 'KE'
        assert normalized['destination_country'] == 'NG'
        assert normalized['hs_code'] == '010121'
        assert normalized['value_usd'] == 10000.0
        assert 'metadata' in normalized
        assert 'timestamp' in normalized
    
    def test_aggregate_trade_data(self):
        """Test aggregation of trade records"""
        records = [
            {'origin_country': 'KE', 'destination_country': 'NG', 'value_usd': 1000.0},
            {'origin_country': 'KE', 'destination_country': 'NG', 'value_usd': 2000.0},
            {'origin_country': 'KE', 'destination_country': 'GH', 'value_usd': 1500.0},
        ]
        
        aggregated = self.processor.aggregate_trade_data(
            records,
            group_by=['origin_country', 'destination_country']
        )
        
        assert len(aggregated) == 2  # Two unique country pairs
        
        # Find KE->NG aggregation
        ke_ng = next(r for r in aggregated if r['destination_country'] == 'NG')
        assert ke_ng['total_value_usd'] == 3000.0
        assert ke_ng['record_count'] == 2
    
    def test_calculate_statistics(self):
        """Test statistics calculation"""
        values = [10, 20, 30, 40, 50]
        
        stats = self.processor.calculate_statistics(values)
        
        assert stats['count'] == 5
        assert stats['sum'] == 150
        assert stats['mean'] == 30
        assert stats['median'] == 30
        assert stats['min'] == 10
        assert stats['max'] == 50
    
    def test_calculate_statistics_empty(self):
        """Test statistics with empty list"""
        stats = self.processor.calculate_statistics([])
        
        assert stats['count'] == 0
        assert stats['sum'] == 0
        assert stats['mean'] == 0


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
