from django.urls import path
from .views import (
    StoryCreateListView,
    StoryRetrieveDestroyView,
    StoryLikeView,
)

urlpatterns = [
    path("", StoryCreateListView.as_view(), name="story-create-list"),
    path("/<int:story_id>", StoryRetrieveDestroyView.as_view(), name="story-retrieve-destroy"),
    path("/<int:story_id>/like", StoryLikeView.as_view(), name="story-like"),
]