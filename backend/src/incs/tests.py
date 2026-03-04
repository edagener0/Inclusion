from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from django.urls import reverse
from content.models import UserLikesContent
from comments.models import Comment
from .models import Inc
from friends.models import Friend
from django.utils import timezone
from datetime import timedelta

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


class IncVisibilityAPITests(APITestCase):

    def setUp(self):
        self.client = APIClient()

        
        self.user = User.objects.create_user(username="user1", password="pass")
        self.friend = User.objects.create_user(username="friend", password="pass")
        self.non_friend = User.objects.create_user(username="nonfriend", password="pass")

        
        self.user.is_private = True
        self.user.save()

        
        Friend.objects.create(
            user1=min(self.user, self.friend, key=lambda u: u.id),
            user2=max(self.user, self.friend, key=lambda u: u.id)
        )

        
        self.inc_recent = Inc.objects.create(user=self.user, content="Recent Inc")
        self.inc_old = Inc.objects.create(user=self.user, content="Old Inc")
        self.inc_old.created_at = timezone.now() - timedelta(days=2)
        self.inc_old.save()

        self.list_url = reverse("inc-create-list")
        self.detail_url = lambda inc_id: reverse("inc-retrieve-destroy", args=[inc_id])
        self.like_url = lambda inc_id: reverse("inc-like", kwargs={"inc_id": inc_id})
        self.comment_url = lambda inc_id: reverse("inc-comments-create-list", kwargs={"inc_id": inc_id})

    def authenticate(self, user):
        self.client.force_authenticate(user=user)

    def test_non_friend_cannot_view_private_inc(self):
        self.authenticate(self.non_friend)
        response = self.client.get(self.detail_url(self.inc_recent.id))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_friend_can_view_private_inc(self):
        self.authenticate(self.friend)
        response = self.client.get(self.detail_url(self.inc_recent.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_owner_can_view_own_private_inc(self):
        self.authenticate(self.user)
        response = self.client.get(self.detail_url(self.inc_recent.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_non_friend_cannot_list_private_incs(self):
        self.authenticate(self.non_friend)
        response = self.client.get(self.list_url)
        self.assertEqual(response.data["results"], [])

    def test_friend_can_list_private_incs(self):
        self.authenticate(self.friend)
        response = self.client.get(self.list_url)
        inc_ids = [i["id"] for i in response.data["results"]]
        self.assertIn(self.inc_recent.id, inc_ids)
        self.assertIn(self.inc_old.id, inc_ids)

    def test_non_friend_cannot_like_private_inc(self):
        self.authenticate(self.non_friend)
        response = self.client.post(self.like_url(self.inc_recent.id))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_friend_can_like_private_inc(self):
        self.authenticate(self.friend)
        response = self.client.post(self.like_url(self.inc_recent.id))
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(UserLikesContent.objects.filter(user=self.friend, content=self.inc_recent).exists())

    def test_owner_can_like_own_private_inc(self):
        self.authenticate(self.user)
        response = self.client.post(self.like_url(self.inc_recent.id))
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(UserLikesContent.objects.filter(user=self.user, content=self.inc_recent).exists())

    def test_unlike_inc_friend(self):
        UserLikesContent.objects.create(user=self.friend, content=self.inc_recent)
        self.authenticate(self.friend)
        response = self.client.delete(self.like_url(self.inc_recent.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(UserLikesContent.objects.filter(user=self.friend, content=self.inc_recent).exists())

    def test_unlike_inc_non_friend_forbidden(self):
        UserLikesContent.objects.create(user=self.non_friend, content=self.inc_recent)
        self.authenticate(self.non_friend)
        response = self.client.delete(self.like_url(self.inc_recent.id))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_non_friend_cannot_comment_private_inc(self):
        self.authenticate(self.non_friend)
        response = self.client.post(self.comment_url(self.inc_recent.id), {"commentary": "Hi"})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_friend_can_comment_private_inc(self):
        self.authenticate(self.friend)
        response = self.client.post(self.comment_url(self.inc_recent.id), {"commentary": "Nice!"})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Comment.objects.filter(user=self.friend, lf_content=self.inc_recent).exists())

    def test_owner_can_comment_private_inc(self):
        self.authenticate(self.user)
        response = self.client.post(self.comment_url(self.inc_recent.id), {"commentary": "Owner comment"})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Comment.objects.filter(user=self.user, lf_content=self.inc_recent).exists())

    def test_comments_include_like_metadata(self):
        comment = Comment.objects.create(user=self.user, lf_content=self.inc_recent, commentary="Hello")
        UserLikesContent.objects.create(user=self.friend, content=comment)
        self.authenticate(self.friend)
        response = self.client.get(self.comment_url(self.inc_recent.id))
        comment_data = next(c for c in response.data["results"] if c["id"] == comment.id)
        self.assertEqual(comment_data["likes_count"], 1)
        self.assertTrue(comment_data["is_liked"])

    def test_non_friend_can_view_public_inc(self):
        self.user.is_private = False
        self.user.save()
        self.authenticate(self.non_friend)
        response = self.client.get(self.detail_url(self.inc_recent.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_non_friend_can_like_public_inc(self):
        self.user.is_private = False
        self.user.save()
        self.authenticate(self.non_friend)
        response = self.client.post(self.like_url(self.inc_recent.id))
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)