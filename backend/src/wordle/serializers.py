from rest_framework import serializers
from .models import Word

class WordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Word
        fields = ["length", "difficulty"]


class WordleGuessSerializer(serializers.Serializer):
    word = serializers.CharField(max_length=150)


class WordleGuessResponseSerializer(serializers.Serializer):
    detail = serializers.CharField()
    correct = serializers.BooleanField()
    guesses = serializers.IntegerField()


class WordleGuessErrorSerializer(serializers.Serializer):
    detail = serializers.CharField()