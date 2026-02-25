from django.urls import path
from .views import (
    PostCreateListView,
    PostRetrieveView
)

urlpatterns = [
    path("", PostCreateListView.as_view(), name="post-create-list"),
    path("/<int:pk>", PostRetrieveView.as_view(), name="post-retrieve")
]