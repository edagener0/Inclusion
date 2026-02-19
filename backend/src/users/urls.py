from django.urls import path
from .views import (
    UserListView,
    UserUpdateView,
    UserRetrieveView,
    UserSearchView,
)

urlpatterns = [
    path("list/", UserListView.as_view(), name="user-list"),
    path("<int:pk>/", UserRetrieveView.as_view(), name="user-detail-view"),
    path("me/", UserUpdateView.as_view(), name="user-detail-update"),
    path("search/<str:name>/", UserSearchView.as_view(), name="user-search-list"),
]


