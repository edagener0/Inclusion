from drf_spectacular.utils import (
    extend_schema,
)
from rest_framework.generics import ListAPIView, RetrieveAPIView
from .serializers import ProfileSerializer
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from .filters import ProfileFilter
from posts.serializers import PostSerializer
from incs.serializers import IncSerializer
from posts.models import Post
from incs.models import Inc
from rest_framework.exceptions import NotFound
from .mixins import FriendAnnotationMixin

User = get_user_model()

@extend_schema(
    tags=["Profiles"],
    summary="Get profile",
    description="Retrieve a public or permitted profile by username."
)
class ProfileRetrieveView(FriendAnnotationMixin, RetrieveAPIView):
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = ProfileSerializer
    lookup_field = "username"
    lookup_url_kwarg = "username"
    

@extend_schema(
    tags=["Profiles"],
    summary="List profiles",
    description="Return a paginated list of user profiles filtered by the configured profile filters."
)
class ProfileListView(FriendAnnotationMixin, ListAPIView):
    queryset = User.objects.all().order_by("first_name")
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]
    filterset_class = ProfileFilter

@extend_schema(
    tags=["Profiles"],
    summary="List user posts",
    description="Return the posts that the authenticated user is allowed to see for the selected profile."
)
class ProfilePostListView(ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
    queryset = Post.objects.none()

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return Post.objects.none()

        username = self.kwargs.get("username")
        if username is None:
            return Post.objects.none()
        
        try:
            target_user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise NotFound(detail="User not found")

        qs = Post.objects.visible_to(self.request.user).filter(user=target_user).with_likes_data(self.request.user).order_by("-created_at")
        
        if not qs.exists() and target_user.is_private and target_user != self.request.user and not target_user in self.request.user.friends:
            raise NotFound(detail="No posts available or not allowed to view")

        return qs
    
@extend_schema(
    tags=["Profiles"],
    summary="List user incs",
    description="Return the incs that the authenticated user is allowed to see for the selected profile."
)
class ProfileIncListVIew(ListAPIView):
    serializer_class = IncSerializer
    permission_classes = [IsAuthenticated]
    queryset = Inc.objects.none()

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return Inc.objects.none()

        username = self.kwargs.get("username")
        if username is None:
            return Inc.objects.none()

        try:
            target_user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise NotFound(detail="User not found")

        qs = Inc.objects.visible_to(self.request.user).filter(user=target_user).with_likes_data(self.request.user).order_by("-created_at")
        
        if not qs.exists() and target_user.is_private and target_user != self.request.user and not target_user in self.request.user.friends:
            raise NotFound(detail="No incs available or not allowed to view")

        return qs
