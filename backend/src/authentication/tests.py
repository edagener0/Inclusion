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

        
        access_cookie = response.cookies.get(self.access_cookie_name)
        refresh_cookie = response.cookies.get(self.refresh_cookie_name)
        self.assertIsNotNone(access_cookie)
        self.assertIsNotNone(refresh_cookie)

    def test_login_with_tauri_header_returns_tokens_in_body(self):
        data = {"username": "tester", "password": "password123"}
        response = self.client.post(
            self.login_url,
            data,
            format="json",
            HTTP_X_TAURI_CLIENT="1",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_login_invalid_credentials(self):
        data = {"username": "tester", "password": "wrong-password"}
        response = self.client.post(self.login_url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data["message"], "Invalid credentials!")


class TokenRefreshTests(BaseAuthTestCase):
    def _login_and_get_tokens(self):
        data = {"username": "tester", "password": "password123"}
        response = self.client.post(self.login_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        return response

    def test_refresh_with_body_rotates_refresh_token_and_sets_cookies(self):
        self._login_and_get_tokens()

        response = self.client.post(
            self.refresh_url,
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

    def test_refresh_accepts_header_token_for_tauri_clients(self):
        login_response = self._login_and_get_tokens()
        refresh_token = login_response.cookies.get(self.refresh_cookie_name)

        response = self.client.post(
            self.refresh_url,
            format="json",
            HTTP_X_TAURI_CLIENT="1",
            HTTP_X_REFRESH_TOKEN=refresh_token.value,
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_refresh_without_refresh_token_returns_401(self):
        response = self.client.post(self.refresh_url, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class LogoutTests(BaseAuthTestCase):
    def test_logout_returns_success_and_deletes_cookies(self):
        
        data = {"username": "tester", "password": "password123"}
        login_response = self.client.post(self.login_url, data, format="json")

        
        refresh_response = self.client.post(
            self.refresh_url,
            format="json",
        )

        
        new_access_cookie = refresh_response.cookies.get(self.access_cookie_name)
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {new_access_cookie.value}"
        )

        
        response = self.client.post(
            self.logout_url,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
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
    def _register_payload(self, **overrides):
        payload = {
            "username": "newuser",
            "email": "test@gmail.com",
            "first_name": "John",
            "last_name": "Doe",
            "password": "StrongPass123!",
        }
        payload.update(overrides)
        return payload

    def test_register_success_creates_user(self):
        payload = self._register_payload()
        response = self.client.post(self.register_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username="newuser").exists())

    def test_register_rejects_duplicate_username(self):
        payload = self._register_payload(username="tester")

        response = self.client.post(self.register_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data["username"][0],
            "A user with that username already exists.",
        )

    def test_register_rejects_whitespace_only_username_as_blank_field(self):
        payload = self._register_payload(username="   ")

        response = self.client.post(self.register_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data["username"][0],
            "This field may not be blank.",
        )

    def test_register_rejects_restricted_username_case_insensitively(self):
        payload = self._register_payload(username="admin")

        response = self.client.post(self.register_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data["username"][0],
            "This username is not allowed.",
        )

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
