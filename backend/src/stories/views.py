from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveDestroyAPIView
)
from rest_framework.permissions import IsAuthenticated
from common.permissions import IsOwnerOrReadOnly
from .serializers import StoryFeedSerializer, StorySerializer
from .models import Story
from django.utils import timezone
from datetime import timedelta
from rest_framework.views import APIView
from content.utils import (
    create_like_for_content,
    remove_like_from_content,
)
from collections import OrderedDict
from rest_framework.response import Response

class StoryCreateListView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = StorySerializer

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
    
    def post(self, request, story_id):
        return create_like_for_content(request, story_id)

    def delete(self, request, story_id):
        return remove_like_from_content(request, story_id)
