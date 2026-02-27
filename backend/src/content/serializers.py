from rest_framework import serializers
from common.serializers import ProfileFeedSerializer

class ContentBaseSerializer(serializers.ModelSerializer):
    user = ProfileFeedSerializer(read_only=True)
    likes_count = serializers.IntegerField(read_only=True)
    is_liked = serializers.BooleanField(read_only=True)

    class Meta:
        abstract = True