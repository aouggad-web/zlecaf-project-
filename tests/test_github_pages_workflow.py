#!/usr/bin/env python3
"""
Test for GitHub Pages workflow configuration
Verifies that the workflow has proper error handling and documentation
"""

import sys
from pathlib import Path
import yaml

# Constants
SEPARATOR_WIDTH = 70
MINIMUM_DOC_SIZE = 1000  # Minimum expected size for documentation in bytes
REQUIRED_ERROR_PHRASES = [
    'Get Pages site failed',
    'repository Settings',
    'GitHub Actions'
]


def test_workflow_has_verification_step():
    """Test that the workflow includes the Pages verification step"""
    print("\n" + "="*SEPARATOR_WIDTH)
    print("📋 TEST: GitHub Pages Workflow Verification Step")
    print("="*SEPARATOR_WIDTH)
    
    workflow_file = Path(__file__).parent.parent / '.github' / 'workflows' / 'jekyll-gh-pages.yml'
    
    if not workflow_file.exists():
        print(f"   ❌ Workflow file not found: {workflow_file}")
        return False
    
    try:
        with open(workflow_file, 'r') as f:
            workflow = yaml.safe_load(f)
        
        print("   ✅ Workflow YAML is valid")
        
        # Check if the build job exists
        if 'jobs' not in workflow or 'build' not in workflow['jobs']:
            print("   ❌ Build job not found in workflow")
            return False
        
        build_job = workflow['jobs']['build']
        steps = build_job.get('steps', [])
        
        # Check for the verification step
        verification_step_found = False
        for step in steps:
            if 'name' in step and 'Verify GitHub Pages Setup' in step['name']:
                verification_step_found = True
                print(f"   ✅ Found verification step: {step['name']}")
                
                # Check if it has the run command with helpful message
                if 'run' in step:
                    run_content = step['run']
                    
                    missing_phrases = []
                    for phrase in REQUIRED_ERROR_PHRASES:
                        if phrase not in run_content:
                            missing_phrases.append(phrase)
                    
                    if missing_phrases:
                        print(f"   ⚠️  Missing phrases in error message: {missing_phrases}")
                    else:
                        print("   ✅ Verification step has comprehensive error message")
                break
        
        if not verification_step_found:
            print("   ❌ Verification step not found in workflow")
            return False
        
        return True
        
    except yaml.YAMLError as e:
        print(f"   ❌ YAML parsing error: {e}")
        return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False


def test_documentation_exists():
    """Test that GitHub Pages setup documentation exists"""
    print("\n" + "="*SEPARATOR_WIDTH)
    print("📋 TEST: GitHub Pages Documentation")
    print("="*SEPARATOR_WIDTH)
    
    doc_file = Path(__file__).parent.parent / 'docs' / 'GITHUB_PAGES_SETUP.md'
    
    if not doc_file.exists():
        print(f"   ❌ Documentation file not found: {doc_file}")
        return False
    
    print(f"   ✅ Documentation file exists: {doc_file}")
    
    # Check if documentation has key sections
    with open(doc_file, 'r') as f:
        content = f.read()
    
    required_sections = [
        'The Issue',
        'Solution',
        'Step 1',
        'Step 2',
        'Troubleshooting',
        'Get Pages site failed'
    ]
    
    missing_sections = []
    for section in required_sections:
        if section not in content:
            missing_sections.append(section)
    
    if missing_sections:
        print(f"   ⚠️  Missing sections: {missing_sections}")
    else:
        print("   ✅ Documentation has all required sections")
    
    # Check file size (should be substantial)
    file_size = doc_file.stat().st_size
    if file_size < MINIMUM_DOC_SIZE:
        print(f"   ⚠️  Documentation seems too short: {file_size} bytes")
    else:
        print(f"   ✅ Documentation is comprehensive: {file_size} bytes")
    
    return True


def test_readme_links_to_documentation():
    """Test that README links to the GitHub Pages documentation"""
    print("\n" + "="*SEPARATOR_WIDTH)
    print("📋 TEST: README Links to Documentation")
    print("="*SEPARATOR_WIDTH)
    
    readme_file = Path(__file__).parent.parent / 'README.md'
    
    if not readme_file.exists():
        print(f"   ❌ README file not found: {readme_file}")
        return False
    
    with open(readme_file, 'r') as f:
        content = f.read()
    
    # Check for links to the documentation
    if 'GITHUB_PAGES_SETUP.md' in content:
        print("   ✅ README links to GitHub Pages setup documentation")
        
        # Count number of references
        count = content.count('GITHUB_PAGES_SETUP.md')
        print(f"   ℹ️  Found {count} reference(s) to the documentation")
        return True
    else:
        print("   ❌ README does not link to GitHub Pages setup documentation")
        return False


def test_workflow_permissions():
    """Test that the workflow has correct permissions"""
    print("\n" + "="*SEPARATOR_WIDTH)
    print("📋 TEST: Workflow Permissions")
    print("="*SEPARATOR_WIDTH)
    
    workflow_file = Path(__file__).parent.parent / '.github' / 'workflows' / 'jekyll-gh-pages.yml'
    
    try:
        with open(workflow_file, 'r') as f:
            workflow = yaml.safe_load(f)
        
        if 'permissions' not in workflow:
            print("   ❌ No permissions defined in workflow")
            return False
        
        permissions = workflow['permissions']
        required_permissions = {
            'contents': 'read',
            'pages': 'write',
            'id-token': 'write'
        }
        
        all_correct = True
        for perm, value in required_permissions.items():
            if perm not in permissions:
                print(f"   ❌ Missing permission: {perm}")
                all_correct = False
            elif permissions[perm] != value:
                print(f"   ⚠️  Permission {perm} should be '{value}', got '{permissions[perm]}'")
            else:
                print(f"   ✅ Permission {perm}: {value}")
        
        return all_correct
        
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False


def main():
    """Main test function"""
    print("\n" + "="*SEPARATOR_WIDTH)
    print("🧪 GITHUB PAGES WORKFLOW TESTS")
    print("="*SEPARATOR_WIDTH)
    
    tests = [
        ("Workflow Verification Step", test_workflow_has_verification_step),
        ("Documentation Exists", test_documentation_exists),
        ("README Links", test_readme_links_to_documentation),
        ("Workflow Permissions", test_workflow_permissions),
    ]
    
    results = []
    for name, test_func in tests:
        try:
            success = test_func()
            results.append((name, success))
        except Exception as e:
            print(f"\n❌ Error during test '{name}': {e}")
            results.append((name, False))
    
    # Summary
    print("\n" + "="*SEPARATOR_WIDTH)
    print("📊 TEST SUMMARY")
    print("="*SEPARATOR_WIDTH)
    
    passed = sum(1 for _, success in results if success)
    total = len(results)
    
    for name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"   {status}: {name}")
    
    print("\n" + "="*SEPARATOR_WIDTH)
    print(f"Result: {passed}/{total} tests passed")
    print("="*SEPARATOR_WIDTH)
    
    return 0 if passed == total else 1


if __name__ == "__main__":
    sys.exit(main())
