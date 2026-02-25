from django.urls import path
from .views import (
    IncCreateListView,
    IncRetrieveView
)

urlpatterns = [
    path("", IncCreateListView.as_view(), name="inc-create-list"),
    path("/<int:pk>", IncRetrieveView.as_view(), name="inc-retrieve")
]