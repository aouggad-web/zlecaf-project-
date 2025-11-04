"""
Country Profiles Manager

Manages AfCFTA member country profiles and data.
"""

import logging
from typing import Dict, Any, List, Optional

logger = logging.getLogger(__name__)


class CountryProfileManager:
    """Manager for AfCFTA country profiles"""
    
    # Least Developed Countries (LDCs) in AfCFTA
    LDC_COUNTRIES = {
        'BJ', 'BF', 'BI', 'CF', 'TD', 'KM', 'CD', 'DJ', 'ER', 'ET', 
        'GM', 'GN', 'GW', 'LS', 'LR', 'MG', 'MW', 'ML', 'MR', 'MZ',
        'NE', 'RW', 'ST', 'SN', 'SL', 'SO', 'SS', 'SD', 'TG', 'UG',
        'TZ', 'ZM'
    }
    
    # Regional Economic Communities
    REGIONAL_COMMUNITIES = {
        'ECOWAS': {
            'name': 'Economic Community of West African States',
            'members': ['BJ', 'BF', 'CV', 'CI', 'GM', 'GH', 'GN', 'GW', 'LR', 'ML', 'NE', 'NG', 'SN', 'SL', 'TG']
        },
        'EAC': {
            'name': 'East African Community',
            'members': ['BI', 'KE', 'RW', 'SS', 'TZ', 'UG']
        },
        'SADC': {
            'name': 'Southern African Development Community',
            'members': ['AO', 'BW', 'CD', 'LS', 'MG', 'MW', 'MU', 'MZ', 'NA', 'SC', 'ZA', 'TZ', 'ZM', 'ZW']
        },
        'COMESA': {
            'name': 'Common Market for Eastern and Southern Africa',
            'members': ['BI', 'KM', 'CD', 'DJ', 'EG', 'ER', 'ET', 'KE', 'LY', 'MG', 'MW', 'MU', 'RW', 'SC', 'SO', 'SD', 'SZ', 'TN', 'UG', 'ZM', 'ZW']
        },
        'CEMAC': {
            'name': 'Economic and Monetary Community of Central Africa',
            'members': ['CM', 'CF', 'TD', 'CG', 'GQ', 'GA']
        },
        'AMU': {
            'name': 'Arab Maghreb Union',
            'members': ['DZ', 'LY', 'MR', 'MA', 'TN']
        },
    }
    
    def __init__(self, countries_data: List[Dict[str, Any]]):
        """
        Initialize the country profiles manager.
        
        Args:
            countries_data: List of country dictionaries
        """
        self.countries = {c['code']: c for c in countries_data}
        self.countries_list = countries_data
    
    def get_country(self, country_code: str) -> Optional[Dict[str, Any]]:
        """
        Get a country profile by code.
        
        Args:
            country_code: The country code (2 letters)
            
        Returns:
            Country dictionary or None if not found
        """
        return self.countries.get(country_code.upper())
    
    def get_all_countries(self) -> List[Dict[str, Any]]:
        """
        Get all AfCFTA member countries.
        
        Returns:
            List of country dictionaries
        """
        return self.countries_list
    
    def is_ldc(self, country_code: str) -> bool:
        """
        Check if a country is a Least Developed Country.
        
        Args:
            country_code: The country code (2 letters)
            
        Returns:
            True if the country is an LDC, False otherwise
        """
        return country_code.upper() in self.LDC_COUNTRIES
    
    def get_regional_communities(self, country_code: str) -> List[Dict[str, str]]:
        """
        Get the regional economic communities a country belongs to.
        
        Args:
            country_code: The country code (2 letters)
            
        Returns:
            List of community dictionaries
        """
        country_code = country_code.upper()
        communities = []
        
        for rec_code, rec_data in self.REGIONAL_COMMUNITIES.items():
            if country_code in rec_data['members']:
                communities.append({
                    'code': rec_code,
                    'name': rec_data['name']
                })
        
        return communities
    
    def get_common_communities(
        self,
        country_code1: str,
        country_code2: str
    ) -> List[Dict[str, str]]:
        """
        Get regional communities common to both countries.
        
        Args:
            country_code1: First country code
            country_code2: Second country code
            
        Returns:
            List of common community dictionaries
        """
        communities1 = set(c['code'] for c in self.get_regional_communities(country_code1))
        communities2 = set(c['code'] for c in self.get_regional_communities(country_code2))
        
        common = communities1.intersection(communities2)
        
        return [
            {
                'code': rec_code,
                'name': self.REGIONAL_COMMUNITIES[rec_code]['name']
            }
            for rec_code in common
        ]
    
    def get_countries_by_region(self, region: str) -> List[Dict[str, Any]]:
        """
        Get all countries in a specific region.
        
        Args:
            region: The region name
            
        Returns:
            List of country dictionaries
        """
        return [
            country for country in self.countries_list
            if country.get('region') == region
        ]
    
    def get_countries_by_community(self, community_code: str) -> List[Dict[str, Any]]:
        """
        Get all countries in a regional economic community.
        
        Args:
            community_code: The REC code (e.g., 'ECOWAS')
            
        Returns:
            List of country dictionaries
        """
        if community_code not in self.REGIONAL_COMMUNITIES:
            return []
        
        member_codes = self.REGIONAL_COMMUNITIES[community_code]['members']
        
        return [
            self.countries[code]
            for code in member_codes
            if code in self.countries
        ]
    
    def get_country_statistics(self) -> Dict[str, Any]:
        """
        Get statistics about AfCFTA member countries.
        
        Returns:
            Dictionary with statistics
        """
        total_population = sum(c.get('population', 0) for c in self.countries_list)
        
        regions = {}
        for country in self.countries_list:
            region = country.get('region', 'Unknown')
            if region not in regions:
                regions[region] = {
                    'count': 0,
                    'population': 0
                }
            regions[region]['count'] += 1
            regions[region]['population'] += country.get('population', 0)
        
        return {
            'total_countries': len(self.countries_list),
            'total_population': total_population,
            'ldc_count': len([c for c in self.countries_list if self.is_ldc(c['code'])]),
            'regions': regions,
            'regional_communities_count': len(self.REGIONAL_COMMUNITIES)
        }
