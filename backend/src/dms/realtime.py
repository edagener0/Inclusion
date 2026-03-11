from types import SimpleNamespace
from urllib.parse import urljoin

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.conf import settings
from django.db import transaction
from djangorestframework_camel_case.util import camelize

from .serializers import DMInboxSerializer, DMRealtimeMessageSerializer


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


def broadcast_dm_message(dm):
    channel_layer = get_channel_layer()

    if channel_layer is None:
        return

    async_to_sync(channel_layer.group_send)(
        build_dm_conversation_group(dm.sender_id, dm.receiver_id),
        {
            "type": "dm.message",
            "message": serialize_dm_realtime_message(dm),
        },
    )


def broadcast_dm_inbox_updates(dm):
    channel_layer = get_channel_layer()

    if channel_layer is None:
        return

    async_to_sync(channel_layer.group_send)(
        build_dm_user_group(dm.sender_id),
        {
            "type": "dm.inbox",
            "inbox_item": serialize_dm_inbox_item(dm, dm.sender),
        },
    )
    async_to_sync(channel_layer.group_send)(
        build_dm_user_group(dm.receiver_id),
        {
            "type": "dm.inbox",
            "inbox_item": serialize_dm_inbox_item(dm, dm.receiver),
        },
    )


def schedule_dm_message_broadcast(dm):
    transaction.on_commit(
        lambda: (
            broadcast_dm_message(dm),
            broadcast_dm_inbox_updates(dm),
        )
    )
