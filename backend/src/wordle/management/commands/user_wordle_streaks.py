from django.core.management.base import BaseCommand
from wordle.utils import reset_missed_wordle_streaks

class Command(BaseCommand):
    help = "Reset Wordle streaks for users who missed yesterday's Wordle."

    def handle(self, *args, **kwargs):
        reset_missed_wordle_streaks()
        self.stdout.write(self.style.SUCCESS("Reset missed Wordle streaks."))