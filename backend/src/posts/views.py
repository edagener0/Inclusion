from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveAPIView
)
from rest_framework.permissions import IsAuthenticated
from common.permissions import IsOwnerOrReadOnly
from .serializers import PostSerializer
from .models import Post


class PostCreateListView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PostSerializer
    queryset = Post.objects.all().order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(user = self.request.user)

class PostRetrieveView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PostSerializer
    queryset = Post.objects.all()