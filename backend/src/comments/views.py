from rest_framework.generics import RetrieveDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from .serializers import CommentSerializer
from .models import Comment
from common.permissions import IsOwnerOrReadOnly
from rest_framework.views import APIView
from content.utils import (
    create_like_for_content,
    remove_like_from_content
)

class CommentRetrieveDestroyView(RetrieveDestroyAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    queryset = Comment.objects.all()
    lookup_url_kwarg = "comment_id"
    lookup_field = "id"

class CommentLikeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, comment_id):
        return create_like_for_content(request, comment_id)

    def delete(self, request, comment_id):
        return remove_like_from_content(request, comment_id)