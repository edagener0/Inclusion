from django.urls import path
from .views import (
    UserRegisterView,
    UserLoginView,
    UserLogoutView,
    UserTokenRefreshView,
    UserMeView
)

urlpatterns = [
    path("/register", UserRegisterView.as_view(), name="user-register"),
    path("/login", UserLoginView.as_view(), name="user-login"),
    path("/logout", UserLogoutView.as_view(), name="user-logout"),
    path("/refresh", UserTokenRefreshView.as_view(), name="user-token-refresh"),
    path("/me", UserMeView.as_view(), name="user-me-view")
]
