from rest_framework import serializers
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema_field
from authentication.serializers import UserMeSerializer
from .models import DM


class DMCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DM
        fields = ["content", "receiver"]


class DMInboxSerializer(serializers.ModelSerializer):
    other_user = serializers.SerializerMethodField(read_only=True)
    last_message = serializers.CharField(source="content", read_only=True)

    class Meta:
        model = DM
        fields = ["id", "other_user", "last_message", "created_at"]
        read_only_fields = fields

    @extend_schema_field(UserMeSerializer)
    def get_other_user(self, obj):
        # A mesma DM pode ser enviada ou recebida pelo utilizador autenticado.
        # Aqui escolhemos sempre "o outro lado" da conversa para a inbox.
        request = self.context["request"]
        other_user = obj.receiver if obj.sender_id == request.user.id else obj.sender
        return UserMeSerializer(other_user).data


class DMConversationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DM
        fields = ["content"]


class DMConversationMessageSerializer(serializers.ModelSerializer):
    sender = UserMeSerializer(read_only=True)
    receiver = UserMeSerializer(read_only=True)
    is_mine = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = DM
        fields = ["id", "content", "sender", "receiver", "is_mine", "created_at"]
        read_only_fields = fields

    @extend_schema_field(OpenApiTypes.BOOL)
    def get_is_mine(self, obj):
        return obj.sender_id == self.context["request"].user.id
