from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import KISAccountViewSet

router = DefaultRouter()
router.register(r"accounts", KISAccountViewSet, basename="kis-account")

urlpatterns = [
    path("", include(router.urls)),
]
