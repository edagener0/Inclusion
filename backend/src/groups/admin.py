from django.contrib import admin

from .models import GroupChat, GroupMessage


@admin.register(GroupChat)
class GroupChatAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "created_at", "updated_at"]
    search_fields = ["name"]


@admin.register(GroupMessage)
class GroupMessageAdmin(admin.ModelAdmin):
    list_display = ["id", "group", "sender", "created_at"]
    search_fields = ["group__name", "sender__username", "content"]
