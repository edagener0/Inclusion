from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.auth import get_user_model
from posts.models import Post
from content.models import UserLikesContent
from comments.models import Comment
from friends.models import Friend
from .models import FavoritePost

User = get_user_model()

def create_test_image():
    return SimpleUploadedFile("image.jpg", b"file_content", content_type="image/jpeg")

class PostAPITests(APITestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="user1", password="pass")
        self.other_user = User.objects.create_user(username="user2", password="pass")

        
        self.valid_image = SimpleUploadedFile("image.jpg", b"file_content", content_type="image/jpeg")
        self.invalid_file = SimpleUploadedFile("file.txt", b"not_image", content_type="text/plain")

    def authenticate(self, user=None):
        self.client.force_authenticate(user=user or self.user)

    def test_create_post_with_valid_file(self):
        self.authenticate()
        url = reverse("post-create-list")
        response = self.client.post(url, {"description": "Valid post", "file": self.valid_image}, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Post.objects.count(), 1)
        self.assertEqual(Post.objects.first().user, self.user)

    def test_create_post_invalid_file_extension(self):
        self.authenticate()
        url = reverse("post-create-list")
        response = self.client.post(url, {"description": "Invalid file", "file": self.invalid_file}, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_list_posts_includes_likes_annotations(self):
        post1 = Post.objects.create(user=self.user, description="Post 1", file=self.valid_image)
        post2 = Post.objects.create(user=self.user, description="Post 2", file=self.valid_image)

        UserLikesContent.objects.create(user=self.other_user, content=post1)

        self.authenticate(self.other_user)
        url = reverse("post-create-list")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data["results"]

        p1_data = next(p for p in results if p["id"] == post1.id)
        p2_data = next(p for p in results if p["id"] == post2.id)

        self.assertEqual(p1_data["likes_count"], 1)
        self.assertTrue(p1_data["is_liked"])
        self.assertEqual(p2_data["likes_count"], 0)
        self.assertFalse(p2_data["is_liked"])

    def test_retrieve_post_annotations(self):
        post = Post.objects.create(user=self.user, description="Retrieve test", file=self.valid_image)
        UserLikesContent.objects.create(user=self.other_user, content=post)

        self.authenticate(self.other_user)
        url = reverse("post-retrieve-destroy", args=[post.id])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["likes_count"], 1)
        self.assertTrue(response.data["is_liked"])

    def test_delete_post_owner(self):
        post = Post.objects.create(user=self.user, description="Delete me", file=self.valid_image)
        self.authenticate()
        url = reverse("post-retrieve-destroy", args=[post.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Post.objects.filter(id=post.id).exists())

    def test_delete_post_not_owner(self):
        post = Post.objects.create(user=self.user, description="Delete me", file=self.valid_image)
        self.authenticate(self.other_user)
        url = reverse("post-retrieve-destroy", args=[post.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(Post.objects.filter(id=post.id).exists())

    def test_like_post(self):
        post = Post.objects.create(user=self.user, description="Like me", file=self.valid_image)
        self.authenticate(self.other_user)
        url = reverse("post-like", kwargs={"post_id": post.id})

        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data["liked"])
        self.assertTrue(UserLikesContent.objects.filter(user=self.other_user, content=post).exists())

    def test_like_post_twice(self):
        post = Post.objects.create(user=self.user, description="Like twice", file=self.valid_image)
        self.authenticate(self.other_user)
        url = reverse("post-like", kwargs={"post_id": post.id})

        self.client.post(url)
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(UserLikesContent.objects.filter(user=self.other_user, content=post).count(), 1)

    def test_unlike_post(self):
        post = Post.objects.create(user=self.user, description="Unlike me", file=self.valid_image)
        UserLikesContent.objects.create(user=self.other_user, content=post)
        self.authenticate(self.other_user)
        url = reverse("post-like", kwargs={"post_id": post.id})

        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data["liked"])
        self.assertFalse(UserLikesContent.objects.filter(user=self.other_user, content=post).exists())

    def test_unlike_post_not_liked(self):
        post = Post.objects.create(user=self.user, description="Not liked", file=self.valid_image)
        self.authenticate(self.other_user)
        url = reverse("post-like", kwargs={"post_id": post.id})

        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data["liked"])

    def test_create_comment_authenticated(self):
        post = Post.objects.create(user=self.user, description="Comment me", file=self.valid_image)
        self.authenticate(self.other_user)
        url = reverse("post-comments-create-list", kwargs={"post_id": post.id})

        response = self.client.post(url, {"commentary": "Nice post"})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Comment.objects.count(), 1)
        comment = Comment.objects.first()
        self.assertEqual(comment.commentary, "Nice post")
        self.assertEqual(comment.user, self.other_user)

    def test_create_comment_invalid(self):
        post = Post.objects.create(user=self.user, description="Comment me", file=self.valid_image)
        self.authenticate(self.other_user)
        url = reverse("post-comments-create-list", kwargs={"post_id": post.id})

        response = self.client.post(url, {"commentary": ""})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Comment.objects.count(), 0)

    def test_list_comments_only_for_post(self):
        post1 = Post.objects.create(user=self.user, description="Post 1", file=self.valid_image)
        post2 = Post.objects.create(user=self.user, description="Post 2", file=self.valid_image)

        Comment.objects.create(user=self.user, lf_content=post1, commentary="Comment 1")
        Comment.objects.create(user=self.other_user, lf_content=post2, commentary="Comment 2")

        self.authenticate()
        url = reverse("post-comments-create-list", kwargs={"post_id": post1.id})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        comments = [c["commentary"] for c in response.data["results"]]
        self.assertIn("Comment 1", comments)
        self.assertNotIn("Comment 2", comments)

    def test_comments_include_likes_metadata(self):
        post = Post.objects.create(user=self.user, description="Post with comment", file=self.valid_image)
        comment = Comment.objects.create(user=self.user, lf_content=post, commentary="A comment")
        UserLikesContent.objects.create(user=self.other_user, content=comment)

        self.authenticate(self.other_user)
        url = reverse("post-comments-create-list", kwargs={"post_id": post.id})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        comment_data = response.data["results"][0]
        self.assertEqual(comment_data["likes_count"], 1)
        self.assertTrue(comment_data["is_liked"])


class PostVisibilityAPITests(APITestCase):

    def setUp(self):
        self.client = APIClient()
        
        self.user = User.objects.create_user(username="user1", password="pass")
        self.friend = User.objects.create_user(username="friend", password="pass")
        self.non_friend = User.objects.create_user(username="nonfriend", password="pass")

        
        self.user.is_private = True
        self.user.save()

        
        Friend.objects.create(user1=min(self.user, self.friend, key=lambda u: u.id),
                              user2=max(self.user, self.friend, key=lambda u: u.id))

        self.valid_image = create_test_image()

    def authenticate(self, user):
        self.client.force_authenticate(user=user)

    def test_non_friend_cannot_view_private_post(self):
        post = Post.objects.create(user=self.user, description="Private Post", file=self.valid_image)
        self.authenticate(self.non_friend)
        url = reverse("post-retrieve-destroy", args=[post.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_friend_can_view_private_post(self):
        post = Post.objects.create(user=self.user, description="Private Post", file=self.valid_image)
        self.authenticate(self.friend)
        url = reverse("post-retrieve-destroy", args=[post.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], post.id)

    def test_owner_can_view_own_private_post(self):
        post = Post.objects.create(user=self.user, description="Private Post", file=self.valid_image)
        self.authenticate(self.user)
        url = reverse("post-retrieve-destroy", args=[post.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_non_friend_cannot_like_private_post(self):
        post = Post.objects.create(user=self.user, description="Private Post", file=self.valid_image)
        self.authenticate(self.non_friend)
        url = reverse("post-like", kwargs={"post_id": post.id})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_friend_can_like_private_post(self):
        post = Post.objects.create(user=self.user, description="Private Post", file=self.valid_image)
        self.authenticate(self.friend)
        url = reverse("post-like", kwargs={"post_id": post.id})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(UserLikesContent.objects.filter(user=self.friend, content=post).exists())

    def test_owner_can_like_own_private_post(self):
        post = Post.objects.create(user=self.user, description="Private Post", file=self.valid_image)
        self.authenticate(self.user)
        url = reverse("post-like", kwargs={"post_id": post.id})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_non_friend_cannot_unlike_private_post(self):
        post = Post.objects.create(user=self.user, description="Private Post", file=self.valid_image)
        UserLikesContent.objects.create(user=self.non_friend, content=post)  
        self.authenticate(self.non_friend)
        url = reverse("post-like", kwargs={"post_id": post.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_friend_can_unlike_private_post(self):
        post = Post.objects.create(user=self.user, description="Private Post", file=self.valid_image)
        UserLikesContent.objects.create(user=self.friend, content=post)
        self.authenticate(self.friend)
        url = reverse("post-like", kwargs={"post_id": post.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(UserLikesContent.objects.filter(user=self.friend, content=post).exists())

    def test_non_friend_cannot_comment_private_post(self):
        post = Post.objects.create(user=self.user, description="Private Post", file=self.valid_image)
        self.authenticate(self.non_friend)
        url = reverse("post-comments-create-list", kwargs={"post_id": post.id})
        response = self.client.post(url, {"commentary": "Hello"})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(Comment.objects.count(), 0)

    def test_friend_can_comment_private_post(self):
        post = Post.objects.create(user=self.user, description="Private Post", file=self.valid_image)
        self.authenticate(self.friend)
        url = reverse("post-comments-create-list", kwargs={"post_id": post.id})
        response = self.client.post(url, {"commentary": "Hello Friend"})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Comment.objects.count(), 1)
        self.assertEqual(Comment.objects.first().user, self.friend)

    def test_owner_can_comment_own_private_post(self):
        post = Post.objects.create(user=self.user, description="Private Post", file=self.valid_image)
        self.authenticate(self.user)
        url = reverse("post-comments-create-list", kwargs={"post_id": post.id})
        response = self.client.post(url, {"commentary": "My own comment"})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Comment.objects.count(), 1)
    
    def test_non_friend_can_view_public_post(self):
        self.user.is_private = False
        self.user.save()
        post = Post.objects.create(user=self.user, description="Public Post", file=self.valid_image)
        self.authenticate(self.non_friend)
        url = reverse("post-retrieve-destroy", args=[post.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_non_friend_can_like_public_post(self):
        self.user.is_private = False
        self.user.save()
        post = Post.objects.create(user=self.user, description="Public Post", file=self.valid_image)
        self.authenticate(self.non_friend)
        url = reverse("post-like", kwargs={"post_id": post.id})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_non_friend_can_comment_public_post(self):
        self.user.is_private = False
        self.user.save()
        post = Post.objects.create(user=self.user, description="Public Post", file=self.valid_image)
        self.authenticate(self.non_friend)
        url = reverse("post-comments-create-list", kwargs={"post_id": post.id})
        response = self.client.post(url, {"commentary": "Public comment"})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

class PostFavoriteAPITests(APITestCase):

    def setUp(self):
        self.client = APIClient()

        self.user = User.objects.create_user(username="user1", password="pass")
        self.other_user = User.objects.create_user(username="user2", password="pass")

        self.valid_image = create_test_image()

        self.post1 = Post.objects.create(user=self.user, description="Post 1", file=self.valid_image)
        self.post2 = Post.objects.create(user=self.user, description="Post 2", file=self.valid_image)

    def authenticate(self, user):
        self.client.force_authenticate(user=user)

    def test_favorite_post(self):
        self.authenticate(self.other_user)
        url = reverse("post-favorite-create-delete", kwargs={"post_id": self.post1.id})

        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data["favorited"])
        self.assertTrue(
            FavoritePost.objects.filter(user=self.other_user, post=self.post1).exists()
        )

    def test_favorite_post_twice(self):
        self.authenticate(self.other_user)
        url = reverse("post-favorite-create-delete", kwargs={"post_id": self.post1.id})

        self.client.post(url)
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            FavoritePost.objects.filter(user=self.other_user, post=self.post1).count(), 1
        )

    def test_unfavorite_post(self):
        FavoritePost.objects.create(user=self.other_user, post=self.post1)

        self.authenticate(self.other_user)
        url = reverse("post-favorite-create-delete", kwargs={"post_id": self.post1.id})

        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data["favorited"])
        self.assertFalse(
            FavoritePost.objects.filter(user=self.other_user, post=self.post1).exists()
        )

    def test_unfavorite_post_not_favorited(self):
        self.authenticate(self.other_user)
        url = reverse("post-favorite-create-delete", kwargs={"post_id": self.post1.id})

        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_favorite_requires_authentication(self):
        url = reverse("post-favorite-create-delete", kwargs={"post_id": self.post1.id})

        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_favorited_posts(self):
        FavoritePost.objects.create(user=self.other_user, post=self.post1)
        FavoritePost.objects.create(user=self.other_user, post=self.post2)

        self.authenticate(self.other_user)
        url = reverse("post-favorite-list")

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data["results"]

        returned_ids = [p["id"] for p in results]
        self.assertIn(self.post1.id, returned_ids)
        self.assertIn(self.post2.id, returned_ids)

    def test_list_only_user_favorites(self):
        FavoritePost.objects.create(user=self.other_user, post=self.post1)
        FavoritePost.objects.create(user=self.user, post=self.post2)

        self.authenticate(self.other_user)
        url = reverse("post-favorite-list")

        response = self.client.get(url)

        results = response.data["results"]
        returned_ids = [p["id"] for p in results]

        self.assertIn(self.post1.id, returned_ids)
        self.assertNotIn(self.post2.id, returned_ids)

    def test_favorites_ordered_by_most_recent(self):
        import time

        self.authenticate(self.other_user)

        FavoritePost.objects.create(user=self.other_user, post=self.post1)
        time.sleep(0.01)
        FavoritePost.objects.create(user=self.other_user, post=self.post2)

        url = reverse("post-favorite-list")
        response = self.client.get(url)

        results = response.data["results"]

        self.assertEqual(results[0]["id"], self.post2.id)
        self.assertEqual(results[1]["id"], self.post1.id)

    def test_cannot_favorite_invisible_post(self):
        self.user.is_private = True
        self.user.save()

        self.authenticate(self.other_user)
        url = reverse("post-favorite-create-delete", kwargs={"post_id": self.post1.id})

        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_owner_can_favorite_own_post(self):
        self.authenticate(self.user)
        url = reverse("post-favorite-create-delete", kwargs={"post_id": self.post1.id})

        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_favorite_list_respects_visibility(self):
        self.user.is_private = True
        self.user.save()

        FavoritePost.objects.create(user=self.other_user, post=self.post1)

        self.authenticate(self.other_user)
        url = reverse("post-favorite-list")

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 0)

    def test_favorite_deleted_post(self):
        self.authenticate(self.other_user)

        post_id = self.post1.id
        self.post1.delete()

        url = reverse("post-favorite-create-delete", kwargs={"post_id": post_id})
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)