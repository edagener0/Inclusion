from rest_framework import serializers
from .models import Post
from common.serializers import ProfileFeedSerializer

class PostSerializer(serializers.ModelSerializer):
    user = ProfileFeedSerializer(read_only=True)

    class Meta:
        model = Post
        fields = ["id", "user", "file", "description", "created_at"]