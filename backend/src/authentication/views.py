from rest_framework.generics import CreateAPIView
from .serializers import UserRegisterSerializer
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

class UserRegisterView(CreateAPIView):
    serializer_class = UserRegisterSerializer

class UserLoginView(APIView):
    def post(self, request):
        data = request.data
        response = Response()
        username = data.get("username", None)
        password = data.get("password", None)
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
                "data": data,
            }
            return response
        else:
            return Response(
                {"message": "This account is not active."},
                status = status.HTTP_404_NOT_FOUND,
            )
        
class UserLogoutView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh") or request.COOKIES.get(
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
    def post(self, request):
        refresh_token = request.data.get("refresh") or request.COOKIES.get(
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

    def get(self, request):
        serializer = UserMeSerializer(request.user)
        return Response(serializer.data)