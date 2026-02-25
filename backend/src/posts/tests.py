# posts/tests.py
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.auth import get_user_model
from posts.models import Post

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
        url = reverse("post-retrieve", args=[post.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_post_as_owner(self):
        post = Post.objects.create(user=self.user, description="Delete test", file=self.valid_image)
        self.authenticate()
        url = reverse("content-delete", args=[post.pk])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Post.objects.count(), 0)

    def test_cannot_delete_post_as_non_owner(self):
        post = Post.objects.create(user=self.other_user, description="Other's post", file=self.valid_image)
        self.authenticate()
        url = reverse("content-delete", args=[post.pk])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Post.objects.count(), 1)

    def test_get_permissions_allow_read_to_any_authenticated_user(self):
        post = Post.objects.create(user=self.other_user, description="Public readable", file=self.valid_image)
        self.authenticate()
        url = reverse("post-retrieve", args=[post.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
