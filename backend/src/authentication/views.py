from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from django.conf import settings
from django.middleware import csrf
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from drf_spectacular.utils import extend_schema

from .serializers import UserRegisterSerializer, UserLoginSerializer, UserMeSerializer
from .utils import (
    build_auth_response_payload,
    get_tokens_for_user,
    set_cookies_for_response,
)
from common.serializers import MessageResponseSerializer

User = get_user_model()


def get_refresh_token_from_request(request):
    return (
        request.COOKIES.get(settings.SIMPLE_JWT["REFRESH_COOKIE"])
        or request.data.get("refresh")
        or request.headers.get("X-Refresh-Token")
    )


@extend_schema(
    tags=["Auth"],
    summary="Register user",
    description="Create a new user account.",
)
class UserRegisterView(CreateAPIView):
    serializer_class = UserRegisterSerializer


@extend_schema(
    tags=["Auth"],
    summary="Log in",
    description="Authenticate a user and issue access and refresh cookies.",
)
class UserLoginView(APIView):
    authentication_classes = []
    permission_classes = []

    @extend_schema(
        request=UserLoginSerializer,
        responses={
            200: MessageResponseSerializer,
            401: MessageResponseSerializer,
            403: MessageResponseSerializer,
        },
    )
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = authenticate(
            username=serializer.validated_data["username"],
            password=serializer.validated_data["password"],
        )

        if user is None:
            return Response(
                {"message": "Invalid credentials!"}, status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.is_active:
            return Response(
                {"message": "This account is not active."},
                status=status.HTTP_403_FORBIDDEN,
            )

        data = get_tokens_for_user(user)
        response = Response(build_auth_response_payload(request, "Login Successfully", data))
        set_cookies_for_response(response, data)
        csrf.get_token(request)

        return response


@extend_schema(
    tags=["Auth"],
    summary="Log out",
    description="Invalidate the refresh token cookie and clear authentication cookies.",
)
class UserLogoutView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=None,
        responses={200: MessageResponseSerializer},
    )
    def post(self, request):
        refresh_token = get_refresh_token_from_request(request)

        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except TokenError:
                pass

        response = Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
        response.delete_cookie(settings.SIMPLE_JWT["AUTH_COOKIE"])
        response.delete_cookie(settings.SIMPLE_JWT["REFRESH_COOKIE"])
        return response


@extend_schema(
    tags=["Auth"],
    summary="Refresh token",
    description="Rotate the refresh token and issue a new access token through cookies.",
)
class UserTokenRefreshView(APIView):
    authentication_classes = []

    @extend_schema(
        request=None,
        responses={
            200: MessageResponseSerializer,
            401: MessageResponseSerializer,
        },
    )
    def post(self, request):
        refresh_token = get_refresh_token_from_request(request)

        if not refresh_token:
            return Response(
                {"message": "Refresh Token Required"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        try:
            old_refresh = RefreshToken(refresh_token)
            user_id = old_refresh["user_id"]
            user = User.objects.get(id=user_id)
            new_refresh = RefreshToken.for_user(user)
            old_refresh.blacklist()

            data = {
                "refresh": str(new_refresh),
                "access": str(new_refresh.access_token),
            }
        except Exception:
            return Response(
                {"message": "Invalid or expired refresh token"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        response = Response(
            build_auth_response_payload(request, "Token refreshed successfully", data)
        )
        set_cookies_for_response(response, data)
        return response


@extend_schema(
    tags=["Auth"],
    summary="Get current user",
    description="Return the authenticated user's basic profile information.",
)
class UserMeView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(responses={200: UserMeSerializer})
    def get(self, request):
        serializer = UserMeSerializer(request.user, context={"request": request})
        return Response(serializer.data)
