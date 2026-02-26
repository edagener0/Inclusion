from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from django.urls import reverse
from .models import Inc
from content.models import UserLikesContent
from comments.models import Comment

User = get_user_model()

class IncViewTests(APITestCase):
    
    def setUp(self):
        self.client = APIClient()
        self.url_list_create = reverse("inc-create-list")
        self.url_detail_template = "inc-retrieve-destroy"
        
        self.user1 = User.objects.create_user(
            username="user1", 
            email="user1@test.com", 
            password="testpass123"
        )
        
        self.user2 = User.objects.create_user(
            username="user2", 
            email="user2@test.com", 
            password="testpass123"
        )
        
        self.inc_data = {"content": "Test content"}
        self.inc = Inc.objects.create(
            user=self.user1, 
            content="Test content"
        )
        self.inc_pk = self.inc.pk
        self.url_detail = reverse(self.url_detail_template, args=[self.inc_pk])
        self.url_delete = reverse("inc-retrieve-destroy", args=[self.inc_pk])

    def test_list_incs_authenticated_user(self):
        self.client.force_authenticate(user=self.user1)
        response = self.client.get(self.url_list_create)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_list_incs_unauthenticated_user(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.url_list_create)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_inc_authenticated_user(self):
        self.client.force_authenticate(user=self.user1)
        response = self.client.post(self.url_list_create, self.inc_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["content"], "Test content")
        self.assertEqual(Inc.objects.count(), 2)
        inc = Inc.objects.get(id=response.data["id"])
        self.assertEqual(inc.user, self.user1)

    def test_create_inc_unauthenticated_user(self):
        self.client.force_authenticate(user=None)
        response = self.client.post(self.url_list_create, self.inc_data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_retrieve_inc_owner(self):
        self.client.force_authenticate(user=self.user1)
        response = self.client.get(self.url_detail)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["content"], "Test content")

    def test_retrieve_inc_other_user(self):
        self.client.force_authenticate(user=self.user2)
        response = self.client.get(self.url_detail)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_inc_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.url_detail)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_destroy_inc_owner(self):
        self.client.force_authenticate(user=self.user1)
        response = self.client.delete(self.url_delete)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Inc.objects.filter(pk=self.inc_pk).exists())

    def test_destroy_inc_other_user(self):
        self.client.force_authenticate(user=self.user2)
        response = self.client.delete(self.url_delete)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(Inc.objects.filter(pk=self.inc_pk).exists())

    def test_destroy_inc_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.delete(self.url_delete)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_inc_invalid_data(self):
        self.client.force_authenticate(user=self.user1)
        invalid_data = {"content": ""}
        response = self.client.post(self.url_list_create, invalid_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("content", response.data)

class IsOwnerOrReadOnlyPermissionTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(
            username="owner", 
            email="owner@test.com",
            password="pass"
        )
        self.user2 = User.objects.create_user(
            username="other", 
            email="other@test.com",
            password="pass"
        )
        self.inc = Inc.objects.create(
            user=self.user1,
            content="Protected content"
        )
        self.url = reverse("inc-retrieve-destroy", args=[self.inc.pk])
    
    def test_owner_can_delete(self):
        self.client.force_authenticate(user=self.user1)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
    
    def test_other_user_cannot_delete(self):
        self.client.force_authenticate(user=self.user2)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_cannot_delete(self):
        self.client.force_authenticate(user=None)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

class IncLikeViewTests(APITestCase):

    def setUp(self):
        self.client = APIClient()

        self.user1 = User.objects.create_user(
            username="user1",
            email="user1@test.com",
            password="testpass123"
        )

        self.user2 = User.objects.create_user(
            username="user2",
            email="user2@test.com",
            password="testpass123"
        )

        self.inc = Inc.objects.create(
            user=self.user1,
            content="Test content"
        )

        self.like_url = reverse("inc-like", args=[self.inc.pk])


    def test_like_content_authenticated(self):
        self.client.force_authenticate(user=self.user2)

        response = self.client.post(self.like_url)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data["liked"])
        self.assertEqual(response.data["detail"], "Liked Successfully!")

        self.assertTrue(
            UserLikesContent.objects.filter(
                user=self.user2,
                content=self.inc
            ).exists()
        )

    def test_like_content_twice(self):
        self.client.force_authenticate(user=self.user2)

        self.client.post(self.like_url)

        response = self.client.post(self.like_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["liked"])
        self.assertEqual(
            response.data["detail"],
            "You've already liked the content"
        )

        self.assertEqual(
            UserLikesContent.objects.filter(
                user=self.user2,
                content=self.inc
            ).count(),
            1
        )

    def test_like_content_unauthenticated(self):
        self.client.force_authenticate(user=None)

        response = self.client.post(self.like_url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


    def test_unlike_content_success(self):
        UserLikesContent.objects.create(
            user=self.user2,
            content=self.inc
        )

        self.client.force_authenticate(user=self.user2)

        response = self.client.delete(self.like_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data["liked"])
        self.assertEqual(response.data["detail"], "Unliked successfully")

        self.assertFalse(
            UserLikesContent.objects.filter(
                user=self.user2,
                content=self.inc
            ).exists()
        )

    def test_unlike_content_not_liked(self):
        self.client.force_authenticate(user=self.user2)

        response = self.client.delete(self.like_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data["liked"])
        self.assertEqual(
            response.data["detail"],
            "You had not liked this content"
        )

    def test_unlike_content_unauthenticated(self):
        self.client.force_authenticate(user=None)

        response = self.client.delete(self.like_url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

class IncCommentsAPITests(APITestCase):

    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(username="user1", password="pass")
        self.user2 = User.objects.create_user(username="user2", password="pass")
        self.inc = Inc.objects.create(user=self.user1, content="Test Inc Content")
        self.url = reverse("inc-comments-create-list", kwargs={"inc_id": self.inc.pk})

    def authenticate(self, user=None):
        self.client.force_authenticate(user=user or self.user1)

    def test_authentication_required_for_list_and_create(self):
        
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        
        response = self.client.post(self.url, {"commentary": "Unauthorized"})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_comment_authenticated(self):
        self.authenticate()
        response = self.client.post(self.url, {"commentary": "My first comment"})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Comment.objects.count(), 1)
        comment = Comment.objects.first()
        self.assertEqual(comment.commentary, "My first comment")
        self.assertEqual(comment.user, self.user1)

    def test_create_comment_invalid_data(self):
        self.authenticate()
        response = self.client.post(self.url, {"commentary": ""})  
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Comment.objects.count(), 0)

    def test_list_comments_authenticated(self):
        Comment.objects.create(user=self.user1, lf_content=self.inc, commentary="First comment")
        Comment.objects.create(user=self.user2, lf_content=self.inc, commentary="Second comment")

        self.authenticate()
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        texts = [c["commentary"] for c in response.data["results"]]
        self.assertIn("First comment", texts)
        self.assertIn("Second comment", texts)

    def test_list_comments_only_for_given_inc(self):
        other_inc = Inc.objects.create(user=self.user1, content="Other Inc")
        Comment.objects.create(user=self.user1, lf_content=other_inc, commentary="Other Inc Comment")
        Comment.objects.create(user=self.user1, lf_content=self.inc, commentary="This Inc Comment")

        self.authenticate()
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        texts = [c["commentary"] for c in response.data["results"]]
        self.assertIn("This Inc Comment", texts)
        self.assertNotIn("Other Inc Comment", texts)