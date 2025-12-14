"""
User URL configuration.
"""

from django.urls import path

from .views import ChangePasswordView, ProfileView, RegisterView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='user_register'),
    path('profile/', ProfileView.as_view(), name='user_profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
]
