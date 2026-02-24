from rest_framework import serializers
from .models import Story
from common.serializers import ProfileFeedSerializer

class StoriesSerializer(serializers.ModelSerializer):
    user = ProfileFeedSerializer(read_only=True)

    class Meta:
        model = Story
        fields = ["id", "user", "file", "created_at"]