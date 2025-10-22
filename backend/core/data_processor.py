"""
Data Processor

Utilities for processing and validating trade data.
"""

import logging
from typing import Dict, Any, List, Optional, Union
from datetime import datetime
import re

logger = logging.getLogger(__name__)


class DataProcessor:
    """Processor for trade data validation and transformation"""
    
    # Valid HS code pattern (6 digits)
    HS_CODE_PATTERN = re.compile(r'^\d{6}$')
    
    # Valid country code pattern (2 letters)
    COUNTRY_CODE_PATTERN = re.compile(r'^[A-Z]{2}$')
    
    def __init__(self):
        """Initialize the data processor"""
        pass
    
    def validate_hs_code(self, hs_code: str) -> Dict[str, Any]:
        """
        Validate an HS code.
        
        Args:
            hs_code: The HS code to validate
            
        Returns:
            Validation result dictionary
        """
        try:
            # Clean the input
            cleaned = str(hs_code).strip()
            
            # Check pattern
            is_valid = bool(self.HS_CODE_PATTERN.match(cleaned))
            
            result = {
                'is_valid': is_valid,
                'original': hs_code,
                'cleaned': cleaned,
                'errors': []
            }
            
            if not is_valid:
                if len(cleaned) != 6:
                    result['errors'].append(f"HS code must be exactly 6 digits, got {len(cleaned)}")
                if not cleaned.isdigit():
                    result['errors'].append("HS code must contain only digits")
            else:
                result['hs2'] = cleaned[:2]
                result['hs4'] = cleaned[:4]
                result['hs6'] = cleaned
            
            return result
            
        except Exception as e:
            logger.error(f"Error validating HS code: {e}")
            return {
                'is_valid': False,
                'original': hs_code,
                'errors': [str(e)]
            }
    
    def validate_country_code(
        self,
        country_code: str,
        valid_countries: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        Validate a country code.
        
        Args:
            country_code: The country code to validate
            valid_countries: Optional list of valid country codes
            
        Returns:
            Validation result dictionary
        """
        try:
            # Clean the input
            cleaned = str(country_code).strip().upper()
            
            # Check pattern
            is_valid = bool(self.COUNTRY_CODE_PATTERN.match(cleaned))
            
            result = {
                'is_valid': is_valid,
                'original': country_code,
                'cleaned': cleaned,
                'errors': []
            }
            
            if not is_valid:
                if len(cleaned) != 2:
                    result['errors'].append(f"Country code must be exactly 2 letters, got {len(cleaned)}")
                if not cleaned.isalpha():
                    result['errors'].append("Country code must contain only letters")
            elif valid_countries and cleaned not in valid_countries:
                result['is_valid'] = False
                result['errors'].append(f"Country code '{cleaned}' is not in the valid list")
            
            return result
            
        except Exception as e:
            logger.error(f"Error validating country code: {e}")
            return {
                'is_valid': False,
                'original': country_code,
                'errors': [str(e)]
            }
    
    def validate_trade_value(
        self,
        value: Union[int, float, str],
        min_value: float = 0.0,
        max_value: Optional[float] = None
    ) -> Dict[str, Any]:
        """
        Validate a trade value.
        
        Args:
            value: The trade value to validate
            min_value: Minimum allowed value (default 0)
            max_value: Optional maximum allowed value
            
        Returns:
            Validation result dictionary
        """
        try:
            # Convert to float
            numeric_value = float(value)
            
            result = {
                'is_valid': True,
                'original': value,
                'numeric_value': numeric_value,
                'errors': []
            }
            
            # Check minimum
            if numeric_value < min_value:
                result['is_valid'] = False
                result['errors'].append(f"Value {numeric_value} is below minimum {min_value}")
            
            # Check maximum if provided
            if max_value is not None and numeric_value > max_value:
                result['is_valid'] = False
                result['errors'].append(f"Value {numeric_value} exceeds maximum {max_value}")
            
            return result
            
        except (ValueError, TypeError) as e:
            logger.error(f"Error validating trade value: {e}")
            return {
                'is_valid': False,
                'original': value,
                'errors': [f"Invalid numeric value: {str(e)}"]
            }
    
    def normalize_trade_record(
        self,
        record: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Normalize a trade record to standard format.
        
        Args:
            record: Raw trade record
            
        Returns:
            Normalized trade record
        """
        try:
            normalized = {
                'timestamp': datetime.now().isoformat(),
                'origin_country': str(record.get('origin_country', '')).strip().upper(),
                'destination_country': str(record.get('destination_country', '')).strip().upper(),
                'hs_code': str(record.get('hs_code', '')).strip(),
                'value_usd': float(record.get('value', 0)),
                'currency': record.get('currency', 'USD'),
                'year': record.get('year', datetime.now().year)
            }
            
            # Add metadata
            normalized['metadata'] = {
                'processed_at': datetime.now().isoformat(),
                'source': record.get('source', 'unknown'),
                'quality_score': self._calculate_quality_score(normalized)
            }
            
            return normalized
            
        except Exception as e:
            logger.error(f"Error normalizing trade record: {e}")
            raise
    
    def aggregate_trade_data(
        self,
        records: List[Dict[str, Any]],
        group_by: List[str]
    ) -> List[Dict[str, Any]]:
        """
        Aggregate trade records by specified fields.
        
        Args:
            records: List of trade records
            group_by: List of fields to group by
            
        Returns:
            List of aggregated records
        """
        try:
            # Group records
            groups = {}
            for record in records:
                # Create group key
                key_parts = [str(record.get(field, '')) for field in group_by]
                key = '|'.join(key_parts)
                
                if key not in groups:
                    groups[key] = {
                        'group_key': dict(zip(group_by, key_parts)),
                        'records': [],
                        'total_value': 0,
                        'count': 0
                    }
                
                groups[key]['records'].append(record)
                groups[key]['total_value'] += record.get('value_usd', 0)
                groups[key]['count'] += 1
            
            # Convert to list
            aggregated = []
            for group in groups.values():
                aggregated.append({
                    **group['group_key'],
                    'total_value_usd': round(group['total_value'], 2),
                    'record_count': group['count'],
                    'average_value_usd': round(group['total_value'] / group['count'], 2) if group['count'] > 0 else 0
                })
            
            return aggregated
            
        except Exception as e:
            logger.error(f"Error aggregating trade data: {e}")
            raise
    
    def calculate_statistics(
        self,
        values: List[Union[int, float]]
    ) -> Dict[str, float]:
        """
        Calculate basic statistics for a list of values.
        
        Args:
            values: List of numeric values
            
        Returns:
            Dictionary with statistics
        """
        try:
            if not values:
                return {
                    'count': 0,
                    'sum': 0,
                    'mean': 0,
                    'median': 0,
                    'min': 0,
                    'max': 0
                }
            
            sorted_values = sorted(values)
            n = len(sorted_values)
            
            return {
                'count': n,
                'sum': round(sum(values), 2),
                'mean': round(sum(values) / n, 2),
                'median': round(sorted_values[n // 2] if n % 2 == 1 else (sorted_values[n // 2 - 1] + sorted_values[n // 2]) / 2, 2),
                'min': round(min(values), 2),
                'max': round(max(values), 2),
                'std_dev': round(self._calculate_std_dev(values), 2)
            }
            
        except Exception as e:
            logger.error(f"Error calculating statistics: {e}")
            raise
    
    def _calculate_quality_score(self, record: Dict[str, Any]) -> float:
        """Calculate data quality score (0-100)"""
        score = 100.0
        
        # Deduct for missing or invalid fields
        if not record.get('origin_country'):
            score -= 25
        if not record.get('destination_country'):
            score -= 25
        if not record.get('hs_code') or len(str(record.get('hs_code', ''))) != 6:
            score -= 20
        if record.get('value_usd', 0) <= 0:
            score -= 30
        
        return max(0, score)
    
    def _calculate_std_dev(self, values: List[Union[int, float]]) -> float:
        """Calculate standard deviation"""
        if len(values) < 2:
            return 0.0
        
        mean = sum(values) / len(values)
        variance = sum((x - mean) ** 2 for x in values) / (len(values) - 1)
        
        return variance ** 0.5
