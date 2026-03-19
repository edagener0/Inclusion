from django.db.models import Q
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import DM
from .realtime import (
    schedule_dm_message_created_broadcast,
    schedule_dm_message_deleted_broadcast,
    schedule_dm_message_updated_broadcast,
)
from .serializers import (
    DMConversationCreateSerializer,
    DMConversationMessageSerializer,
    DMConversationUpdateSerializer,
    DMCreateSerializer,
    DMInboxSerializer,
)

User = get_user_model()


class DMBroadcastCreateMixin:
    response_serializer_class = DMConversationMessageSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        dm = self.perform_create(serializer)
        response_serializer = self.response_serializer_class(
            dm,
            context=self.get_serializer_context(),
        )
        headers = self.get_success_headers(response_serializer.data)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class DMUpdateResponseMixin:
    response_serializer_class = DMConversationMessageSerializer

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        message = self.perform_update(serializer)
        response_serializer = self.response_serializer_class(
            message,
            context=self.get_serializer_context(),
        )
        return Response(response_serializer.data)


@extend_schema(tags=["DMs"])
class DMListCreateView(DMBroadcastCreateMixin, ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=DMCreateSerializer,
        responses={201: DMConversationMessageSerializer},
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

    def get_serializer_class(self):
        if self.request.method == "POST":
            return DMCreateSerializer
        return DMInboxSerializer

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return DM.objects.none()

        return (
            DM.objects
            # Uma conversa existe se o utilizador autenticado participou
            # na mensagem como remetente ou destinatário.
            .filter(Q(sender=self.request.user) | Q(receiver=self.request.user))
            .select_related("sender", "receiver")
            .order_by("-created_at")
        )

    def list(self, request, *args, **kwargs):
        latest_dms = []
        seen_user_ids = set()

        # Como as DMs já vêm ordenadas da mais recente para a mais antiga,
        # a primeira mensagem encontrada para cada utilizador é a "last message"
        # da conversa que queremos mostrar na inbox.
        for dm in self.get_queryset():
            other_user_id = dm.receiver_id if dm.sender_id == request.user.id else dm.sender_id

            if other_user_id in seen_user_ids:
                continue

            seen_user_ids.add(other_user_id)
            latest_dms.append(dm)

        page = self.paginate_queryset(latest_dms)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(latest_dms, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        dm = serializer.save(sender=self.request.user)
        schedule_dm_message_created_broadcast(dm)
        return dm


@extend_schema(tags=["DMs"])
class DMConversationMessagesView(DMBroadcastCreateMixin, ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=DMConversationCreateSerializer,
        responses={201: DMConversationMessageSerializer},
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

    def get_other_user(self):
        # A conversa é sempre aberta contra um utilizador específico vindo da URL.
        other_user = get_object_or_404(User, id=self.kwargs["user_id"])

        # Não faz sentido abrir uma DM "contigo próprio".
        if other_user.id == self.request.user.id:
            raise ValidationError("You cannot open a DM conversation with yourself.")

        return other_user

    def get_serializer_class(self):
        # No GET devolvemos mensagens completas do chat.
        # No POST só recebemos o conteúdo, porque o destinatário já vem da URL.
        if self.request.method == "POST":
            return DMConversationCreateSerializer
        return DMConversationMessageSerializer

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return DM.objects.none()

        # O chat é o conjunto de mensagens trocadas entre o utilizador autenticado
        # e o utilizador da URL, nos dois sentidos.
        other_user = self.get_other_user()
        return (
            DM.objects
            .filter(
                Q(sender=self.request.user, receiver=other_user) |
                Q(sender=other_user, receiver=self.request.user)
            )
            .select_related("sender", "receiver")
            # Para o ecrã de chat, a ordem natural é cronológica.
            .order_by("created_at")
        )

    def perform_create(self, serializer):
        dm = serializer.save(
            sender=self.request.user,
            receiver=self.get_other_user(),
        )
        schedule_dm_message_created_broadcast(dm)
        return dm


@extend_schema(tags=["DMs"])
class DMRetrieveUpdateDestroyView(DMUpdateResponseMixin, RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    response_serializer_class = DMConversationMessageSerializer
    lookup_url_kwarg = "dm_id"
    lookup_field = "id"

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return DM.objects.none()

        return (
            DM.objects
            .filter(Q(sender=self.request.user) | Q(receiver=self.request.user))
            .select_related("sender", "receiver")
        )

    def get_serializer_class(self):
        if self.request.method == "PATCH":
            return DMConversationUpdateSerializer
        return DMConversationMessageSerializer

    def _ensure_sender(self, dm):
        if dm.sender_id != self.request.user.id:
            raise PermissionDenied("Only the sender can modify this DM message.")

    def perform_update(self, serializer):
        dm = serializer.instance
        self._ensure_sender(dm)
        updated_dm = serializer.save()
        schedule_dm_message_updated_broadcast(updated_dm)
        return updated_dm

    def perform_destroy(self, instance):
        self._ensure_sender(instance)
        instance.delete()
        schedule_dm_message_deleted_broadcast(instance)
