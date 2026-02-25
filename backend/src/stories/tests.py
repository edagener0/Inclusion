from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from stories.models import Story
from django.core.files.uploadedfile import SimpleUploadedFile
from django.utils import timezone
from datetime import timedelta
from content.models import UserLikesContent

User = get_user_model()

def create_test_file():
    return SimpleUploadedFile(
        "test.jpg",
        b"file_content",
        content_type="image/jpeg"
    )

class StoriesAPITest(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="user1",
            email="user1@test.com",
            password="pass1234"
        )
        self.other_user = User.objects.create_user(
            username="user2",
            email="user2@test.com",
            password="pass1234"
        )
        self.list_url = reverse("story-create-list")

    def test_list_requires_authentication(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_stories_authenticated(self):
        self.client.force_authenticate(self.user)
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_story(self):
        self.client.force_authenticate(self.user)
        data = {"file": create_test_file()}
        response = self.client.post(self.list_url, data, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Story.objects.count(), 1)
        self.assertEqual(Story.objects.first().user, self.user)

    def test_retrieve_story(self):
        story = Story.objects.create(
            user=self.user,
            file=create_test_file()
        )
        self.client.force_authenticate(self.user)
        url = reverse("story-retrieve-destroy", args=[story.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_owner_can_delete_story(self):
        story = Story.objects.create(
            user=self.user,
            file=create_test_file()
        )
        self.client.force_authenticate(self.user)
        url = reverse("story-retrieve-destroy", args=[story.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_non_owner_cannot_delete_story(self):
        story = Story.objects.create(
            user=self.user,
            file=create_test_file()
        )
        self.client.force_authenticate(self.other_user)
        url = reverse("story-retrieve-destroy", args=[story.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_list_only_stories_last_24h(self):
        self.client.force_authenticate(self.user)
        recent_story = Story.objects.create(
            user=self.user,
            file=create_test_file()
        )
        old_story = Story.objects.create(
            user=self.user,
            file=create_test_file()
        )
        Story.objects.filter(pk=old_story.pk).update(
            created_at=timezone.now() - timedelta(days=2)
        )
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        story_ids = [s["id"] for s in response.data["results"]]
        self.assertIn(recent_story.id, story_ids)
        self.assertNotIn(old_story.id, story_ids)

    def test_create_story_is_listed_in_last_24h(self):
        self.client.force_authenticate(self.user)
        data = {"file": create_test_file()}
        self.client.post(self.list_url, data, format="multipart")
        response = self.client.get(self.list_url)
        story_contents = [s["id"] for s in response.data["results"]]
        self.assertTrue(len(story_contents) >= 1)

class StoryLikeViewTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="user1",
            email="user1@test.com",
            password="pass1234"
        )
        self.other_user = User.objects.create_user(
            username="user2",
            email="user2@test.com",
            password="pass1234"
        )
        self.story = Story.objects.create(
            user=self.user,
            file=create_test_file()
        )
        self.like_url = reverse("story-like", kwargs={"story_id": self.story.id})
    
    def test_like_story_authenticated(self):
        self.client.force_authenticate(self.other_user)
        response = self.client.post(self.like_url)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data["liked"])
        self.assertEqual(response.data["detail"], "Liked Successfully!")
        self.assertTrue(
            UserLikesContent.objects.filter(
                user=self.other_user,
                content=self.story
            ).exists()
        )

    def test_like_story_twice(self):
        self.client.force_authenticate(self.other_user)
        self.client.post(self.like_url)  
        response = self.client.post(self.like_url)  

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["liked"])
        self.assertEqual(response.data["detail"], "You've already liked the content")
        self.assertEqual(
            UserLikesContent.objects.filter(
                user=self.other_user,
                content=self.story
            ).count(),
            1
        )

    def test_like_story_unauthenticated(self):
        response = self.client.post(self.like_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unlike_story_authenticated(self):
        UserLikesContent.objects.create(user=self.other_user, content=self.story)
        self.client.force_authenticate(self.other_user)
        response = self.client.delete(self.like_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data["liked"])
        self.assertEqual(response.data["detail"], "Unliked successfully")
        self.assertFalse(
            UserLikesContent.objects.filter(
                user=self.other_user,
                content=self.story
            ).exists()
        )

    def test_unlike_story_not_liked(self):
        self.client.force_authenticate(self.other_user)
        response = self.client.delete(self.like_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data["liked"])
        self.assertEqual(response.data["detail"], "You had not liked this content")

    def test_unlike_story_unauthenticated(self):
        response = self.client.delete(self.like_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)