from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser


class CustomUserAdmin(UserAdmin):
    model = CustomUser

    # Show in edit user page
    fieldsets = UserAdmin.fieldsets + (
        ("Academic Information", {
            "fields": ("role", "semester"),
        }),
    )

    # Show in add user page
    add_fieldsets = UserAdmin.add_fieldsets + (
        ("Academic Information", {
            "fields": ("role", "semester"),
        }),
    )

    list_display = ("username", "email", "role", "semester", "is_staff", "is_superuser")


admin.site.register(CustomUser, CustomUserAdmin)
