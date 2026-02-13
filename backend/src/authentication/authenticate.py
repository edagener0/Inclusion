from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.conf import settings
from django.middleware.csrf import get_token
from drf_spectacular.extensions import OpenApiAuthenticationExtension 

class CustomAuthentication(JWTAuthentication):
    def authenticate(self, request):
        header = self.get_header(request)
        
        if header is None:
            raw_token = request.COOKIES.get(settings.SIMPLE_JWT["AUTH_COOKIE"])
        else:
            raw_token = self.get_raw_token(header)

        if raw_token is None:
            return None

        try:
            validated_token = self.get_validated_token(raw_token)
        except (InvalidToken, TokenError):
            return None

        try:
            get_token(request)
        except Exception:
            return None

        return self.get_user(validated_token), validated_token

class CustomAuthenticationExtension(OpenApiAuthenticationExtension):
    target_class = 'authentication.authenticate.CustomAuthentication'
    name = 'CustomAuthentication'

    def get_security_definition(self, auto_schema):
        return {
            'type': 'http',
            'scheme': 'bearer',
            'bearerFormat': 'JWT',
        }