from django.urls import path
from .views import (
    IncCreateListView,
    IncRetrieveDestroyView,
    IncLikeView,
    IncCommentsCreateListView
)

urlpatterns = [
    path("", IncCreateListView.as_view(), name="inc-create-list"),
    path("/<int:inc_id>", IncRetrieveDestroyView.as_view(), name="inc-retrieve-destroy"),
    path("/<int:inc_id>/like", IncLikeView.as_view(), name="inc-like"),
    path("/<int:inc_id>/comments", IncCommentsCreateListView.as_view(), name="inc-comments-create-list")
]