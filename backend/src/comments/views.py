from drf_spectacular.utils import OpenApiResponse, extend_schema, extend_schema_view
from rest_framework.generics import RetrieveDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from .serializers import CommentSerializer
from .models import Comment
from common.permissions import IsOwnerOrReadOnly
from common.serializers import DetailResponseSerializer, LikeToggleResponseSerializer
from rest_framework.views import APIView
from django.db.models import Q
from content.utils import (
    create_like_for_content,
    remove_like_from_content
)


def get_visible_comments_queryset(user):
    if not getattr(user, "is_authenticated", False):
        return Comment.objects.none()

    return (
        Comment.objects
        .with_likes_data(user)
        .filter(
            Q(lf_content__user__is_private=False) |
            Q(lf_content__user=user) |
            Q(lf_content__user__in=user.friends)
        )
        .select_related("lf_content", "lf_content__user")
    )


@extend_schema(tags=["Comments"])
@extend_schema_view(
    get=extend_schema(
        summary="Get comment",
        description="Retrieve a visible comment by id.",
    ),
    delete=extend_schema(
        summary="Delete comment",
        description="Delete a comment owned by the authenticated user.",
        responses={204: OpenApiResponse(description="Comment deleted.")},
    ),
)
class CommentRetrieveDestroyView(RetrieveDestroyAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    lookup_url_kwarg = "comment_id"
    lookup_field = "id"

    def get_queryset(self):
        return (
            get_visible_comments_queryset(self.request.user)
            .order_by("-likes_count")
        )

class CommentLikeView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=None,
        responses={
            200: LikeToggleResponseSerializer,
            201: LikeToggleResponseSerializer,
            404: DetailResponseSerializer,
        },
        tags=["Comments"],
        summary="Like comment",
        description="Add a like to a visible comment.",
    )
    def post(self, request, comment_id):
        return create_like_for_content(
            request,
            comment_id,
            queryset=get_visible_comments_queryset(request.user),
        )

    @extend_schema(
        request=None,
        responses={
            200: LikeToggleResponseSerializer,
            404: DetailResponseSerializer,
        },
        tags=["Comments"],
        summary="Unlike comment",
        description="Remove a like from a visible comment.",
    )
    def delete(self, request, comment_id):
        return remove_like_from_content(
            request,
            comment_id,
            queryset=get_visible_comments_queryset(request.user),
        )
