from rest_framework import serializers
from .models import DM

class DMSerializer(serializers.ModelSerializer):
    class Meta:
        model = DM
        fields = ['id', 'content', 'sender', 'receiver', 'created_at']
        read_only_fields = ['id', 'sender', 'created_at']

class DMCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DM
        fields = ['content', 'receiver']

class DMListSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.username', read_only=True)
    receiver_username = serializers.CharField(source='receiver.username', read_only=True)

    class Meta:
        model = DM
        fields = ['id', 'content', 'sender_username', 'receiver_username', 'created_at']
        read_only_fields = ['id', 'sender_username', 'receiver_username', 'created_at']