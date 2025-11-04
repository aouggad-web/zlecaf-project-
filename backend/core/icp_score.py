"""
ICP (Investment Climate and Potential) Score Calculator

Calculates investment climate and trade potential scores for country pairs.
"""

import logging
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)


class ICPScoreCalculator:
    """Calculator for Investment Climate and Potential (ICP) scores"""
    
    # Economic factors weights
    WEIGHTS = {
        'gdp_size': 0.15,
        'gdp_per_capita': 0.10,
        'trade_volume': 0.15,
        'infrastructure': 0.15,
        'business_environment': 0.15,
        'regional_integration': 0.10,
        'market_access': 0.10,
        'political_stability': 0.10,
    }
    
    # Regional integration factors
    REGIONAL_COMMUNITIES = {
        'ECOWAS': ['BJ', 'BF', 'CV', 'CI', 'GM', 'GH', 'GN', 'GW', 'LR', 'ML', 'NE', 'NG', 'SN', 'SL', 'TG'],
        'EAC': ['BI', 'KE', 'RW', 'SS', 'TZ', 'UG'],
        'SADC': ['AO', 'BW', 'CD', 'LS', 'MG', 'MW', 'MU', 'MZ', 'NA', 'SC', 'ZA', 'TZ', 'ZM', 'ZW'],
        'COMESA': ['BI', 'KM', 'CD', 'DJ', 'EG', 'ER', 'ET', 'KE', 'LY', 'MG', 'MW', 'MU', 'RW', 'SC', 'SO', 'SD', 'SZ', 'TN', 'UG', 'ZM', 'ZW'],
        'CEMAC': ['CM', 'CF', 'TD', 'CG', 'GQ', 'GA'],
        'AMU': ['DZ', 'LY', 'MR', 'MA', 'TN'],
    }
    
    def __init__(self):
        """Initialize the ICP score calculator"""
        pass
    
    def calculate_score(
        self,
        origin_country: Dict[str, Any],
        destination_country: Dict[str, Any],
        trade_data: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Calculate the ICP score between two countries.
        
        Args:
            origin_country: Origin country data
            destination_country: Destination country data
            trade_data: Optional trade data between countries
            
        Returns:
            Dictionary with ICP score and components
        """
        try:
            components = {}
            
            # GDP size component (0-100)
            dest_gdp = destination_country.get('gdp_usd', 10_000_000_000)
            components['gdp_size'] = min(100, (dest_gdp / 1_000_000_000_000) * 100)
            
            # GDP per capita component (0-100)
            dest_gdp_pc = destination_country.get('gdp_per_capita', 1000)
            components['gdp_per_capita'] = min(100, (dest_gdp_pc / 20000) * 100)
            
            # Trade volume component (0-100)
            if trade_data and 'bilateral_trade_volume' in trade_data:
                trade_volume = trade_data['bilateral_trade_volume']
                components['trade_volume'] = min(100, (trade_volume / 10_000_000_000) * 100)
            else:
                # Estimate based on GDP
                components['trade_volume'] = components['gdp_size'] * 0.3
            
            # Infrastructure component (0-100)
            components['infrastructure'] = destination_country.get('infrastructure_index', 50)
            
            # Business environment component (0-100)
            africa_rank = destination_country.get('africa_rank', 27)
            components['business_environment'] = max(0, 100 - (africa_rank * 2))
            
            # Regional integration component (0-100)
            components['regional_integration'] = self._calculate_regional_integration(
                origin_country.get('code'),
                destination_country.get('code')
            )
            
            # Market access component (0-100)
            components['market_access'] = 70  # Base score for AfCFTA members
            
            # Political stability component (0-100)
            risk_rating = destination_country.get('risk_ratings', {}).get('global_risk', 'Moderate')
            components['political_stability'] = self._risk_to_score(risk_rating)
            
            # Calculate weighted total
            total_score = sum(
                components[key] * self.WEIGHTS[key]
                for key in self.WEIGHTS.keys()
            )
            
            # Calculate trade potential rating
            potential_rating = self._score_to_rating(total_score)
            
            return {
                'icp_score': round(total_score, 2),
                'rating': potential_rating,
                'components': {k: round(v, 2) for k, v in components.items()},
                'recommendations': self._generate_recommendations(total_score, components)
            }
            
        except Exception as e:
            logger.error(f"Error calculating ICP score: {e}")
            raise
    
    def _calculate_regional_integration(
        self,
        origin_code: Optional[str],
        dest_code: Optional[str]
    ) -> float:
        """
        Calculate regional integration score based on common memberships.
        
        Returns:
            Score from 0-100
        """
        if not origin_code or not dest_code:
            return 50.0
        
        common_communities = 0
        for community, members in self.REGIONAL_COMMUNITIES.items():
            if origin_code in members and dest_code in members:
                common_communities += 1
        
        # Score increases with common memberships
        base_score = 50  # Base for AfCFTA
        bonus = min(50, common_communities * 20)  # +20 per common REC
        
        return base_score + bonus
    
    def _risk_to_score(self, risk_rating: str) -> float:
        """
        Convert risk rating to a 0-100 score.
        
        Args:
            risk_rating: Risk rating string
            
        Returns:
            Score from 0-100
        """
        risk_mapping = {
            'Very Low': 90,
            'Low': 80,
            'Moderate': 60,
            'Moderately High': 50,
            'High': 30,
            'Very High': 20,
            'Non évalué': 50,  # Neutral score
        }
        
        return risk_mapping.get(risk_rating, 50)
    
    def _score_to_rating(self, score: float) -> str:
        """
        Convert ICP score to a qualitative rating.
        
        Args:
            score: ICP score (0-100)
            
        Returns:
            Rating string
        """
        if score >= 80:
            return "Excellent"
        elif score >= 70:
            return "Very Good"
        elif score >= 60:
            return "Good"
        elif score >= 50:
            return "Moderate"
        elif score >= 40:
            return "Fair"
        else:
            return "Limited"
    
    def _generate_recommendations(
        self,
        total_score: float,
        components: Dict[str, float]
    ) -> list:
        """
        Generate recommendations based on ICP score and components.
        
        Args:
            total_score: Overall ICP score
            components: Component scores
            
        Returns:
            List of recommendation strings
        """
        recommendations = []
        
        if total_score >= 70:
            recommendations.append("High trade potential - consider priority market development")
        elif total_score >= 50:
            recommendations.append("Moderate potential - targeted market entry recommended")
        else:
            recommendations.append("Limited potential - careful market assessment needed")
        
        # Component-specific recommendations
        if components.get('infrastructure', 100) < 50:
            recommendations.append("Infrastructure challenges may affect logistics costs")
        
        if components.get('regional_integration', 100) > 70:
            recommendations.append("Strong regional integration - leverage existing trade networks")
        
        if components.get('business_environment', 100) > 70:
            recommendations.append("Favorable business environment for investment")
        
        if components.get('trade_volume', 100) < 40:
            recommendations.append("Limited existing trade - focus on market development")
        
        return recommendations
