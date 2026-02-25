from django.urls import path
from .views import (
    ContentLikeView,
    ContentDestroyView
)

urlpatterns = [
    path("/like/<int:content_id>", ContentLikeView.as_view(), name="content-like"),
    path("/<int:pk>", ContentDestroyView.as_view(), name="content-delete")
]