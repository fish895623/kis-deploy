from django.contrib import admin

from .models import KISAccount


@admin.register(KISAccount)
class KISAccountAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "account_number", "account_id", "created_at")
    list_filter = ("created_at",)
    search_fields = ("account_number", "account_id", "user__username")
    ordering = ("-created_at",)
    readonly_fields = ("created_at", "updated_at")
