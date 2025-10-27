"""
Request Validators

Provides comprehensive validation for API requests.
"""

import logging
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field, validator

logger = logging.getLogger(__name__)


class TariffCalculationRequest(BaseModel):
    """Request model for tariff calculation"""
    origin_country: str = Field(..., description="Origin country code (2 letters)")
    destination_country: str = Field(..., description="Destination country code (2 letters)")
    hs_code: str = Field(..., description="HS code (6 digits)")
    value: float = Field(..., gt=0, description="Merchandise value in USD")
    
    @validator('origin_country', 'destination_country')
    def validate_country_code(cls, v):
        """Validate country code format"""
        v = v.strip().upper()
        if len(v) != 2:
            raise ValueError("Country code must be exactly 2 letters")
        if not v.isalpha():
            raise ValueError("Country code must contain only letters")
        return v
    
    @validator('hs_code')
    def validate_hs_code(cls, v):
        """Validate HS code format"""
        v = str(v).strip()
        if len(v) != 6:
            raise ValueError("HS code must be exactly 6 digits")
        if not v.isdigit():
            raise ValueError("HS code must contain only digits")
        return v
    
    @validator('value')
    def validate_value(cls, v):
        """Validate trade value"""
        if v <= 0:
            raise ValueError("Value must be greater than 0")
        if v > 1e12:  # 1 trillion USD
            raise ValueError("Value exceeds maximum allowed amount")
        return v


class CountryProfileRequest(BaseModel):
    """Request model for country profile"""
    country_code: str = Field(..., description="Country code (2 letters)")
    include_projections: bool = Field(True, description="Include economic projections")
    include_risk_ratings: bool = Field(True, description="Include risk ratings")
    
    @validator('country_code')
    def validate_country_code(cls, v):
        """Validate country code format"""
        v = v.strip().upper()
        if len(v) != 2:
            raise ValueError("Country code must be exactly 2 letters")
        if not v.isalpha():
            raise ValueError("Country code must contain only letters")
        return v


class RulesOfOriginRequest(BaseModel):
    """Request model for rules of origin"""
    hs_code: str = Field(..., description="HS code (6 digits)")
    
    @validator('hs_code')
    def validate_hs_code(cls, v):
        """Validate HS code format"""
        v = str(v).strip()
        if len(v) != 6:
            raise ValueError("HS code must be exactly 6 digits")
        if not v.isdigit():
            raise ValueError("HS code must contain only digits")
        return v


class TradeAnalysisRequest(BaseModel):
    """Request model for trade analysis"""
    origin_country: str = Field(..., description="Origin country code")
    destination_country: str = Field(..., description="Destination country code")
    hs_code: Optional[str] = Field(None, description="Optional HS code for product-specific analysis")
    period: Optional[str] = Field("current", description="Analysis period (current, historical, forecast)")
    
    @validator('origin_country', 'destination_country')
    def validate_country_code(cls, v):
        """Validate country code format"""
        v = v.strip().upper()
        if len(v) != 2:
            raise ValueError("Country code must be exactly 2 letters")
        if not v.isalpha():
            raise ValueError("Country code must contain only letters")
        return v
    
    @validator('hs_code')
    def validate_hs_code(cls, v):
        """Validate HS code format if provided"""
        if v is None:
            return v
        v = str(v).strip()
        if len(v) != 6:
            raise ValueError("HS code must be exactly 6 digits")
        if not v.isdigit():
            raise ValueError("HS code must contain only digits")
        return v


class RequestValidator:
    """Validator for API requests"""
    
    def __init__(self, african_countries: List[Dict[str, Any]]):
        """
        Initialize validator with list of valid African countries.
        
        Args:
            african_countries: List of African country dictionaries
        """
        self.valid_country_codes = {c['code'] for c in african_countries}
    
    def validate_tariff_request(
        self,
        request: TariffCalculationRequest
    ) -> Dict[str, Any]:
        """
        Validate a tariff calculation request.
        
        Args:
            request: The tariff calculation request
            
        Returns:
            Validation result dictionary
        """
        errors = []
        
        # Check if countries are AfCFTA members
        if request.origin_country not in self.valid_country_codes:
            errors.append(f"Origin country '{request.origin_country}' is not an AfCFTA member")
        
        if request.destination_country not in self.valid_country_codes:
            errors.append(f"Destination country '{request.destination_country}' is not an AfCFTA member")
        
        # Check if countries are different
        if request.origin_country == request.destination_country:
            errors.append("Origin and destination countries must be different")
        
        return {
            'is_valid': len(errors) == 0,
            'errors': errors
        }
    
    def validate_country_profile_request(
        self,
        country_code: str
    ) -> Dict[str, Any]:
        """
        Validate a country profile request.
        
        Args:
            country_code: The country code to validate
            
        Returns:
            Validation result dictionary
        """
        errors = []
        
        # Check if country is AfCFTA member
        if country_code not in self.valid_country_codes:
            errors.append(f"Country '{country_code}' is not an AfCFTA member")
        
        return {
            'is_valid': len(errors) == 0,
            'errors': errors
        }
    
    def validate_trade_analysis_request(
        self,
        request: TradeAnalysisRequest
    ) -> Dict[str, Any]:
        """
        Validate a trade analysis request.
        
        Args:
            request: The trade analysis request
            
        Returns:
            Validation result dictionary
        """
        errors = []
        
        # Check if countries are AfCFTA members
        if request.origin_country not in self.valid_country_codes:
            errors.append(f"Origin country '{request.origin_country}' is not an AfCFTA member")
        
        if request.destination_country not in self.valid_country_codes:
            errors.append(f"Destination country '{request.destination_country}' is not an AfCFTA member")
        
        # Validate period
        valid_periods = ['current', 'historical', 'forecast']
        if request.period and request.period not in valid_periods:
            errors.append(f"Period must be one of: {', '.join(valid_periods)}")
        
        return {
            'is_valid': len(errors) == 0,
            'errors': errors
        }
