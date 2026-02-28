from django.urls import path
from .views import (
    CommentRetrieveDestroyView,
    CommentLikeView,
)

urlpatterns = [
    path("/<int:comment_id>", CommentRetrieveDestroyView.as_view(), name="comment-retrieve-destroy"),
    path("/<int:comment_id>/like", CommentLikeView.as_view(), name="comment-like"),
]