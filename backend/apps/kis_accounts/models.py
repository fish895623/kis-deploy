from django.db import models


class KISAccounts(models.Model):
    id = models.BigAutoField(primary_key=True)
    account_number = models.CharField(unique=True, help_text="계좌번호")
    account_id = models.CharField(help_text="실계좌 id")
    app_key = models.CharField(max_length=36)
    sec_key = models.CharField(max_length=180)
