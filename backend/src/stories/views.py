from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveAPIView
)
from rest_framework.permissions import IsAuthenticated
from common.permissions import IsOwnerOrReadOnly
from .serializers import StoriesSerializer
from .models import Story
from django.utils import timezone
from datetime import timedelta

class StoriesCreateListView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = StoriesSerializer

    def perform_create(self, serializer):
        serializer.save(user = self.request.user)

    def get_queryset(self):
        now = timezone.now()
        last_24h = now - timedelta(hours=24)
        return Story.objects.filter(created_at__gte=last_24h).order_by("-created_at")
    
class StoriesRetrieveView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = StoriesSerializer
    queryset = Story.objects.all()