import requests
from .models import Word
from collections import Counter

WORDS_URLS = [
        "https://raw.githubusercontent.com/MrLabbrow/All-English-Words/refs/heads/main/Words.txt",
    ]

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
            diff[i] = "+"
            count[guess[i]] -= 1

    # look for the chars in wrong position or absent
    for i in range(n):
        if diff[i] != "":
            continue

        if count[guess[i]] > 0:
            diff[i] = "*"
            count[guess[i]] -= 1
        else:
            diff[i] = "-"
    
    return "".join(diff)

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