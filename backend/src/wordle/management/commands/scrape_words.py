from django.core.management.base import BaseCommand
from wordle.utils import scrape_words

class Command(BaseCommand):
    help = "Scrapes words and saves them in the database."

    def handle(self, *args, **options):
        self.stdout.write("Starting word scraping...")
        scrape_words(self.stdout)
        self.stdout.write(self.style.SUCCESS("Finished word scraping."))