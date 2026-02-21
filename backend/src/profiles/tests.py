from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model


User = get_user_model()


class ProfileViewTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        
        
        self.user1 = User.objects.create_user(
            username="john_doe",
            email="john@example.com",
            first_name="John",
            last_name="Doe"
        )
        self.user2 = User.objects.create_user(
            username="jane_smith", 
            email="jane@example.com",
            first_name="Jane",
            last_name="Smith"
        )
        self.user3 = User.objects.create_user(
            username="bob_johnson",
            email="bob@example.com",
            first_name="Bob",
            last_name="Johnson"
        )
        
        
        self.client.force_authenticate(user=self.user1)
        
        
        self.list_url = reverse("profile-search-list")
        self.retrieve_url = lambda username: reverse("profile-retrive", kwargs={"username": username})

    def tearDown(self):
        self.client.force_authenticate(user=None)
        User.objects.all().delete()

    
    def test_retrieve_profile_by_username(self):
        response = self.client.get(self.retrieve_url("john_doe"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "john_doe")
        self.assertEqual(response.data["first_name"], "John")
        self.assertEqual(response.data["last_name"], "Doe")

    def test_retrieve_nonexistent_username(self):
        response = self.client.get(self.retrieve_url("nonexistent"))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_retrieve_case_insensitive_username(self):
        response = self.client.get(self.retrieve_url("JoHn_DoE"))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_list_all_profiles(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("count", response.data)
        self.assertIn("results", response.data)
        self.assertEqual(response.data["count"], 3)
        self.assertEqual(len(response.data["results"]), 3)

    def test_list_ordered_by_first_name(self):
        response = self.client.get(self.list_url)
        usernames = [user["username"] for user in response.data["results"]]
        self.assertEqual(usernames, ["bob_johnson", "jane_smith", "john_doe"])

    def test_filter_by_username(self):
        response = self.client.get(self.list_url, {"username": "john"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 2)  

    def test_filter_by_first_name(self):
        response = self.client.get(self.list_url, {"first_name": "jan"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)  

    def test_filter_by_last_name(self):
        response = self.client.get(self.list_url, {"last_name": "do"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)  

    def test_filter_by_name_full_name(self):
        response = self.client.get(self.list_url, {"name": "john"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        usernames = [user["username"] for user in response.data["results"]]
        self.assertEqual(set(usernames), {"john_doe", "bob_johnson"})  

    def test_filter_by_name_doe(self):
        response = self.client.get(self.list_url, {"name": "doe"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(response.data["results"][0]["username"], "john_doe")

    def test_filter_multiple_params(self):
        response = self.client.get(self.list_url, {
            "first_name": "j",
            "last_name": "s"
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)  

    def test_list_pagination(self):
        response = self.client.get(self.list_url, {"page": 1})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("next", response.data)
        self.assertIn("previous", response.data)

    
    def test_unauthenticated_list(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unauthenticated_retrieve(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.retrieve_url("john_doe"))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    
    def test_list_post_not_allowed(self):
        response = self.client.post(self.list_url, {})
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_retrieve_patch_not_allowed(self):
        response = self.client.patch(self.retrieve_url("john_doe"), {})
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
