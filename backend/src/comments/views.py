from rest_framework.generics import RetrieveDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from .serializers import CommentSerializer
from .models import Comment
from common.permissions import IsOwnerOrReadOnly
from rest_framework.views import APIView
from django.db.models import Q
from content.utils import (
    create_like_for_content,
    remove_like_from_content
)


def get_visible_comments_queryset(user):
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

    def post(self, request, comment_id):
        return create_like_for_content(
            request,
            comment_id,
            queryset=get_visible_comments_queryset(request.user),
        )

    def delete(self, request, comment_id):
        return remove_like_from_content(
            request,
            comment_id,
            queryset=get_visible_comments_queryset(request.user),
        )
