from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.utils import json
from django.core.files.uploadedfile import SimpleUploadedFile
from PIL import Image
import io

User = get_user_model()

class UserViewsEdgeCasesTestCase(APITestCase):

    def setUp(self):
        
        self.user1 = User.objects.create_user(
            username="alice", first_name="Alice", last_name="Smith", password="password123"
        )
        self.user2 = User.objects.create_user(
            username="bob", first_name="Bob", last_name="Johnson", password="password123"
        )
        self.user3 = User.objects.create_user(
            username="charlie", first_name="Charlie", last_name="Brown", password="password123"
        )

        self.client.force_authenticate(user=self.user1)
    
    def test_user_list_authenticated(self):
        url = reverse("user-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 3)

    def test_user_list_unauthenticated(self):
        self.client.force_authenticate(user=None)
        url = reverse("user-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_user_retrieve_existing_user(self):
        url = reverse("user-detail-view", kwargs={"pk": self.user2.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "bob")

    def test_user_retrieve_nonexistent_user(self):
        url = reverse("user-detail-view", kwargs={"pk": 999})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_update_patch_text_fields(self):
        url = reverse("user-detail-update")
        data = {
            "firstName": "AliceUpdated",
            "lastName": "SmithUpdated",
            "biography": "Updated biography"
        }
        response = self.client.patch(url, data, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user1.refresh_from_db()
        self.assertEqual(self.user1.first_name, "AliceUpdated")
        self.assertEqual(self.user1.last_name, "SmithUpdated")
        self.assertEqual(self.user1.biography, "Updated biography")

    
    def test_user_update_patch_avatar_upload(self):
        url = reverse("user-detail-update")
        
        img = Image.new('RGB', (100, 100), color='red')
        img_byte_arr = io.BytesIO()
        img.save(img_byte_arr, format='PNG')
        img_byte_arr = img_byte_arr.getvalue()
        
        avatar_file = SimpleUploadedFile(
            "avatar.png", 
            img_byte_arr,  
            content_type="image/png"
        )
        
        data = {"avatar": avatar_file}
        response = self.client.patch(url, data, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user1.refresh_from_db()
        self.assertTrue(bool(self.user1.avatar))

    def test_user_update_patch_invalid_field(self):
        url = reverse("user-detail-update")
        data = {
            "nonExistentField": "value"
        }
        response = self.client.patch(url, data, format="multipart")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_search_by_username(self):
        url = reverse("user-search-list", kwargs={"name": "alice"})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["results"][0]["username"], "alice")

    def test_user_search_by_first_name(self):
        url = reverse("user-search-list", kwargs={"name": "Bob"})
        response = self.client.get(url)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(response.data["results"][0]["username"], "bob")

    def test_user_search_by_last_name(self):
        url = reverse("user-search-list", kwargs={"name": "Brown"})
        response = self.client.get(url)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(response.data["results"][0]["username"], "charlie")

    def test_user_search_by_full_name(self):
        url = reverse("user-search-list", kwargs={"name": "Alice Smith"})
        response = self.client.get(url)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(response.data["results"][0]["username"], "alice")

    def test_user_search_no_results(self):
        url = reverse("user-search-list", kwargs={"name": "nonexistent"})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 0)

    def test_user_search_pagination(self):
        
        for i in range(10):
            User.objects.create_user(
                username=f"user{i}", first_name=f"Test{i}", last_name="Paginate", password="pass"
            )
        url = reverse("user-search-list", kwargs={"name": "user"})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.assertTrue("results" in response.data)
        self.assertTrue(len(response.data["results"]) <= 10)

    def test_user_update_unauthenticated(self):
        self.client.force_authenticate(user=None)
        url = reverse("user-detail-update")
        data = {"firstName": "NoAuth"}
        response = self.client.patch(url, data, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_user_retrieve_unauthenticated(self):
        self.client.force_authenticate(user=None)
        url = reverse("user-detail-view", kwargs={"pk": self.user1.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
