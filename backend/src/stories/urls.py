from django.urls import path
from .views import (
    StoriesCreateListView,
    StoriesRetrieveDestroyView
)

urlpatterns = [
    path("", StoriesCreateListView.as_view(), name="stories-create-list"),
    path("/<int:pk>", StoriesRetrieveDestroyView.as_view(), name="stories-retrieve")
]