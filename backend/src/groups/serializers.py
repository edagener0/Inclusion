from django.contrib.auth import get_user_model
from django.db import transaction
from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from authentication.serializers import UserMeSerializer

from .models import GroupChat, GroupMessage, GroupParticipants

User = get_user_model()


class GroupParticipantSerializer(serializers.ModelSerializer):
    user = UserMeSerializer(read_only=True)

    class Meta:
        model = GroupParticipants
        fields = ["user", "role", "created_at"]
        read_only_fields = fields


class GroupSerializer(serializers.ModelSerializer):
    participants = serializers.SerializerMethodField(read_only=True)
    last_message = serializers.CharField(read_only=True, allow_null=True)
    last_message_created_at = serializers.DateTimeField(read_only=True, allow_null=True)

    class Meta:
        model = GroupChat
        fields = [
            "id",
            "name",
            "avatar",
            "participants",
            "last_message",
            "last_message_created_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields

    @extend_schema_field(GroupParticipantSerializer(many=True))
    def get_participants(self, obj):
        participants = getattr(
            obj,
            "_prefetched_objects_cache",
            {},
        ).get("participants")

        if participants is None:
            participants = (
                obj.participants
                .select_related("user")
                .order_by("created_at")
            )

        return GroupParticipantSerializer(participants, many=True).data

class GroupInboxSerializer(serializers.ModelSerializer):
    last_message = serializers.CharField(read_only=True, allow_null=True)
    last_message_created_at = serializers.DateTimeField(read_only=True, allow_null=True)

    class Meta:
        model = GroupChat
        fields = ["id", "name", "avatar", "last_message", "last_message_created_at"]
        read_only_fields = fields

class GroupCreateSerializer(serializers.ModelSerializer):
    member_ids = serializers.ListField(
        child=serializers.IntegerField(min_value=1),
        allow_empty=True,
        required=False,
        write_only=True,
    )

    class Meta:
        model = GroupChat
        fields = ["name", "avatar", "member_ids"]

    def validate_member_ids(self, value):
        seen_user_ids = set()
        unique_user_ids = []

        for user_id in value:
            if user_id in seen_user_ids:
                continue

            seen_user_ids.add(user_id)
            unique_user_ids.append(user_id)

        return unique_user_ids

    def validate(self, attrs):
        member_ids = attrs.get("member_ids", [])
        existing_user_ids = set(
            User.objects
            .filter(id__in=member_ids)
            .values_list("id", flat=True)
        )
        missing_user_ids = [
            user_id
            for user_id in member_ids
            if user_id not in existing_user_ids
        ]

        if missing_user_ids:
            raise serializers.ValidationError({
                "member_ids": (
                    "Users not found: "
                    + ", ".join(str(user_id) for user_id in missing_user_ids)
                    + "."
                )
            })

        return attrs

    @transaction.atomic
    def create(self, validated_data):
        member_ids = validated_data.pop("member_ids", [])
        creator = self.context["request"].user
        group = GroupChat.objects.create(**validated_data)

        GroupParticipants.objects.create(
            user=creator,
            group=group,
            role=GroupParticipants.RoleChoices.ADMIN,
        )

        for user_id in member_ids:
            if user_id == creator.id:
                continue

            GroupParticipants.objects.create(
                user_id=user_id,
                group=group,
                role=GroupParticipants.RoleChoices.MEMBER,
            )

        return group


class GroupMessageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupMessage
        fields = ["content"]


class GroupMessageUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupMessage
        fields = ["content"]


class GroupMessageSerializer(serializers.ModelSerializer):
    sender = UserMeSerializer(read_only=True)

    class Meta:
        model = GroupMessage
        fields = ["id", "content", "sender", "created_at", "updated_at"]
        read_only_fields = fields


class GroupRealtimeMessageSerializer(serializers.ModelSerializer):
    sender = UserMeSerializer(read_only=True)
    sender_id = serializers.IntegerField(read_only=True)
    group_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = GroupMessage
        fields = [
            "id",
            "content",
            "sender",
            "sender_id",
            "group_id",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields
