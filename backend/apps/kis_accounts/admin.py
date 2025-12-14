from django.contrib import admin

from .models import KISAccounts


@admin.register(KISAccounts)
class KISAccountsAdmin(admin.ModelAdmin):
    list_display = ("id", "account_number", "account_id")
    search_fields = ("account_number", "account_id")
    ordering = ("id",)
