"""
MFN (Most Favored Nation) Duty Calculator

Implements MFN tariff calculations based on WTO tariff schedules.
"""

import logging
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)


class MFNDutyCalculator:
    """Calculator for MFN (Most Favored Nation) tariffs"""
    
    # Average MFN rates by HS2 sector (simplified approximations)
    # In production, these would come from a comprehensive tariff database
    DEFAULT_MFN_RATES = {
        # Agriculture (HS 01-24)
        **{f"{i:02d}": 15.0 for i in range(1, 25)},
        # Minerals (HS 25-27)
        "25": 5.0, "26": 0.0, "27": 5.0,
        # Chemicals (HS 28-38)
        **{f"{i:02d}": 8.0 for i in range(28, 39)},
        # Plastics and rubber (HS 39-40)
        "39": 10.0, "40": 12.0,
        # Raw hides, skins, leather (HS 41-43)
        "41": 7.0, "42": 12.0, "43": 15.0,
        # Wood (HS 44-46)
        "44": 10.0, "45": 8.0, "46": 10.0,
        # Paper (HS 47-49)
        "47": 5.0, "48": 8.0, "49": 8.0,
        # Textiles (HS 50-63)
        **{f"{i:02d}": 18.0 for i in range(50, 64)},
        # Footwear (HS 64-67)
        **{f"{i:02d}": 20.0 for i in range(64, 68)},
        # Stone, glass (HS 68-70)
        "68": 10.0, "69": 12.0, "70": 10.0,
        # Precious metals (HS 71)
        "71": 8.0,
        # Base metals (HS 72-83)
        **{f"{i:02d}": 8.0 for i in range(72, 84)},
        # Machinery and electronics (HS 84-85)
        "84": 5.0, "85": 7.0,
        # Vehicles (HS 86-89)
        **{f"{i:02d}": 15.0 for i in range(86, 90)},
        # Instruments (HS 90-92)
        "90": 5.0, "91": 8.0, "92": 10.0,
        # Arms (HS 93)
        "93": 5.0,
        # Furniture (HS 94)
        "94": 15.0,
        # Toys (HS 95)
        "95": 12.0,
        # Miscellaneous (HS 96-97)
        "96": 10.0, "97": 5.0,
    }
    
    # Country-specific adjustments (some countries have higher/lower average rates)
    COUNTRY_ADJUSTMENTS = {
        "EG": 1.2,  # Egypt - slightly higher
        "NG": 1.3,  # Nigeria - higher protection
        "KE": 1.1,  # Kenya - slightly higher
        "ZA": 0.9,  # South Africa - more liberalized
        "MU": 0.8,  # Mauritius - very open economy
    }
    
    def __init__(self):
        """Initialize the MFN duty calculator"""
        pass
    
    def get_mfn_rate(self, hs_code: str, country_code: str) -> float:
        """
        Get the MFN tariff rate for a given HS code and country.
        
        Args:
            hs_code: The HS code (6-digit)
            country_code: The destination country code
            
        Returns:
            The MFN tariff rate as a percentage
        """
        # Get the HS2 sector
        hs2 = hs_code[:2]
        
        # Get base rate
        base_rate = self.DEFAULT_MFN_RATES.get(hs2, 10.0)  # Default 10% if not found
        
        # Apply country-specific adjustment
        adjustment = self.COUNTRY_ADJUSTMENTS.get(country_code, 1.0)
        
        return round(base_rate * adjustment, 2)
    
    def calculate_duty(
        self,
        value: float,
        hs_code: str,
        country_code: str
    ) -> Dict[str, Any]:
        """
        Calculate MFN duty for a given trade value.
        
        Args:
            value: Merchandise value in USD
            hs_code: The HS code (6-digit)
            country_code: The destination country code
            
        Returns:
            Dictionary with calculation details
        """
        try:
            mfn_rate = self.get_mfn_rate(hs_code, country_code)
            mfn_amount = value * (mfn_rate / 100)
            
            return {
                'mfn_rate': mfn_rate,
                'mfn_amount': round(mfn_amount, 2),
                'hs_code': hs_code,
                'hs2_sector': hs_code[:2],
                'country_code': country_code,
                'has_country_adjustment': country_code in self.COUNTRY_ADJUSTMENTS
            }
        except Exception as e:
            logger.error(f"Error calculating MFN duty: {e}")
            raise
    
    def get_sector_info(self, hs_code: str) -> Dict[str, Any]:
        """
        Get information about the HS sector.
        
        Args:
            hs_code: The HS code (6-digit)
            
        Returns:
            Dictionary with sector information
        """
        hs2 = hs_code[:2]
        
        sector_names = {
            **{f"{i:02d}": "Agricultural Products" for i in range(1, 25)},
            "25": "Mineral Products", "26": "Ores and Metals", "27": "Fuels",
            **{f"{i:02d}": "Chemicals" for i in range(28, 39)},
            "39": "Plastics", "40": "Rubber",
            "41": "Raw Hides", "42": "Leather Products", "43": "Furskins",
            **{f"{i:02d}": "Wood and Wood Products" for i in range(44, 47)},
            **{f"{i:02d}": "Paper and Paper Products" for i in range(47, 50)},
            **{f"{i:02d}": "Textiles" for i in range(50, 64)},
            **{f"{i:02d}": "Footwear" for i in range(64, 68)},
            "68": "Stone Products", "69": "Ceramics", "70": "Glass",
            "71": "Precious Stones and Metals",
            **{f"{i:02d}": "Base Metals" for i in range(72, 84)},
            "84": "Machinery", "85": "Electrical Equipment",
            **{f"{i:02d}": "Vehicles" for i in range(86, 90)},
            "90": "Optical and Medical Instruments", "91": "Clocks", "92": "Musical Instruments",
            "93": "Arms and Ammunition", "94": "Furniture", "95": "Toys and Sports Equipment",
            "96": "Miscellaneous Manufactured Articles", "97": "Works of Art"
        }
        
        return {
            'hs2': hs2,
            'sector_name': sector_names.get(hs2, f"Sector {hs2}"),
            'base_mfn_rate': self.DEFAULT_MFN_RATES.get(hs2, 10.0)
        }
