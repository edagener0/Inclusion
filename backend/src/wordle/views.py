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
    WordleGuessErrorSerializer,
    WordleLeaderboardUserSerializer,
)
from .utils import find_diff_between_words, RIGHT_PLACE_SYMBOL
from rest_framework.generics import ListAPIView
from django.contrib.auth import get_user_model
from .utils import update_user_wordle_streak

User = get_user_model()

@extend_schema(
    tags=["Wordle"],
    summary="Get today's Wordle",
    description="Return metadata for today's Wordle game, including difficulty and whether the user has already won.",
)
class WordleWordView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        responses={200: WordSerializer, 404: WordleGuessErrorSerializer},
        description="Get today's Wordle metadata. Returns the word length and difficulty.",
    )
    def get(self, request, *args, **kwargs):
        today = timezone.now().date()

        wordle = get_object_or_404(Wordle, date=today)

        has_won = WordleResult.objects.filter(
            wordle=wordle,
            user=self.request.user,
            status=WordleResult.StatusChoices.SUCCESS,
        ).exists()

        serializer = WordSerializer(
            wordle.word, context={"has_won": has_won, "game_id": wordle.id}
        )

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
        tags=["Wordle"],
        summary="Submit Wordle guess",
        description="Submit your guess for today's Wordle. Returns whether the guess is correct, the number of guesses, or errors if invalid.",
    )
    def post(self, request, *args, **kwargs):
        serializer = WordleGuessSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        guessed_word = serializer.validated_data["word"]

        today = timezone.now().date()
        wordle = get_object_or_404(Wordle, date=today)

        if not guessed_word:
            return Response(
                {"detail": "No guessed word."}, status=status.HTTP_400_BAD_REQUEST
            )

        if len(guessed_word) != wordle.word.length:
            return Response(
                {"detail": "Invalid guess length"}, status=status.HTTP_400_BAD_REQUEST
            )

        wordle_result, created = WordleResult.objects.get_or_create(
            wordle=wordle, user=self.request.user
        )

        if not created and wordle_result.status == WordleResult.StatusChoices.SUCCESS:
            return Response(
                {
                    "detail": "You already guessed today's wordle!",
                    "correct": True,
                    "guesses": wordle_result.guesses,
                    "diff": RIGHT_PLACE_SYMBOL * wordle.word.length,
                },
                status=status.HTTP_200_OK,
            )

        is_correct = guessed_word.lower() == wordle.word.text.lower()
        diff = find_diff_between_words(guessed_word.lower(), wordle.word.text.lower())

        if is_correct:
            wordle_result.status = WordleResult.StatusChoices.SUCCESS
            update_user_wordle_streak(request.user, wordle.date)

        wordle_result.guesses += 1 if not created else 0
        wordle_result.save()

        return Response(
            {
                "detail": "Your guess was "
                + ("correct" if is_correct else "incorrect"),
                "correct": is_correct,
                "guesses": wordle_result.guesses,
                "diff": diff,
            },
            status=status.HTTP_200_OK,
        )

@extend_schema(
    tags=["Wordle"],
    summary="Get Wordle leaderboard",
    description="List users ordered by their maximum Wordle streak.",
)
class WordleLeaderboardView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = WordleLeaderboardUserSerializer
    queryset = User.objects.order_by("-max_wordle_streak")
