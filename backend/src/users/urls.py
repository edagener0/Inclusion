from django.urls import path
from .views import (
    UserListView,
    UserDetailUpdateView,
    UserSearchView
)

urlpatterns = [
    path("list/", UserListView.as_view(), name="user-list"),
    path("<int:pk>/", UserDetailUpdateView.as_view(), name="user-detail-update"),
    path("search/<str:name>/", UserSearchView.as_view(), name="user-search-list"),
]
