from rest_framework.generics import CreateAPIView
from .serializers import UserRegisterSerializer, UserLoginSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.conf import settings
from rest_framework import status
from django.middleware import csrf
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.exceptions import TokenError
from .utils import (
    get_tokens_for_user,
    set_cookies_for_response,
)
from .serializers import UserMeSerializer
from drf_spectacular.utils import (
    extend_schema, 
    OpenApiResponse,
)

@extend_schema(
    description="Registers a user."
)
class UserRegisterView(CreateAPIView):
    serializer_class = UserRegisterSerializer

class UserLoginView(APIView):
    @extend_schema(
        request = UserLoginSerializer,
        description="Logs in a user.",
        responses={
            400: OpenApiResponse(description="Validators failed for username or password"),
            200: OpenApiResponse(description="Successfully authenticated."),
            404: OpenApiResponse(description="User not found.")
        },
        methods=["POST"],
    )
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        
        serializer.is_valid(raise_exception=True)

        username = serializer.validated_data["username"]
        password = serializer.validated_data["password"]
        
        response = Response()
        user = authenticate(username=username, password=password)

        if user is None:
            return Response(
                {"message": "Invalid username or password!"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        if user.is_active:
            data = get_tokens_for_user(user)
            

            set_cookies_for_response(response, data)
            
            csrf.get_token(request)
            
            response.data = {
                "message": "Login Successfully",
            }
            return response
        else:
            return Response(
                {"message": "This account is not active."},
                status = status.HTTP_404_NOT_FOUND,
            )
        
class UserLogoutView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        description="Logs out a user.",
        responses={
            400: OpenApiResponse(description="Refresh token invalid or not present."),
            200: OpenApiResponse(description="Logout Successful."),
        },
        methods=["POST"]  
    )
    def post(self, request):
        refresh_token = request.COOKIES.get(
            settings.SIMPLE_JWT["REFRESH_COOKIE"]
        )
        
        if not refresh_token:
            return Response(
                {"message": "Refresh token required"},
                status = status.HTTP_400_BAD_REQUEST
            )
        
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except TokenError:
            return Response(
                {"message": "Invalid or expired refresh token"},
                status = status.HTTP_400_BAD_REQUEST
            )
        
        response = Response(
            {"message": "Logout successful"},
            status = status.HTTP_205_RESET_CONTENT
        )

        response.delete_cookie(settings.SIMPLE_JWT["AUTH_COOKIE"])
        response.delete_cookie(settings.SIMPLE_JWT["REFRESH_COOKIE"])
        
        return response
    
class UserTokenRefreshView(APIView):
    @extend_schema(
        description="Refreshes the authentication of the user.",
        responses={
            400: OpenApiResponse(description="Refresh token invalid or not present."),
            200: OpenApiResponse(description="Token generated successfully!"),
        },
        methods=["POST"],
    )
    def post(self, request):
        refresh_token = request.COOKIES.get(
            settings.SIMPLE_JWT["REFRESH_COOKIE"]
        )

        if not refresh_token:
            return Response(
                {"message": "Refresh Token Required"},
                status = status.HTTP_400_BAD_REQUEST
            )
        
        try:
            refresh = RefreshToken(refresh_token)
            new_access = str(refresh.access_token)
            new_refresh = str(refresh)
        except TokenError:
            return Response(
                {"message": "Invalid or expired refresh token"},
                status = status.HTTP_400_BAD_REQUEST
            )
        
        response = Response(
            {
                "message": "Token refreshed successfully",
            },
            status=status.HTTP_200_OK
        )

        data = {
            "refresh": new_refresh,
            "access": new_access,
        }

        set_cookies_for_response(response, data)

        return response

class UserMeView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        description="Responds with the data of the authenticated user.",
        responses={200: UserMeSerializer},
        methods=["GET"],
    )
    def get(self, request):
        serializer = UserMeSerializer(request.user, context={"request": request})
        return Response(serializer.data)