from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from notes.models import Note

User = get_user_model()


class NoteAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="gabriel",
            email="gabriel@test.com",
            password="testpass123"
        )
        self.other_user = User.objects.create_user(
            username="other",
            email="other@test.com",
            password="testpass123"
        )

        self.note = Note.objects.create(
            user=self.user,
            content="Minha nota"
        )

        self.list_url = reverse("note-create")
        self.detail_url = reverse(
            "note-retrieve-destroy",
            kwargs={"pk": self.note.pk}
        )


    def test_list_notes_authenticated(self):
        self.client.force_authenticate(self.user)

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)

    def test_list_notes_unauthenticated(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


    def test_create_note(self):
        self.client.force_authenticate(self.user)

        data = {"content": "Nova nota"}

        response = self.client.post(self.list_url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Note.objects.count(), 2)
        self.assertEqual(response.data["content"], "Nova nota")


    def test_retrieve_note(self):
        self.client.force_authenticate(self.user)

        response = self.client.get(self.detail_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], self.note.id)


    def test_delete_note_owner(self):
        self.client.force_authenticate(self.user)

        response = self.client.delete(self.detail_url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Note.objects.count(), 0)


    def test_delete_note_not_owner(self):
        self.client.force_authenticate(self.other_user)

        response = self.client.delete(self.detail_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Note.objects.count(), 1)