from django.urls import path
from .views import (
    IncCreateListView,
    IncRetrieveDestroyView,
    IncLikeView,
)

urlpatterns = [
    path("", IncCreateListView.as_view(), name="inc-create-list"),
    path("/<int:inc_id>", IncRetrieveDestroyView.as_view(), name="inc-retrieve-destroy"),
    path("/<int:inc_id>/like", IncLikeView.as_view(), name="inc-like"),
]