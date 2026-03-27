from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from content.models import LongFormContent, UserLikesContent
from comments.models import Comment
from posts.models import Post
from incs.models import Inc
from friends.models import Friend

User = get_user_model()


def create_test_image():
    return SimpleUploadedFile("comment-test.jpg", b"file_content", content_type="image/jpeg")


class CommentRetrieveDestroyTests(APITestCase):

    def setUp(self):
        self.client = APIClient()

        self.user1 = User.objects.create_user(username="user1", password="pass")
        self.user2 = User.objects.create_user(username="user2", password="pass")

        self.lf_content = LongFormContent.objects.create(user=self.user1)

        self.comment = Comment.objects.create(
            user=self.user1,
            lf_content=self.lf_content,
            commentary="Test comment"
        )

        self.url = reverse(
            "comment-retrieve-destroy",
            kwargs={"comment_id": self.comment.id}
        )

    def authenticate(self, user=None):
        self.client.force_authenticate(user=user or self.user1)

    def test_retrieve_comment_includes_like_fields(self):
        self.authenticate(self.user2)

        
        UserLikesContent.objects.create(user=self.user2, content=self.comment)

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["commentary"], "Test comment")
        self.assertEqual(response.data["likes_count"], 1)
        self.assertTrue(response.data["is_liked"])

    def test_retrieve_comment_not_liked(self):
        self.authenticate(self.user2)

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["likes_count"], 0)
        self.assertFalse(response.data["is_liked"])

    def test_delete_comment_owner(self):
        self.authenticate(self.user1)

        response = self.client.delete(self.url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(
            Comment.objects.filter(id=self.comment.id).exists()
        )

    def test_delete_comment_other_user_forbidden(self):
        self.authenticate(self.user2)

        response = self.client.delete(self.url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_retrieve_comment_unauthenticated(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

class CommentLikeViewTests(APITestCase):

    def setUp(self):
        self.client = APIClient()

        self.user1 = User.objects.create_user(username="user1", password="pass")
        self.user2 = User.objects.create_user(username="user2", password="pass")

        self.lf_content = LongFormContent.objects.create(user=self.user1)

        self.comment = Comment.objects.create(
            user=self.user1,
            lf_content=self.lf_content,
            commentary="Comment to like"
        )

        self.like_url = reverse(
            "comment-like",
            kwargs={"comment_id": self.comment.id}
        )

    def authenticate(self, user):
        self.client.force_authenticate(user=user)

    def test_like_comment(self):
        self.authenticate(self.user2)

        response = self.client.post(self.like_url)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            UserLikesContent.objects.filter(
                user=self.user2,
                content=self.comment
            ).exists()
        )

    def test_like_comment_twice(self):
        self.authenticate(self.user2)

        self.client.post(self.like_url)
        response = self.client.post(self.like_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            UserLikesContent.objects.filter(
                user=self.user2,
                content=self.comment
            ).count(),
            1
        )

    def test_unlike_comment(self):
        UserLikesContent.objects.create(
            user=self.user2,
            content=self.comment
        )

        self.authenticate(self.user2)

        response = self.client.delete(self.like_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(
            UserLikesContent.objects.filter(
                user=self.user2,
                content=self.comment
            ).exists()
        )

    def test_like_unauthenticated(self):
        response = self.client.post(self.like_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class CommentVisibilityTests(APITestCase):

    def setUp(self):
        self.client = APIClient()

        self.owner = User.objects.create_user(username="owner", password="pass")
        self.friend = User.objects.create_user(username="friend", password="pass")
        self.outsider = User.objects.create_user(username="outsider", password="pass")

        self.owner.is_private = True
        self.owner.save()

        Friend.objects.create(
            user1=min(self.owner, self.friend, key=lambda user: user.id),
            user2=max(self.owner, self.friend, key=lambda user: user.id),
        )

        self.private_post = Post.objects.create(
            user=self.owner,
            description="Private post",
            file=create_test_image(),
        )
        self.private_inc = Inc.objects.create(
            user=self.owner,
            content="Private inc",
        )

        self.owner_post_comment = Comment.objects.create(
            user=self.owner,
            lf_content=self.private_post,
            commentary="Owner comment",
        )
        self.friend_inc_comment = Comment.objects.create(
            user=self.friend,
            lf_content=self.private_inc,
            commentary="Friend comment",
        )

    def authenticate(self, user):
        self.client.force_authenticate(user=user)

    def test_non_friend_cannot_retrieve_comment_for_private_post(self):
        self.authenticate(self.outsider)

        response = self.client.get(
            reverse(
                "comment-retrieve-destroy",
                kwargs={"comment_id": self.owner_post_comment.id},
            )
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_non_friend_cannot_like_comment_for_private_inc(self):
        self.authenticate(self.outsider)

        response = self.client.post(
            reverse(
                "comment-like",
                kwargs={"comment_id": self.friend_inc_comment.id},
            )
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertFalse(
            UserLikesContent.objects.filter(
                user=self.outsider,
                content=self.friend_inc_comment,
            ).exists()
        )

    def test_friend_can_retrieve_comment_for_private_post(self):
        self.authenticate(self.friend)

        response = self.client.get(
            reverse(
                "comment-retrieve-destroy",
                kwargs={"comment_id": self.owner_post_comment.id},
            )
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], self.owner_post_comment.id)

    def test_owner_can_like_own_comment_on_private_post(self):
        self.authenticate(self.owner)

        response = self.client.post(
            reverse(
                "comment-like",
                kwargs={"comment_id": self.owner_post_comment.id},
            )
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            UserLikesContent.objects.filter(
                user=self.owner,
                content=self.owner_post_comment,
            ).exists()
        )
