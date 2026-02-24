from rest_framework import serializers
from .models import Inc
from common.serializers import ProfileFeedSerializer

class IncSerializer(serializers.ModelSerializer):
    user = ProfileFeedSerializer(read_only=True)
    class Meta:
        model = Inc
        fields = ["id", "user", "content", "created_at"]