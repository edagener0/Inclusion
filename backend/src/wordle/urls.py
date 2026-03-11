from django.urls import path
from .views import (
    WordleWordView,
    WordleGuessView,
    WordleLeaderboardView
)

urlpatterns = [
    path("/word", WordleWordView.as_view(), name="wordle-word"),
    path("/guess", WordleGuessView.as_view(), name="wordle-guess"),
    path("/leaderboard", WordleLeaderboardView.as_view(), name="wordle-leaderboard")
]