from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.utils import timezone
from django.urls import reverse
from datetime import timedelta
from django.core.management import call_command
from django.conf import settings
from django.contrib.auth import get_user_model

from wordle.models import Word, Wordle, WordleResult
from wordle.utils import find_diff_between_words, get_difficulty_for_word, RIGHT_PLACE_SYMBOL

User = get_user_model()


class WordleAPITests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="tester", password="password")
        self.client.force_authenticate(user=self.user)
        self.word = Word.objects.create(text="apple", length=5, difficulty="easy")
        self.today = timezone.now().date()
        self.wordle = Wordle.objects.create(word=self.word, date=self.today)
        self.word_url = reverse("wordle-word")
        self.guess_url = reverse("wordle-guess")
        self.leaderboard_url = reverse("wordle-leaderboard")

    def test_word_view_success(self):
        response = self.client.get(self.word_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["length"], 5)
        self.assertEqual(response.data["difficulty"], "easy")

    def test_word_view_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.word_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_word_view_not_found(self):
        Wordle.objects.all().delete()
        response = self.client.get(self.word_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_guess_correct(self):
        response = self.client.post(self.guess_url, {"word": "apple"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["correct"])
        self.assertEqual(response.data["diff"], RIGHT_PLACE_SYMBOL * 5)
        self.user.refresh_from_db()
        self.assertEqual(self.user.current_wordle_streak, 1)
        self.assertEqual(self.user.max_wordle_streak, 1)

    def test_guess_incorrect(self):
        response = self.client.post(self.guess_url, {"word": "grape"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data["correct"])
        self.user.refresh_from_db()
        self.assertEqual(self.user.current_wordle_streak, 0)

    def test_guess_case_insensitive(self):
        response = self.client.post(self.guess_url, {"word": "APPLE"})
        self.assertTrue(response.data["correct"])

    def test_guess_counter_increment(self):
        self.client.post(self.guess_url, {"word": "grape"})
        self.client.post(self.guess_url, {"word": "grape"})
        result = WordleResult.objects.get(user=self.user, wordle=self.wordle)
        self.assertEqual(result.guesses, 2)

    def test_guess_after_success(self):
        self.client.post(self.guess_url, {"word": "apple"})
        response = self.client.post(self.guess_url, {"word": "apple"})
        self.assertTrue(response.data["correct"])
        self.assertIn("already guessed", response.data["detail"])

    def test_guess_no_wordle_today(self):
        Wordle.objects.all().delete()
        response = self.client.post(self.guess_url, {"word": "apple"})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_streak_increments_today_only(self):
        self.client.post(self.guess_url, {"word": "apple"})
        self.user.refresh_from_db()
        self.assertEqual(self.user.current_wordle_streak, 1)
        self.assertEqual(self.user.max_wordle_streak, 1)

    def test_leaderboard_success(self):
        User.objects.create_user(username="user2", password="pass")
        response = self.client.get(self.leaderboard_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_leaderboard_serializer_fields(self):
        response = self.client.get(self.leaderboard_url)
        user_data = response.data["results"][0]
        self.assertIn("username", user_data)
        self.assertIn("first_name", user_data)
        self.assertIn("last_name", user_data)
        self.assertIn("current_wordle_streak", user_data)
        self.assertIn("max_wordle_streak", user_data)


class UtilsTests(TestCase):

    def test_find_diff_all_correct(self):
        self.assertEqual(find_diff_between_words("apple", "apple"), "+++++")

    def test_find_diff_wrong_place(self):
        self.assertEqual(find_diff_between_words("appel", "apple"), "+++**")

    def test_find_diff_absent(self):
        self.assertEqual(find_diff_between_words("zzzzz", "apple"), "-----")

    def test_find_diff_duplicates(self):
        self.assertEqual(len(find_diff_between_words("ppppp", "apple")), 5)

    def test_find_diff_length_mismatch(self):
        with self.assertRaises(Exception):
            find_diff_between_words("hi", "apple")

    def test_difficulty_easy(self):
        self.assertEqual(get_difficulty_for_word("cat"), "easy")

    def test_difficulty_medium(self):
        self.assertEqual(get_difficulty_for_word("elephant"), "medium")

    def test_difficulty_hard(self):
        self.assertEqual(get_difficulty_for_word("extraordinary"), "hard")


class ManagementCommandTests(TestCase):

    def setUp(self):
        self.word = Word.objects.create(text="apple", length=5, difficulty="easy")

    def test_generate_daily_wordle_creates(self):
        call_command("generate_daily_wordle")
        self.assertTrue(Wordle.objects.exists())

    def test_generate_daily_wordle_no_duplicate(self):
        call_command("generate_daily_wordle")
        before = Wordle.objects.count()
        call_command("generate_daily_wordle")
        self.assertEqual(before, Wordle.objects.count())


class CronTests(TestCase):

    def test_cronjob_exists(self):
        self.assertTrue(hasattr(settings, "CRONJOBS"))
        job = settings.CRONJOBS[0]
        self.assertEqual(job[1], "django.core.management.call_command")
        self.assertIn("generate_daily_wordle", job[2])


class LeaderboardOrderingTests(APITestCase):

    def setUp(self):
        self.user1 = User.objects.create_user(username="user1", password="pass")
        self.user2 = User.objects.create_user(username="user2", password="pass")
        self.user3 = User.objects.create_user(username="user3", password="pass")
        self.client.force_authenticate(user=self.user1)
        self.word = Word.objects.create(text="apple", length=5, difficulty="easy")
        today = timezone.now().date()
        self.wordle_today = Wordle.objects.create(word=self.word, date=today)
        self.guess_url = reverse("wordle-guess")
        self.leaderboard_url = reverse("wordle-leaderboard")

    def simulate_today_guess(self, user):
        self.client.force_authenticate(user=user)
        self.client.post(self.guess_url, {"word": "apple"})

    def test_leaderboard_streaks_ordering_today(self):
        self.simulate_today_guess(self.user1)
        self.simulate_today_guess(self.user2)
        self.simulate_today_guess(self.user3)
        response = self.client.get(self.leaderboard_url)
        results = {u["username"]: u for u in response.data["results"]}
        self.assertEqual(results["user1"]["current_wordle_streak"], 1)
        self.assertEqual(results["user2"]["current_wordle_streak"], 1)
        self.assertEqual(results["user3"]["current_wordle_streak"], 1)

from django.test import TestCase
from django.utils import timezone
from datetime import timedelta
from wordle.models import Wordle, Word, WordleResult, User
from wordle.utils import reset_missed_wordle_streaks

class WordleStreakResetTests(TestCase):

    def setUp(self):
        self.user_played = User.objects.create(username="played_user")
        self.user_missed = User.objects.create(username="missed_user")
        
        self.word = Word.objects.create(text="apple", length=5, difficulty="easy")
        
        self.yesterday = timezone.now().date() - timedelta(days=1)
        self.wordle_yesterday = Wordle.objects.create(word=self.word, date=self.yesterday)
        
        WordleResult.objects.create(
            user=self.user_played,
            wordle=self.wordle_yesterday,
            status=WordleResult.StatusChoices.SUCCESS,
            guesses=1
        )

        self.user_played.current_wordle_streak = 3
        self.user_played.save()
        self.user_missed.current_wordle_streak = 5
        self.user_missed.save()

    def test_reset_missed_streaks(self):
        reset_missed_wordle_streaks()

        self.user_played.refresh_from_db()
        self.user_missed.refresh_from_db()

        self.assertEqual(self.user_played.current_wordle_streak, 3)

        self.assertEqual(self.user_missed.current_wordle_streak, 0)