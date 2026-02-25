from django.urls import path
from .views import (
    StoriesCreateListView,
    StoriesRetrieveView
)

urlpatterns = [
    path("", StoriesCreateListView.as_view(), name="stories-create-list"),
    path("/<int:pk>", StoriesRetrieveView.as_view(), name="stories-retrieve")
]