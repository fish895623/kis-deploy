"""
Django development settings for KIS project.
"""

from .base import *  # noqa: F401, F403

DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1']

# CORS - Allow all origins in development
CORS_ALLOW_ALL_ORIGINS = True

# Use console email backend for development
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
