from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from .models import DM

User = get_user_model()


class DMViewsTests(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username="alice", password="password")
        self.user2 = User.objects.create_user(username="bob", password="password")
        self.user3 = User.objects.create_user(username="charlie", password="password")
        self.client = APIClient()
        self.client.force_authenticate(user=self.user1)

    def test_inbox_lists_only_latest_message_per_other_user(self):
        DM.objects.create(sender=self.user1, receiver=self.user2, content="old bob")
        latest_bob_dm = DM.objects.create(sender=self.user2, receiver=self.user1, content="latest bob")
        latest_charlie_dm = DM.objects.create(sender=self.user1, receiver=self.user3, content="latest charlie")

        response = self.client.get(reverse("dm-create-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 2)
        self.assertEqual(response.data["results"][0]["id"], latest_charlie_dm.id)
        self.assertEqual(response.data["results"][0]["last_message"], "latest charlie")
        self.assertEqual(response.data["results"][1]["id"], latest_bob_dm.id)
        self.assertEqual(response.data["results"][1]["last_message"], "latest bob")
        self.assertEqual(response.data["results"][1]["other_user"]["username"], self.user2.username)

    def test_create_dm_from_inbox_sets_authenticated_user_as_sender(self):
        response = self.client.post(
            reverse("dm-create-list"),
            {"content": "hello inbox", "receiver": self.user2.id},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            DM.objects.filter(
                sender=self.user1,
                receiver=self.user2,
                content="hello inbox",
            ).exists()
        )

    def test_conversation_messages_view_lists_only_messages_between_two_users(self):
        first_dm = DM.objects.create(sender=self.user1, receiver=self.user2, content="first")
        second_dm = DM.objects.create(sender=self.user2, receiver=self.user1, content="second")
        DM.objects.create(sender=self.user1, receiver=self.user3, content="ignore me")

        response = self.client.get(
            reverse("dm-conversation-messages", kwargs={"user_id": self.user2.id})
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 2)
        self.assertEqual(response.data["results"][0]["id"], first_dm.id)
        self.assertTrue(response.data["results"][0]["is_mine"])
        self.assertEqual(response.data["results"][1]["id"], second_dm.id)
        self.assertFalse(response.data["results"][1]["is_mine"])

    def test_conversation_messages_post_uses_user_from_url_as_receiver(self):
        response = self.client.post(
            reverse("dm-conversation-messages", kwargs={"user_id": self.user2.id}),
            {"content": "hello chat"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            DM.objects.filter(
                sender=self.user1,
                receiver=self.user2,
                content="hello chat",
            ).exists()
        )

    def test_conversation_with_self_is_rejected(self):
        response = self.client.get(
            reverse("dm-conversation-messages", kwargs={"user_id": self.user1.id})
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_unauthenticated_access_is_rejected(self):
        self.client.force_authenticate(user=None)

        response = self.client.get(reverse("dm-create-list"))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        response = self.client.get(
            reverse("dm-conversation-messages", kwargs={"user_id": self.user2.id})
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
