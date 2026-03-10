from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from wordle.models import Word, Wordle

class Command(BaseCommand):
    help = "Generate daily Wordle for the next day"

    def handle(self, *args, **kwargs):
        tomorrow = timezone.now().date() + timedelta(days=1)

        if Wordle.objects.filter(date=tomorrow).exists():
            self.stdout.write(self.style.WARNING("Wordle already exists for tomorrow"))
            return

        word = Word.objects.order_by("?").first()

        Wordle.objects.create(
            word=word,
            date=tomorrow
        )

        self.stdout.write(self.style.SUCCESS(f"Wordle created for {tomorrow} with word: {word.word}"))