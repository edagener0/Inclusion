# tests/test_friend_views.py
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from friends.models import FriendRequest, Friend

User = get_user_model()

class FriendViewsTests(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username="alice", password="password")
        self.user2 = User.objects.create_user(username="bob", password="password")
        self.user3 = User.objects.create_user(username="charlie", password="password")
        self.client = APIClient()
        self.client.force_authenticate(user=self.user1)

    def test_create_friend_request_success(self):
        url = reverse("friend-request-create")
        data = {"to_user": self.user2.id}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(FriendRequest.objects.filter(from_user=self.user1, to_user=self.user2).exists())

    def test_create_friend_request_self(self):
        url = reverse("friend-request-create")
        data = {"to_user": self.user1.id}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_friend_request_duplicate(self):
        FriendRequest.objects.create(from_user=self.user1, to_user=self.user2)
        url = reverse("friend-request-create")
        data = {"to_user": self.user2.id}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_friend_request_when_already_friends(self):
        Friend.objects.create(user1=self.user1, user2=self.user2)
        url = reverse("friend-request-create")
        data = {"to_user": self.user2.id}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_list_sent_requests(self):
        FriendRequest.objects.create(from_user=self.user1, to_user=self.user2)
        url = reverse("friend-request-list-sent")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)

    def test_list_received_requests(self):
        FriendRequest.objects.create(from_user=self.user2, to_user=self.user1)
        url = reverse("friend-request-list-received")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)

    def test_accept_friend_request(self):
        FriendRequest.objects.create(from_user=self.user2, to_user=self.user1)
        url = reverse("friend-request-accept-received", kwargs={"from_user_id": self.user2.id})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Friend.objects.filter(user1=self.user1, user2=self.user2).exists())
        self.assertFalse(FriendRequest.objects.filter(from_user=self.user2, to_user=self.user1).exists())

    def test_decline_friend_request(self):
        FriendRequest.objects.create(from_user=self.user2, to_user=self.user1)
        url = reverse("friend-request-decline-received", kwargs={"from_user_id": self.user2.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(FriendRequest.objects.filter(from_user=self.user2, to_user=self.user1).exists())

    def test_remove_friend(self):
        Friend.objects.create(user1=self.user1, user2=self.user2)
        url = reverse("friend-remove", kwargs={"friend_id": self.user2.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Friend.objects.filter(user1=self.user1, user2=self.user2).exists())

    def test_list_friends(self):
        Friend.objects.create(user1=self.user1, user2=self.user2)
        Friend.objects.create(user1=self.user3, user2=self.user1)
        url = reverse("friend-list", kwargs={"username": self.user1.username})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 2)

    def test_non_authenticated_access(self):
        self.client.force_authenticate(user=None)
        url = reverse("friend-request-create")
        response = self.client.post(url, {"to_user": self.user2.id})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        url = reverse("friend-request-list-received")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        url = reverse("friend-request-list-sent")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        url = reverse("friend-request-accept-received", kwargs={"from_user_id": self.user2.id})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        url = reverse("friend-request-decline-received", kwargs={"from_user_id": self.user2.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        url = reverse("friend-remove", kwargs={"friend_id": self.user2.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        url = reverse("friend-list", kwargs={"username": self.user1.username})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_accept_request_not_exists(self):
        url = reverse("friend-request-accept-received", kwargs={"from_user_id": self.user2.id})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_decline_request_not_exists(self):
        url = reverse("friend-request-decline-received", kwargs={"from_user_id": self.user2.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_remove_friend_not_exists(self):
        url = reverse("friend-remove", kwargs={"friend_id": self.user2.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)