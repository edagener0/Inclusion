from rest_framework import serializers

class ChatBotSerializer(serializers.Serializer):
    prompt = serializers.CharField()

class ChatBotResponseSerializer(serializers.Serializer):
    response = serializers.CharField()