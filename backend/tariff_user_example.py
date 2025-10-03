# Vérification basée sur l'exemple exact de l'utilisateur
# Valeur: 16 120 $US

def verify_user_calculation():
    """
    Vérification de l'exemple utilisateur:
    Valeur: 16 120 $US
    
    NPF:
    - Droits: 3 000 $US (30.0%)
    - TVA: 2 470 $US (19.0%) 
    - Autres: 650 $US (6.5%)
    
    ZLECAf:
    - Total: 12 475 $US
    - Droits: 0 $US (0.0%)
    - TVA: 1 900 $US (19.0%)
    - Autres: 575 $US (5.8%)
    """
    
    value = 16120
    
    # === ANALYSE DES CHIFFRES UTILISATEUR ===
    print("=== ANALYSE DE L'EXEMPLE UTILISATEUR ===")
    print(f"Valeur marchandise: {value:,} $US")
    print()
    
    # NPF (selon utilisateur)
    user_npf_droits = 3000
    user_npf_tva = 2470  
    user_npf_autres = 650
    user_npf_total = value + user_npf_droits + user_npf_tva + user_npf_autres
    
    print("RÉGIME NPF (selon utilisateur):")
    print(f"  Droits: {user_npf_droits:,} $US")
    print(f"    → Taux réel: {(user_npf_droits/value)*100:.1f}% (affiché 30.0%)")
    print(f"  TVA: {user_npf_tva:,} $US") 
    print(f"    → Base TVA apparente: {user_npf_tva/0.19:,.0f} $US")
    print(f"    → Si 19% sur (valeur+droits): {(value+user_npf_droits)*0.19:,.0f} $US")
    print(f"  Autres: {user_npf_autres:,} $US")
    print(f"    → Taux réel: {(user_npf_autres/value)*100:.2f}% (affiché 6.5%)")
    print(f"  TOTAL NPF: {user_npf_total:,} $US")
    print()
    
    # ZLECAf (selon utilisateur)  
    user_zlecaf_total = 12475
    user_zlecaf_droits = 0
    user_zlecaf_tva = 1900
    user_zlecaf_autres = 575
    user_zlecaf_value = user_zlecaf_total - user_zlecaf_tva - user_zlecaf_autres
    
    print("RÉGIME ZLECAf (selon utilisateur):")
    print(f"  Total: {user_zlecaf_total:,} $US")
    print(f"  Droits: {user_zlecaf_droits:,} $US (0.0%)")
    print(f"  TVA: {user_zlecaf_tva:,} $US")
    print(f"    → Base TVA apparente: {user_zlecaf_tva/0.19:,.0f} $US")
    print(f"  Autres: {user_zlecaf_autres:,} $US") 
    print(f"    → Taux réel: {(user_zlecaf_autres/value)*100:.2f}% (affiché 5.8%)")
    print()
    
    # Économies
    savings = user_npf_total - user_zlecaf_total
    savings_pct = (savings / user_npf_total) * 100
    
    print("ÉCONOMIES:")
    print(f"  Montant: {savings:,} $US")
    print(f"  Pourcentage: {savings_pct:.1f}%")
    print()
    
    # === PROBLÈMES IDENTIFIÉS ===
    print("=== PROBLÈMES IDENTIFIÉS ===")
    
    # 1. Incohérence dans les taux affichés vs calculés
    print(f"1. Droits NPF:")
    print(f"   - Affiché: 30.0%, Réel: {(user_npf_droits/value)*100:.1f}%")
    
    # 2. Base de calcul TVA
    expected_tva_npf = (value + user_npf_droits) * 0.19
    print(f"2. TVA NPF:")
    print(f"   - Attendue (19% sur {value+user_npf_droits:,}): {expected_tva_npf:,.0f} $US")
    print(f"   - Affichée: {user_npf_tva:,} $US")
    print(f"   - Différence: {expected_tva_npf - user_npf_tva:,.0f} $US")
    
    expected_tva_zlecaf = value * 0.19
    print(f"3. TVA ZLECAf:")
    print(f"   - Attendue (19% sur {value:,}): {expected_tva_zlecaf:,.0f} $US")
    print(f"   - Affichée: {user_zlecaf_tva:,} $US")
    print(f"   - Différence: {expected_tva_zlecaf - user_zlecaf_tva:,.0f} $US")
    
    # 3. Incohérence autres taxes
    print(f"4. Autres taxes:")
    print(f"   - NPF: {(user_npf_autres/value)*100:.2f}% vs affiché 6.5%")
    print(f"   - ZLECAf: {(user_zlecaf_autres/value)*100:.2f}% vs affiché 5.8%")
    
    return {
        'npf_total': user_npf_total,
        'zlecaf_total': user_zlecaf_total,
        'savings': savings,
        'issues_found': 4
    }

if __name__ == "__main__":
    verify_user_calculation()