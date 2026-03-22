from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveDestroyAPIView,
    ListAPIView
)
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from common.permissions import IsOwnerOrReadOnly
from .serializers import IncSerializer
from .models import Inc, FavoriteInc
from content.utils import (
    create_like_for_content,
    remove_like_from_content
)
from comments.serializers import CommentSerializer
from content.utils import (
    create_comment_for_lf_content,
    get_queryset_comments_for_lf_content,
)
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status

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
    
class IncFavoriteToggleView(APIView):
    permission_classes = [IsAuthenticated]

    def get_inc(self, request, inc_id):
        return get_object_or_404(
            Inc.objects.visible_to(request.user),
            id=inc_id
        )

    def post(self, request, inc_id):
        inc = self.get_inc(request, inc_id)

        fav, created = FavoriteInc.objects.get_or_create(
            user=self.request.user,
            inc=inc
        )

        return Response(
            {
                "detail": "Favorited successfully." if created else "Already favorited.",
                "favorited": True
            },
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
        )

    def delete(self, request, inc_id):
        inc = self.get_inc(request, inc_id)

        fav = get_object_or_404(FavoriteInc, user=self.request.user, inc=inc)

        fav.delete()

        return Response(
            {"detail": "Removed from favorites", "favorited": False},
            status=status.HTTP_200_OK
        )


class FavoriteIncListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = IncSerializer

    def get_queryset(self):
        return (
            Inc.objects
            .filter(favorited_by__user=self.request.user)
            .visible_to(self.request.user)
            .with_likes_data(self.request.user)
            .order_by("-created_at")
        )