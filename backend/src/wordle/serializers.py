from rest_framework import serializers
from .models import Word
from django.contrib.auth import get_user_model

User = get_user_model()

class WordSerializer(serializers.ModelSerializer):
    has_won = serializers.SerializerMethodField()

    class Meta:
        model = Word
        fields = ["length", "difficulty", "has_won"]

    def get_has_won(self, obj):
        return self.context.get("has_won")


class WordleGuessSerializer(serializers.Serializer):
    word = serializers.CharField(max_length=150)


class WordleGuessResponseSerializer(serializers.Serializer):
    detail = serializers.CharField()
    correct = serializers.BooleanField()
    guesses = serializers.IntegerField()
    diff = serializers.CharField()


class WordleGuessErrorSerializer(serializers.Serializer):
    detail = serializers.CharField()

class StreaksSerializer(serializers.Serializer):
    current_streak = serializers.IntegerField()
    max_streak = serializers.IntegerField()

class WordleLeaderboardUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name", "avatar", "current_wordle_streak", "max_wordle_streak"]