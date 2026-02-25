from django.urls import path
from .views import (
    PostCreateListView,
    PostRetrieveDestroyView
)

urlpatterns = [
    path("", PostCreateListView.as_view(), name="post-create-list"),
    path("/<int:pk>", PostRetrieveDestroyView.as_view(), name="post-retrieve")
]