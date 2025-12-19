from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema, extend_schema_view

from .models import KISAccount
from .serializers import KISAccountSerializer, KISAccountListSerializer


@extend_schema_view(
    list=extend_schema(
        summary="KIS 계좌 목록 조회",
        description="현재 로그인한 사용자의 KIS 계좌 목록을 조회합니다.",
    ),
    retrieve=extend_schema(
        summary="KIS 계좌 상세 조회",
        description="특정 KIS 계좌의 상세 정보를 조회합니다.",
    ),
    create=extend_schema(
        summary="KIS 계좌 생성",
        description="새로운 KIS 계좌를 등록합니다.",
    ),
    update=extend_schema(
        summary="KIS 계좌 전체 수정",
        description="KIS 계좌 정보를 전체 수정합니다.",
    ),
    partial_update=extend_schema(
        summary="KIS 계좌 부분 수정",
        description="KIS 계좌 정보를 부분 수정합니다.",
    ),
    destroy=extend_schema(
        summary="KIS 계좌 삭제",
        description="KIS 계좌를 삭제합니다.",
    ),
)
class KISAccountViewSet(viewsets.ModelViewSet):
    """
    KIS 계좌 관리 ViewSet

    한국투자증권 계좌 정보를 관리하는 API 엔드포인트입니다.
    """

    serializer_class = KISAccountSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """현재 로그인한 사용자의 계좌만 반환"""
        return KISAccount.objects.filter(user=self.request.user).order_by(
            "-created_at"
        )

    def get_serializer_class(self):
        """액션에 따라 다른 시리얼라이저 사용"""
        if self.action == "list":
            return KISAccountListSerializer
        return KISAccountSerializer

    def perform_create(self, serializer):
        """계좌 생성 시 현재 사용자 자동 설정"""
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        """계좌 수정 시 사용자 변경 불가"""
        serializer.save(user=self.request.user)

    @extend_schema(
        summary="계좌 존재 여부 확인",
        description="사용자가 등록한 KIS 계좌가 있는지 확인합니다.",
    )
    @action(detail=False, methods=["get"])
    def check_exists(self, request):
        """사용자가 등록한 계좌가 있는지 확인"""
        exists = self.get_queryset().exists()
        count = self.get_queryset().count()
        return Response({"exists": exists, "count": count})
