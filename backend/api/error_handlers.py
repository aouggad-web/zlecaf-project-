"""
Error Handlers

Provides comprehensive error handling for the API.
"""

import logging
from typing import Any, Dict
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import ValidationError

logger = logging.getLogger(__name__)


def setup_error_handlers(app: FastAPI) -> None:
    """
    Setup error handlers for the FastAPI application.
    
    Args:
        app: The FastAPI application instance
    """
    
    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        """Handle validation errors"""
        logger.warning(f"Validation error on {request.url}: {exc}")
        
        errors = []
        for error in exc.errors():
            errors.append({
                'field': '.'.join(str(loc) for loc in error['loc']),
                'message': error['msg'],
                'type': error['type']
            })
        
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                'error': 'Validation Error',
                'message': 'Request validation failed',
                'details': errors,
                'path': str(request.url)
            }
        )
    
    @app.exception_handler(ValueError)
    async def value_error_handler(request: Request, exc: ValueError):
        """Handle value errors"""
        logger.warning(f"Value error on {request.url}: {exc}")
        
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                'error': 'Bad Request',
                'message': str(exc),
                'path': str(request.url)
            }
        )
    
    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception):
        """Handle general exceptions"""
        logger.error(f"Unhandled exception on {request.url}: {exc}", exc_info=True)
        
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                'error': 'Internal Server Error',
                'message': 'An unexpected error occurred',
                'path': str(request.url)
            }
        )


class APIException(Exception):
    """Base exception for API errors"""
    
    def __init__(
        self,
        message: str,
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        details: Dict[str, Any] = None
    ):
        self.message = message
        self.status_code = status_code
        self.details = details or {}
        super().__init__(self.message)


class CountryNotFoundException(APIException):
    """Exception for country not found errors"""
    
    def __init__(self, country_code: str):
        super().__init__(
            message=f"Country '{country_code}' not found or not an AfCFTA member",
            status_code=status.HTTP_404_NOT_FOUND,
            details={'country_code': country_code}
        )


class InvalidHSCodeException(APIException):
    """Exception for invalid HS code errors"""
    
    def __init__(self, hs_code: str):
        super().__init__(
            message=f"Invalid HS code: '{hs_code}'",
            status_code=status.HTTP_400_BAD_REQUEST,
            details={'hs_code': hs_code}
        )


class CalculationException(APIException):
    """Exception for calculation errors"""
    
    def __init__(self, message: str, details: Dict[str, Any] = None):
        super().__init__(
            message=message,
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            details=details
        )
