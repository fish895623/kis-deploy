"""
Tests for the users app.
"""

import pytest
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APIClient


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user(db):
    return User.objects.create_user(username="testuser", email="test@example.com", password="testpass123")


@pytest.mark.django_db
class TestRegisterView:
    def test_register_success(self, api_client):
        data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "securepass123",
            "password2": "securepass123",
        }
        response = api_client.post("/api/users/register/", data)
        assert response.status_code == status.HTTP_201_CREATED
        assert User.objects.filter(username="newuser").exists()

    def test_register_password_mismatch(self, api_client):
        data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "securepass123",
            "password2": "differentpass",
        }
        response = api_client.post("/api/users/register/", data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestProfileView:
    def test_profile_unauthenticated(self, api_client):
        response = api_client.get("/api/users/profile/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_profile_authenticated(self, api_client, user):
        api_client.force_authenticate(user=user)
        response = api_client.get("/api/users/profile/")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["username"] == "testuser"
        assert response.data["email"] == "test@example.com"


@pytest.mark.django_db
class TestChangePasswordView:
    def test_change_password_success(self, api_client, user):
        api_client.force_authenticate(user=user)
        data = {
            "old_password": "testpass123",
            "new_password": "newsecurepass123",
        }
        response = api_client.post("/api/users/change-password/", data)
        assert response.status_code == status.HTTP_200_OK
        user.refresh_from_db()
        assert user.check_password("newsecurepass123")

    def test_change_password_wrong_old_password(self, api_client, user):
        api_client.force_authenticate(user=user)
        data = {
            "old_password": "wrongpassword",
            "new_password": "newsecurepass123",
        }
        response = api_client.post("/api/users/change-password/", data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
