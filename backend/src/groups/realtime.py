from urllib.parse import urljoin

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.conf import settings
from django.db import transaction
from djangorestframework_camel_case.util import camelize

from .models import GroupParticipants
from .querysets import build_group_queryset_for_user
from .serializers import GroupInboxSerializer, GroupRealtimeMessageSerializer


def build_group_conversation_group(group_id):
    return f"group_{int(group_id)}"


def build_group_user_group(user_id):
    return f"group_user_{int(user_id)}"


def _absolutize_url(url):
    if not url or url.startswith(("http://", "https://")):
        return url

    return urljoin(f"{settings.BACKEND_PUBLIC_URL.rstrip('/')}/", url.lstrip("/"))


def _normalize_user_payload(user_payload):
    normalized_payload = dict(user_payload)
    normalized_payload["avatar"] = _absolutize_url(normalized_payload.get("avatar"))
    return normalized_payload


def _normalize_group_payload(group_payload):
    normalized_payload = dict(group_payload)
    normalized_payload["avatar"] = _absolutize_url(normalized_payload.get("avatar"))
    return normalized_payload


def serialize_group_realtime_message(message):
    serializer = GroupRealtimeMessageSerializer(message)
    payload = camelize(serializer.data)
    payload["user"] = _normalize_user_payload(payload["user"])
    return payload


def serialize_group_deleted_message(message):
    return camelize({
        "id": message.id,
    })


def serialize_group_inbox_item(group):
    serializer = GroupInboxSerializer(group)
    payload = camelize(serializer.data)
    return _normalize_group_payload(payload)


def _broadcast_group_message_event(event_type, payload, group_id):
    channel_layer = get_channel_layer()

    if channel_layer is None:
        return

    async_to_sync(channel_layer.group_send)(
        build_group_conversation_group(group_id),
        {
            "type": event_type,
            "message": payload,
        },
    )


def _broadcast_group_inbox_updated(group_id, member_user):
    channel_layer = get_channel_layer()

    if channel_layer is None:
        return

    group = build_group_queryset_for_user(member_user).get(id=group_id)
    async_to_sync(channel_layer.group_send)(
        build_group_user_group(member_user.id),
        {
            "type": "group.inbox.updated",
            "group_item": serialize_group_inbox_item(group),
        },
    )


def broadcast_group_inbox_updates(group_id, member_ids):
    from django.contrib.auth import get_user_model

    User = get_user_model()
    for member in User.objects.filter(id__in=member_ids):
        _broadcast_group_inbox_updated(group_id, member)


def broadcast_group_inbox_removed(group_id, member_ids):
    channel_layer = get_channel_layer()

    if channel_layer is None:
        return

    for member_id in member_ids:
        async_to_sync(channel_layer.group_send)(
            build_group_user_group(member_id),
            {
                "type": "group.inbox.removed",
                "group_item": camelize({"id": group_id}),
            },
        )


def broadcast_group_message_created(message):
    _broadcast_group_message_event(
        "group.message.created",
        serialize_group_realtime_message(message),
        message.group_id,
    )


def broadcast_group_message_updated(message):
    _broadcast_group_message_event(
        "group.message.updated",
        serialize_group_realtime_message(message),
        message.group_id,
    )


def broadcast_group_message_deleted(message):
    _broadcast_group_message_event(
        "group.message.deleted",
        serialize_group_deleted_message(message),
        message.group_id,
    )


def _get_member_ids(group_id):
    return list(
        GroupParticipants.objects
        .filter(group_id=group_id)
        .values_list("user_id", flat=True)
    )


def schedule_group_created_broadcast(group):
    member_ids = _get_member_ids(group.id)
    transaction.on_commit(lambda: broadcast_group_inbox_updates(group.id, member_ids))


def schedule_group_deleted_broadcast(group_id, member_ids):
    transaction.on_commit(lambda: broadcast_group_inbox_removed(group_id, member_ids))


def schedule_group_message_created_broadcast(message):
    member_ids = _get_member_ids(message.group_id)
    transaction.on_commit(
        lambda: (
            broadcast_group_message_created(message),
            broadcast_group_inbox_updates(message.group_id, member_ids),
        )
    )


def schedule_group_message_updated_broadcast(message):
    member_ids = _get_member_ids(message.group_id)
    transaction.on_commit(
        lambda: (
            broadcast_group_message_updated(message),
            broadcast_group_inbox_updates(message.group_id, member_ids),
        )
    )


def schedule_group_message_deleted_broadcast(message):
    member_ids = _get_member_ids(message.group_id)
    transaction.on_commit(
        lambda: (
            broadcast_group_message_deleted(message),
            broadcast_group_inbox_updates(message.group_id, member_ids),
        )
    )
