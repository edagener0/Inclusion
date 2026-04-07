from rest_framework import serializers
from drf_spectacular.utils import extend_schema_field
from authentication.serializers import UserMeSerializer
from .models import DM


class DMInboxSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField(read_only=True)
    last_message = serializers.CharField(source="content", read_only=True)

    class Meta:
        model = DM
        fields = ["id", "user", "last_message", "created_at"]
        read_only_fields = fields

    @extend_schema_field(UserMeSerializer)
    def get_user(self, obj):
        # A mesma DM pode ser enviada ou recebida pelo utilizador autenticado.
        # Aqui escolhemos sempre "o outro lado" da conversa para a inbox.
        request = self.context["request"]
        other_user = obj.receiver if obj.sender_id == request.user.id else obj.sender
        serializer_context = (
            self.context
            if hasattr(request, "build_absolute_uri")
            else None
        )

        if serializer_context is None:
            return UserMeSerializer(other_user).data

        return UserMeSerializer(other_user, context=serializer_context).data


class DMConversationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DM
        fields = ["content"]


class DMConversationUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DM
        fields = ["content"]


class DMConversationMessageSerializer(serializers.ModelSerializer):
    sender = UserMeSerializer(read_only=True)
    receiver = UserMeSerializer(read_only=True)

    class Meta:
        model = DM
        fields = ["id", "content", "sender", "receiver", "created_at", "updated_at"]
        read_only_fields = fields


class DMRealtimeMessageSerializer(serializers.ModelSerializer):
    sender = UserMeSerializer(read_only=True)
    receiver = UserMeSerializer(read_only=True)
    sender_id = serializers.IntegerField(read_only=True)
    receiver_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = DM
        fields = [
            "id",
            "content",
            "sender",
            "receiver",
            "sender_id",
            "receiver_id",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields
