from django.urls import path
from .views import (
    StoriesCreateListView,
    StoriesRetrieveDestroyView
)

urlpatterns = [
    path("", StoriesCreateListView.as_view(), name="stories-create"),
    path("/<int:pk>", StoriesRetrieveDestroyView.as_view(), name="stories-retrieve-destroy")
]