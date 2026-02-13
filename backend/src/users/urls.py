from django.urls import path
from .views import (
    UserListView,
    UserDetailUpdateView
)

urlpatterns = [
    path("list/", UserListView.as_view(), name="user-list"),
    path("<int:pk>/", UserDetailUpdateView.as_view(), name="user-detail-update"),
]
