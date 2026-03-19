from types import SimpleNamespace
from urllib.parse import urljoin

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.conf import settings
from django.db import transaction
from djangorestframework_camel_case.util import camelize

from .serializers import DMInboxSerializer, DMRealtimeMessageSerializer
from .models import DM


def build_dm_conversation_group(user_a_id, user_b_id):
    first_user_id, second_user_id = sorted((int(user_a_id), int(user_b_id)))
    return f"dm_{first_user_id}_{second_user_id}"


def build_dm_user_group(user_id):
    return f"dm_user_{int(user_id)}"


def _absolutize_url(url):
    if not url or url.startswith(("http://", "https://")):
        return url

    return urljoin(f"{settings.BACKEND_PUBLIC_URL.rstrip('/')}/", url.lstrip("/"))


def _normalize_user_payload(user_payload):
    normalized_payload = dict(user_payload)
    normalized_payload["avatar"] = _absolutize_url(normalized_payload.get("avatar"))
    return normalized_payload


def serialize_dm_realtime_message(dm):
    serializer = DMRealtimeMessageSerializer(dm)
    payload = camelize(serializer.data)
    payload["sender"] = _normalize_user_payload(payload["sender"])
    payload["receiver"] = _normalize_user_payload(payload["receiver"])
    return payload


def serialize_dm_inbox_item(dm, current_user):
    serializer = DMInboxSerializer(
        dm,
        context={"request": SimpleNamespace(user=current_user)},
    )
    payload = camelize(serializer.data)
    payload["otherUser"] = _normalize_user_payload(payload["otherUser"])
    return payload


def serialize_dm_deleted_message(dm):
    return camelize({
        "id": dm.id,
        "sender_id": dm.sender_id,
        "receiver_id": dm.receiver_id,
    })


def serialize_dm_removed_conversation(current_user_id, other_user_id):
    return camelize({
        "current_user_id": current_user_id,
        "other_user_id": other_user_id,
    })


def _get_latest_dm_between_users(user_a_id, user_b_id):
    return (
        DM.objects
        .filter(
            sender_id__in=[user_a_id, user_b_id],
            receiver_id__in=[user_a_id, user_b_id],
        )
        .order_by("-created_at", "-id")
        .first()
    )


def _broadcast_dm_message_event(event_type, payload, sender_id, receiver_id):
    channel_layer = get_channel_layer()

    if channel_layer is None:
        return

    async_to_sync(channel_layer.group_send)(
        build_dm_conversation_group(sender_id, receiver_id),
        {
            "type": event_type,
            "message": payload,
        },
    )


def _broadcast_dm_inbox_state_for_user(current_user_id, other_user_id):
    channel_layer = get_channel_layer()

    if channel_layer is None:
        return

    latest_dm = _get_latest_dm_between_users(current_user_id, other_user_id)

    if latest_dm is None:
        async_to_sync(channel_layer.group_send)(
            build_dm_user_group(current_user_id),
            {
                "type": "dm.inbox.removed",
                "conversation": serialize_dm_removed_conversation(
                    current_user_id,
                    other_user_id,
                ),
            },
        )
        return

    current_user = latest_dm.sender if latest_dm.sender_id == current_user_id else latest_dm.receiver
    async_to_sync(channel_layer.group_send)(
        build_dm_user_group(current_user_id),
        {
            "type": "dm.inbox.updated",
            "inbox_item": serialize_dm_inbox_item(latest_dm, current_user),
        },
    )


def broadcast_dm_inbox_updates(sender_id, receiver_id):
    _broadcast_dm_inbox_state_for_user(sender_id, receiver_id)
    _broadcast_dm_inbox_state_for_user(receiver_id, sender_id)


def broadcast_dm_message_created(dm):
    _broadcast_dm_message_event(
        "dm.message.created",
        serialize_dm_realtime_message(dm),
        dm.sender_id,
        dm.receiver_id,
    )


def broadcast_dm_message_updated(dm):
    _broadcast_dm_message_event(
        "dm.message.updated",
        serialize_dm_realtime_message(dm),
        dm.sender_id,
        dm.receiver_id,
    )


def broadcast_dm_message_deleted(dm):
    _broadcast_dm_message_event(
        "dm.message.deleted",
        serialize_dm_deleted_message(dm),
        dm.sender_id,
        dm.receiver_id,
    )


def schedule_dm_message_created_broadcast(dm):
    transaction.on_commit(
        lambda: (
            broadcast_dm_message_created(dm),
            broadcast_dm_inbox_updates(dm.sender_id, dm.receiver_id),
        )
    )


def schedule_dm_message_updated_broadcast(dm):
    transaction.on_commit(
        lambda: (
            broadcast_dm_message_updated(dm),
            broadcast_dm_inbox_updates(dm.sender_id, dm.receiver_id),
        )
    )


def schedule_dm_message_deleted_broadcast(dm):
    transaction.on_commit(
        lambda: (
            broadcast_dm_message_deleted(dm),
            broadcast_dm_inbox_updates(dm.sender_id, dm.receiver_id),
        )
    )
