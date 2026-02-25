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

class PostCreateListView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PostSerializer
    queryset = Post.objects.all().order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(user = self.request.user)

class PostRetrieveDestroyView(RetrieveDestroyAPIView):
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    serializer_class = PostSerializer
    queryset = Post.objects.all()
    lookup_url_kwarg = "post_id"
    lookup_field = "id"

class PostLikeView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, post_id):
        return create_like_for_content(request, post_id)

    def delete(self, request, post_id):
        return remove_like_from_content(request, post_id)