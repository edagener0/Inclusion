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
from drf_spectacular.utils import extend_schema, OpenApiResponse

from .serializers import UserRegisterSerializer, UserLoginSerializer, UserMeSerializer
from .utils import get_tokens_for_user, set_cookies_for_response

@extend_schema(
    tags=["Auth"],
    description="Register a user"
)
class UserRegisterView(CreateAPIView):
    serializer_class = UserRegisterSerializer

@extend_schema(
    tags=["Auth"],
    description="Login a user."
)
class UserLoginView(APIView):
    authentication_classes = [] 
    permission_classes = []

    @extend_schema(
        request=UserLoginSerializer,
        responses={
            200: OpenApiResponse(description="Login Successful"),
            401: OpenApiResponse(description="Invalid credentials"),
            403: OpenApiResponse(description="Account inactive"),
        }
    )
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = authenticate(
            username=serializer.validated_data["username"],
            password=serializer.validated_data["password"]
        )

        if user is None:
            return Response({"message": "Invalid credentials!"}, status=status.HTTP_401_UNAUTHORIZED)
        
        if not user.is_active:
            return Response({"message": "This account is not active."}, status=status.HTTP_403_FORBIDDEN)

        data = get_tokens_for_user(user)
        response = Response({"message": "Login Successfully"})
        set_cookies_for_response(response, data)
        csrf.get_token(request)
        
        return response

@extend_schema(
    tags=["Auth"],
    description="Logout a user."
)
class UserLogoutView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=None, 
        responses={200: OpenApiResponse(description="Logout successful")}
    )
    def post(self, request):
        refresh_token = request.COOKIES.get(settings.SIMPLE_JWT["REFRESH_COOKIE"])
        
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
    description="Refreshes a user's authentication token."
)
class UserTokenRefreshView(APIView):
    authentication_classes = [] 
    
    @extend_schema(
        request=None, 
        responses={
            200: OpenApiResponse(description="Token refreshed"),
            401: OpenApiResponse(description="Refresh token required/invalid")
        }
    )
    def post(self, request):
        refresh_token = request.COOKIES.get(settings.SIMPLE_JWT["REFRESH_COOKIE"])

        if not refresh_token:
            return Response({"message": "Refresh Token Required"}, status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            refresh = RefreshToken(refresh_token)
            data = {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }
        except TokenError:
            return Response({"message": "Invalid or expired refresh token"}, status=status.HTTP_401_UNAUTHORIZED)
        
        response = Response({"message": "Token refreshed successfully"})
        set_cookies_for_response(response, data)
        return response

@extend_schema(
    tags=["Auth"],
    description="Get current user info."
)
class UserMeView(APIView):
    permission_classes = [IsAuthenticated]
    
    @extend_schema(responses={200: UserMeSerializer})
    def get(self, request):
        serializer = UserMeSerializer(request.user, context={"request": request})
        return Response(serializer.data)