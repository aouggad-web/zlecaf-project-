"""
Trade Analyzer

Provides comprehensive trade analysis tools including trade flows,
comparative advantage, and market opportunities.
"""

import logging
from typing import Dict, Any, List, Optional
from datetime import datetime

logger = logging.getLogger(__name__)


class TradeAnalyzer:
    """Analyzer for trade patterns and opportunities"""
    
    def __init__(self):
        """Initialize the trade analyzer"""
        pass
    
    def analyze_bilateral_trade(
        self,
        origin_country: Dict[str, Any],
        destination_country: Dict[str, Any],
        hs_code: str,
        value: float
    ) -> Dict[str, Any]:
        """
        Analyze bilateral trade between two countries for a specific product.
        
        Args:
            origin_country: Origin country data
            destination_country: Destination country data
            hs_code: The HS code (6-digit)
            value: Trade value in USD
            
        Returns:
            Dictionary with trade analysis
        """
        try:
            analysis = {
                'origin': {
                    'code': origin_country['code'],
                    'name': origin_country['name'],
                    'region': origin_country['region']
                },
                'destination': {
                    'code': destination_country['code'],
                    'name': destination_country['name'],
                    'region': destination_country['region']
                },
                'product': {
                    'hs_code': hs_code,
                    'hs2_sector': hs_code[:2]
                },
                'trade_value_usd': value,
                'analysis_date': datetime.now().isoformat()
            }
            
            # Calculate trade intensity
            analysis['trade_intensity'] = self._calculate_trade_intensity(
                value,
                origin_country.get('gdp_usd', 1_000_000_000),
                destination_country.get('gdp_usd', 1_000_000_000)
            )
            
            # Assess market size
            analysis['market_assessment'] = self._assess_market_size(
                destination_country
            )
            
            # Calculate distance factor (simplified by region)
            analysis['distance_factor'] = self._calculate_distance_factor(
                origin_country['region'],
                destination_country['region']
            )
            
            # Competitive analysis
            analysis['competitiveness'] = self._assess_competitiveness(
                origin_country,
                destination_country,
                hs_code
            )
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error analyzing bilateral trade: {e}")
            raise
    
    def identify_opportunities(
        self,
        country_data: Dict[str, Any],
        partner_countries: List[Dict[str, Any]],
        sectors: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        Identify trade opportunities for a country with partner countries.
        
        Args:
            country_data: Data for the country analyzing opportunities
            partner_countries: List of potential partner countries
            sectors: Optional list of HS2 sectors to focus on
            
        Returns:
            Dictionary with identified opportunities
        """
        try:
            opportunities = []
            
            for partner in partner_countries:
                # Skip same country
                if partner['code'] == country_data['code']:
                    continue
                
                opportunity = {
                    'partner_code': partner['code'],
                    'partner_name': partner['name'],
                    'partner_region': partner['region'],
                    'market_size_usd': partner.get('gdp_usd', 0),
                    'population': partner.get('population', 0),
                }
                
                # Calculate opportunity score
                opportunity['opportunity_score'] = self._calculate_opportunity_score(
                    country_data,
                    partner
                )
                
                # Identify key sectors
                opportunity['key_sectors'] = self._identify_key_sectors(
                    country_data,
                    partner,
                    sectors
                )
                
                opportunities.append(opportunity)
            
            # Sort by opportunity score
            opportunities.sort(key=lambda x: x['opportunity_score'], reverse=True)
            
            return {
                'country': country_data['code'],
                'total_opportunities': len(opportunities),
                'top_opportunities': opportunities[:10],
                'all_opportunities': opportunities,
                'analysis_date': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error identifying opportunities: {e}")
            raise
    
    def calculate_trade_creation_potential(
        self,
        current_mfn_rate: float,
        afcfta_rate: float,
        elasticity: float = 1.5
    ) -> Dict[str, Any]:
        """
        Estimate trade creation potential from tariff reduction.
        
        Args:
            current_mfn_rate: Current MFN tariff rate (%)
            afcfta_rate: AfCFTA tariff rate (%)
            elasticity: Trade elasticity to tariff changes (default 1.5)
            
        Returns:
            Dictionary with trade creation estimates
        """
        try:
            # Calculate tariff reduction
            tariff_reduction = current_mfn_rate - afcfta_rate
            
            # Estimate trade increase (simplified model)
            # Trade increase % = elasticity × tariff reduction %
            trade_increase_pct = elasticity * tariff_reduction
            
            return {
                'tariff_reduction_pct': round(tariff_reduction, 2),
                'estimated_trade_increase_pct': round(trade_increase_pct, 2),
                'elasticity_used': elasticity,
                'interpretation': self._interpret_trade_creation(trade_increase_pct)
            }
            
        except Exception as e:
            logger.error(f"Error calculating trade creation: {e}")
            raise
    
    def _calculate_trade_intensity(
        self,
        trade_value: float,
        origin_gdp: float,
        dest_gdp: float
    ) -> Dict[str, Any]:
        """Calculate trade intensity index"""
        # Trade intensity = (bilateral trade / origin GDP) / (dest GDP / world GDP)
        # Simplified: use bilateral trade as % of combined GDP
        combined_gdp = origin_gdp + dest_gdp
        intensity = (trade_value / combined_gdp * 100) if combined_gdp > 0 else 0
        
        return {
            'intensity_index': round(intensity, 4),
            'interpretation': 'High' if intensity > 0.1 else 'Moderate' if intensity > 0.01 else 'Low'
        }
    
    def _assess_market_size(self, country: Dict[str, Any]) -> Dict[str, Any]:
        """Assess market size and attractiveness"""
        gdp = country.get('gdp_usd', 0)
        population = country.get('population', 0)
        
        return {
            'size_category': 'Large' if gdp > 100_000_000_000 else 'Medium' if gdp > 10_000_000_000 else 'Small',
            'gdp_usd': gdp,
            'population': population,
            'gdp_per_capita': round(gdp / population, 2) if population > 0 else 0
        }
    
    def _calculate_distance_factor(
        self,
        origin_region: str,
        dest_region: str
    ) -> Dict[str, Any]:
        """Calculate distance/proximity factor"""
        same_region = origin_region == dest_region
        
        # Simplified distance penalty
        distance_penalty = 0 if same_region else 0.15
        
        return {
            'same_region': same_region,
            'distance_penalty': distance_penalty,
            'proximity_advantage': same_region
        }
    
    def _assess_competitiveness(
        self,
        origin: Dict[str, Any],
        destination: Dict[str, Any],
        hs_code: str
    ) -> Dict[str, Any]:
        """Assess competitive position"""
        # Simplified competitiveness assessment
        origin_gdp_pc = origin.get('gdp_per_capita', 1000)
        dest_gdp_pc = destination.get('gdp_per_capita', 1000)
        
        # Cost advantage if origin has lower GDP per capita
        cost_advantage = origin_gdp_pc < dest_gdp_pc
        
        return {
            'has_cost_advantage': cost_advantage,
            'competitiveness_score': 70 if cost_advantage else 50,
            'factors': {
                'origin_gdp_per_capita': origin_gdp_pc,
                'destination_gdp_per_capita': dest_gdp_pc
            }
        }
    
    def _calculate_opportunity_score(
        self,
        origin: Dict[str, Any],
        partner: Dict[str, Any]
    ) -> float:
        """Calculate overall opportunity score (0-100)"""
        score = 0
        
        # Market size (30%)
        partner_gdp = partner.get('gdp_usd', 0)
        score += min(30, (partner_gdp / 1_000_000_000_000) * 30)
        
        # Population (20%)
        partner_pop = partner.get('population', 0)
        score += min(20, (partner_pop / 100_000_000) * 20)
        
        # Regional proximity (25%)
        if origin['region'] == partner['region']:
            score += 25
        else:
            score += 10
        
        # Growth potential (25%)
        # Simplified: assume all African countries have growth potential
        score += 20
        
        return round(score, 2)
    
    def _identify_key_sectors(
        self,
        origin: Dict[str, Any],
        partner: Dict[str, Any],
        sectors: Optional[List[str]] = None
    ) -> List[str]:
        """Identify key sectors for trade"""
        # Simplified sector identification
        default_sectors = [
            "Agricultural Products (HS 01-24)",
            "Textiles and Apparel (HS 50-63)",
            "Machinery and Electronics (HS 84-85)",
            "Chemicals (HS 28-38)",
            "Processed Foods (HS 16-24)"
        ]
        
        if sectors:
            return sectors[:5]
        
        return default_sectors[:3]
    
    def _interpret_trade_creation(self, increase_pct: float) -> str:
        """Interpret trade creation potential"""
        if increase_pct > 20:
            return "Very High - Significant trade creation expected"
        elif increase_pct > 10:
            return "High - Substantial trade increase expected"
        elif increase_pct > 5:
            return "Moderate - Notable trade increase expected"
        elif increase_pct > 0:
            return "Low - Modest trade increase expected"
        else:
            return "Minimal - Limited trade impact expected"
