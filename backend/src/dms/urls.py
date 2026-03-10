from django.urls import path
from .views import (
    DMListView,
    DMRetrieveDestroyView
)

urlpatterns = [
    path("", DMListView.as_view(), name="dm-create-list"),
    path("/<int:dm_id>", DMRetrieveDestroyView.as_view(), name="dm-retrieve-destroy")
]