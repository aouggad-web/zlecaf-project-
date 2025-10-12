"""
Tests for Settings configuration
"""

import pytest
import sys
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent.parent.parent / 'backend'
sys.path.insert(0, str(backend_path))

from config.settings import Settings


class TestSettings:
    """Test suite for settings configuration"""
    
    def test_settings_initialization(self):
        """Test settings can be initialized with defaults"""
        settings = Settings()
        
        assert settings.app_name == "AfCFTA Trade Analysis System"
        assert settings.app_version == "2.0.0"
        assert settings.api_prefix == "/api"
    
    def test_settings_validation_valid(self):
        """Test validation with valid settings"""
        settings = Settings(environment="production", log_level="INFO")
        
        result = settings.validate_settings()
        assert result['is_valid'] is True
        assert len(result['errors']) == 0
    
    def test_settings_validation_invalid_environment(self):
        """Test validation with invalid environment"""
        settings = Settings(environment="invalid")
        
        result = settings.validate_settings()
        assert result['is_valid'] is False
        assert len(result['errors']) > 0
    
    def test_settings_validation_invalid_log_level(self):
        """Test validation with invalid log level"""
        settings = Settings(log_level="INVALID")
        
        result = settings.validate_settings()
        assert result['is_valid'] is False
        assert len(result['errors']) > 0
    
    def test_settings_validation_warnings(self):
        """Test validation generates warnings for risky configs"""
        settings = Settings(environment="production", debug=True)
        
        result = settings.validate_settings()
        assert len(result['warnings']) > 0
    
    def test_get_database_config(self):
        """Test database configuration retrieval"""
        settings = Settings(mongo_url="mongodb://test:27017", db_name="test_db")
        
        db_config = settings.get_database_config()
        assert db_config['url'] == "mongodb://test:27017"
        assert db_config['database'] == "test_db"
    
    def test_get_api_config(self):
        """Test API configuration retrieval"""
        settings = Settings(api_prefix="/api/v1", rate_limit_per_minute=100)
        
        api_config = settings.get_api_config()
        assert api_config['prefix'] == "/api/v1"
        assert api_config['rate_limit'] == 100
    
    def test_get_logging_config(self):
        """Test logging configuration retrieval"""
        settings = Settings(log_level="DEBUG")
        
        log_config = settings.get_logging_config()
        assert log_config['level'] == "DEBUG"
        assert 'format' in log_config


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
