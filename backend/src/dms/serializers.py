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

    def _get_request_and_user(self):
        request = self.context.get("request")
        user = getattr(request, "user", None)

        if user is None:
            raise RuntimeError("DMInboxSerializer requires request.user in context.")

        return request, user

    def _get_nested_user_context(self, request):
        if callable(getattr(request, "build_absolute_uri", None)):
            return {"request": request}

        return {}

    @extend_schema_field(UserMeSerializer)
    def get_user(self, obj):
        # A mesma DM pode ser enviada ou recebida pelo utilizador autenticado.
        # Aqui escolhemos sempre "o outro lado" da conversa para a inbox.
        request, current_user = self._get_request_and_user()
        other_user = obj.receiver if obj.sender_id == current_user.id else obj.sender
        return UserMeSerializer(
            other_user,
            context=self._get_nested_user_context(request),
        ).data


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
