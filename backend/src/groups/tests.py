from asgiref.sync import async_to_sync, sync_to_async
from channels.testing import WebsocketCommunicator
from django.contrib.auth import get_user_model
from django.test import TransactionTestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase
from rest_framework_simplejwt.tokens import AccessToken

from inclusion.asgi import application

from .models import GroupChat, GroupMessage, GroupParticipants

User = get_user_model()


class GroupViewsTests(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username="alice", password="password")
        self.user2 = User.objects.create_user(username="bob", password="password")
        self.user3 = User.objects.create_user(username="charlie", password="password")
        self.user4 = User.objects.create_user(username="david", password="password")
        self.client = APIClient()
        self.client.force_authenticate(user=self.user1)

    def create_group(self, *, name="Study Group", members=None):
        group = GroupChat.objects.create(name=name)
        GroupParticipants.objects.create(
            user=self.user1,
            group=group,
            role=GroupParticipants.RoleChoices.ADMIN,
        )

        for user in members or []:
            GroupParticipants.objects.create(
                user=user,
                group=group,
                role=GroupParticipants.RoleChoices.MEMBER,
            )

        return group

    def test_list_groups_returns_only_groups_for_authenticated_user(self):
        first_group = self.create_group(name="First Group", members=[self.user2])
        second_group = self.create_group(name="Second Group", members=[self.user3])
        outsider_group = GroupChat.objects.create(name="Hidden Group")
        GroupParticipants.objects.create(
            user=self.user2,
            group=outsider_group,
            role=GroupParticipants.RoleChoices.ADMIN,
        )

        GroupMessage.objects.create(
            sender=self.user1,
            group=first_group,
            content="older message",
        )
        latest_message = GroupMessage.objects.create(
            sender=self.user3,
            group=second_group,
            content="latest message",
        )

        response = self.client.get(reverse("group-create-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 2)
        self.assertEqual(response.data["results"][0]["id"], second_group.id)
        self.assertEqual(response.data["results"][0]["last_message"], latest_message.content)
        self.assertEqual(response.data["results"][1]["id"], first_group.id)

    def test_create_group_adds_creator_as_admin(self):
        response = self.client.post(
            reverse("group-create-list"),
            {
                "name": "Project Team",
                "member_ids": [self.user2.id, self.user3.id, self.user1.id, self.user2.id],
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        group = GroupChat.objects.get(name="Project Team")
        self.assertTrue(GroupParticipants.objects.filter(
            group=group,
            user=self.user1,
            role=GroupParticipants.RoleChoices.ADMIN,
        ).exists())
        self.assertTrue(GroupParticipants.objects.filter(
            group=group,
            user=self.user2,
            role=GroupParticipants.RoleChoices.MEMBER,
        ).exists())
        self.assertTrue(GroupParticipants.objects.filter(
            group=group,
            user=self.user3,
            role=GroupParticipants.RoleChoices.MEMBER,
        ).exists())
        self.assertEqual(GroupParticipants.objects.filter(group=group).count(), 3)

    def test_create_group_rejects_unknown_members(self):
        response = self.client.post(
            reverse("group-create-list"),
            {
                "name": "Broken Group",
                "member_ids": [9999],
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("member_ids", response.data)

    def test_group_detail_requires_membership(self):
        group = self.create_group(members=[self.user2])

        self.client.force_authenticate(user=self.user4)
        response = self.client.get(
            reverse("group-retrieve-destroy", kwargs={"group_id": group.id})
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_group_admin_can_delete_group(self):
        group = self.create_group(members=[self.user2])

        response = self.client.delete(
            reverse("group-retrieve-destroy", kwargs={"group_id": group.id})
        )

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(GroupChat.objects.filter(id=group.id).exists())

    def test_non_admin_cannot_delete_group(self):
        group = self.create_group(members=[self.user2])

        self.client.force_authenticate(user=self.user2)
        response = self.client.delete(
            reverse("group-retrieve-destroy", kwargs={"group_id": group.id})
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(GroupChat.objects.filter(id=group.id).exists())

    def test_group_messages_view_lists_only_messages_from_that_group(self):
        group = self.create_group(members=[self.user2])
        other_group = self.create_group(name="Other Group", members=[self.user3])
        first_message = GroupMessage.objects.create(
            sender=self.user1,
            group=group,
            content="hello team",
        )
        second_message = GroupMessage.objects.create(
            sender=self.user2,
            group=group,
            content="hello back",
        )
        GroupMessage.objects.create(
            sender=self.user1,
            group=other_group,
            content="ignore me",
        )

        response = self.client.get(
            reverse("group-conversation-messages", kwargs={"group_id": group.id})
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 2)
        self.assertEqual(response.data["results"][0]["id"], first_message.id)
        self.assertEqual(response.data["results"][1]["id"], second_message.id)

    def test_group_messages_post_uses_authenticated_user_as_sender(self):
        group = self.create_group(members=[self.user2])

        response = self.client.post(
            reverse("group-conversation-messages", kwargs={"group_id": group.id}),
            {"content": "new group message"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(GroupMessage.objects.filter(
            sender=self.user1,
            group=group,
            content="new group message",
        ).exists())
        self.assertEqual(response.data["user"]["username"], self.user1.username)
        self.assertNotIn("sender", response.data)
        self.assertNotIn("firstName", response.data["user"])
        self.assertNotIn("lastName", response.data["user"])

    def test_sender_can_update_own_group_message(self):
        group = self.create_group(members=[self.user2])
        message = GroupMessage.objects.create(
            sender=self.user1,
            group=group,
            content="before",
        )

        response = self.client.patch(
            reverse(
                "group-message-retrieve-update-destroy",
                kwargs={"group_id": group.id, "message_id": message.id},
            ),
            {"content": "after"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        message.refresh_from_db()
        self.assertEqual(message.content, "after")

    def test_put_is_not_allowed_for_group_message_update(self):
        group = self.create_group(members=[self.user2])
        message = GroupMessage.objects.create(
            sender=self.user1,
            group=group,
            content="before",
        )

        response = self.client.put(
            reverse(
                "group-message-retrieve-update-destroy",
                kwargs={"group_id": group.id, "message_id": message.id},
            ),
            {"content": "after"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        message.refresh_from_db()
        self.assertEqual(message.content, "before")

    def test_other_member_cannot_update_group_message(self):
        group = self.create_group(members=[self.user2])
        message = GroupMessage.objects.create(
            sender=self.user1,
            group=group,
            content="before",
        )
        self.client.force_authenticate(user=self.user2)

        response = self.client.patch(
            reverse(
                "group-message-retrieve-update-destroy",
                kwargs={"group_id": group.id, "message_id": message.id},
            ),
            {"content": "after"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        message.refresh_from_db()
        self.assertEqual(message.content, "before")

    def test_sender_can_delete_own_group_message(self):
        group = self.create_group(members=[self.user2])
        message = GroupMessage.objects.create(
            sender=self.user1,
            group=group,
            content="delete me",
        )

        response = self.client.delete(
            reverse(
                "group-message-retrieve-update-destroy",
                kwargs={"group_id": group.id, "message_id": message.id},
            )
        )

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(GroupMessage.objects.filter(id=message.id).exists())

    def test_group_admin_can_delete_other_members_message(self):
        group = self.create_group(members=[self.user2])
        message = GroupMessage.objects.create(
            sender=self.user2,
            group=group,
            content="delete me",
        )

        response = self.client.delete(
            reverse(
                "group-message-retrieve-update-destroy",
                kwargs={"group_id": group.id, "message_id": message.id},
            )
        )

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(GroupMessage.objects.filter(id=message.id).exists())

    def test_non_admin_member_cannot_delete_other_members_message(self):
        group = self.create_group(members=[self.user2, self.user3])
        message = GroupMessage.objects.create(
            sender=self.user3,
            group=group,
            content="keep me",
        )
        self.client.force_authenticate(user=self.user2)

        response = self.client.delete(
            reverse(
                "group-message-retrieve-update-destroy",
                kwargs={"group_id": group.id, "message_id": message.id},
            )
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(GroupMessage.objects.filter(id=message.id).exists())

    def test_group_list_reflects_previous_message_after_latest_is_deleted(self):
        group = self.create_group(members=[self.user2])
        older_message = GroupMessage.objects.create(
            sender=self.user1,
            group=group,
            content="older",
        )
        latest_message = GroupMessage.objects.create(
            sender=self.user1,
            group=group,
            content="latest",
        )

        response = self.client.delete(
            reverse(
                "group-message-retrieve-update-destroy",
                kwargs={"group_id": group.id, "message_id": latest_message.id},
            )
        )

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        list_response = self.client.get(reverse("group-create-list"))
        self.assertEqual(list_response.status_code, status.HTTP_200_OK)
        self.assertEqual(list_response.data["results"][0]["id"], group.id)
        self.assertEqual(list_response.data["results"][0]["last_message"], older_message.content)

    def test_group_messages_require_membership(self):
        group = self.create_group(members=[self.user2])

        self.client.force_authenticate(user=self.user4)
        response = self.client.get(
            reverse("group-conversation-messages", kwargs={"group_id": group.id})
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_unauthenticated_access_is_rejected(self):
        group = self.create_group(members=[self.user2])
        self.client.force_authenticate(user=None)

        response = self.client.get(reverse("group-create-list"))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        response = self.client.get(
            reverse("group-retrieve-destroy", kwargs={"group_id": group.id})
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        response = self.client.get(
            reverse("group-conversation-messages", kwargs={"group_id": group.id})
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class GroupWebSocketTests(TransactionTestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username="alice", password="password")
        self.user2 = User.objects.create_user(username="bob", password="password")
        self.user3 = User.objects.create_user(username="charlie", password="password")
        self.group = GroupChat.objects.create(name="Realtime Group")
        GroupParticipants.objects.create(
            user=self.user1,
            group=self.group,
            role=GroupParticipants.RoleChoices.ADMIN,
        )
        GroupParticipants.objects.create(
            user=self.user2,
            group=self.group,
            role=GroupParticipants.RoleChoices.MEMBER,
        )

    def test_post_message_broadcasts_created_event_to_group_socket(self):
        client = APIClient()
        client.force_authenticate(user=self.user1)

        async def run_test():
            communicator = WebsocketCommunicator(
                application,
                f"/ws/groups/{self.group.id}/",
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
                reverse("group-conversation-messages", kwargs={"group_id": self.group.id}),
                {"content": "hello group realtime"},
                format="json",
            )

            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            payload = await communicator.receive_json_from(timeout=2)
            self.assertEqual(payload["type"], "group.message.created")
            self.assertEqual(payload["message"]["content"], "hello group realtime")
            self.assertEqual(payload["message"]["user"]["id"], self.user1.id)
            self.assertNotIn("sender", payload["message"])
            self.assertNotIn("groupId", payload["message"])

            await communicator.disconnect()

        async_to_sync(run_test)()

    def test_patch_message_broadcasts_updated_event_to_group_socket(self):
        message = GroupMessage.objects.create(
            sender=self.user1,
            group=self.group,
            content="before",
        )
        client = APIClient()
        client.force_authenticate(user=self.user1)

        async def run_test():
            communicator = WebsocketCommunicator(
                application,
                f"/ws/groups/{self.group.id}/",
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
                client.patch,
                thread_sensitive=True,
            )(
                reverse(
                    "group-message-retrieve-update-destroy",
                    kwargs={"group_id": self.group.id, "message_id": message.id},
                ),
                {"content": "after"},
                format="json",
            )

            self.assertEqual(response.status_code, status.HTTP_200_OK)
            payload = await communicator.receive_json_from(timeout=2)
            self.assertEqual(payload["type"], "group.message.updated")
            self.assertEqual(payload["message"]["id"], message.id)
            self.assertEqual(payload["message"]["content"], "after")

            await communicator.disconnect()

        async_to_sync(run_test)()

    def test_delete_message_broadcasts_deleted_event_to_group_socket(self):
        message = GroupMessage.objects.create(
            sender=self.user1,
            group=self.group,
            content="delete me",
        )
        client = APIClient()
        client.force_authenticate(user=self.user1)

        async def run_test():
            communicator = WebsocketCommunicator(
                application,
                f"/ws/groups/{self.group.id}/",
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
                reverse(
                    "group-message-retrieve-update-destroy",
                    kwargs={"group_id": self.group.id, "message_id": message.id},
                ),
            )

            self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
            payload = await communicator.receive_json_from(timeout=2)
            self.assertEqual(payload["type"], "group.message.deleted")
            self.assertEqual(payload["message"]["id"], message.id)
            self.assertEqual(list(payload["message"].keys()), ["id"])

            await communicator.disconnect()

        async_to_sync(run_test)()

    def test_group_list_socket_receives_updates_after_message_change(self):
        message = GroupMessage.objects.create(
            sender=self.user1,
            group=self.group,
            content="before",
        )
        client = APIClient()
        client.force_authenticate(user=self.user1)

        async def run_test():
            communicator = WebsocketCommunicator(
                application,
                "/ws/groups/inbox/",
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
                client.patch,
                thread_sensitive=True,
            )(
                reverse(
                    "group-message-retrieve-update-destroy",
                    kwargs={"group_id": self.group.id, "message_id": message.id},
                ),
                {"content": "after"},
                format="json",
            )

            self.assertEqual(response.status_code, status.HTTP_200_OK)
            payload = await communicator.receive_json_from(timeout=2)
            self.assertEqual(payload["type"], "group.inbox.updated")
            self.assertEqual(payload["groupItem"]["id"], self.group.id)
            self.assertEqual(payload["groupItem"]["lastMessage"], "after")

            await communicator.disconnect()

        async_to_sync(run_test)()

    def test_non_member_cannot_connect_to_group_socket(self):
        async def run_test():
            communicator = WebsocketCommunicator(
                application,
                f"/ws/groups/{self.group.id}/",
                headers=[
                    (b"origin", b"http://localhost:5173"),
                    (
                        b"cookie",
                        f"access_token={AccessToken.for_user(self.user3)}".encode("utf-8"),
                    ),
                ],
            )

            connected, _ = await communicator.connect()
            self.assertFalse(connected)

        async_to_sync(run_test)()
