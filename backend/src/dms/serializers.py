from rest_framework import serializers
from .models import DM

# 
class DMSerializer(serializers.ModelSerializer):
    class Meta:
        model = DM
        fields = ['id', 'content', 'sender', 'receiver', 'created_at']
        read_only_fields = ['id', 'sender', 'created_at']

# Serializer para criação de uma mensagem DM, onde o remetente é o usuário autenticado
class DMCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DM
        fields = ['content', 'receiver']

# Devolver as conversas de todos os DMs do usuário com os diferentes destinatários, mostrando o username do remetente e destinatário
class DMListSerializer(serializers.ModelSerializer):
    receiver_username = serializers.CharField(source='receiver.username', read_only=True)
    class Meta:
        model = DM
        fields = ['id', 'sender', 'receiver', 'receiver_username', 'created_at']
        read_only_fields = ['id', 'sender', 'created_at']