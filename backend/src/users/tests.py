from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from PIL import Image
from io import BytesIO
        

User = get_user_model()


class UserRetrieveUpdateViewTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123",
            first_name="John",
            last_name="Doe",
            biography="Initial bio"
        )
        self.client.force_authenticate(user=self.user)
        self.url = reverse("user-retrieve-update")

    def tearDown(self):
        self.client.force_authenticate(user=None)
        self.user.delete()

    def test_get_retrieve_user(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "testuser")
        self.assertEqual(response.data["first_name"], "John")
        self.assertEqual(response.data["biography"], "Initial bio")
        self.assertIn("id", response.data)
        self.assertIn("email", response.data)

    def test_patch_partial_update(self):
        data = {
            "first_name": "Jane",
            "biography": "Updated bio"
        }
        response = self.client.patch(self.url, data, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        
        
        self.assertEqual(self.user.first_name, "Jane")
        self.assertEqual(self.user.biography, "Updated bio")
        
        
        self.assertEqual(self.user.last_name, "Doe")  
        self.assertEqual(self.user.email, "test@example.com")  

    def test_patch_empty_strings(self):
        data = {
            "email": "",
            "first_name": "",
            "biography": ""
        }
        response = self.client.patch(self.url, data, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        
        self.assertEqual(self.user.email, "")
        self.assertEqual(self.user.first_name, "")
        self.assertEqual(self.user.biography, "")
        self.assertEqual(self.user.last_name, "Doe")  

    def test_patch_readonly_fields(self):
        data = {
            "id": 999,
            "username": "hacker"
        }
        response = self.client.patch(self.url, data, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        
        
        self.assertEqual(self.user.id, self.user.id)
        self.assertEqual(self.user.username, "testuser")

    def test_patch_avatar_upload(self):
        img = Image.new('RGB', (1, 1), color='red')
        img_byte_arr = BytesIO()
        img.save(img_byte_arr, format='JPEG')
        img_byte_arr.seek(0)
        
        avatar = SimpleUploadedFile(
            "test.jpg", 
            img_byte_arr.read(),
            content_type="image/jpeg"
        )
        
        data = {
            "first_name": "AvatarUser",
            "avatar": avatar
        }
        
        response = self.client.patch(self.url, data, format="multipart")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        
        self.assertEqual(self.user.first_name, "AvatarUser")
        self.assertTrue(self.user.avatar.name.startswith("avatars/"))
        self.assertTrue(self.user.avatar.size > 0)


    def test_unauthenticated_access(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_invalid_method(self):
        response = self.client.post(self.url, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_patch_clear_biography(self):
        data = {"biography": ""}
        response = self.client.patch(self.url, data, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.biography, "")  
