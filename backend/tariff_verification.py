# Vérification et correction des méthodes de calcul tarifaire
# Basé sur les standards OMC/UNCTAD

def calculate_tariff_correct_method(value, origin_country, dest_country, hs_code):
    """
    Méthode de calcul correcte selon les standards internationaux
    """
    
    # 1. VALEUR CIF (Cost, Insurance, Freight)
    # En pratique, souvent fournie directement ou estimée à +10-15% de la valeur FOB
    cif_value = value * 1.12  # Estimation CIF = FOB + 12%
    
    # 2. DROITS DE DOUANE (appliqués sur la valeur CIF)
    # Exemple pour textile (61): Algérie applique généralement 30-40%
    normal_tariff_rate = 0.30  # 30% selon exemple utilisateur
    normal_tariff_amount = cif_value * normal_tariff_rate
    
    # ZLECAf: Élimination progressive des droits
    zlecaf_tariff_rate = 0.00
    zlecaf_tariff_amount = 0.00
    
    # 3. VALEUR IMPOSABLE POUR TVA = CIF + Droits de douane
    normal_tax_base = cif_value + normal_tariff_amount
    zlecaf_tax_base = cif_value + zlecaf_tariff_amount
    
    # 4. TVA (appliquée sur valeur imposable)
    vat_rate = 0.19  # 19% Algérie
    normal_vat_amount = normal_tax_base * vat_rate
    zlecaf_vat_amount = zlecaf_tax_base * vat_rate
    
    # 5. AUTRES TAXES spécifiques
    # Taxes d'accise, frais de dossier, taxes environnementales
    other_tax_rate = 0.065  # 6.5% selon exemple utilisateur
    normal_other_taxes = cif_value * other_tax_rate
    # ZLECAf: réduction partielle des autres taxes
    zlecaf_other_taxes = cif_value * (other_tax_rate * 0.9)  # 10% de réduction
    
    # 6. TOTAUX
    normal_total = cif_value + normal_tariff_amount + normal_vat_amount + normal_other_taxes
    zlecaf_total = cif_value + zlecaf_tariff_amount + zlecaf_vat_amount + zlecaf_other_taxes
    
    # 7. ÉCONOMIES
    total_savings = normal_total - zlecaf_total
    savings_percentage = (total_savings / normal_total) * 100
    
    return {
        "original_value": value,
        "cif_value": round(cif_value, 2),
        "normal_regime": {
            "droits": round(normal_tariff_amount, 2),
            "droits_rate": f"{normal_tariff_rate*100}%",
            "tva": round(normal_vat_amount, 2),
            "tva_rate": f"{vat_rate*100}%",
            "autres": round(normal_other_taxes, 2),
            "autres_rate": f"{other_tax_rate*100}%",
            "total": round(normal_total, 2)
        },
        "zlecaf_regime": {
            "droits": round(zlecaf_tariff_amount, 2),
            "droits_rate": f"{zlecaf_tariff_rate*100}%",
            "tva": round(zlecaf_vat_amount, 2),
            "tva_rate": f"{vat_rate*100}%",
            "autres": round(zlecaf_other_taxes, 2),
            "autres_rate": f"{other_tax_rate*0.9*100:.1f}%",
            "total": round(zlecaf_total, 2)
        },
        "savings": {
            "amount": round(total_savings, 2),
            "percentage": round(savings_percentage, 2)
        }
    }

# Test avec l'exemple fourni
if __name__ == "__main__":
    result = calculate_tariff_correct_method(16120, "MA", "DZ", "610910")
    
    print("=== CALCUL TARIFAIRE CORRIGÉ ===")
    print(f"Valeur marchandise: {result['original_value']} $US")
    print(f"Valeur CIF estimée: {result['cif_value']} $US")
    print()
    print("RÉGIME NPF (Normal):")
    print(f"  Droits: {result['normal_regime']['droits']} $US ({result['normal_regime']['droits_rate']})")
    print(f"  TVA: {result['normal_regime']['tva']} $US ({result['normal_regime']['tva_rate']})")
    print(f"  Autres: {result['normal_regime']['autres']} $US ({result['normal_regime']['autres_rate']})")
    print(f"  TOTAL NPF: {result['normal_regime']['total']} $US")
    print()
    print("RÉGIME ZLECAf:")
    print(f"  Droits: {result['zlecaf_regime']['droits']} $US ({result['zlecaf_regime']['droits_rate']})")
    print(f"  TVA: {result['zlecaf_regime']['tva']} $US ({result['zlecaf_regime']['tva_rate']})")
    print(f"  Autres: {result['zlecaf_regime']['autres']} $US ({result['zlecaf_regime']['autres_rate']})")
    print(f"  TOTAL ZLECAf: {result['zlecaf_regime']['total']} $US")
    print()
    print(f"ÉCONOMIES: {result['savings']['amount']} $US ({result['savings']['percentage']}%)")