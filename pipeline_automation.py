#!/usr/bin/env python3
"""
Automated Data Pipeline for ZLECAf
Lyra Plus Feature: Automated data processing and validation
"""
import json
import os
import sys
from datetime import datetime
from pathlib import Path
import subprocess

class ZLECAfDataPipeline:
    """Main pipeline orchestrator for ZLECAf data processing"""
    
    def __init__(self):
        self.timestamp = datetime.now().isoformat()
        self.results = {
            'started_at': self.timestamp,
            'steps': [],
            'success': True,
            'errors': []
        }
    
    def log_step(self, step_name, status, message=''):
        """Log a pipeline step"""
        step = {
            'name': step_name,
            'status': status,
            'message': message,
            'timestamp': datetime.now().isoformat()
        }
        self.results['steps'].append(step)
        
        icon = '✅' if status == 'success' else '❌' if status == 'error' else '⏳'
        print(f"{icon} {step_name}: {message}")
    
    def run_script(self, script_name, description):
        """Run a Python script and capture results"""
        self.log_step(script_name, 'running', f'Starting {description}')
        
        try:
            result = subprocess.run(
                [sys.executable, script_name],
                capture_output=True,
                text=True,
                timeout=300
            )
            
            if result.returncode == 0:
                self.log_step(script_name, 'success', f'{description} completed')
                return True
            else:
                error_msg = result.stderr[:200] if result.stderr else 'Unknown error'
                self.log_step(script_name, 'error', f'Failed: {error_msg}')
                self.results['errors'].append({
                    'script': script_name,
                    'error': error_msg
                })
                return False
        except subprocess.TimeoutExpired:
            self.log_step(script_name, 'error', 'Script timeout')
            self.results['errors'].append({
                'script': script_name,
                'error': 'Timeout after 5 minutes'
            })
            return False
        except Exception as e:
            self.log_step(script_name, 'error', str(e))
            self.results['errors'].append({
                'script': script_name,
                'error': str(e)
            })
            return False
    
    def validate_data_files(self):
        """Validate required data files exist"""
        self.log_step('file_validation', 'running', 'Checking data files')
        
        required_files = [
            'zlecaf_corrections_2024.json',
            'validation_master.xlsx',
            'backend/server.py',
            'backend/country_data.py'
        ]
        
        missing_files = []
        for file_path in required_files:
            if not Path(file_path).exists():
                missing_files.append(file_path)
        
        if missing_files:
            self.log_step(
                'file_validation', 
                'error', 
                f'Missing files: {", ".join(missing_files)}'
            )
            return False
        
        self.log_step('file_validation', 'success', 'All required files present')
        return True
    
    def run_pipeline(self):
        """Execute the complete data pipeline"""
        print("=" * 70)
        print("🚀 ZLECAf Data Pipeline - Lyra Plus Automation")
        print("=" * 70)
        print(f"Started at: {self.timestamp}\n")
        
        # Step 1: Validate files
        if not self.validate_data_files():
            self.results['success'] = False
            return self.finalize()
        
        # Step 2: Apply corrections
        if not self.run_script('apply_corrections.py', 'Tariff corrections'):
            self.results['success'] = False
            # Continue even if corrections fail
        
        # Step 3: Integrate validated data
        if Path('integrate_validated_data.py').exists():
            if not self.run_script('integrate_validated_data.py', 'Data integration'):
                self.results['success'] = False
        
        # Step 4: Verify data quality
        if Path('verify_data_quality.py').exists():
            self.run_script('verify_data_quality.py', 'Quality verification')
        
        # Step 5: Run detailed verification
        if Path('detailed_verification.py').exists():
            self.run_script('detailed_verification.py', 'Detailed verification')
        
        return self.finalize()
    
    def finalize(self):
        """Finalize pipeline execution"""
        self.results['completed_at'] = datetime.now().isoformat()
        
        print("\n" + "=" * 70)
        print("📊 Pipeline Execution Summary")
        print("=" * 70)
        
        success_count = sum(1 for s in self.results['steps'] if s['status'] == 'success')
        error_count = sum(1 for s in self.results['steps'] if s['status'] == 'error')
        
        print(f"Total steps: {len(self.results['steps'])}")
        print(f"✅ Successful: {success_count}")
        print(f"❌ Errors: {error_count}")
        
        if self.results['errors']:
            print("\n⚠️  Errors encountered:")
            for error in self.results['errors']:
                print(f"   - {error['script']}: {error['error']}")
        
        # Save results
        results_file = f'pipeline_results_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json'
        with open(results_file, 'w', encoding='utf-8') as f:
            json.dump(self.results, f, indent=2, ensure_ascii=False)
        
        print(f"\n📄 Results saved to: {results_file}")
        print("=" * 70)
        
        return self.results['success']

def main():
    """Main entry point"""
    pipeline = ZLECAfDataPipeline()
    success = pipeline.run_pipeline()
    sys.exit(0 if success else 1)

if __name__ == '__main__':
    main()
