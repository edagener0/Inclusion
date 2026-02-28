from django.urls import path
from .views import (
    NoteCreateListView,
    NoteRetrieveDestroyView,
    NoteLikeView
)

urlpatterns = [
    path("", NoteCreateListView.as_view(), name="note-create-list"),
    path("/<int:note_id>", NoteRetrieveDestroyView.as_view(), name="note-retrieve-destroy"),
    path("/<int:note_id>/like", NoteLikeView.as_view(), name="note-like"),
]