from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveDestroyAPIView
)
from rest_framework.permissions import IsAuthenticated
from common.permissions import IsOwnerOrReadOnly
from .serializers import PostSerializer
from .models import Post
from rest_framework.views import APIView
from content.utils import (
    create_like_for_content,
    remove_like_from_content,
)
from comments.serializers import CommentSerializer
from content.utils import (
    create_comment_for_lf_content,
    get_queryset_comments_for_lf_content,
)

class PostCreateListView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PostSerializer

    def perform_create(self, serializer):
        serializer.save(user = self.request.user)

    def get_queryset(self):
        return (
            Post.objects
            .with_likes_data(self.request.user)
            .order_by("-likes_count")
        )

class PostRetrieveDestroyView(RetrieveDestroyAPIView):
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    serializer_class = PostSerializer
    lookup_url_kwarg = "post_id"
    lookup_field = "id"

    def get_queryset(self):
        return (
            Post.objects
            .with_likes_data(self.request.user)
        )

class PostLikeView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, post_id):
        return create_like_for_content(request, post_id)

    def delete(self, request, post_id):
        return remove_like_from_content(request, post_id)
    
class PostCommentsCreateListView(ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    
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