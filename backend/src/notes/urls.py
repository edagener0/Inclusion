from django.urls import path
from .views import (
    NoteCreateListView,
    NoteRetrieveDestroyView
)

urlpatterns = [
    path("", NoteCreateListView.as_view(), name="note-create-list"),
    path("/<int:pk>", NoteRetrieveDestroyView.as_view(), name="note-retrieve")
]