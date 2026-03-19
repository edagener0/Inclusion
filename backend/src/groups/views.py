from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import ListCreateAPIView, RetrieveDestroyAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import GroupChat, GroupMessage, GroupParticipants
from .querysets import build_group_queryset_for_user
from .realtime import (
    schedule_group_created_broadcast,
    schedule_group_deleted_broadcast,
    schedule_group_message_created_broadcast,
    schedule_group_message_deleted_broadcast,
    schedule_group_message_updated_broadcast,
)
from .serializers import (
    GroupCreateSerializer,
    GroupMessageCreateSerializer,
    GroupMessageSerializer,
    GroupMessageUpdateSerializer,
    GroupSerializer,
)


class GroupCreateResponseMixin:
    response_serializer_class = None

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = self.perform_create(serializer)
        response_serializer = self.response_serializer_class(
            instance,
            context=self.get_serializer_context(),
        )
        headers = self.get_success_headers(response_serializer.data)
        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers,
        )


class GroupUpdateResponseMixin:
    response_serializer_class = None

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


@extend_schema(tags=["Groups"])
class GroupListCreateView(GroupCreateResponseMixin, ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    response_serializer_class = GroupSerializer

    @extend_schema(
        request=GroupCreateSerializer,
        responses={201: GroupSerializer},
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

    def get_serializer_class(self):
        if self.request.method == "POST":
            return GroupCreateSerializer
        return GroupSerializer

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return GroupChat.objects.none()

        return (
            build_group_queryset_for_user(self.request.user)
        )

    def perform_create(self, serializer):
        group = serializer.save()
        schedule_group_created_broadcast(group)
        return group


@extend_schema(tags=["Groups"])
class GroupRetrieveDestroyView(RetrieveDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = GroupSerializer
    lookup_field = "id"
    lookup_url_kwarg = "group_id"

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return GroupChat.objects.none()

        return build_group_queryset_for_user(self.request.user)

    def perform_destroy(self, instance):
        is_admin = GroupParticipants.objects.filter(
            group=instance,
            user=self.request.user,
            role=GroupParticipants.RoleChoices.ADMIN,
        ).exists()

        if not is_admin:
            raise PermissionDenied("Only group admins can delete the group.")

        member_ids = list(
            instance.participants.values_list("user_id", flat=True)
        )
        group_id = instance.id
        instance.delete()
        schedule_group_deleted_broadcast(group_id, member_ids)


@extend_schema(tags=["Groups"])
class GroupConversationMessagesView(GroupCreateResponseMixin, ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    response_serializer_class = GroupMessageSerializer

    @extend_schema(
        request=GroupMessageCreateSerializer,
        responses={201: GroupMessageSerializer},
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

    def get_group(self):
        return get_object_or_404(
            build_group_queryset_for_user(self.request.user),
            id=self.kwargs["group_id"],
        )

    def get_serializer_class(self):
        if self.request.method == "POST":
            return GroupMessageCreateSerializer
        return GroupMessageSerializer

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return GroupMessage.objects.none()

        return (
            GroupMessage.objects
            .filter(group=self.get_group())
            .select_related("sender", "group")
            .order_by("created_at")
        )

    def perform_create(self, serializer):
        message = serializer.save(
            sender=self.request.user,
            group=self.get_group(),
        )
        schedule_group_message_created_broadcast(message)
        return message


@extend_schema(tags=["Groups"])
class GroupMessageRetrieveUpdateDestroyView(GroupUpdateResponseMixin, RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    response_serializer_class = GroupMessageSerializer
    lookup_field = "id"
    lookup_url_kwarg = "message_id"

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return GroupMessage.objects.none()

        return (
            GroupMessage.objects
            .filter(group_id=self.kwargs["group_id"], group__members=self.request.user)
            .select_related("sender", "group")
            .distinct()
        )

    def get_serializer_class(self):
        if self.request.method == "PATCH":
            return GroupMessageUpdateSerializer
        return GroupMessageSerializer

    def _ensure_sender_can_update(self, message):
        if message.sender_id != self.request.user.id:
            raise PermissionDenied("Only the sender can update this group message.")

    def _ensure_can_delete(self, message):
        if message.sender_id == self.request.user.id:
            return

        is_admin = GroupParticipants.objects.filter(
            group_id=message.group_id,
            user=self.request.user,
            role=GroupParticipants.RoleChoices.ADMIN,
        ).exists()

        if not is_admin:
            raise PermissionDenied(
                "Only the sender or a group admin can delete this group message."
            )

    def perform_update(self, serializer):
        message = serializer.instance
        self._ensure_sender_can_update(message)
        updated_message = serializer.save()
        schedule_group_message_updated_broadcast(updated_message)
        return updated_message

    def perform_destroy(self, instance):
        self._ensure_can_delete(instance)
        instance.delete()
        schedule_group_message_deleted_broadcast(instance)
