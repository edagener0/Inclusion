import requests
from .models import Word

WORDS_URLS = [
        "https://raw.githubusercontent.com/MrLabbrow/All-English-Words/refs/heads/main/Words.txt",
    ]

def find_diff_between_words(guess: str, original: str) -> bool:
    if len(guess) != len(original):
        raise Exception("To be compared the strings must have the same length")
    
    #TODO falta implementar para encontrar as diferenças entre as duas palavras
    
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
                word=word,
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