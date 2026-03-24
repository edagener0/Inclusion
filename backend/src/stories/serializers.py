from .models import Story
from content.serializers import ContentBaseSerializer
from common.serializers import ProfileFeedSerializer
from rest_framework import serializers


class StorySerializer(ContentBaseSerializer):

    class Meta:
        model = Story
        fields = ["id", "user", "file", "likes_count", "is_liked", "created_at"]


class StoryDetailSerializer(serializers.ModelSerializer):
    likes_count = serializers.IntegerField(read_only=True)
    is_liked = serializers.BooleanField(read_only=True)

    class Meta:
        model = Story
        fields = ["id", "file", "likes_count", "is_liked", "created_at"]


class StoryFeedSerializer(serializers.Serializer):
    user = ProfileFeedSerializer(read_only=True)
    stories = StoryDetailSerializer(many=True, read_only=True)
