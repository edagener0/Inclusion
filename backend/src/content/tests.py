

from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

from .models import (  
    Content,
    ShortFormContent,
    LongFormContent,
    UserLikesContent,
)

User = get_user_model()


class LikeContentViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="password123",
            first_name="Test",
            last_name="User",
        )
        self.client.force_authenticate(user=self.user)

        
        self.content = Content.objects.create(user=self.user)
        self.short_content = ShortFormContent.objects.create(user=self.user)
        self.long_content = LongFormContent.objects.create(user=self.user)

        
        self.content_url = reverse(
            "like-content",
            kwargs={"content_id": self.content.id},
        )
        self.short_url = reverse(
            "like-content",
            kwargs={"content_id": self.short_content.id},
        )
        self.long_url = reverse(
            "like-content",
            kwargs={"content_id": self.long_content.id},
        )

    def test_like_content_first_time_creates_like(self):
        response = self.client.post(self.content_url)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["detail"], "Liked Successfully!")
        self.assertTrue(response.data["liked"])

        self.assertTrue(
            UserLikesContent.objects.filter(
                user=self.user,
                content=self.content,
            ).exists()
        )

    def test_like_content_second_time_returns_200_and_no_duplicate(self):
        
        self.client.post(self.content_url)

        
        response = self.client.post(self.content_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["detail"],
            "You've already liked the content",
        )
        self.assertTrue(response.data["liked"])

        
        self.assertEqual(
            UserLikesContent.objects.filter(
                user=self.user,
                content=self.content,
            ).count(),
            1,
        )

    def test_delete_when_liked_deletes_and_returns_unliked(self):
        
        UserLikesContent.objects.create(user=self.user, content=self.content)

        response = self.client.delete(self.content_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["detail"], "Unliked successfully")
        self.assertFalse(response.data["liked"])

        self.assertFalse(
            UserLikesContent.objects.filter(
                user=self.user,
                content=self.content,
            ).exists()
        )

    def test_delete_when_not_liked_is_idempotent(self):
        
        response = self.client.delete(self.content_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["detail"],
            "You had not liked this content",
        )
        self.assertFalse(response.data["liked"])

        self.assertFalse(
            UserLikesContent.objects.filter(
                user=self.user,
                content=self.content,
            ).exists()
        )

    def test_unauthenticated_user_cannot_like(self):
        self.client.force_authenticate(user=None)

        response = self.client.post(self.content_url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unauthenticated_user_cannot_unlike(self):
        self.client.force_authenticate(user=None)

        response = self.client.delete(self.content_url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_like_shortform_and_longform_content(self):
        
        response_short = self.client.post(self.short_url)
        self.assertEqual(response_short.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            UserLikesContent.objects.filter(
                user=self.user,
                content=self.short_content,
            ).exists()
        )

        
        response_long = self.client.post(self.long_url)
        self.assertEqual(response_long.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            UserLikesContent.objects.filter(
                user=self.user,
                content=self.long_content,
            ).exists()
        )

    def test_delete_shortform_and_longform_likes(self):
        
        UserLikesContent.objects.create(user=self.user, content=self.short_content)
        UserLikesContent.objects.create(user=self.user, content=self.long_content)

        response_short = self.client.delete(self.short_url)
        self.assertEqual(response_short.status_code, status.HTTP_200_OK)
        self.assertFalse(
            UserLikesContent.objects.filter(
                user=self.user,
                content=self.short_content,
            ).exists()
        )

        response_long = self.client.delete(self.long_url)
        self.assertEqual(response_long.status_code, status.HTTP_200_OK)
        self.assertFalse(
            UserLikesContent.objects.filter(
                user=self.user,
                content=self.long_content,
            ).exists()
        )
