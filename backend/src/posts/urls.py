from django.urls import path
from .views import (
    PostCreateListView,
    PostRetrieveDestroyView,
    PostLikeView,
    PostCommentsCreateListView,
    PostFavoriteListView,
    PostFavoriteToggleView,
)

urlpatterns = [
    path("", PostCreateListView.as_view(), name="post-create-list"),
    path("/<int:post_id>", PostRetrieveDestroyView.as_view(), name="post-retrieve-destroy"),
    path("/<int:post_id>/like", PostLikeView.as_view(), name="post-like"),
    path("/<int:post_id>/favorite", PostFavoriteToggleView.as_view(), name="post-favorite-create-delete"),
    path("/favorites", PostFavoriteListView.as_view(), name="post-favorite-list"),
    path("/<int:post_id>/comments", PostCommentsCreateListView.as_view(), name="post-comments-create-list")
]