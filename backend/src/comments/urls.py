from django.urls import path
from .views import (
    CommentCreateListView,
)

urlpatterns = [
    path("", CommentCreateListView.as_view(), name="comment-create-list"),
]