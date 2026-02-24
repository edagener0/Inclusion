from django.urls import path
from .views import (
    NoteCreateListView,
    NoteRetrieveDestroyView
)

urlpatterns = [
    path("", NoteCreateListView.as_view(), name="note-create"),
    path("/<int:pk>", NoteRetrieveDestroyView.as_view(), name="note-retrieve-destroy")
]