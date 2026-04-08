from unittest.mock import patch

from asgiref.sync import async_to_sync, sync_to_async
from channels.layers import get_channel_layer
from channels.testing import WebsocketCommunicator
from django.contrib.auth import get_user_model
from django.test import TransactionTestCase
from django.test.utils import override_settings
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase
from rest_framework_simplejwt.tokens import AccessToken

from inclusion.asgi import application

from .models import DM
from .realtime import (
    build_dm_conversation_group,
    build_dm_user_group,
    serialize_dm_inbox_item,
    serialize_dm_realtime_message,
)

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

        response = self.client.get(reverse("dm-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 2)
        self.assertEqual(response.data["results"][0]["id"], latest_charlie_dm.id)
        self.assertEqual(response.data["results"][0]["last_message"], "latest charlie")
        self.assertEqual(response.data["results"][1]["id"], latest_bob_dm.id)
        self.assertEqual(response.data["results"][1]["last_message"], "latest bob")
        self.assertEqual(response.data["results"][1]["user"]["username"], self.user2.username)
        self.assertTrue(response.data["results"][1]["user"]["avatar"].startswith("http://testserver/"))

    def test_inbox_post_is_not_allowed(self):
        response = self.client.post(
            reverse("dm-list"),
            {"content": "hello inbox", "receiver": self.user2.id},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        self.assertFalse(
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
        self.assertEqual(response.data["results"][1]["id"], second_dm.id)

    def test_conversation_messages_post_uses_user_from_url_as_receiver(self):
        with patch("dms.views.schedule_dm_message_created_broadcast") as mocked_broadcast:
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
        mocked_broadcast.assert_called_once()
        self.assertEqual(response.data["receiver"]["username"], self.user2.username)

    def test_sender_can_update_own_dm_message(self):
        dm = DM.objects.create(sender=self.user1, receiver=self.user2, content="before")

        with patch("dms.views.schedule_dm_message_updated_broadcast") as mocked_broadcast:
            response = self.client.patch(
                reverse("dm-message-retrieve-update-destroy", kwargs={"dm_id": dm.id}),
                {"content": "after"},
                format="json",
            )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        mocked_broadcast.assert_called_once()
        dm.refresh_from_db()
        self.assertEqual(dm.content, "after")

    def test_receiver_cannot_update_dm_message(self):
        dm = DM.objects.create(sender=self.user1, receiver=self.user2, content="before")
        self.client.force_authenticate(user=self.user2)

        response = self.client.patch(
            reverse("dm-message-retrieve-update-destroy", kwargs={"dm_id": dm.id}),
            {"content": "after"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        dm.refresh_from_db()
        self.assertEqual(dm.content, "before")

    def test_sender_can_delete_own_dm_message(self):
        dm = DM.objects.create(sender=self.user1, receiver=self.user2, content="delete me")

        with patch("dms.views.schedule_dm_message_deleted_broadcast") as mocked_broadcast:
            response = self.client.delete(
                reverse("dm-message-retrieve-update-destroy", kwargs={"dm_id": dm.id})
            )

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        mocked_broadcast.assert_called_once()
        self.assertFalse(DM.objects.filter(id=dm.id).exists())

    def test_receiver_cannot_delete_dm_message(self):
        dm = DM.objects.create(sender=self.user1, receiver=self.user2, content="delete me")
        self.client.force_authenticate(user=self.user2)

        response = self.client.delete(
            reverse("dm-message-retrieve-update-destroy", kwargs={"dm_id": dm.id})
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(DM.objects.filter(id=dm.id).exists())

    def test_inbox_reflects_previous_message_after_latest_is_deleted(self):
        older_dm = DM.objects.create(sender=self.user1, receiver=self.user2, content="older")
        latest_dm = DM.objects.create(sender=self.user1, receiver=self.user2, content="latest")

        response = self.client.delete(
            reverse("dm-message-retrieve-update-destroy", kwargs={"dm_id": latest_dm.id})
        )

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        inbox_response = self.client.get(reverse("dm-list"))
        self.assertEqual(inbox_response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(inbox_response.data["results"]), 1)
        self.assertEqual(inbox_response.data["results"][0]["id"], older_dm.id)
        self.assertEqual(inbox_response.data["results"][0]["last_message"], "older")

    def test_conversation_with_self_is_rejected(self):
        response = self.client.get(
            reverse("dm-conversation-messages", kwargs={"user_id": self.user1.id})
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_unauthenticated_access_is_rejected(self):
        self.client.force_authenticate(user=None)

        response = self.client.get(reverse("dm-list"))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        response = self.client.get(
            reverse("dm-conversation-messages", kwargs={"user_id": self.user2.id})
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


@override_settings(BACKEND_PUBLIC_URL="http://localhost:8000")
class DMRealtimeHelpersTests(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username="alice", password="password")
        self.user2 = User.objects.create_user(username="bob", password="password")

    def test_conversation_group_is_stable_regardless_of_user_order(self):
        self.assertEqual(build_dm_conversation_group(3, 7), "dm_3_7")
        self.assertEqual(build_dm_conversation_group(7, 3), "dm_3_7")

    def test_realtime_payload_is_camel_case_and_contains_user_ids(self):
        dm = DM.objects.create(sender=self.user1, receiver=self.user2, content="hello")

        payload = serialize_dm_realtime_message(dm)

        self.assertEqual(payload["senderId"], self.user1.id)
        self.assertEqual(payload["receiverId"], self.user2.id)
        self.assertIn("createdAt", payload)
        self.assertNotIn("created_at", payload)
        self.assertTrue(payload["sender"]["avatar"].startswith("http://localhost:8000/"))

    def test_inbox_payload_uses_user_for_current_user(self):
        dm = DM.objects.create(sender=self.user1, receiver=self.user2, content="hello inbox")

        payload = serialize_dm_inbox_item(dm, self.user1)

        self.assertEqual(payload["user"]["id"], self.user2.id)
        self.assertEqual(payload["lastMessage"], "hello inbox")
        self.assertTrue(payload["user"]["avatar"].startswith("http://localhost:8000/"))


class DMWebSocketTests(TransactionTestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username="alice", password="password")
        self.user2 = User.objects.create_user(username="bob", password="password")

    def test_authenticated_user_receives_broadcast_for_open_conversation(self):
        async def run_test():
            communicator = WebsocketCommunicator(
                application,
                f"/ws/dms/{self.user2.id}/",
                headers=[
                    (b"origin", b"http://localhost:5173"),
                    (
                        b"cookie",
                        f"access_token={AccessToken.for_user(self.user1)}".encode("utf-8"),
                    ),
                ],
            )

            connected, _ = await communicator.connect()
            self.assertTrue(connected)

            await get_channel_layer().group_send(
                build_dm_conversation_group(self.user1.id, self.user2.id),
                {
                    "type": "dm.message.created",
                    "message": {
                        "id": 99,
                        "content": "hello realtime",
                    },
                },
            )

            payload = await communicator.receive_json_from()
            self.assertEqual(payload["type"], "dm.message.created")
            self.assertEqual(payload["message"]["content"], "hello realtime")

            await communicator.disconnect()

        async_to_sync(run_test)()

    def test_authenticated_user_receives_inbox_update(self):
        async def run_test():
            communicator = WebsocketCommunicator(
                application,
                "/ws/dms/inbox/",
                headers=[
                    (b"origin", b"http://localhost:5173"),
                    (
                        b"cookie",
                        f"access_token={AccessToken.for_user(self.user1)}".encode("utf-8"),
                    ),
                ],
            )

            connected, _ = await communicator.connect()
            self.assertTrue(connected)

            await get_channel_layer().group_send(
                build_dm_user_group(self.user1.id),
                {
                    "type": "dm.inbox.updated",
                    "inbox_item": {
                        "id": 99,
                        "lastMessage": "hello inbox realtime",
                    },
                },
            )

            payload = await communicator.receive_json_from()
            self.assertEqual(payload["type"], "dm.inbox.updated")
            self.assertEqual(payload["inboxItem"]["lastMessage"], "hello inbox realtime")

            await communicator.disconnect()

        async_to_sync(run_test)()

    def test_post_message_broadcasts_created_event_to_conversation_socket(self):
        client = APIClient()
        client.force_authenticate(user=self.user1)

        async def run_test():
            communicator = WebsocketCommunicator(
                application,
                f"/ws/dms/{self.user2.id}/",
                headers=[
                    (b"origin", b"http://localhost:5173"),
                    (
                        b"cookie",
                        f"access_token={AccessToken.for_user(self.user1)}".encode("utf-8"),
                    ),
                ],
            )

            connected, _ = await communicator.connect()
            self.assertTrue(connected)

            response = await sync_to_async(
                client.post,
                thread_sensitive=True,
            )(
                reverse("dm-conversation-messages", kwargs={"user_id": self.user2.id}),
                {"content": "hello through rest"},
                format="json",
            )

            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            payload = await communicator.receive_json_from(timeout=2)
            self.assertEqual(payload["type"], "dm.message.created")
            self.assertEqual(payload["message"]["content"], "hello through rest")
            self.assertEqual(payload["message"]["receiverId"], self.user2.id)

            await communicator.disconnect()

        async_to_sync(run_test)()

    def test_post_message_broadcasts_updated_inbox_to_receiver_socket(self):
        client = APIClient()
        client.force_authenticate(user=self.user1)

        async def run_test():
            communicator = WebsocketCommunicator(
                application,
                "/ws/dms/inbox/",
                headers=[
                    (b"origin", b"http://localhost:5173"),
                    (
                        b"cookie",
                        f"access_token={AccessToken.for_user(self.user2)}".encode("utf-8"),
                    ),
                ],
            )

            connected, _ = await communicator.connect()
            self.assertTrue(connected)

            response = await sync_to_async(
                client.post,
                thread_sensitive=True,
            )(
                reverse("dm-conversation-messages", kwargs={"user_id": self.user2.id}),
                {"content": "hello inbox after post"},
                format="json",
            )

            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            payload = await communicator.receive_json_from(timeout=2)
            self.assertEqual(payload["type"], "dm.inbox.updated")
            self.assertEqual(payload["inboxItem"]["user"]["id"], self.user1.id)
            self.assertEqual(payload["inboxItem"]["lastMessage"], "hello inbox after post")

            await communicator.disconnect()

        async_to_sync(run_test)()

    def test_patch_message_broadcasts_updated_event_to_conversation_socket(self):
        dm = DM.objects.create(sender=self.user1, receiver=self.user2, content="before")
        client = APIClient()
        client.force_authenticate(user=self.user1)

        async def run_test():
            communicator = WebsocketCommunicator(
                application,
                f"/ws/dms/{self.user2.id}/",
                headers=[
                    (b"origin", b"http://localhost:5173"),
                    (
                        b"cookie",
                        f"access_token={AccessToken.for_user(self.user1)}".encode("utf-8"),
                    ),
                ],
            )

            connected, _ = await communicator.connect()
            self.assertTrue(connected)

            response = await sync_to_async(
                client.patch,
                thread_sensitive=True,
            )(
                reverse("dm-message-retrieve-update-destroy", kwargs={"dm_id": dm.id}),
                {"content": "after"},
                format="json",
            )

            self.assertEqual(response.status_code, status.HTTP_200_OK)
            payload = await communicator.receive_json_from(timeout=2)
            self.assertEqual(payload["type"], "dm.message.updated")
            self.assertEqual(payload["message"]["id"], dm.id)
            self.assertEqual(payload["message"]["content"], "after")

            await communicator.disconnect()

        async_to_sync(run_test)()

    def test_delete_message_broadcasts_deleted_event_to_conversation_socket(self):
        dm = DM.objects.create(sender=self.user1, receiver=self.user2, content="delete me")
        client = APIClient()
        client.force_authenticate(user=self.user1)

        async def run_test():
            communicator = WebsocketCommunicator(
                application,
                f"/ws/dms/{self.user2.id}/",
                headers=[
                    (b"origin", b"http://localhost:5173"),
                    (
                        b"cookie",
                        f"access_token={AccessToken.for_user(self.user1)}".encode("utf-8"),
                    ),
                ],
            )

            connected, _ = await communicator.connect()
            self.assertTrue(connected)

            response = await sync_to_async(
                client.delete,
                thread_sensitive=True,
            )(
                reverse("dm-message-retrieve-update-destroy", kwargs={"dm_id": dm.id}),
            )

            self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
            payload = await communicator.receive_json_from(timeout=2)
            self.assertEqual(payload["type"], "dm.message.deleted")
            self.assertEqual(payload["message"]["id"], dm.id)

            await communicator.disconnect()

        async_to_sync(run_test)()

    def test_delete_latest_message_removes_inbox_item_when_conversation_becomes_empty(self):
        dm = DM.objects.create(sender=self.user1, receiver=self.user2, content="lonely message")
        client = APIClient()
        client.force_authenticate(user=self.user1)

        async def run_test():
            communicator = WebsocketCommunicator(
                application,
                "/ws/dms/inbox/",
                headers=[
                    (b"origin", b"http://localhost:5173"),
                    (
                        b"cookie",
                        f"access_token={AccessToken.for_user(self.user2)}".encode("utf-8"),
                    ),
                ],
            )

            connected, _ = await communicator.connect()
            self.assertTrue(connected)

            response = await sync_to_async(
                client.delete,
                thread_sensitive=True,
            )(
                reverse("dm-message-retrieve-update-destroy", kwargs={"dm_id": dm.id}),
            )

            self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
            payload = await communicator.receive_json_from(timeout=2)
            self.assertEqual(payload["type"], "dm.inbox.removed")
            self.assertEqual(payload["conversation"]["userId"], self.user1.id)

            await communicator.disconnect()

        async_to_sync(run_test)()

    def test_unauthenticated_user_cannot_connect(self):
        async def run_test():
            communicator = WebsocketCommunicator(
                application,
                f"/ws/dms/{self.user2.id}/",
                headers=[(b"origin", b"http://localhost:5173")],
            )

            connected, _ = await communicator.connect()
            self.assertFalse(connected)

        async_to_sync(run_test)()
