from django.urls import path
from .views import (
    IncCreateListView,
    IncRetrieveDestroyView,
    IncLikeView,
    IncCommentsCreateListView,
    IncFavoriteToggleView,
    FavoriteIncListView
)

urlpatterns = [
    path("", IncCreateListView.as_view(), name="inc-create-list"),
    path("/<int:inc_id>", IncRetrieveDestroyView.as_view(), name="inc-retrieve-destroy"),
    path("/<int:inc_id>/like", IncLikeView.as_view(), name="inc-like"),
    path("/<int:inc_id>/favorite", IncFavoriteToggleView.as_view(), name="inc-favorite-create-delete"),
    path("/favorites", FavoriteIncListView.as_view(), name="inc-favorite-list"),
    path("/<int:inc_id>/comments", IncCommentsCreateListView.as_view(), name="inc-comments-create-list"),
]