from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveDestroyAPIView
)
from rest_framework.permissions import IsAuthenticated
from common.permissions import IsOwnerOrReadOnly
from .serializers import StoriesSerializer
from .models import Story


class StoriesCreateListView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = StoriesSerializer
    queryset = Story.objects.all().order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(user = self.request.user)

class StoriesRetrieveDestroyView(RetrieveDestroyAPIView):
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    serializer_class = StoriesSerializer
    queryset = Story.objects.all()