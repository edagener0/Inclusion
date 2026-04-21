from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveDestroyAPIView,
)
from drf_spectacular.utils import OpenApiResponse, extend_schema, extend_schema_view
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from common.permissions import IsOwnerOrReadOnly
from common.serializers import DetailResponseSerializer, LikeToggleResponseSerializer
from .serializers import IncSerializer
from .models import Inc
from content.utils import (
    create_like_for_content,
    remove_like_from_content
)
from comments.models import Comment
from comments.serializers import CommentSerializer
from content.utils import (
    create_comment_for_lf_content,
    get_queryset_comments_for_lf_content,
)
from content.views import BaseFavoriteListView, FavoriteToggleView


@extend_schema(tags=["Incs"])
@extend_schema_view(
    get=extend_schema(
        summary="List incs",
        description="List the incs visible to the authenticated user, ordered from newest to oldest.",
    ),
    post=extend_schema(
        summary="Create inc",
        description="Create a new inc for the authenticated user.",
    ),
)
class IncCreateListView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = IncSerializer
    queryset = Inc.objects.none()

    def perform_create(self, serializer):
        serializer.save(user = self.request.user)

    def get_queryset(self):
        return (
            Inc.objects
            .visible_to(self.request.user)
            .with_likes_data(self.request.user)
            .order_by("-created_at")
        )

@extend_schema(tags=["Incs"])
@extend_schema_view(
    get=extend_schema(
        summary="Get inc",
        description="Retrieve a visible inc by id.",
    ),
    delete=extend_schema(
        summary="Delete inc",
        description="Delete an inc owned by the authenticated user.",
        responses={204: OpenApiResponse(description="Inc deleted.")},
    ),
)
class IncRetrieveDestroyView(RetrieveDestroyAPIView):
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    serializer_class = IncSerializer
    queryset = Inc.objects.all()
    lookup_url_kwarg = "inc_id"
    lookup_field = "id"

    def get_queryset(self):
        return (
            Inc.objects
            .visible_to(self.request.user)
            .with_likes_data(self.request.user)
        )


class IncLikeView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=None,
        responses={
            200: LikeToggleResponseSerializer,
            201: LikeToggleResponseSerializer,
            404: DetailResponseSerializer,
        },
        tags=["Incs"],
        summary="Like inc",
        description="Add a like to a visible inc.",
    )
    def post(self, request, inc_id):
        return create_like_for_content(
            request,
            inc_id,
            queryset=Inc.objects.visible_to(request.user),
        )

    @extend_schema(
        request=None,
        responses={
            200: LikeToggleResponseSerializer,
            404: DetailResponseSerializer,
        },
        tags=["Incs"],
        summary="Unlike inc",
        description="Remove a like from a visible inc.",
    )
    def delete(self, request, inc_id):
        return remove_like_from_content(
            request,
            inc_id,
            queryset=Inc.objects.visible_to(request.user),
        )
    

@extend_schema(tags=["Incs"])
@extend_schema_view(
    get=extend_schema(
        summary="List inc comments",
        description="List the comments for a visible inc.",
    ),
    post=extend_schema(
        summary="Create inc comment",
        description="Create a new comment on a visible inc.",
    ),
)
class IncCommentsCreateListView(ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    queryset = Comment.objects.none()
    
    def perform_create(self, serializer):
        create_comment_for_lf_content(
            Inc,
            self.kwargs["inc_id"],
            serializer,
            self.request.user
        )

    def get_queryset(self):
        return get_queryset_comments_for_lf_content(
            Inc,
            self.kwargs["inc_id"],
            self.request.user
        )
    

@extend_schema(tags=["Incs"])
class IncFavoriteToggleView(FavoriteToggleView):
    model = Inc


@extend_schema(
    tags=["Incs"],
    summary="List favorite incs",
    description="List the authenticated user's favorite incs.",
)
class IncFavoriteListView(BaseFavoriteListView):
    model = Inc
    serializer_class = IncSerializer
    queryset = Inc.objects.none()
