from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ["username", "first_name", "last_name", "is_staff"]
    search_fields = ["username"]

admin.site.register(User, CustomUserAdmin)
