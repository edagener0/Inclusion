from django.urls import path
from .views import (
    ProfileRetrieveView,
    ProfileListView,
    ProfilePostListView,
    ProfileIncListVIew
)

urlpatterns = [
    path("/<str:username>", ProfileRetrieveView.as_view(), name="profile-retrive"),
    path("/<str:username>/posts", ProfilePostListView.as_view(), name="profile-posts-list"),
    path("/<str:username>/incs", ProfileIncListVIew.as_view(), name="profile-incs-list"),
    path("", ProfileListView.as_view(), name="profile-search-list"),
]