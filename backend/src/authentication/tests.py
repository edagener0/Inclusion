from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from django.conf import settings

User = get_user_model()


class BaseAuthTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="tester",
            email="tester@example.com",
            password="password123",
        )
        self.register_url = reverse("user-register")
        self.login_url = reverse("user-login")
        self.logout_url = reverse("user-logout")
        self.refresh_url = reverse("user-token-refresh")
        self.me_url = reverse("user-me-view")
        
        self.access_cookie_name = settings.SIMPLE_JWT["AUTH_COOKIE"]
        self.refresh_cookie_name = settings.SIMPLE_JWT["REFRESH_COOKIE"]


class LoginTests(BaseAuthTestCase):
    def test_login_success_sets_cookies_and_returns_tokens(self):
        data = {"username": "tester", "password": "password123"}
        response = self.client.post(self.login_url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("data", response.data)
        self.assertIn("access", response.data["data"])
        self.assertIn("refresh", response.data["data"])

        
        access_cookie = response.cookies.get(self.access_cookie_name)
        refresh_cookie = response.cookies.get(self.refresh_cookie_name)
        self.assertIsNotNone(access_cookie)
        self.assertIsNotNone(refresh_cookie)

    def test_login_invalid_credentials(self):
        data = {"username": "tester", "password": "wrong-password"}
        response = self.client.post(self.login_url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data["message"], "Invalid username or password!")


class TokenRefreshTests(BaseAuthTestCase):
    def _login_and_get_tokens(self):
        data = {"username": "tester", "password": "password123"}
        response = self.client.post(self.login_url, data, format="json")
        return response.data["data"]["access"], response.data["data"]["refresh"]

    def test_refresh_with_body_rotates_refresh_token_and_sets_cookies(self):
        _, refresh = self._login_and_get_tokens()

        response = self.client.post(
            self.refresh_url,
            {"refresh": refresh},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.assertEqual(
            response.data["message"],
            "Token refreshed successfully",
        )

        access_cookie = response.cookies.get(self.access_cookie_name)
        refresh_cookie = response.cookies.get(self.refresh_cookie_name)
        self.assertIsNotNone(access_cookie)
        self.assertIsNotNone(refresh_cookie)

    def test_refresh_without_refresh_token_returns_400(self):
        response = self.client.post(self.refresh_url, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["message"], "Refresh Token Required")


class LogoutTests(BaseAuthTestCase):
    def test_logout_returns_success_and_deletes_cookies(self):
        
        data = {"username": "tester", "password": "password123"}
        login_response = self.client.post(self.login_url, data, format="json")
        access = login_response.data["data"]["access"]
        refresh = login_response.data["data"]["refresh"]

        
        refresh_response = self.client.post(
            self.refresh_url,
            {"refresh": refresh},
            format="json",
        )

        
        new_access_cookie = refresh_response.cookies.get(self.access_cookie_name)
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {new_access_cookie.value}"
        )

        
        response = self.client.post(
            self.logout_url,
            {"refresh": refresh},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_205_RESET_CONTENT)
        self.assertEqual(response.data["message"], "Logout successful")

        
        self.assertEqual(
            response.cookies.get(self.access_cookie_name).value, ""
        )
        self.assertEqual(
            response.cookies.get(self.refresh_cookie_name).value, ""
        )

    def test_logout_without_refresh_returns_401(self):
        
        response = self.client.post(self.logout_url, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class RegisterTests(BaseAuthTestCase):
    def test_register_success_creates_user(self):
        payload = {
            "username": "newuser",
            "email": "test@gmail.com",
            "first_name": "John",
            "last_name": "Doe",
            "password": "StrongPass123!",
            "confirm_password": "StrongPass123!",
        }
        response = self.client.post(self.register_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username="newuser").exists())

    def test_register_password_mismatch_fails(self):
        payload = {
            "username": "newuser2",
            "email": "test@gmail.com",
            "first_name": "Jane",
            "last_name": "Doe",
            "password": "Pass123!",
            "confirm_password": "DifferentPass!",
        }
        response = self.client.post(self.register_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Passwords do not match!", str(response.data))

class UserMeViewTests(BaseAuthTestCase):
    def _login_and_set_auth_header(self):
        data = {"username": "tester", "password": "password123"}
        response = self.client.post(self.login_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        access_cookie = response.cookies.get(self.access_cookie_name)
        self.assertIsNotNone(access_cookie)

        access_token = access_cookie.value
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")

    def test_me_requires_authentication(self):
        response = self.client.get(self.me_url, format="json")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_me_returns_userme_serializer_fields(self):
        self._login_and_set_auth_header()

        response = self.client.get(self.me_url, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        
        self.assertIn("id", response.data)
        self.assertIn("username", response.data)
        self.assertIn("first_name", response.data)
        self.assertIn("last_name", response.data)

        self.assertEqual(response.data["id"], self.user.id)
        self.assertEqual(response.data["username"], self.user.username)
        self.assertEqual(response.data["first_name"], self.user.first_name)
        self.assertEqual(response.data["last_name"], self.user.last_name)
