from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
from django.contrib.auth import get_user_model
from stories.models import Story
from django.core.files.uploadedfile import SimpleUploadedFile
from django.utils import timezone
from datetime import timedelta
from content.models import UserLikesContent

User = get_user_model()

def test_file():
    return SimpleUploadedFile("test.jpg", b"file_content", content_type="image/jpeg")

class StoryAPITests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="user1", password="pass123")
        self.other_user = User.objects.create_user(username="user2", password="pass123")
        self.list_url = reverse("story-create-list")

    def authenticate(self, user=None):
        self.client.force_authenticate(user=user or self.user)

    def test_create_story_authenticated(self):
        self.authenticate()
        response = self.client.post(self.list_url, {"file": test_file()}, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Story.objects.count(), 1)
        self.assertEqual(Story.objects.first().user, self.user)

    def test_list_stories_authenticated(self):
        self.authenticate()
        Story.objects.create(user=self.user, file=test_file())
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)

    def test_list_stories_only_last_24h(self):
        self.authenticate()
        recent = Story.objects.create(user=self.user, file=test_file())
        old = Story.objects.create(user=self.user, file=test_file())
        Story.objects.filter(pk=old.pk).update(created_at=timezone.now()-timedelta(days=2))
        response = self.client.get(self.list_url)
        ids = [s["id"] for s in response.data["results"]]
        self.assertIn(recent.id, ids)
        self.assertNotIn(old.id, ids)

    def test_retrieve_story_authenticated(self):
        story = Story.objects.create(user=self.user, file=test_file())
        self.authenticate()
        url = reverse("story-retrieve-destroy", args=[story.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], story.id)

    def test_delete_story_owner(self):
        story = Story.objects.create(user=self.user, file=test_file())
        self.authenticate()
        url = reverse("story-retrieve-destroy", args=[story.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Story.objects.filter(id=story.id).exists())

    def test_delete_story_non_owner(self):
        story = Story.objects.create(user=self.user, file=test_file())
        self.authenticate(self.other_user)
        url = reverse("story-retrieve-destroy", args=[story.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(Story.objects.filter(id=story.id).exists())

    def test_story_includes_likes_metadata(self):
        story = Story.objects.create(user=self.user, file=test_file())
        UserLikesContent.objects.create(user=self.other_user, content=story)
        self.authenticate(self.other_user)
        url = reverse("story-retrieve-destroy", args=[story.id])
        response = self.client.get(url)
        self.assertEqual(response.data["likes_count"], 1)
        self.assertTrue(response.data["is_liked"])

class StoryLikeTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="user1", password="pass123")
        self.other_user = User.objects.create_user(username="user2", password="pass123")
        self.story = Story.objects.create(user=self.user, file=test_file())
        self.like_url = reverse("story-like", kwargs={"story_id": self.story.id})
        self.client = APIClient()

    def authenticate(self, user):
        self.client.force_authenticate(user=user)

    def test_like_story_authenticated(self):
        self.authenticate(self.other_user)
        response = self.client.post(self.like_url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data["liked"])
        self.assertTrue(UserLikesContent.objects.filter(user=self.other_user, content=self.story).exists())

    def test_like_story_twice(self):
        self.authenticate(self.other_user)
        self.client.post(self.like_url)
        response = self.client.post(self.like_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(UserLikesContent.objects.filter(user=self.other_user, content=self.story).count(), 1)

    def test_like_story_unauthenticated(self):
        response = self.client.post(self.like_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unlike_story_authenticated(self):
        UserLikesContent.objects.create(user=self.other_user, content=self.story)
        self.authenticate(self.other_user)
        response = self.client.delete(self.like_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data["liked"])
        self.assertFalse(UserLikesContent.objects.filter(user=self.other_user, content=self.story).exists())

    def test_unlike_story_not_liked(self):
        self.authenticate(self.other_user)
        response = self.client.delete(self.like_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data["liked"])

    def test_unlike_story_unauthenticated(self):
        response = self.client.delete(self.like_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)