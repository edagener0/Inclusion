from django.urls import re_path

from .consumers import GroupConsumer, GroupInboxConsumer


websocket_urlpatterns = [
    re_path(r"^ws/groups/inbox/?$", GroupInboxConsumer.as_asgi()),
    re_path(r"^ws/groups/(?P<group_id>\d+)/?$", GroupConsumer.as_asgi()),
]
