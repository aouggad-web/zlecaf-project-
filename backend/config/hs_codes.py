"""
HS Codes Manager

Manages the Harmonized System (HS) codes database and lookup functionality.
"""

import logging
from typing import Dict, Any, List, Optional

logger = logging.getLogger(__name__)


class HSCodeManager:
    """Manager for HS codes and product classifications"""
    
    # HS2 Sector descriptions
    HS2_SECTORS = {
        # Live animals and animal products (01-05)
        '01': {'name': 'Live Animals', 'section': 'I'},
        '02': {'name': 'Meat and Edible Meat Offal', 'section': 'I'},
        '03': {'name': 'Fish and Crustaceans', 'section': 'I'},
        '04': {'name': 'Dairy Products; Eggs; Honey', 'section': 'I'},
        '05': {'name': 'Other Animal Products', 'section': 'I'},
        
        # Vegetable products (06-14)
        '06': {'name': 'Live Trees and Plants', 'section': 'II'},
        '07': {'name': 'Edible Vegetables', 'section': 'II'},
        '08': {'name': 'Edible Fruits and Nuts', 'section': 'II'},
        '09': {'name': 'Coffee, Tea, Spices', 'section': 'II'},
        '10': {'name': 'Cereals', 'section': 'II'},
        '11': {'name': 'Milling Products', 'section': 'II'},
        '12': {'name': 'Oil Seeds and Oleaginous Fruits', 'section': 'II'},
        '13': {'name': 'Lac; Gums; Resins', 'section': 'II'},
        '14': {'name': 'Vegetable Plaiting Materials', 'section': 'II'},
        
        # Fats and oils (15)
        '15': {'name': 'Animal or Vegetable Fats and Oils', 'section': 'III'},
        
        # Prepared foodstuffs (16-24)
        '16': {'name': 'Meat and Fish Preparations', 'section': 'IV'},
        '17': {'name': 'Sugars and Sugar Confectionery', 'section': 'IV'},
        '18': {'name': 'Cocoa and Cocoa Preparations', 'section': 'IV'},
        '19': {'name': 'Cereal, Flour, Starch Preparations', 'section': 'IV'},
        '20': {'name': 'Vegetable, Fruit Preparations', 'section': 'IV'},
        '21': {'name': 'Miscellaneous Edible Preparations', 'section': 'IV'},
        '22': {'name': 'Beverages, Spirits and Vinegar', 'section': 'IV'},
        '23': {'name': 'Food Industry Residues', 'section': 'IV'},
        '24': {'name': 'Tobacco and Tobacco Substitutes', 'section': 'IV'},
        
        # Mineral products (25-27)
        '25': {'name': 'Salt; Sulphur; Earth and Stone', 'section': 'V'},
        '26': {'name': 'Ores, Slag and Ash', 'section': 'V'},
        '27': {'name': 'Mineral Fuels and Oils', 'section': 'V'},
        
        # Chemicals (28-38)
        '28': {'name': 'Inorganic Chemicals', 'section': 'VI'},
        '29': {'name': 'Organic Chemicals', 'section': 'VI'},
        '30': {'name': 'Pharmaceutical Products', 'section': 'VI'},
        '31': {'name': 'Fertilizers', 'section': 'VI'},
        '32': {'name': 'Tanning and Dyeing Extracts', 'section': 'VI'},
        '33': {'name': 'Essential Oils and Cosmetics', 'section': 'VI'},
        '34': {'name': 'Soap and Detergents', 'section': 'VI'},
        '35': {'name': 'Protein Substances; Glues', 'section': 'VI'},
        '36': {'name': 'Explosives', 'section': 'VI'},
        '37': {'name': 'Photographic Goods', 'section': 'VI'},
        '38': {'name': 'Miscellaneous Chemical Products', 'section': 'VI'},
        
        # Plastics and rubber (39-40)
        '39': {'name': 'Plastics and Articles Thereof', 'section': 'VII'},
        '40': {'name': 'Rubber and Articles Thereof', 'section': 'VII'},
        
        # Raw hides and skins (41-43)
        '41': {'name': 'Raw Hides and Skins', 'section': 'VIII'},
        '42': {'name': 'Leather Articles', 'section': 'VIII'},
        '43': {'name': 'Furskins and Artificial Fur', 'section': 'VIII'},
        
        # Wood (44-46)
        '44': {'name': 'Wood and Articles of Wood', 'section': 'IX'},
        '45': {'name': 'Cork and Articles of Cork', 'section': 'IX'},
        '46': {'name': 'Straw and Basketware', 'section': 'IX'},
        
        # Paper (47-49)
        '47': {'name': 'Pulp of Wood', 'section': 'X'},
        '48': {'name': 'Paper and Paperboard', 'section': 'X'},
        '49': {'name': 'Books and Printed Matter', 'section': 'X'},
        
        # Textiles (50-63)
        '50': {'name': 'Silk', 'section': 'XI'},
        '51': {'name': 'Wool and Animal Hair', 'section': 'XI'},
        '52': {'name': 'Cotton', 'section': 'XI'},
        '53': {'name': 'Other Vegetable Textile Fibres', 'section': 'XI'},
        '54': {'name': 'Man-made Filaments', 'section': 'XI'},
        '55': {'name': 'Man-made Staple Fibres', 'section': 'XI'},
        '56': {'name': 'Wadding and Felt', 'section': 'XI'},
        '57': {'name': 'Carpets and Textile Floor Coverings', 'section': 'XI'},
        '58': {'name': 'Special Woven Fabrics', 'section': 'XI'},
        '59': {'name': 'Impregnated Textile Fabrics', 'section': 'XI'},
        '60': {'name': 'Knitted or Crocheted Fabrics', 'section': 'XI'},
        '61': {'name': 'Knitted Apparel', 'section': 'XI'},
        '62': {'name': 'Woven Apparel', 'section': 'XI'},
        '63': {'name': 'Other Made-up Textile Articles', 'section': 'XI'},
        
        # Footwear and headgear (64-67)
        '64': {'name': 'Footwear', 'section': 'XII'},
        '65': {'name': 'Headgear', 'section': 'XII'},
        '66': {'name': 'Umbrellas and Walking-sticks', 'section': 'XII'},
        '67': {'name': 'Prepared Feathers', 'section': 'XII'},
        
        # Stone and glass (68-70)
        '68': {'name': 'Stone, Plaster, Cement Articles', 'section': 'XIII'},
        '69': {'name': 'Ceramic Products', 'section': 'XIII'},
        '70': {'name': 'Glass and Glassware', 'section': 'XIII'},
        
        # Precious stones and metals (71)
        '71': {'name': 'Pearls, Precious Stones and Metals', 'section': 'XIV'},
        
        # Base metals (72-83)
        '72': {'name': 'Iron and Steel', 'section': 'XV'},
        '73': {'name': 'Articles of Iron or Steel', 'section': 'XV'},
        '74': {'name': 'Copper and Articles Thereof', 'section': 'XV'},
        '75': {'name': 'Nickel and Articles Thereof', 'section': 'XV'},
        '76': {'name': 'Aluminium and Articles Thereof', 'section': 'XV'},
        '78': {'name': 'Lead and Articles Thereof', 'section': 'XV'},
        '79': {'name': 'Zinc and Articles Thereof', 'section': 'XV'},
        '80': {'name': 'Tin and Articles Thereof', 'section': 'XV'},
        '81': {'name': 'Other Base Metals', 'section': 'XV'},
        '82': {'name': 'Tools and Cutlery of Base Metal', 'section': 'XV'},
        '83': {'name': 'Miscellaneous Articles of Base Metal', 'section': 'XV'},
        
        # Machinery (84-85)
        '84': {'name': 'Nuclear Reactors, Boilers, Machinery', 'section': 'XVI'},
        '85': {'name': 'Electrical Machinery and Equipment', 'section': 'XVI'},
        
        # Vehicles (86-89)
        '86': {'name': 'Railway Locomotives', 'section': 'XVII'},
        '87': {'name': 'Vehicles Other than Railway', 'section': 'XVII'},
        '88': {'name': 'Aircraft and Spacecraft', 'section': 'XVII'},
        '89': {'name': 'Ships and Boats', 'section': 'XVII'},
        
        # Instruments (90-92)
        '90': {'name': 'Optical, Photographic, Medical Instruments', 'section': 'XVIII'},
        '91': {'name': 'Clocks and Watches', 'section': 'XVIII'},
        '92': {'name': 'Musical Instruments', 'section': 'XVIII'},
        
        # Arms (93)
        '93': {'name': 'Arms and Ammunition', 'section': 'XIX'},
        
        # Miscellaneous (94-96)
        '94': {'name': 'Furniture and Bedding', 'section': 'XX'},
        '95': {'name': 'Toys, Games and Sports Equipment', 'section': 'XX'},
        '96': {'name': 'Miscellaneous Manufactured Articles', 'section': 'XX'},
        
        # Art (97)
        '97': {'name': 'Works of Art and Antiques', 'section': 'XXI'},
    }
    
    def __init__(self):
        """Initialize the HS code manager"""
        pass
    
    def get_hs2_info(self, hs_code: str) -> Optional[Dict[str, Any]]:
        """
        Get information about an HS2 sector.
        
        Args:
            hs_code: The HS code (at least 2 digits)
            
        Returns:
            Dictionary with sector information or None if not found
        """
        if len(hs_code) < 2:
            return None
        
        hs2 = hs_code[:2]
        sector_info = self.HS2_SECTORS.get(hs2)
        
        if sector_info:
            return {
                'hs2_code': hs2,
                'sector_name': sector_info['name'],
                'section': sector_info['section'],
                'full_code': hs_code
            }
        
        return None
    
    def get_all_sectors(self) -> List[Dict[str, Any]]:
        """
        Get all HS2 sectors.
        
        Returns:
            List of sector dictionaries
        """
        return [
            {
                'hs2_code': code,
                'sector_name': info['name'],
                'section': info['section']
            }
            for code, info in sorted(self.HS2_SECTORS.items())
        ]
    
    def get_sectors_by_section(self, section: str) -> List[Dict[str, Any]]:
        """
        Get all HS2 sectors in a specific section.
        
        Args:
            section: The section code (e.g., 'I', 'II', 'XVI')
            
        Returns:
            List of sector dictionaries
        """
        return [
            {
                'hs2_code': code,
                'sector_name': info['name'],
                'section': info['section']
            }
            for code, info in sorted(self.HS2_SECTORS.items())
            if info['section'] == section
        ]
    
    def validate_hs_code(self, hs_code: str) -> Dict[str, Any]:
        """
        Validate an HS code format and existence.
        
        Args:
            hs_code: The HS code to validate
            
        Returns:
            Validation result dictionary
        """
        # Basic format validation
        if not isinstance(hs_code, str):
            return {
                'is_valid': False,
                'error': 'HS code must be a string'
            }
        
        hs_code = hs_code.strip()
        
        if len(hs_code) != 6:
            return {
                'is_valid': False,
                'error': f'HS code must be exactly 6 digits, got {len(hs_code)}'
            }
        
        if not hs_code.isdigit():
            return {
                'is_valid': False,
                'error': 'HS code must contain only digits'
            }
        
        # Check if HS2 sector exists
        hs2 = hs_code[:2]
        if hs2 not in self.HS2_SECTORS:
            return {
                'is_valid': False,
                'error': f'Unknown HS2 sector: {hs2}'
            }
        
        return {
            'is_valid': True,
            'hs2': hs2,
            'hs4': hs_code[:4],
            'hs6': hs_code,
            'sector_info': self.get_hs2_info(hs_code)
        }
    
    def search_sectors(self, query: str) -> List[Dict[str, Any]]:
        """
        Search for HS2 sectors by name.
        
        Args:
            query: The search query
            
        Returns:
            List of matching sector dictionaries
        """
        query = query.lower()
        matches = []
        
        for code, info in self.HS2_SECTORS.items():
            if query in info['name'].lower():
                matches.append({
                    'hs2_code': code,
                    'sector_name': info['name'],
                    'section': info['section']
                })
        
        return matches
