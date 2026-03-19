from django.db.models import DateTimeField, F, OuterRef, Prefetch, Subquery
from django.db.models.functions import Coalesce

from .models import GroupChat, GroupMessage, GroupParticipants


def build_group_queryset_for_user(user):
    latest_message_queryset = (
        GroupMessage.objects
        .filter(group=OuterRef("pk"))
        .order_by("-created_at", "-pk")
    )
    participants_queryset = (
        GroupParticipants.objects
        .select_related("user")
        .order_by("created_at")
    )

    return (
        GroupChat.objects
        .filter(members=user)
        .annotate(
            last_message=Subquery(latest_message_queryset.values("content")[:1]),
            last_message_created_at=Coalesce(
                Subquery(
                    latest_message_queryset.values("created_at")[:1],
                    output_field=DateTimeField(),
                ),
                F("created_at"),
            ),
        )
        .prefetch_related(Prefetch("participants", queryset=participants_queryset))
        .order_by("-last_message_created_at", "-created_at")
        .distinct()
    )
