from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveDestroyAPIView,
)
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from common.permissions import IsOwnerOrReadOnly
from .serializers import IncSerializer
from .models import Inc
from content.utils import (
    create_like_for_content,
    remove_like_from_content
)
from comments.serializers import CommentSerializer
from content.utils import (
    create_comment_for_lf_content,
    get_queryset_comments_for_lf_content,
)
from content.views import BaseFavoriteListView, FavoriteToggleView


class IncCreateListView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = IncSerializer

    def perform_create(self, serializer):
        serializer.save(user = self.request.user)

    def get_queryset(self):
        return (
            Inc.objects
            .visible_to(self.request.user)
            .with_likes_data(self.request.user)
            .order_by("-created_at")
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

    def post(self, request, inc_id):
        return create_like_for_content(request, inc_id)

    def delete(self, request, inc_id):
        return remove_like_from_content(request, inc_id)
    

class IncCommentsCreateListView(ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    
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
    

class IncFavoriteToggleView(FavoriteToggleView):
    model = Inc


class IncFavoriteListView(BaseFavoriteListView):
    model = Inc
    serializer_class = IncSerializer