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
    description="Get a user's profile."
)
class ProfileRetrieveView(FriendAnnotationMixin, RetrieveAPIView):
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = ProfileSerializer
    lookup_field = "username"
    lookup_url_kwarg = "username"
    

@extend_schema(
    tags=["Profiles"],
    description="Returns a list of paginated users' profiles."
)
class ProfileListView(FriendAnnotationMixin, ListAPIView):
    queryset = User.objects.all().order_by("first_name")
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]
    filterset_class = ProfileFilter

@extend_schema(
    tags=["Profiles"],
    description="Returns a list of paginated user posts."
)
class ProfilePostListView(ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        username = self.kwargs["username"]
        
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
    description="Returns a list of paginated user incs."
)
class ProfileIncListVIew(ListAPIView):
    serializer_class = IncSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        username = self.kwargs["username"]

        try:
            target_user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise NotFound(detail="User not found")

        qs = Inc.objects.visible_to(self.request.user).filter(user=target_user).with_likes_data(self.request.user).order_by("-created_at")
        
        if not qs.exists() and target_user.is_private and target_user != self.request.user and not target_user in self.request.user.friends:
            raise NotFound(detail="No incs available or not allowed to view")

        return qs