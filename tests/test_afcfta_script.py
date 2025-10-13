#!/usr/bin/env python3
"""
Test pour afcfta_2025_datasets.sh
Vérifie que le script shell fonctionne correctement
"""

import sys
import subprocess
import tempfile
import shutil
from pathlib import Path


def run_command(cmd, description, cwd=None):
    """Exécute une commande et retourne le résultat"""
    print(f"\n{'='*60}")
    print(f"🔄 {description}")
    print(f"{'='*60}")
    
    if cwd is None:
        cwd = Path(__file__).parent.parent
    
    result = subprocess.run(
        cmd, 
        shell=True, 
        capture_output=True, 
        text=True,
        cwd=cwd
    )
    
    if result.returncode != 0:
        print(f"❌ Échec: {description}")
        print(f"Erreur: {result.stderr}")
        return False, result
    else:
        print(f"✅ Succès: {description}")
        if result.stdout:
            # Print first 500 chars to avoid too much output
            output = result.stdout[:500] + "..." if len(result.stdout) > 500 else result.stdout
            print(output)
        return True, result


def test_script_help():
    """Test 1: Le script affiche l'aide correctement"""
    print("\n" + "="*60)
    print("📋 TEST 1: Script help option")
    print("="*60)
    
    success, result = run_command(
        "./afcfta_2025_datasets.sh --help",
        "Affichage de l'aide"
    )
    
    if not success:
        return False
    
    # Vérifier que l'aide contient les mots clés attendus
    help_text = result.stdout
    keywords = ["AfCFTA", "Usage", "Options", "--demo", "--production", "--output"]
    
    for keyword in keywords:
        if keyword not in help_text:
            print(f"❌ Mot-clé manquant dans l'aide: {keyword}")
            return False
    
    print(f"✅ Toutes les sections d'aide sont présentes")
    return True


def test_script_demo_mode():
    """Test 2: Le script génère les données en mode démo"""
    print("\n" + "="*60)
    print("📋 TEST 2: Demo mode data generation")
    print("="*60)
    
    # Créer un répertoire temporaire pour les tests
    with tempfile.TemporaryDirectory() as tmpdir:
        output_dir = Path(tmpdir) / "test_output"
        
        success, result = run_command(
            f"./afcfta_2025_datasets.sh --demo --output {output_dir}",
            "Génération en mode démo avec répertoire temporaire"
        )
        
        if not success:
            return False
        
        # Vérifier que les fichiers attendus sont créés
        expected_files = [
            "zlecaf_tariff_lines_by_country.json",
            "zlecaf_rules_of_origin.json",
            "zlecaf_dismantling_schedule.csv",
            "zlecaf_tariff_origin_phase.json",
            # Either xlsx or csv version
        ]
        
        comparison_file = None
        if (output_dir / "zlecaf_africa_vs_world_tariffs.xlsx").exists():
            comparison_file = "zlecaf_africa_vs_world_tariffs.xlsx"
        elif (output_dir / "zlecaf_africa_vs_world_tariffs.csv").exists():
            comparison_file = "zlecaf_africa_vs_world_tariffs.csv"
        
        if comparison_file:
            expected_files.append(comparison_file)
        
        all_files_present = True
        for filename in expected_files:
            filepath = output_dir / filename
            if filepath.exists():
                size = filepath.stat().st_size
                print(f"   ✓ {filename} ({size} bytes)")
            else:
                print(f"   ✗ {filename} manquant!")
                all_files_present = False
        
        if not all_files_present:
            print("❌ Certains fichiers sont manquants")
            return False
        
        print("✅ Tous les fichiers attendus ont été générés")
        return True


def test_script_default_output():
    """Test 3: Le script utilise le répertoire par défaut"""
    print("\n" + "="*60)
    print("📋 TEST 3: Default output directory")
    print("="*60)
    
    success, result = run_command(
        "./afcfta_2025_datasets.sh --demo",
        "Génération avec répertoire par défaut"
    )
    
    if not success:
        return False
    
    # Vérifier que les fichiers sont dans frontend/public/data
    default_output = Path(__file__).parent.parent / "frontend" / "public" / "data"
    
    if not default_output.exists():
        print(f"❌ Le répertoire par défaut n'existe pas: {default_output}")
        return False
    
    # Vérifier au moins un fichier
    test_file = default_output / "zlecaf_tariff_lines_by_country.json"
    if not test_file.exists():
        print(f"❌ Fichier test non trouvé: {test_file}")
        return False
    
    print(f"✅ Les fichiers ont été générés dans le répertoire par défaut")
    return True


def test_script_invalid_option():
    """Test 4: Le script gère les options invalides"""
    print("\n" + "="*60)
    print("📋 TEST 4: Invalid option handling")
    print("="*60)
    
    result = subprocess.run(
        "./afcfta_2025_datasets.sh --invalid-option",
        shell=True,
        capture_output=True,
        text=True,
        cwd=Path(__file__).parent.parent
    )
    
    if result.returncode == 0:
        print("❌ Le script aurait dû échouer avec une option invalide")
        return False
    
    if "Unknown option" in result.stdout or "Unknown option" in result.stderr:
        print("✅ Le script détecte correctement les options invalides")
        return True
    
    print("❌ Message d'erreur attendu non trouvé")
    return False


def main():
    """Exécute tous les tests"""
    print("\n" + "="*60)
    print("🚀 TESTS AFCFTA_2025_DATASETS.SH")
    print("="*60)
    
    tests = [
        ("Script Help", test_script_help),
        ("Demo Mode Generation", test_script_demo_mode),
        ("Default Output Directory", test_script_default_output),
        ("Invalid Option Handling", test_script_invalid_option),
    ]
    
    results = []
    for name, test_func in tests:
        try:
            success = test_func()
            results.append((name, success))
        except Exception as e:
            print(f"❌ Exception dans le test {name}: {e}")
            results.append((name, False))
    
    # Résumé
    print("\n" + "="*60)
    print("📊 RÉSUMÉ DES TESTS")
    print("="*60)
    
    passed = sum(1 for _, success in results if success)
    total = len(results)
    
    for name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {name}")
    
    print("\n" + "="*60)
    print(f"Résultat: {passed}/{total} tests réussis")
    print("="*60)
    
    if passed == total:
        print("\n🎉 Tous les tests sont passés!")
        return 0
    else:
        print(f"\n⚠️  {total - passed} test(s) ont échoué")
        return 1


if __name__ == "__main__":
    sys.exit(main())
