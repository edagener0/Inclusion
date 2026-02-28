from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from django.urls import reverse
from content.models import UserLikesContent
from comments.models import Comment
from .models import Inc

User = get_user_model()


class IncListViewTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(username="user1", password="pass")
        self.user2 = User.objects.create_user(username="user2", password="pass")

        self.inc1 = Inc.objects.create(user=self.user1, content="Inc 1")
        self.inc2 = Inc.objects.create(user=self.user1, content="Inc 2")

        self.url = reverse("inc-create-list")

    def authenticate(self, user):
        self.client.force_authenticate(user=user)

    def test_list_incs_includes_like_metadata(self):
        UserLikesContent.objects.create(user=self.user2, content=self.inc1)

        self.authenticate(self.user2)
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Because it's paginated
        results = response.data["results"]

        inc1_data = next(i for i in results if i["id"] == self.inc1.id)
        inc2_data = next(i for i in results if i["id"] == self.inc2.id)

        self.assertEqual(inc1_data["likes_count"], 1)
        self.assertTrue(inc1_data["is_liked"])

        self.assertEqual(inc2_data["likes_count"], 0)
        self.assertFalse(inc2_data["is_liked"])

class IncLikeViewTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(username="user1", password="pass")
        self.user2 = User.objects.create_user(username="user2", password="pass")

        self.inc = Inc.objects.create(user=self.user1, content="Test content")
        self.like_url = reverse("inc-like", args=[self.inc.pk])
        self.detail_url = reverse("inc-retrieve-destroy", args=[self.inc.pk])

    def test_like_updates_metadata(self):
        self.client.force_authenticate(user=self.user2)
        self.client.post(self.like_url)

        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["likes_count"], 1)
        self.assertTrue(response.data["is_liked"])

class IncCommentsAPITests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(username="user1", password="pass")
        self.user2 = User.objects.create_user(username="user2", password="pass")
        self.inc = Inc.objects.create(user=self.user1, content="Test Inc Content")
        self.url = reverse("inc-comments-create-list", kwargs={"inc_id": self.inc.pk})

    def authenticate(self, user):
        self.client.force_authenticate(user=user)

    def test_comment_list_includes_like_metadata_paginated(self):
        comment1 = Comment.objects.create(user=self.user1, lf_content=self.inc, commentary="First")
        comment2 = Comment.objects.create(user=self.user1, lf_content=self.inc, commentary="Second")
        UserLikesContent.objects.create(user=self.user2, content=comment2)

        self.authenticate(self.user2)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        results = response.data["results"]

        c1_data = next(c for c in results if c["id"] == comment1.id)
        c2_data = next(c for c in results if c["id"] == comment2.id)

        self.assertEqual(c1_data["likes_count"], 0)
        self.assertFalse(c1_data["is_liked"])

        self.assertEqual(c2_data["likes_count"], 1)
        self.assertTrue(c2_data["is_liked"])