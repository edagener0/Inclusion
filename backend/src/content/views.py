from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from .utils import (
    toggle_favorite,
    remove_favorite
)
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.contrib.contenttypes.models import ContentType
from django.db.models import OuterRef, Subquery
from .models import Favorite
from common.serializers import (
    DetailResponseSerializer,
    FavoriteToggleResponseSerializer,
)

class BaseFavoriteListView(ListAPIView):
    permission_classes = [IsAuthenticated]

    model = None
    serializer_class = None

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False) or self.model is None:
            return Favorite.objects.none()

        content_type = ContentType.objects.get_for_model(self.model)

        favorite_subquery = Favorite.objects.filter(
            user=self.request.user,
            content_type=content_type,
            object_id=OuterRef("pk"),
        ).values("created_at")[:1]

        return (
            self.model.objects
            .filter(
                id__in=Favorite.objects.filter(
                    user=self.request.user,
                    content_type=content_type
                ).values("object_id")
            )
            .annotate(favorited_at=Subquery(favorite_subquery))
            .visible_to(self.request.user)
            .with_likes_data(self.request.user)
            .order_by("-favorited_at")
        )
    
class FavoriteToggleView(APIView):
    permission_classes = [IsAuthenticated]
    model = None

    @extend_schema(
        request=None,
        responses={
            200: FavoriteToggleResponseSerializer,
            201: FavoriteToggleResponseSerializer,
            404: DetailResponseSerializer,
        },
        summary="Add favorite",
        description="Add the selected item to the authenticated user's favorites.",
    )
    def post(self, request, **kwargs):
        obj = self._get_object(request, **kwargs)
        _, created = toggle_favorite(request.user, obj)

        return Response(
            {
                "favorited": True,
                "detail": "Favorited successfully." if created else "Already favorited.",
            },
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
        )

    @extend_schema(
        request=None,
        responses={
            200: FavoriteToggleResponseSerializer,
            404: DetailResponseSerializer,
        },
        summary="Remove favorite",
        description="Remove the selected item from the authenticated user's favorites.",
    )
    def delete(self, request, **kwargs):
        obj = self._get_object(request, **kwargs)
        remove_favorite(request.user, obj)

        return Response(
            {"favorited": False, "detail": "Removed from favorites"},
            status=status.HTTP_200_OK
        )

    def _get_object(self, request, **kwargs):
        pk = next(iter(kwargs.values()))
        return get_object_or_404(
            self.model.objects.visible_to(request.user),
            id=pk
        )
