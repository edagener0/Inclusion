from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveDestroyAPIView
)
from rest_framework.permissions import IsAuthenticated
from .serializers import NoteSerializer
from .models import Note
from django.utils import timezone
from datetime import timedelta
from common.permissions import IsOwnerOrReadOnly
from rest_framework.views import APIView
from content.utils import (
    create_like_for_content,
    remove_like_from_content,
)

class NoteCreateListView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = NoteSerializer

    def perform_create(self, serializer):
        serializer.save(user = self.request.user)

    def get_queryset(self):
        now = timezone.now()
        last_24h = now - timedelta(hours=24)
        return Note.objects.with_likes_data(self.request.user).filter(created_at__gte=last_24h).order_by("-likes_count")

class NoteRetrieveDestroyView(RetrieveDestroyAPIView):
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    serializer_class = NoteSerializer
    lookup_url_kwarg = "note_id"
    lookup_field = "id"
    
    def get_queryset(self):
        now = timezone.now()
        last_24h = now - timedelta(hours=24)
        return (
            Note.objects
            .with_likes_data(self.request.user)
            .filter(created_at__gte=last_24h)
        )

class NoteLikeView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, note_id):
        return create_like_for_content(request, note_id)

    def delete(self, request, note_id):
        return remove_like_from_content(request, note_id)