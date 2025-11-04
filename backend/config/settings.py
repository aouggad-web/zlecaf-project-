"""
Settings Manager

Manages system settings and configuration.
"""

import os
import logging
from typing import Optional
from pydantic import BaseModel, Field
from functools import lru_cache

logger = logging.getLogger(__name__)


class Settings(BaseModel):
    """Application settings"""
    
    # Application settings
    app_name: str = Field(default="AfCFTA Trade Analysis System", description="Application name")
    app_version: str = Field(default="2.0.0", description="Application version")
    environment: str = Field(default="production", description="Environment (development, production, test)")
    debug: bool = Field(default=False, description="Debug mode")
    
    # API settings
    api_prefix: str = Field(default="/api", description="API URL prefix")
    cors_origins: list = Field(
        default=["*"],
        description="CORS allowed origins"
    )
    
    # Database settings
    mongo_url: str = Field(default="mongodb://localhost:27017", description="MongoDB connection URL")
    db_name: str = Field(default="zlecaf_db", description="Database name")
    
    # Calculation settings
    afcfta_start_year: int = Field(default=2021, description="AfCFTA implementation start year")
    default_trade_elasticity: float = Field(default=1.5, description="Default trade elasticity for calculations")
    
    # Rate limits
    rate_limit_per_minute: int = Field(default=60, description="API rate limit per minute")
    
    # Cache settings
    cache_ttl_seconds: int = Field(default=3600, description="Cache TTL in seconds")
    
    # Logging settings
    log_level: str = Field(default="INFO", description="Logging level")
    log_format: str = Field(
        default="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        description="Log format"
    )
    
    # External API settings
    worldbank_api_url: str = Field(
        default="https://api.worldbank.org/v2",
        description="World Bank API base URL"
    )
    oec_api_url: str = Field(
        default="https://api-v2.oec.world",
        description="OEC API base URL"
    )
    external_api_timeout: int = Field(default=30, description="External API timeout in seconds")
    
    # Feature flags
    enable_external_apis: bool = Field(default=True, description="Enable external API integrations")
    enable_caching: bool = Field(default=True, description="Enable response caching")
    enable_rate_limiting: bool = Field(default=True, description="Enable rate limiting")
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False
    
    @classmethod
    def from_env(cls) -> "Settings":
        """
        Create settings from environment variables.
        
        Returns:
            Settings instance
        """
        return cls(
            mongo_url=os.getenv("MONGO_URL", "mongodb://localhost:27017"),
            db_name=os.getenv("DB_NAME", "zlecaf_db"),
            environment=os.getenv("ENVIRONMENT", "production"),
            debug=os.getenv("DEBUG", "false").lower() == "true",
            log_level=os.getenv("LOG_LEVEL", "INFO"),
        )
    
    def validate_settings(self) -> dict:
        """
        Validate settings configuration.
        
        Returns:
            Dictionary with validation results
        """
        errors = []
        warnings = []
        
        # Validate environment
        valid_environments = ["development", "production", "test"]
        if self.environment not in valid_environments:
            errors.append(f"Invalid environment: {self.environment}")
        
        # Validate log level
        valid_log_levels = ["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]
        if self.log_level.upper() not in valid_log_levels:
            errors.append(f"Invalid log level: {self.log_level}")
        
        # Validate database URL
        if not self.mongo_url:
            errors.append("MongoDB URL is required")
        
        # Validate rate limit
        if self.rate_limit_per_minute < 1:
            warnings.append("Rate limit is very low, may affect usability")
        
        # Check debug mode in production
        if self.environment == "production" and self.debug:
            warnings.append("Debug mode is enabled in production environment")
        
        return {
            'is_valid': len(errors) == 0,
            'errors': errors,
            'warnings': warnings
        }
    
    def get_database_config(self) -> dict:
        """
        Get database configuration.
        
        Returns:
            Dictionary with database config
        """
        return {
            'url': self.mongo_url,
            'database': self.db_name
        }
    
    def get_api_config(self) -> dict:
        """
        Get API configuration.
        
        Returns:
            Dictionary with API config
        """
        return {
            'prefix': self.api_prefix,
            'cors_origins': self.cors_origins,
            'rate_limit': self.rate_limit_per_minute
        }
    
    def get_logging_config(self) -> dict:
        """
        Get logging configuration.
        
        Returns:
            Dictionary with logging config
        """
        return {
            'level': self.log_level,
            'format': self.log_format
        }


@lru_cache()
def get_settings() -> Settings:
    """
    Get settings instance (cached).
    
    Returns:
        Settings instance
    """
    return Settings.from_env()
