from django.urls import path
from .views import (
    NoteCreateListView,
    NoteRetrieveView
)

urlpatterns = [
    path("", NoteCreateListView.as_view(), name="note-create-list"),
    path("/<int:pk>", NoteRetrieveView.as_view(), name="note-retrieve")
]