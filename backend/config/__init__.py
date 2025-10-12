"""
Configuration module for AfCFTA Trade Analysis System.

This module manages:
- Country profiles
- HS codes database
- System settings
"""

from .country_profiles import CountryProfileManager
from .hs_codes import HSCodeManager
from .settings import Settings, get_settings

__all__ = [
    'CountryProfileManager',
    'HSCodeManager',
    'Settings',
    'get_settings',
]
