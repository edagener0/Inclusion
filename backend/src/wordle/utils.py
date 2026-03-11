import requests
from .models import Word, WordleResult
from collections import Counter
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth import get_user_model

User = get_user_model()

WORDS_URLS = [
        "https://raw.githubusercontent.com/MrLabbrow/All-English-Words/refs/heads/main/Words.txt",
    ]

RIGHT_PLACE_SYMBOL = "+"
WRONG_PLACE_SYMBOL = "*"
ABSENT_SYMBOL = "-"

def find_diff_between_words(guess: str, original: str) -> str:
    
    n = len(guess)
    count = Counter(original)

    if n != len(original):
        raise Exception("To be compared the strings must have the same length")
    
    diff = [""] * n

    # + => char is in correct position
    # - => char is not present in the word
    # * => char is present in word but not in the right position

    # find the chars in the right position
    for i in range(n):
        if guess[i] == original[i]:
            diff[i] = RIGHT_PLACE_SYMBOL
            count[guess[i]] -= 1

    # look for the chars in wrong position or absent
    for i in range(n):
        if diff[i] != "":
            continue

        if count[guess[i]] > 0:
            diff[i] = WRONG_PLACE_SYMBOL
            count[guess[i]] -= 1
        else:
            diff[i] = ABSENT_SYMBOL
    
    return "".join(diff)

def update_user_wordle_streak(user, today_date):
    last_success = WordleResult.objects.filter(
        user=user, status=WordleResult.StatusChoices.SUCCESS
    ).order_by("-wordle__date").first()

    if last_success is None or last_success.wordle.date < today_date - timedelta(days=1):
        user.current_wordle_streak = 1
    elif last_success.wordle.date == today_date - timedelta(days=1):
        user.current_wordle_streak += 1
    else:
        user.current_wordle_streak = 1

    if user.current_wordle_streak > user.max_wordle_streak:
        user.max_wordle_streak = user.current_wordle_streak

    user.save(update_fields=["current_wordle_streak", "max_wordle_streak"])


def reset_missed_wordle_streaks():
    today = timezone.now().date()
    yesterday = today - timedelta(days=1)

    users_to_reset = User.objects.exclude(
        id__in=WordleResult.objects.filter(
            wordle__date=yesterday,
            status=WordleResult.StatusChoices.SUCCESS
        ).values_list("user_id", flat=True)
    )

    users_to_reset.update(current_wordle_streak=0)

def get_difficulty_for_word(word):
    word_len = len(word)

    if word_len < 6:
        return "easy"
    elif word_len < 10:
        return "medium"
    return "hard"

def get_words_list(stdout=None):
    words = []

    for url in WORDS_URLS:
        try:
            response = requests.get(url, timeout=10)

            if response.ok:
                words.extend(response.text.strip().split("\n"))
                if stdout:
                    stdout.write(f"Fetched words from {url}")
            else:
                if stdout:
                    stdout.write(f"Failed to fetch {url}")

        except Exception as e:
            if stdout:
                stdout.write(f"Error fetching {url}: {e}")

    return list(set(words))

def scrape_words(stdout=None):
    words = get_words_list(stdout)

    batch_size = 5000
    batch = []

    total = len(words)

    for i, word in enumerate(words, 1):
        batch.append(
            Word(
                text=word,
                length=len(word),
                difficulty=get_difficulty_for_word(word)
            )
        )

        if len(batch) >= batch_size:
            Word.objects.bulk_create(batch, ignore_conflicts=True)
            batch.clear()

            if stdout:
                percent = (i / total) * 100
                stdout.write(f"Progress: {i}/{total} ({percent:.2f}%)")

    if batch:
        Word.objects.bulk_create(batch, ignore_conflicts=True)