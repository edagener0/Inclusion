from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveDestroyAPIView
)
from drf_spectacular.utils import OpenApiResponse, extend_schema, extend_schema_view
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from common.serializers import DetailResponseSerializer, LikeToggleResponseSerializer
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

@extend_schema(tags=["Notes"])
@extend_schema_view(
    get=extend_schema(
        summary="List notes",
        description="List the notes from the last 24 hours that are visible to the authenticated user.",
    ),
    post=extend_schema(
        summary="Create or update note",
        description="Create a new note for the authenticated user or update the most recent note from the last 24 hours.",
    ),
)
class NoteCreateListView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = NoteSerializer
    queryset = Note.objects.none()

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

@extend_schema(tags=["Notes"])
@extend_schema_view(
    get=extend_schema(
        summary="Get note",
        description="Retrieve a visible note from the last 24 hours by id.",
    ),
    delete=extend_schema(
        summary="Delete note",
        description="Delete a note owned by the authenticated user.",
        responses={204: OpenApiResponse(description="Note deleted.")},
    ),
)
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
    
    @extend_schema(
        request=None,
        responses={
            200: LikeToggleResponseSerializer,
            201: LikeToggleResponseSerializer,
            404: DetailResponseSerializer,
        },
        tags=["Notes"],
        summary="Like note",
        description="Add a like to a visible note.",
    )
    def post(self, request, note_id):
        return create_like_for_content(
            request,
            note_id,
            queryset=Note.objects.visible_to_friends(request.user),
        )

    @extend_schema(
        request=None,
        responses={
            200: LikeToggleResponseSerializer,
            404: DetailResponseSerializer,
        },
        tags=["Notes"],
        summary="Unlike note",
        description="Remove a like from a visible note.",
    )
    def delete(self, request, note_id):
        return remove_like_from_content(
            request,
            note_id,
            queryset=Note.objects.visible_to_friends(request.user),
        )
