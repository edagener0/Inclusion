from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
from django.contrib.auth import get_user_model
from content.models import LongFormContent, UserLikesContent
from comments.models import Comment

User = get_user_model()

class CommentRetrieveDestroyTests(APITestCase):

    def setUp(self):
        self.client = APIClient()
        
        self.user1 = User.objects.create_user(username="user1", password="pass")
        self.user2 = User.objects.create_user(username="user2", password="pass")
        
        self.lf_content = LongFormContent.objects.create(user=self.user1)
        
        self.comment = Comment.objects.create(user=self.user1, lf_content=self.lf_content, commentary="Test comment")
        self.url = reverse("comment-retrieve-destroy", kwargs={"comment_id": self.comment.id})

    def authenticate(self, user=None):
        self.client.force_authenticate(user=user or self.user1)

    def test_retrieve_comment_owner(self):
        self.authenticate()
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["commentary"], "Test comment")

    def test_retrieve_comment_other_user(self):
        self.authenticate(self.user2)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["commentary"], "Test comment")

    def test_retrieve_comment_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_comment_owner(self):
        self.authenticate()
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Comment.objects.filter(id=self.comment.id).exists())

    def test_delete_comment_other_user(self):
        self.authenticate(self.user2)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(Comment.objects.filter(id=self.comment.id).exists())

    def test_delete_comment_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class CommentLikeViewTests(APITestCase):

    def setUp(self):
        self.client = APIClient()
        
        self.user1 = User.objects.create_user(username="user1", password="pass")
        self.user2 = User.objects.create_user(username="user2", password="pass")
        
        self.lf_content = LongFormContent.objects.create(user=self.user1)
        self.comment = Comment.objects.create(user=self.user1, lf_content=self.lf_content, commentary="Comment to like")
        self.like_url = reverse("comment-like", kwargs={"comment_id": self.comment.id})

    def authenticate(self, user=None):
        self.client.force_authenticate(user=user or self.user1)

    def test_like_comment_authenticated(self):
        self.authenticate(self.user2)
        response = self.client.post(self.like_url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data["liked"])
        self.assertEqual(response.data["detail"], "Liked Successfully!")
        self.assertTrue(UserLikesContent.objects.filter(user=self.user2, content=self.comment).exists())

    def test_like_comment_twice(self):
        self.authenticate(self.user2)
        self.client.post(self.like_url)
        response = self.client.post(self.like_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["liked"])
        self.assertEqual(response.data["detail"], "You've already liked the content")
        self.assertEqual(UserLikesContent.objects.filter(user=self.user2, content=self.comment).count(), 1)

    def test_like_comment_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.post(self.like_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unlike_comment_success(self):
        UserLikesContent.objects.create(user=self.user2, content=self.comment)
        self.authenticate(self.user2)
        response = self.client.delete(self.like_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data["liked"])
        self.assertEqual(response.data["detail"], "Unliked successfully")
        self.assertFalse(UserLikesContent.objects.filter(user=self.user2, content=self.comment).exists())

    def test_unlike_comment_not_liked(self):
        self.authenticate(self.user2)
        response = self.client.delete(self.like_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data["liked"])
        self.assertEqual(response.data["detail"], "You had not liked this content")

    def test_unlike_comment_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.delete(self.like_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)