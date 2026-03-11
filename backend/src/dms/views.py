from django.db.models import Q
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ValidationError
from rest_framework.generics import ListCreateAPIView, RetrieveDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import DM
from .serializers import (
    DMConversationCreateSerializer,
    DMConversationMessageSerializer,
    DMCreateSerializer,
    DMInboxSerializer,
)

User = get_user_model()


class DMListCreateView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return DMCreateSerializer
        return DMInboxSerializer

    def get_queryset(self):
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
        # O remetente vem sempre da sessão autenticada, não do body do pedido.
        serializer.save(sender=self.request.user)


class DMConversationMessagesView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]

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
        # Ao enviar uma mensagem dentro do chat:
        # - o sender é sempre o utilizador autenticado
        # - o receiver é sempre o utilizador da URL
        serializer.save(
            sender=self.request.user,
            receiver=self.get_other_user(),
        )


class DMRetrieveDestroyView(RetrieveDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = DM.objects.all()
    lookup_url_kwarg = "dm_id"
    lookup_field = "id"
    
