from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveDestroyAPIView
)
from drf_spectacular.utils import OpenApiResponse, extend_schema, extend_schema_view
from rest_framework.permissions import IsAuthenticated
from common.permissions import IsOwnerOrReadOnly
from .serializers import StoryFeedSerializer, StorySerializer
from .models import Story
from django.utils import timezone
from datetime import timedelta
from rest_framework.views import APIView
from common.serializers import DetailResponseSerializer, LikeToggleResponseSerializer
from content.utils import (
    create_like_for_content,
    remove_like_from_content,
)
from collections import OrderedDict
from rest_framework.response import Response

@extend_schema(tags=["Stories"])
@extend_schema_view(
    get=extend_schema(
        summary="List stories",
        description="List the last 24 hours of visible stories grouped by user.",
        responses=StoryFeedSerializer(many=True),
    ),
    post=extend_schema(
        summary="Create story",
        description="Create a new story for the authenticated user.",
    ),
)
class StoryCreateListView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = StorySerializer
    queryset = Story.objects.none()

    def perform_create(self, serializer):
        serializer.save(user = self.request.user)

    def get_queryset(self):
        now = timezone.now()
        last_24h = now - timedelta(hours=24)

        return (
            Story.objects
            .visible_to_friends(self.request.user)
            .with_likes_data(self.request.user)
            .select_related("user")
            .filter(created_at__gte=last_24h)
            .order_by("created_at")
        )
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        user_stories = OrderedDict()
        serializer_context = self.get_serializer_context()

        for story in queryset:
            user_id = story.user.id
            if user_id not in user_stories: #Criar um novo grupo para o usuário se ainda não existir
                user_stories[user_id] = {
                    "user": story.user,
                    "stories": [],
                }
            user_stories[user_id]["stories"].append(story) #Adicionar a história ao grupo do usuário correspondente

        grouped_stories = list(user_stories.values())
        page = self.paginate_queryset(grouped_stories)
        if page is not None:
            serializer = StoryFeedSerializer(
                page,
                many=True,
                context=serializer_context,
            )
            return self.get_paginated_response(serializer.data)

        serializer = StoryFeedSerializer(
            grouped_stories,
            many=True,
            context=serializer_context,
        )
        return Response(serializer.data)
    
@extend_schema(tags=["Stories"])
@extend_schema_view(
    get=extend_schema(
        summary="Get story",
        description="Retrieve a visible story from the last 24 hours by id.",
    ),
    delete=extend_schema(
        summary="Delete story",
        description="Delete a story owned by the authenticated user.",
        responses={204: OpenApiResponse(description="Story deleted.")},
    ),
)
class StoryRetrieveDestroyView(RetrieveDestroyAPIView):
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    serializer_class = StorySerializer
    queryset = Story.objects.all()
    lookup_url_kwarg = "story_id"
    lookup_field = "id"

    def get_queryset(self):
        now = timezone.now()
        last_24h = now - timedelta(hours=24)

        return (
            Story.objects
            .visible_to(self.request.user)
            .with_likes_data(self.request.user)
            .filter(created_at__gte=last_24h)
            .order_by("-likes_count")
        )
        

class StoryLikeView(APIView):
    permission_classes = [IsAuthenticated]
    
    @extend_schema(
        request=None,
        responses={
            200: LikeToggleResponseSerializer,
            201: LikeToggleResponseSerializer,
            404: DetailResponseSerializer,
        },
        tags=["Stories"],
        summary="Like story",
        description="Add a like to a visible story.",
    )
    def post(self, request, story_id):
        return create_like_for_content(
            request,
            story_id,
            queryset=Story.objects.visible_to(request.user),
        )

    @extend_schema(
        request=None,
        responses={
            200: LikeToggleResponseSerializer,
            404: DetailResponseSerializer,
        },
        tags=["Stories"],
        summary="Unlike story",
        description="Remove a like from a visible story.",
    )
    def delete(self, request, story_id):
        return remove_like_from_content(
            request,
            story_id,
            queryset=Story.objects.visible_to(request.user),
        )
