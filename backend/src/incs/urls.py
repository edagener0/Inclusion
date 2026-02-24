from django.urls import path
from .views import (
    IncCreateListView,
    IncRetrieveDestroyView
)

urlpatterns = [
    path("", IncCreateListView.as_view(), name="inc-create"),
    path("/<int:pk>", IncRetrieveDestroyView.as_view(), name="inc-retrieve-destroy")
]