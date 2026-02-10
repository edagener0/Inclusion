from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }

def set_cookies_for_response(response, data):
    response.set_cookie(
        key = settings.SIMPLE_JWT["AUTH_COOKIE"],
        value = data["access"],
        expires = settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"],
        secure = settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"],
        httponly = settings.SIMPLE_JWT["AUTH_COOKIE_HTTP_ONLY"],
        samesite = settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"]
    )

    response.set_cookie(
        key = settings.SIMPLE_JWT["REFRESH_COOKIE"],
        value = data["refresh"],
        expires = settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"],
        secure = settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"],
        httponly = settings.SIMPLE_JWT["AUTH_COOKIE_HTTP_ONLY"],
        samesite = settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],
    )