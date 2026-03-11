from django.urls import re_path

from .consumers import DMConsumer, DMInboxConsumer


websocket_urlpatterns = [
    re_path(r"^ws/dms/inbox/?$", DMInboxConsumer.as_asgi()),
    re_path(r"^ws/dms/(?P<user_id>\d+)/?$", DMConsumer.as_asgi()),
]
