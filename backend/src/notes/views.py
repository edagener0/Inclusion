from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveAPIView
)
from rest_framework.permissions import IsAuthenticated
from .serializers import NoteSerializer
from .models import Note
from django.utils import timezone
from datetime import timedelta

class NoteCreateListView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = NoteSerializer

    def perform_create(self, serializer):
        serializer.save(user = self.request.user)

    def get_queryset(self):
        now = timezone.now()
        last_24h = now - timedelta(hours=24)
        return Note.objects.filter(created_at__gte=last_24h).order_by("-created_at")

class NoteRetrieveView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = NoteSerializer
    queryset = Note.objects.all()