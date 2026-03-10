from django.db import models
from common.models import TimeStampedModel
from django.contrib.auth import get_user_model

User = get_user_model()

class Word(TimeStampedModel):
    
    class DifficultyChoices(models.TextChoices):
        EASY = "easy", "Easy"
        MEDIUM = "medium", "Medium"
        HARD = "hard", "Hard"

    text = models.CharField(max_length=150, null=False, blank=False, unique=True)
    length = models.PositiveIntegerField(null=False)
    difficulty = models.CharField(max_length=20, blank=False, null=False, choices = DifficultyChoices.choices)


class Wordle(TimeStampedModel):
    word = models.ForeignKey(Word, on_delete=models.CASCADE, related_name="wordles")
    date = models.DateField(unique=True, null=False)


class WordleResult(TimeStampedModel):
    
    class StatusChoices(models.TextChoices):
        SUCCESS = "success", "Success"
        FAILURE = "failure", "Failure"

    pk = models.CompositePrimaryKey("wordle", "user")
    wordle = models.ForeignKey(Wordle, on_delete=models.CASCADE, related_name="results")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="participants")
    guesses = models.IntegerField(default=1, null=False)
    status = models.CharField(max_length=20, choices=StatusChoices.choices, default=StatusChoices.FAILURE)