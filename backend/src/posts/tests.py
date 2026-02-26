
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.auth import get_user_model
from posts.models import Post
from content.models import UserLikesContent
from comments.models import Comment

User = get_user_model()

class PostAPITests(APITestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.other_user = User.objects.create_user(username="otheruser", password="otherpass")
        self.valid_image = SimpleUploadedFile("test.jpg", b"file_content", content_type="image/jpeg")
        self.invalid_file = SimpleUploadedFile("test.txt", b"not_image", content_type="text/plain")

    def authenticate(self):
        self.client.force_authenticate(user=self.user)

    def test_authentication_required_for_list_and_create(self):
        list_url = reverse("post-create-list")
        res_list = self.client.get(list_url)
        self.assertEqual(res_list.status_code, status.HTTP_401_UNAUTHORIZED)

        res_create = self.client.post(list_url, {
            "description": "Unauthorized upload",
            "file": self.valid_image
        })
        self.assertEqual(res_create.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_post_with_valid_file(self):
        self.authenticate()
        url = reverse("post-create-list")
        response = self.client.post(url, {
            "description": "Valid image upload",
            "file": self.valid_image
        }, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Post.objects.count(), 1)
        self.assertEqual(Post.objects.first().user, self.user)

    def test_create_post_with_invalid_file_extension(self):
        self.authenticate()
        url = reverse("post-create-list")
        response = self.client.post(url, {
            "description": "Invalid file",
            "file": self.invalid_file
        }, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_list_posts_orders_by_id(self):
        self.authenticate()
        Post.objects.create(user=self.user, description="A", file=self.valid_image)
        Post.objects.create(user=self.user, description="B", file=self.valid_image)
        url = reverse("post-create-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        ids = [p["id"] for p in response.data["results"]]
        self.assertEqual(ids, sorted(ids, reverse=True))

    def test_retrieve_post(self):
        post = Post.objects.create(user=self.user, description="Retrieve test", file=self.valid_image)
        self.authenticate()
        url = reverse("post-retrieve-destroy", args=[post.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_post_as_owner(self):
        post = Post.objects.create(user=self.user, description="Delete test", file=self.valid_image)
        self.authenticate()
        url = reverse("post-retrieve-destroy", args=[post.pk])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Post.objects.count(), 0)

    def test_cannot_delete_post_as_non_owner(self):
        post = Post.objects.create(user=self.other_user, description="Other's post", file=self.valid_image)
        self.authenticate()
        url = reverse("post-retrieve-destroy", args=[post.pk])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Post.objects.count(), 1)

    def test_get_permissions_allow_read_to_any_authenticated_user(self):
        post = Post.objects.create(user=self.other_user, description="Public readable", file=self.valid_image)
        self.authenticate()
        url = reverse("post-retrieve-destroy", args=[post.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class PostLikeViewTests(APITestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.other_user = User.objects.create_user(username="otheruser", password="otherpass")
        self.post = Post.objects.create(user=self.user, description="Test post", file=None)

        self.like_url = reverse("post-like", kwargs={"post_id": self.post.pk})

    def test_like_post_authenticated(self):
        self.client.force_authenticate(user=self.other_user)
        response = self.client.post(self.like_url)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data["liked"])
        self.assertEqual(response.data["detail"], "Liked Successfully!")

        self.assertTrue(
            UserLikesContent.objects.filter(
                user=self.other_user,
                content=self.post
            ).exists()
        )

    def test_like_post_twice(self):
        self.client.force_authenticate(user=self.other_user)
        self.client.post(self.like_url)  
        response = self.client.post(self.like_url)  

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["liked"])
        self.assertEqual(response.data["detail"], "You've already liked the content")
        self.assertEqual(
            UserLikesContent.objects.filter(
                user=self.other_user,
                content=self.post
            ).count(),
            1
        )

    def test_like_post_unauthenticated(self):
        response = self.client.post(self.like_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unlike_post_success(self):
        UserLikesContent.objects.create(user=self.other_user, content=self.post)
        self.client.force_authenticate(user=self.other_user)

        response = self.client.delete(self.like_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data["liked"])
        self.assertEqual(response.data["detail"], "Unliked successfully")

        self.assertFalse(
            UserLikesContent.objects.filter(
                user=self.other_user,
                content=self.post
            ).exists()
        )

    def test_unlike_post_not_liked(self):
        self.client.force_authenticate(user=self.other_user)
        response = self.client.delete(self.like_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data["liked"])
        self.assertEqual(response.data["detail"], "You had not liked this content")

    def test_unlike_post_unauthenticated(self):
        response = self.client.delete(self.like_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

class PostCommentsAPITests(APITestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.other_user = User.objects.create_user(username="otheruser", password="otherpass")
        self.post = Post.objects.create(user=self.user, description="Test Post", file=None)
        self.comments_url = reverse("post-comments-create-list", kwargs={"post_id": self.post.pk})

    def authenticate(self, user=None):
        self.client.force_authenticate(user=user or self.user)

    def test_authentication_required_for_list_and_create(self):
        res_list = self.client.get(self.comments_url)
        self.assertEqual(res_list.status_code, status.HTTP_401_UNAUTHORIZED)

        res_create = self.client.post(self.comments_url, {"commentary": "Unauthorized comment"})
        self.assertEqual(res_create.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_comment_authenticated(self):
        self.authenticate()
        response = self.client.post(self.comments_url, {"commentary": "Test comment"})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Comment.objects.count(), 1)
        comment = Comment.objects.first()
        self.assertEqual(comment.commentary, "Test comment")
        self.assertEqual(comment.user, self.user)

    def test_create_comment_invalid_data(self):
        self.authenticate()
        response = self.client.post(self.comments_url, {"commentary": ""})  
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Comment.objects.count(), 0)

    def test_list_comments_authenticated(self):
        Comment.objects.create(user=self.user, lf_content=self.post, commentary="First comment")
        Comment.objects.create(user=self.other_user, lf_content=self.post, commentary="Second comment")
        
        self.authenticate()
        response = self.client.get(self.comments_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        texts = [c["commentary"] for c in response.data["results"]]
        self.assertIn("First comment", texts)
        self.assertIn("Second comment", texts)

    def test_list_comments_only_for_given_post(self):
        other_post = Post.objects.create(user=self.user, description="Other Post", file=None)
        Comment.objects.create(user=self.user, lf_content=other_post, commentary="Other post comment")
        Comment.objects.create(user=self.user, lf_content=self.post, commentary="This post comment")

        self.authenticate()
        response = self.client.get(self.comments_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        texts = [c["commentary"] for c in response.data["results"]]
        self.assertIn("This post comment", texts)
        self.assertNotIn("Other post comment", texts)