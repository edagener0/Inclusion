from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveDestroyAPIView
)
from rest_framework.permissions import IsAuthenticated
from common.permissions import IsOwnerOrReadOnly
from .serializers import StorySerializer
from .models import Story
from django.utils import timezone
from datetime import timedelta
from rest_framework.views import APIView
from content.utils import (
    create_like_for_content,
    remove_like_from_content,
)

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
            .filter(created_at__gte=last_24h)
            .order_by("-created_at")
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
    
    def post(self, request, story_id):
        return create_like_for_content(request, story_id)

    def delete(self, request, story_id):
        return remove_like_from_content(request, story_id)