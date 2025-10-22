#!/usr/bin/env python3
"""
Complete Trade Analysis Example

This example demonstrates how to use all the core modules together to perform
a comprehensive trade analysis between two African countries.
"""

import sys
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent.parent / 'backend'
sys.path.insert(0, str(backend_path))

from core.duty_calculator import AfCFTADutyCalculator
from core.mfn_calculator import MFNDutyCalculator
from core.icp_score import ICPScoreCalculator
from core.trade_analyzer import TradeAnalyzer
from core.data_processor import DataProcessor
from config.country_profiles import CountryProfileManager
from config.hs_codes import HSCodeManager


def print_section(title):
    """Print a formatted section header"""
    print("\n" + "=" * 70)
    print(f"  {title}")
    print("=" * 70)


def main():
    """Run complete trade analysis example"""
    
    print_section("AfCFTA Complete Trade Analysis System - Example")
    
    # Example data for two countries
    kenya = {
        'code': 'KE',
        'name': 'Kenya',
        'region': 'East Africa',
        'gdp_usd': 110_000_000_000,
        'gdp_per_capita': 2037,
        'population': 54_000_000,
        'infrastructure_index': 65,
        'africa_rank': 7,
        'risk_ratings': {'global_risk': 'Moderate'}
    }
    
    nigeria = {
        'code': 'NG',
        'name': 'Nigeria',
        'region': 'West Africa',
        'gdp_usd': 440_000_000_000,
        'gdp_per_capita': 2097,
        'population': 210_000_000,
        'infrastructure_index': 55,
        'africa_rank': 1,
        'risk_ratings': {'global_risk': 'Moderately High'}
    }
    
    # Trade details
    hs_code = "010121"  # Pure-bred breeding horses
    trade_value = 100_000.0  # USD
    
    # Initialize all calculators and managers
    afcfta_calc = AfCFTADutyCalculator()
    mfn_calc = MFNDutyCalculator()
    icp_calc = ICPScoreCalculator()
    trade_analyzer = TradeAnalyzer()
    data_processor = DataProcessor()
    hs_manager = HSCodeManager()
    
    # 1. Data Validation
    print_section("1. Data Validation")
    
    hs_validation = data_processor.validate_hs_code(hs_code)
    print(f"HS Code Validation: {'✓ Valid' if hs_validation['is_valid'] else '✗ Invalid'}")
    if hs_validation['is_valid']:
        print(f"  - HS2: {hs_validation['hs2']}")
        print(f"  - HS4: {hs_validation['hs4']}")
        print(f"  - HS6: {hs_validation['hs6']}")
    
    origin_validation = data_processor.validate_country_code(kenya['code'])
    dest_validation = data_processor.validate_country_code(nigeria['code'])
    print(f"Origin Country: {'✓ Valid' if origin_validation['is_valid'] else '✗ Invalid'}")
    print(f"Destination Country: {'✓ Valid' if dest_validation['is_valid'] else '✗ Invalid'}")
    
    value_validation = data_processor.validate_trade_value(trade_value)
    print(f"Trade Value: {'✓ Valid' if value_validation['is_valid'] else '✗ Invalid'}")
    print(f"  - Amount: ${value_validation['numeric_value']:,.2f} USD")
    
    # 2. HS Code Analysis
    print_section("2. HS Code Analysis")
    
    hs_info = hs_manager.get_hs2_info(hs_code)
    if hs_info:
        print(f"HS Code: {hs_info['full_code']}")
        print(f"Sector: {hs_info['sector_name']} (HS{hs_info['hs2_code']})")
        print(f"Section: {hs_info['section']}")
    
    sector_info = mfn_calc.get_sector_info(hs_code)
    print(f"Base MFN Rate: {sector_info['base_mfn_rate']}%")
    
    # 3. MFN Tariff Calculation
    print_section("3. MFN Tariff Calculation")
    
    mfn_result = mfn_calc.calculate_duty(
        value=trade_value,
        hs_code=hs_code,
        country_code=nigeria['code']
    )
    
    print(f"Country: {nigeria['name']}")
    print(f"MFN Rate: {mfn_result['mfn_rate']}%")
    print(f"MFN Duty: ${mfn_result['mfn_amount']:,.2f} USD")
    print(f"Country Adjustment: {'Yes' if mfn_result['has_country_adjustment'] else 'No'}")
    
    # 4. AfCFTA Tariff Calculation
    print_section("4. AfCFTA Tariff Calculation")
    
    # Determine tariff category
    category = afcfta_calc.get_category_for_hs_code(hs_code, nigeria['code'])
    print(f"AfCFTA Category: {category}")
    
    # Check if destination is LDC
    # Note: In production, use CountryProfileManager.is_ldc() to determine LDC status
    # For this example, Nigeria is not a Least Developed Country
    is_ldc = False
    
    afcfta_result = afcfta_calc.calculate_duty(
        value=trade_value,
        base_rate=mfn_result['mfn_rate'],
        category=category,
        is_ldc=is_ldc
    )
    
    print(f"Base MFN Rate: {afcfta_result['base_rate']}%")
    print(f"AfCFTA Rate: {afcfta_result['afcfta_rate']}%")
    print(f"AfCFTA Duty: ${afcfta_result['afcfta_amount']:,.2f} USD")
    print(f"Implementation Year: {afcfta_result['implementation_year']}")
    print(f"Years Since Start: {afcfta_result['years_since_start']}")
    print(f"Fully Liberalized: {'Yes' if afcfta_result['is_fully_liberalized'] else 'No'}")
    
    # 5. Savings Analysis
    print_section("5. Savings Analysis")
    
    savings = afcfta_calc.estimate_savings(
        value=trade_value,
        mfn_rate=mfn_result['mfn_rate'],
        afcfta_rate=afcfta_result['afcfta_rate']
    )
    
    print(f"MFN Duty: ${savings['mfn_amount']:,.2f} USD")
    print(f"AfCFTA Duty: ${savings['afcfta_amount']:,.2f} USD")
    print(f"Savings: ${savings['savings_amount']:,.2f} USD")
    print(f"Savings %: {savings['savings_percentage']:.1f}%")
    print(f"Beneficial: {'✓ Yes' if savings['is_beneficial'] else '✗ No'}")
    
    # 6. ICP Score Calculation
    print_section("6. Investment Climate & Potential (ICP) Score")
    
    icp_result = icp_calc.calculate_score(
        origin_country=kenya,
        destination_country=nigeria
    )
    
    print(f"Origin: {kenya['name']}")
    print(f"Destination: {nigeria['name']}")
    print(f"\nICP Score: {icp_result['icp_score']:.2f}/100")
    print(f"Rating: {icp_result['rating']}")
    
    print("\nComponent Scores:")
    for component, score in icp_result['components'].items():
        print(f"  - {component.replace('_', ' ').title()}: {score:.2f}")
    
    print("\nRecommendations:")
    for i, rec in enumerate(icp_result['recommendations'], 1):
        print(f"  {i}. {rec}")
    
    # 7. Trade Analysis
    print_section("7. Bilateral Trade Analysis")
    
    trade_analysis = trade_analyzer.analyze_bilateral_trade(
        origin_country=kenya,
        destination_country=nigeria,
        hs_code=hs_code,
        value=trade_value
    )
    
    print(f"Origin: {trade_analysis['origin']['name']} ({trade_analysis['origin']['region']})")
    print(f"Destination: {trade_analysis['destination']['name']} ({trade_analysis['destination']['region']})")
    print(f"Product: HS {trade_analysis['product']['hs_code']}")
    print(f"Trade Value: ${trade_analysis['trade_value_usd']:,.2f} USD")
    
    print(f"\nTrade Intensity:")
    print(f"  - Index: {trade_analysis['trade_intensity']['intensity_index']:.6f}")
    print(f"  - Interpretation: {trade_analysis['trade_intensity']['interpretation']}")
    
    print(f"\nMarket Assessment:")
    market = trade_analysis['market_assessment']
    print(f"  - Size: {market['size_category']}")
    print(f"  - GDP: ${market['gdp_usd']:,.0f} USD")
    print(f"  - Population: {market['population']:,}")
    print(f"  - GDP per Capita: ${market['gdp_per_capita']:,.2f} USD")
    
    print(f"\nDistance Factor:")
    dist = trade_analysis['distance_factor']
    print(f"  - Same Region: {'Yes' if dist['same_region'] else 'No'}")
    print(f"  - Proximity Advantage: {'Yes' if dist['proximity_advantage'] else 'No'}")
    
    print(f"\nCompetitiveness:")
    comp = trade_analysis['competitiveness']
    print(f"  - Score: {comp['competitiveness_score']}/100")
    print(f"  - Cost Advantage: {'Yes' if comp['has_cost_advantage'] else 'No'}")
    
    # 8. Trade Creation Potential
    print_section("8. Trade Creation Potential")
    
    creation = trade_analyzer.calculate_trade_creation_potential(
        current_mfn_rate=mfn_result['mfn_rate'],
        afcfta_rate=afcfta_result['afcfta_rate'],
        elasticity=1.5
    )
    
    print(f"Tariff Reduction: {creation['tariff_reduction_pct']:.2f} percentage points")
    print(f"Estimated Trade Increase: {creation['estimated_trade_increase_pct']:.2f}%")
    print(f"Trade Elasticity: {creation['elasticity_used']}")
    print(f"Interpretation: {creation['interpretation']}")
    
    # 9. Summary
    print_section("9. Executive Summary")
    
    print(f"Trade Route: {kenya['name']} → {nigeria['name']}")
    print(f"Product: {hs_info['sector_name']} (HS {hs_code})")
    print(f"Trade Value: ${trade_value:,.2f} USD")
    print(f"\nTariff Comparison:")
    print(f"  MFN Rate: {mfn_result['mfn_rate']:.2f}% → ${mfn_result['mfn_amount']:,.2f} duty")
    print(f"  AfCFTA Rate: {afcfta_result['afcfta_rate']:.2f}% → ${afcfta_result['afcfta_amount']:,.2f} duty")
    print(f"  Savings: ${savings['savings_amount']:,.2f} ({savings['savings_percentage']:.1f}%)")
    print(f"\nMarket Potential:")
    print(f"  ICP Score: {icp_result['icp_score']:.2f}/100 ({icp_result['rating']})")
    print(f"  Market Size: {market['size_category']}")
    print(f"  Trade Creation Potential: {creation['estimated_trade_increase_pct']:.2f}% increase")
    
    print_section("Analysis Complete")
    print("\nThis analysis demonstrates the comprehensive capabilities of the")
    print("AfCFTA Trade Analysis System for evaluating trade opportunities.")


if __name__ == '__main__':
    try:
        main()
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
