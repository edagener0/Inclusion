from django.urls import path
from .views import (
    WordleWordView,
    WordleGuessView,
)

urlpatterns = [
    path("/word", WordleWordView.as_view(), name="wordle-word"),
    path("/guess", WordleGuessView.as_view(), name="wordle-guess"),
]