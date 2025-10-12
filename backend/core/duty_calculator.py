"""
AfCFTA Duty Calculator

Implements the AfCFTA tariff calculation logic based on the agreement's tariff
dismantling schedule and rules of origin.
"""

import logging
from typing import Dict, Any, Optional
from datetime import datetime

logger = logging.getLogger(__name__)


class AfCFTADutyCalculator:
    """Calculator for AfCFTA preferential tariffs"""
    
    # AfCFTA Tariff Dismantling Schedule (Phases)
    CATEGORY_A = "A"  # 0% immediately
    CATEGORY_B = "B"  # 0% within 5 years (linear reduction)
    CATEGORY_C = "C"  # 0% within 10 years (linear reduction)
    CATEGORY_D = "D"  # 0% within 13 years (linear reduction for LDCs)
    
    # Implementation timeline (AfCFTA started in 2021)
    IMPLEMENTATION_START_YEAR = 2021
    
    def __init__(self):
        """Initialize the AfCFTA duty calculator"""
        self.current_year = datetime.now().year
        self.years_since_implementation = self.current_year - self.IMPLEMENTATION_START_YEAR
        
    def calculate_afcfta_rate(
        self,
        base_rate: float,
        category: str,
        is_ldc: bool = False
    ) -> float:
        """
        Calculate the current AfCFTA tariff rate based on the dismantling schedule.
        
        Args:
            base_rate: The original MFN tariff rate
            category: Tariff category (A, B, C, or D)
            is_ldc: Whether the importing country is a Least Developed Country
            
        Returns:
            The calculated AfCFTA tariff rate
        """
        if base_rate <= 0:
            return 0.0
            
        if category == self.CATEGORY_A:
            # Immediate elimination
            return 0.0
            
        elif category == self.CATEGORY_B:
            # Linear reduction over 5 years
            reduction_period = 5
            if self.years_since_implementation >= reduction_period:
                return 0.0
            reduction_per_year = base_rate / reduction_period
            return max(0.0, base_rate - (reduction_per_year * self.years_since_implementation))
            
        elif category == self.CATEGORY_C:
            # Linear reduction over 10 years
            reduction_period = 10
            if self.years_since_implementation >= reduction_period:
                return 0.0
            reduction_per_year = base_rate / reduction_period
            return max(0.0, base_rate - (reduction_per_year * self.years_since_implementation))
            
        elif category == self.CATEGORY_D and is_ldc:
            # Linear reduction over 13 years for LDCs
            reduction_period = 13
            if self.years_since_implementation >= reduction_period:
                return 0.0
            reduction_per_year = base_rate / reduction_period
            return max(0.0, base_rate - (reduction_per_year * self.years_since_implementation))
            
        else:
            logger.warning(f"Unknown category {category} or invalid LDC status")
            return base_rate
    
    def calculate_duty(
        self,
        value: float,
        base_rate: float,
        category: str,
        is_ldc: bool = False
    ) -> Dict[str, Any]:
        """
        Calculate AfCFTA duty for a given trade value.
        
        Args:
            value: Merchandise value in USD
            base_rate: The original MFN tariff rate (percentage)
            category: Tariff category (A, B, C, or D)
            is_ldc: Whether the importing country is a Least Developed Country
            
        Returns:
            Dictionary with calculation details
        """
        try:
            afcfta_rate = self.calculate_afcfta_rate(base_rate, category, is_ldc)
            afcfta_amount = value * (afcfta_rate / 100)
            
            return {
                'afcfta_rate': round(afcfta_rate, 2),
                'afcfta_amount': round(afcfta_amount, 2),
                'base_rate': base_rate,
                'category': category,
                'implementation_year': self.current_year,
                'years_since_start': self.years_since_implementation,
                'is_fully_liberalized': afcfta_rate == 0.0
            }
        except Exception as e:
            logger.error(f"Error calculating AfCFTA duty: {e}")
            raise
    
    def get_category_for_hs_code(self, hs_code: str, country_code: str) -> str:
        """
        Determine the tariff category for a given HS code and country.
        
        This is a simplified implementation. In a production system, this would
        query a comprehensive database of tariff schedules.
        
        Args:
            hs_code: The HS code (6-digit)
            country_code: The destination country code
            
        Returns:
            The tariff category (A, B, C, or D)
        """
        # Simplified categorization based on HS sectors
        hs2 = hs_code[:2]
        
        # Agricultural products (HS 01-24) - typically Category B or C
        if hs2 in [f"{i:02d}" for i in range(1, 25)]:
            return self.CATEGORY_C
            
        # Chemicals and plastics (HS 28-40) - typically Category B
        elif hs2 in [f"{i:02d}" for i in range(28, 41)]:
            return self.CATEGORY_B
            
        # Textiles and apparel (HS 50-63) - typically Category B
        elif hs2 in [f"{i:02d}" for i in range(50, 64)]:
            return self.CATEGORY_B
            
        # Metals and machinery (HS 72-85) - typically Category A or B
        elif hs2 in [f"{i:02d}" for i in range(72, 86)]:
            return self.CATEGORY_A
            
        # Vehicles and transport (HS 86-89) - typically Category B
        elif hs2 in [f"{i:02d}" for i in range(86, 90)]:
            return self.CATEGORY_B
            
        # Default to Category B
        else:
            return self.CATEGORY_B
    
    def estimate_savings(
        self,
        value: float,
        mfn_rate: float,
        afcfta_rate: float
    ) -> Dict[str, Any]:
        """
        Calculate the savings from using AfCFTA preferential rates.
        
        Args:
            value: Merchandise value in USD
            mfn_rate: The MFN tariff rate (percentage)
            afcfta_rate: The AfCFTA tariff rate (percentage)
            
        Returns:
            Dictionary with savings information
        """
        mfn_amount = value * (mfn_rate / 100)
        afcfta_amount = value * (afcfta_rate / 100)
        savings_amount = mfn_amount - afcfta_amount
        savings_percentage = ((mfn_amount - afcfta_amount) / mfn_amount * 100) if mfn_amount > 0 else 0
        
        return {
            'mfn_amount': round(mfn_amount, 2),
            'afcfta_amount': round(afcfta_amount, 2),
            'savings_amount': round(savings_amount, 2),
            'savings_percentage': round(savings_percentage, 2),
            'is_beneficial': savings_amount > 0
        }
