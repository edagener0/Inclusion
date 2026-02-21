from django.urls import path
from .views import (
    ProfileRetrieveView,
    ProfileListView
)

urlpatterns = [
    path("/<str:username>", ProfileRetrieveView.as_view(), name="profile-retrive"),
    path("", ProfileListView.as_view(), name="profile-search-list"),
]