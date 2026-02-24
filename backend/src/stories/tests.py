from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from stories.models import Story
from django.core.files.uploadedfile import SimpleUploadedFile


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

        self.list_url = reverse("stories-create")


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
        url = reverse("stories-retrieve-destroy", args=[story.id])

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_owner_can_delete_story(self):
        story = Story.objects.create(
            user=self.user,
            file=create_test_file()
        )

        self.client.force_authenticate(self.user)
        url = reverse("stories-retrieve-destroy", args=[story.id])

        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


    def test_non_owner_cannot_delete_story(self):
        story = Story.objects.create(
            user=self.user,
            file=create_test_file()
        )

        self.client.force_authenticate(self.other_user)
        url = reverse("stories-retrieve-destroy", args=[story.id])

        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)