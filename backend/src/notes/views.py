from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveDestroyAPIView
)
from rest_framework import status
from rest_framework.response import Response
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

    def create(self, request, *args, **kwargs):
        existing_note = self.get_recent_user_note()
        serializer = self.get_serializer(existing_note, data=request.data) if existing_note else self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if existing_note:
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save(user = self.request.user)

    def get_recent_user_note(self):
        now = timezone.now()
        last_24h = now - timedelta(hours=24)
        return (
            Note.objects
            .filter(user=self.request.user, created_at__gte=last_24h)
            .order_by("-created_at")
            .first()
        )

    def get_queryset(self):
        now = timezone.now()
        last_24h = now - timedelta(hours=24)
        return (Note.objects
            .visible_to_friends(self.request.user)
            .with_likes_data(self.request.user)
            .filter(created_at__gte=last_24h)
            .order_by("-created_at"))

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
            .visible_to_friends(self.request.user)
            .with_likes_data(self.request.user)
            .filter(created_at__gte=last_24h)
        )

class NoteLikeView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, note_id):
        return create_like_for_content(
            request,
            note_id,
            queryset=Note.objects.visible_to_friends(request.user),
        )

    def delete(self, request, note_id):
        return remove_like_from_content(
            request,
            note_id,
            queryset=Note.objects.visible_to_friends(request.user),
        )
