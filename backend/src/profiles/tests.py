from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from posts.models import Post
from incs.models import Inc
from content.models import UserLikesContent
from django.utils import timezone
from datetime import timedelta
from friends.models import Friend
User = get_user_model()

def create_test_file():
    return SimpleUploadedFile("test.jpg", b"file_content", content_type="image/jpeg")


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
        
        Friend.objects.create(user1=self.user1, user2=self.user2)

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

    def test_list_profiles_include_friends_count(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for user_data in response.data["results"]:
            self.assertIn("friends_count", user_data)
        user1_data = next(u for u in response.data["results"] if u["username"] == "john_doe")
        user2_data = next(u for u in response.data["results"] if u["username"] == "jane_smith")
        user3_data = next(u for u in response.data["results"] if u["username"] == "bob_johnson")
        self.assertEqual(user1_data["friends_count"], 1)
        self.assertEqual(user2_data["friends_count"], 1)
        self.assertEqual(user3_data["friends_count"], 0)

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

class ProfileContentTests(APITestCase):
    def setUp(self):
        self.client = APIClient()

        
        self.user1 = User.objects.create_user(username="john_doe", password="pass")
        self.user2 = User.objects.create_user(username="jane_smith", password="pass")

        
        self.post1 = Post.objects.create(user=self.user1, description="Post 1", file=create_test_file())
        self.post2 = Post.objects.create(user=self.user1, description="Post 2", file=create_test_file())
        self.old_post = Post.objects.create(user=self.user1, description="Old post", file=create_test_file())
        self.old_post.created_at = timezone.now() - timedelta(days=2)
        self.old_post.save()

        
        self.inc1 = Inc.objects.create(user=self.user1, content="Inc 1")
        self.inc2 = Inc.objects.create(user=self.user1, content="Inc 2")
        self.old_inc = Inc.objects.create(user=self.user1, content="Old inc")
        self.old_inc.created_at = timezone.now() - timedelta(days=2)
        self.old_inc.save()

        
        self.profile_url = lambda username: reverse("profile-retrive", kwargs={"username": username})
        self.profile_posts_url = lambda username: reverse("profile-posts-list", kwargs={"username": username})
        self.profile_incs_url = lambda username: reverse("profile-incs-list", kwargs={"username": username})

        self.client.force_authenticate(user=self.user2)

    def test_retrieve_profile_success(self):
        response = self.client.get(self.profile_url("john_doe"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "john_doe")

    def test_retrieve_nonexistent_profile(self):
        response = self.client.get(self.profile_url("nonexistent"))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_list_user_posts_recent_only(self):
        response = self.client.get(self.profile_posts_url("john_doe"))
        post_ids = [p["id"] for p in response.data["results"]]
        self.assertIn(self.post1.id, post_ids)
        self.assertIn(self.post2.id, post_ids)
        self.assertNotIn(self.old_post.id, post_ids)

    def test_posts_include_likes_metadata(self):
        UserLikesContent.objects.create(user=self.user2, content=self.post1)
        response = self.client.get(self.profile_posts_url("john_doe"))
        post_data = next(p for p in response.data["results"] if p["id"] == self.post1.id)
        self.assertEqual(post_data["likes_count"], 1)
        self.assertTrue(post_data["is_liked"])

    def test_list_user_incs(self):
        response = self.client.get(self.profile_incs_url("john_doe"))
        inc_ids = [i["id"] for i in response.data["results"]]
        self.assertIn(self.inc1.id, inc_ids)
        self.assertIn(self.inc2.id, inc_ids)
        self.assertIn(self.old_inc.id, inc_ids)

    def test_incs_include_likes_metadata(self):
        UserLikesContent.objects.create(user=self.user2, content=self.inc1)
        response = self.client.get(self.profile_incs_url("john_doe"))
        inc_data = next(i for i in response.data["results"] if i["id"] == self.inc1.id)
        self.assertEqual(inc_data["likes_count"], 1)
        self.assertTrue(inc_data["is_liked"])
    
    def test_unauthenticated_access_denied(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.profile_url("john_doe"))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response = self.client.get(self.profile_posts_url("john_doe"))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response = self.client.get(self.profile_incs_url("john_doe"))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_list_post_not_allowed(self):
        response = self.client.post(self.profile_posts_url("john_doe"), {})
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_retrieve_patch_not_allowed(self):
        response = self.client.patch(self.profile_url("john_doe"), {})
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)


class ProfileContentTests(APITestCase):
    def setUp(self):
        self.client = APIClient()

        
        self.user1 = User.objects.create_user(username="john_doe", password="pass")
        self.user2 = User.objects.create_user(username="jane_smith", password="pass")

        
        self.post1 = Post.objects.create(user=self.user1, description="Post 1", file=create_test_file())
        self.post2 = Post.objects.create(user=self.user1, description="Post 2", file=create_test_file())
        self.old_post = Post.objects.create(user=self.user1, description="Old post", file=create_test_file())
        self.old_post.created_at = timezone.now() - timedelta(days=2)
        self.old_post.save()

        
        self.inc1 = Inc.objects.create(user=self.user1, content="Inc 1")
        self.inc2 = Inc.objects.create(user=self.user1, content="Inc 2")
        self.old_inc = Inc.objects.create(user=self.user1, content="Old inc")
        self.old_inc.created_at = timezone.now() - timedelta(days=2)
        self.old_inc.save()

        
        self.profile_url = lambda username: reverse("profile-retrive", kwargs={"username": username})
        self.profile_posts_url = lambda username: reverse("profile-posts-list", kwargs={"username": username})
        self.profile_incs_url = lambda username: reverse("profile-incs-list", kwargs={"username": username})

        self.client.force_authenticate(user=self.user2)

    
    def test_retrieve_profile_success(self):
        response = self.client.get(self.profile_url("john_doe"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "john_doe")

    def test_retrieve_nonexistent_profile(self):
        response = self.client.get(self.profile_url("nonexistent"))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_list_user_posts(self):
        response = self.client.get(self.profile_posts_url("john_doe"))
        post_ids = [p["id"] for p in response.data["results"]]
        self.assertIn(self.post1.id, post_ids)
        self.assertIn(self.post2.id, post_ids)
        self.assertIn(self.old_post.id, post_ids)

    def test_posts_include_likes_metadata(self):
        UserLikesContent.objects.create(user=self.user2, content=self.post1)
        response = self.client.get(self.profile_posts_url("john_doe"))
        post_data = next(p for p in response.data["results"] if p["id"] == self.post1.id)
        self.assertEqual(post_data["likes_count"], 1)
        self.assertTrue(post_data["is_liked"])
    
    def test_list_user_incs(self):
        response = self.client.get(self.profile_incs_url("john_doe"))
        inc_ids = [i["id"] for i in response.data["results"]]
        self.assertIn(self.inc1.id, inc_ids)
        self.assertIn(self.inc2.id, inc_ids)
        self.assertIn(self.old_inc.id, inc_ids)

    def test_incs_include_likes_metadata(self):
        UserLikesContent.objects.create(user=self.user2, content=self.inc1)
        response = self.client.get(self.profile_incs_url("john_doe"))
        inc_data = next(i for i in response.data["results"] if i["id"] == self.inc1.id)
        self.assertEqual(inc_data["likes_count"], 1)
        self.assertTrue(inc_data["is_liked"])
    
    def test_unauthenticated_access_denied(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.profile_url("john_doe"))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response = self.client.get(self.profile_posts_url("john_doe"))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response = self.client.get(self.profile_incs_url("john_doe"))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_post_not_allowed(self):
        response = self.client.post(self.profile_posts_url("john_doe"), {})
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_retrieve_patch_not_allowed(self):
        response = self.client.patch(self.profile_url("john_doe"), {})
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)


class ProfileVisibilityTests(APITestCase):
    def setUp(self):
        self.client = APIClient()

        
        self.user1 = User.objects.create_user(username="public_user", password="pass")
        self.user2 = User.objects.create_user(username="friend_user", password="pass")
        self.user3 = User.objects.create_user(username="other_user", password="pass")
        self.user_private = User.objects.create_user(username="private_user", password="pass", is_private=True)

        
        Friend.objects.create(user1=self.user_private, user2=self.user2)

        
        self.post_public = Post.objects.create(user=self.user_private, description="Private post", file=create_test_file())
        self.inc_public = Inc.objects.create(user=self.user_private, content="Private inc")

        
        self.profile_url = lambda username: reverse("profile-retrive", kwargs={"username": username})
        self.profile_posts_url = lambda username: reverse("profile-posts-list", kwargs={"username": username})
        self.profile_incs_url = lambda username: reverse("profile-incs-list", kwargs={"username": username})

    def test_owner_can_view_own_private_profile(self):
        self.client.force_authenticate(user=self.user_private)
        response = self.client.get(self.profile_url("private_user"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "private_user")

    def test_friend_can_view_private_profile(self):
        self.client.force_authenticate(user=self.user2)
        response = self.client.get(self.profile_url("private_user"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_owner_can_view_own_posts(self):
        self.client.force_authenticate(user=self.user_private)
        response = self.client.get(self.profile_posts_url("private_user"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn(self.post_public.id, [p["id"] for p in response.data["results"]])

    def test_friend_can_view_private_user_posts(self):
        self.client.force_authenticate(user=self.user2)
        response = self.client.get(self.profile_posts_url("private_user"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_non_friend_cannot_view_private_user_posts(self):
        self.client.force_authenticate(user=self.user3)
        response = self.client.get(self.profile_posts_url("private_user"))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_owner_can_view_own_incs(self):
        self.client.force_authenticate(user=self.user_private)
        response = self.client.get(self.profile_incs_url("private_user"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn(self.inc_public.id, [i["id"] for i in response.data["results"]])

    def test_friend_can_view_private_user_incs(self):
        self.client.force_authenticate(user=self.user2)
        response = self.client.get(self.profile_incs_url("private_user"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_non_friend_cannot_view_private_user_incs(self):
        self.client.force_authenticate(user=self.user3)
        response = self.client.get(self.profile_incs_url("private_user"))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_unauthenticated_cannot_view_private_profile(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.profile_url("private_user"))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unauthenticated_cannot_view_private_posts_or_incs(self):
        self.client.force_authenticate(user=None)
        response_posts = self.client.get(self.profile_posts_url("private_user"))
        response_incs = self.client.get(self.profile_incs_url("private_user"))
        self.assertEqual(response_posts.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response_incs.status_code, status.HTTP_401_UNAUTHORIZED)