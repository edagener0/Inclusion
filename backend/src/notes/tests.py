from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth import get_user_model
from notes.models import Note
from content.models import UserLikesContent
from friends.models import Friend

User = get_user_model()


class NoteAPITests(APITestCase):

    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(username="user1", password="pass")
        self.user2 = User.objects.create_user(username="user2", password="pass")
        Friend.objects.create(
            user1=min(self.user1, self.user2, key=lambda u: u.id),
            user2=max(self.user1, self.user2, key=lambda u: u.id),
        )

        
        self.note1 = Note.objects.create(user=self.user1, content="Recent note 1")
        self.note2 = Note.objects.create(user=self.user1, content="Recent note 2")
        self.old_note = Note.objects.create(user=self.user1, content="Old note")
        self.old_note.created_at = timezone.now() - timedelta(days=2)
        self.old_note.save()

        self.list_url = reverse("note-create-list")
        self.detail_url = lambda note_id: reverse("note-retrieve-destroy", kwargs={"note_id": note_id})
        self.like_url = lambda note_id: reverse("note-like", kwargs={"note_id": note_id})

    def authenticate(self, user):
        self.client.force_authenticate(user=user)

    def test_list_notes_pagination_and_annotations(self):
        UserLikesContent.objects.create(user=self.user2, content=self.note1)
        self.authenticate(self.user2)
        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("results", response.data)

        results = response.data["results"]
        self.assertEqual(len(results), 2)  

        
        note1_data = next(n for n in results if n["id"] == self.note1.id)
        note2_data = next(n for n in results if n["id"] == self.note2.id)

        self.assertEqual(note1_data["likes_count"], 1)
        self.assertTrue(note1_data["is_liked"])

        self.assertEqual(note2_data["likes_count"], 0)
        self.assertFalse(note2_data["is_liked"])

    def test_retrieve_note_annotations(self):
        UserLikesContent.objects.create(user=self.user2, content=self.note2)
        self.authenticate(self.user2)
        response = self.client.get(self.detail_url(self.note2.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["likes_count"], 1)
        self.assertTrue(response.data["is_liked"])

    def test_create_note_authenticated_and_listed(self):
        self.authenticate(self.user1)
        response = self.client.post(self.list_url, {"content": "New note"})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        note_id = response.data["id"]

        
        response = self.client.get(self.list_url)
        note_ids = [n["id"] for n in response.data["results"]]
        self.assertIn(note_id, note_ids)

    def test_create_note_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.post(self.list_url, {"content": "New note"})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_note_owner(self):
        self.authenticate(self.user1)
        response = self.client.delete(self.detail_url(self.note1.id))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Note.objects.filter(id=self.note1.id).exists())

    def test_delete_note_not_owner(self):
        self.authenticate(self.user2)
        response = self.client.delete(self.detail_url(self.note1.id))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(Note.objects.filter(id=self.note1.id).exists())

    def test_delete_note_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.delete(self.detail_url(self.note1.id))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_like_note(self):
        self.authenticate(self.user2)
        response = self.client.post(self.like_url(self.note1.id))
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data["liked"])

        
        response = self.client.get(self.detail_url(self.note1.id))
        self.assertEqual(response.data["likes_count"], 1)
        self.assertTrue(response.data["is_liked"])

    def test_like_note_twice(self):
        self.authenticate(self.user2)
        self.client.post(self.like_url(self.note1.id))
        response = self.client.post(self.like_url(self.note1.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(UserLikesContent.objects.filter(user=self.user2, content=self.note1).count(), 1)

    def test_unlike_note(self):
        UserLikesContent.objects.create(user=self.user2, content=self.note2)
        self.authenticate(self.user2)
        response = self.client.delete(self.like_url(self.note2.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data["liked"])

    def test_unlike_note_not_liked(self):
        self.authenticate(self.user2)
        response = self.client.delete(self.like_url(self.note2.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data["liked"])

    def test_like_unlike_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.post(self.like_url(self.note1.id))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response = self.client.delete(self.like_url(self.note1.id))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_old_note_not_listed(self):
        self.authenticate(self.user1)
        response = self.client.get(self.list_url)
        note_ids = [n["id"] for n in response.data["results"]]
        self.assertNotIn(self.old_note.id, note_ids)

    def test_ordering_by_likes_count(self):
        
        UserLikesContent.objects.create(user=self.user2, content=self.note1)
        UserLikesContent.objects.create(user=self.user1, content=self.note2)

        self.authenticate(self.user1)
        response = self.client.get(self.list_url)
        results = response.data["results"]
        self.assertGreaterEqual(results[0]["likes_count"], results[1]["likes_count"])


class NoteVisibilityAPITests(APITestCase):

    def setUp(self):
        self.client = APIClient()

        
        self.user = User.objects.create_user(username="user1", password="pass")
        self.friend = User.objects.create_user(username="friend", password="pass")
        self.non_friend = User.objects.create_user(username="nonfriend", password="pass")

        
        self.user.is_private = True
        self.user.save()

        
        Friend.objects.create(user1=min(self.user, self.friend, key=lambda u: u.id),
                              user2=max(self.user, self.friend, key=lambda u: u.id))

        
        self.recent_note1 = Note.objects.create(user=self.user, content="Recent Note 1")
        self.recent_note2 = Note.objects.create(user=self.user, content="Recent Note 2")
        self.old_note = Note.objects.create(user=self.user, content="Old Note")
        self.old_note.created_at = timezone.now() - timedelta(days=2)
        self.old_note.save()

        self.list_url = reverse("note-create-list")
        self.detail_url = lambda note_id: reverse("note-retrieve-destroy", kwargs={"note_id": note_id})
        self.like_url = lambda note_id: reverse("note-like", kwargs={"note_id": note_id})

    def authenticate(self, user):
        self.client.force_authenticate(user=user)

    def make_user_public(self):
        self.user.is_private = False
        self.user.save()
    
    def test_non_friend_cannot_view_private_note(self):
        self.authenticate(self.non_friend)
        url = self.detail_url(self.recent_note1.id)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_friend_can_view_private_note(self):
        self.authenticate(self.friend)
        url = self.detail_url(self.recent_note1.id)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], self.recent_note1.id)

    def test_owner_can_view_own_private_note(self):
        self.authenticate(self.user)
        url = self.detail_url(self.recent_note1.id)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_list_notes_only_last_24h_for_owner_and_friend(self):
        self.authenticate(self.friend)
        response = self.client.get(self.list_url)
        note_ids = [n["id"] for n in response.data["results"]]
        self.assertIn(self.recent_note1.id, note_ids)
        self.assertIn(self.recent_note2.id, note_ids)
        self.assertNotIn(self.old_note.id, note_ids)

    def test_non_friend_cannot_list_private_notes(self):
        self.authenticate(self.non_friend)
        response = self.client.get(self.list_url)
        self.assertEqual(response.data["results"], [])

    def test_non_friend_cannot_list_notes_even_if_author_is_public(self):
        self.make_user_public()
        self.authenticate(self.non_friend)
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["results"], [])

    def test_non_friend_cannot_like_private_note(self):
        self.authenticate(self.non_friend)
        response = self.client.post(self.like_url(self.recent_note1.id))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_friend_can_like_private_note(self):
        self.authenticate(self.friend)
        response = self.client.post(self.like_url(self.recent_note1.id))
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(UserLikesContent.objects.filter(user=self.friend, content=self.recent_note1).exists())

    def test_owner_can_like_own_private_note(self):
        self.authenticate(self.user)
        response = self.client.post(self.like_url(self.recent_note1.id))
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(UserLikesContent.objects.filter(user=self.user, content=self.recent_note1).exists())

    def test_unlike_note_friend(self):
        UserLikesContent.objects.create(user=self.friend, content=self.recent_note1)
        self.authenticate(self.friend)
        response = self.client.delete(self.like_url(self.recent_note1.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(UserLikesContent.objects.filter(user=self.friend, content=self.recent_note1).exists())

    def test_unlike_note_non_friend_forbidden(self):
        UserLikesContent.objects.create(user=self.non_friend, content=self.recent_note1)
        self.authenticate(self.non_friend)
        response = self.client.delete(self.like_url(self.recent_note1.id))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_non_friend_cannot_view_note_even_if_author_is_public(self):
        self.make_user_public()
        self.authenticate(self.non_friend)
        response = self.client.get(self.detail_url(self.recent_note1.id))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_non_friend_cannot_like_note_even_if_author_is_public(self):
        self.make_user_public()
        self.authenticate(self.non_friend)
        response = self.client.post(self.like_url(self.recent_note1.id))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_non_friend_cannot_unlike_note_even_if_author_is_public(self):
        self.make_user_public()
        UserLikesContent.objects.create(user=self.non_friend, content=self.recent_note1)
        self.authenticate(self.non_friend)
        response = self.client.delete(self.like_url(self.recent_note1.id))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_friend_can_view_note_when_author_is_public(self):
        self.make_user_public()
        self.authenticate(self.friend)
        response = self.client.get(self.detail_url(self.recent_note1.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], self.recent_note1.id)

    def test_friend_can_list_notes_when_author_is_public(self):
        self.make_user_public()
        self.authenticate(self.friend)
        response = self.client.get(self.list_url)
        note_ids = [n["id"] for n in response.data["results"]]
        self.assertIn(self.recent_note1.id, note_ids)
        self.assertIn(self.recent_note2.id, note_ids)

    def test_create_note_authenticated(self):
        self.authenticate(self.user)
        response = self.client.post(self.list_url, {"content": "New note"})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_note_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.post(self.list_url, {"content": "New note"})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_note_owner(self):
        self.authenticate(self.user)
        response = self.client.delete(self.detail_url(self.recent_note1.id))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_delete_note_not_owner(self):
        self.authenticate(self.friend)
        response = self.client.delete(self.detail_url(self.recent_note1.id))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
