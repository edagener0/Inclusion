from rest_framework.views import APIView
from .models import Wordle, WordleResult
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.response import Response
from .serializers import WordSerializer, WordleGuessSerializer
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema
from .serializers import (
    WordleGuessSerializer,
    WordleGuessResponseSerializer,
    WordleGuessErrorSerializer
)
from .utils import find_diff_between_words


class WordleWordView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        responses={
            200: WordSerializer,
            404: WordleGuessErrorSerializer
        },
        description="Get today's Wordle metadata. Returns the word length and difficulty."
    )
    def get(self, request, *args, **kwargs):
        today = timezone.now().date()

        wordle = get_object_or_404(Wordle, date=today)

        serializer = WordSerializer(wordle.word)

        return Response(serializer.data, status=status.HTTP_200_OK)


class WordleGuessView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=WordleGuessSerializer,
        responses={
            200: WordleGuessResponseSerializer,
            400: WordleGuessErrorSerializer,
            404: WordleGuessErrorSerializer,
        },
        description="Submit your guess for today's Wordle. Returns whether the guess is correct, the number of guesses, or errors if invalid."
    )

    def post(self, request, *args, **kwargs):
        serializer = WordleGuessSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        guessed_word = serializer.validated_data["word"]
        
        today = timezone.now().date()
        wordle = get_object_or_404(Wordle, date=today)
        
        if not guessed_word:
            return Response(
                {
                    "detail": "No guessed word."
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if len(guessed_word) != wordle.word.length:
            return Response(
                {
                    "detail": "Invalid guess length"
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        wordle_result, created = WordleResult.objects.get_or_create(wordle=wordle, user=self.request.user)

        if not created and wordle_result.status == WordleResult.StatusChoices.SUCCESS:
            return Response(
                {
                    "detail": "You already guessed today's wordle!",
                    "correct": True,
                    "guesses": wordle_result.guesses,
                    "diff": "+" * wordle.word.length
                },
                status=status.HTTP_200_OK
            )
        
        is_correct = guessed_word.lower() == wordle.word.text.lower()
        diff = find_diff_between_words(guessed_word.lower(), wordle.word.text.lower())

        if is_correct:
            wordle_result.status = WordleResult.StatusChoices.SUCCESS

        wordle_result.guesses += 1 if not created else 0
        wordle_result.save()
        
        return Response(
            {
                "detail": "Your guess was " + ("correct" if is_correct else "incorrect"),
                "correct": is_correct,
                "guesses": wordle_result.guesses,
                "diff": diff,
            },
            status=status.HTTP_200_OK
        )



        