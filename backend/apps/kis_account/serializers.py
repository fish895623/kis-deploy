from rest_framework import serializers
from .models import KISAccount


class KISAccountSerializer(serializers.ModelSerializer):
    """KIS 계좌 정보 시리얼라이저"""

    class Meta:
        model = KISAccount
        fields = [
            "id",
            "account_number",
            "account_id",
            "app_key",
            "sec_key",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def create(self, validated_data):
        """현재 로그인한 사용자로 계좌 생성"""
        user = self.context["request"].user
        validated_data["user"] = user
        return super().create(validated_data)


class KISAccountListSerializer(serializers.ModelSerializer):
    """KIS 계좌 목록용 시리얼라이저 (보안 정보 제외)"""

    class Meta:
        model = KISAccount
        fields = [
            "id",
            "account_number",
            "account_id",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
