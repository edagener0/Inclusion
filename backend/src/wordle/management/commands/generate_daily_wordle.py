from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from wordle.models import Word, Wordle

class Command(BaseCommand):
    help = "Generate daily Wordle for the next day"

    def add_arguments(self, parser):
        parser.add_argument(
            "--days",
            type=int,
            default=1,
            help="How many days from today (default: 1 = tomorrow)",
        )

    def handle(self, *args, **kwargs):
        days = kwargs["days"]
        target_date = timezone.now().date() + timedelta(days=days)

        if Wordle.objects.filter(date=target_date).exists():
            self.stdout.write(self.style.WARNING(f"Wordle already exists for {target_date}"))
            return

        word = Word.objects.order_by("?").first()

        Wordle.objects.create(
            word=word,
            date=target_date
        )

        self.stdout.write(self.style.SUCCESS(f"Wordle created for {target_date} with word: {word.text}"))