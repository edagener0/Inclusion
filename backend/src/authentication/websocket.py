from http.cookies import SimpleCookie

from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from django.conf import settings
from django.contrib.auth.models import AnonymousUser
from django.db import close_old_connections
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError


def _get_cookie_value(scope, cookie_name):
    headers = dict(scope.get("headers", []))
    raw_cookie = headers.get(b"cookie")

    if not raw_cookie:
        return None

    cookie = SimpleCookie()
    cookie.load(raw_cookie.decode("utf-8"))
    morsel = cookie.get(cookie_name)
    return morsel.value if morsel else None


@database_sync_to_async
def _get_user_from_token(raw_token):
    if raw_token is None:
        return AnonymousUser()

    jwt_authentication = JWTAuthentication()

    try:
        validated_token = jwt_authentication.get_validated_token(raw_token)
        return jwt_authentication.get_user(validated_token)
    except (AuthenticationFailed, InvalidToken, TokenError):
        return AnonymousUser()


class JWTWebSocketAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        close_old_connections()
        scope["user"] = await _get_user_from_token(
            _get_cookie_value(scope, settings.SIMPLE_JWT["AUTH_COOKIE"])
        )
        return await super().__call__(scope, receive, send)
