"""
ASGI config for inclusion project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""

import os

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import OriginValidator
from django.core.asgi import get_asgi_application
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'inclusion.settings')

django_asgi_app = get_asgi_application()

from authentication.websocket import JWTWebSocketAuthMiddleware
from dms.routing import websocket_urlpatterns

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": OriginValidator(
        JWTWebSocketAuthMiddleware(
            URLRouter(websocket_urlpatterns)
        ),
        settings.WEBSOCKET_ALLOWED_ORIGINS,
    ),
})
