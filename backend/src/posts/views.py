from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveDestroyAPIView,
)
from drf_spectacular.utils import OpenApiResponse, extend_schema, extend_schema_view
from rest_framework.permissions import IsAuthenticated
from common.permissions import IsOwnerOrReadOnly
from common.serializers import DetailResponseSerializer, LikeToggleResponseSerializer
from .serializers import PostSerializer
from .models import Post
from rest_framework.views import APIView
from content.utils import (
    create_like_for_content,
    remove_like_from_content,
)
from comments.models import Comment
from comments.serializers import CommentSerializer
from content.utils import (
    create_comment_for_lf_content,
    get_queryset_comments_for_lf_content,
)
from content.views import BaseFavoriteListView, FavoriteToggleView


@extend_schema(tags=["Posts"])
@extend_schema_view(
    get=extend_schema(
        summary="List posts",
        description="List the posts visible to the authenticated user, ordered from newest to oldest.",
    ),
    post=extend_schema(
        summary="Create post",
        description="Create a new post for the authenticated user.",
    ),
)
class PostCreateListView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PostSerializer
    queryset = Post.objects.none()

    def perform_create(self, serializer):
        serializer.save(user = self.request.user)

    def get_queryset(self):
        return (
            Post.objects
            .visible_to(self.request.user)
            .with_likes_data(self.request.user)
            .order_by("-created_at")
        )

@extend_schema(tags=["Posts"])
@extend_schema_view(
    get=extend_schema(
        summary="Get post",
        description="Retrieve a visible post by id.",
    ),
    delete=extend_schema(
        summary="Delete post",
        description="Delete a post owned by the authenticated user.",
        responses={204: OpenApiResponse(description="Post deleted.")},
    ),
)
class PostRetrieveDestroyView(RetrieveDestroyAPIView):
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    serializer_class = PostSerializer
    lookup_url_kwarg = "post_id"
    lookup_field = "id"

    def get_queryset(self):
        return (
            Post.objects
            .visible_to(self.request.user)
            .with_likes_data(self.request.user)
        )

class PostLikeView(APIView):
    permission_classes = [IsAuthenticated]
    
    @extend_schema(
        request=None,
        responses={
            200: LikeToggleResponseSerializer,
            201: LikeToggleResponseSerializer,
            404: DetailResponseSerializer,
        },
        tags=["Posts"],
        summary="Like post",
        description="Add a like to a visible post.",
    )
    def post(self, request, post_id):
        return create_like_for_content(
            request,
            post_id,
            queryset=Post.objects.visible_to(request.user),
        )

    @extend_schema(
        request=None,
        responses={
            200: LikeToggleResponseSerializer,
            404: DetailResponseSerializer,
        },
        tags=["Posts"],
        summary="Unlike post",
        description="Remove a like from a visible post.",
    )
    def delete(self, request, post_id):
        return remove_like_from_content(
            request,
            post_id,
            queryset=Post.objects.visible_to(request.user),
        )
    
@extend_schema(tags=["Posts"])
@extend_schema_view(
    get=extend_schema(
        summary="List post comments",
        description="List the comments for a visible post.",
    ),
    post=extend_schema(
        summary="Create post comment",
        description="Create a new comment on a visible post.",
    ),
)
class PostCommentsCreateListView(ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    queryset = Comment.objects.none()
    
    def perform_create(self, serializer):
        create_comment_for_lf_content(
            Post,
            self.kwargs["post_id"],
            serializer,
            self.request.user
        )

    def get_queryset(self):
        return get_queryset_comments_for_lf_content(
            Post,
            self.kwargs["post_id"],
            self.request.user
        )
    
@extend_schema(tags=["Posts"])
class PostFavoriteToggleView(FavoriteToggleView):
    model = Post

@extend_schema(
    tags=["Posts"],
    summary="List favorite posts",
    description="List the authenticated user's favorite posts.",
)
class PostFavoriteListView(BaseFavoriteListView):
    model = Post
    serializer_class = PostSerializer
    queryset = Post.objects.none()
