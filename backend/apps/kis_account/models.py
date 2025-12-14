from django.conf import settings
from django.db import models


class KISAccount(models.Model):
    """Korea Investment & Securities (KIS) account credentials model."""

    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="kis_accounts",
    )
    account_number = models.CharField(
        max_length=20,
        unique=True,
        help_text="계좌번호",
    )
    account_id = models.CharField(
        max_length=50,
        help_text="실계좌 id",
    )
    app_key = models.CharField(max_length=36)
    sec_key = models.CharField(max_length=180)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "KIS Account"
        verbose_name_plural = "KIS Accounts"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.account_number} ({self.user})"
