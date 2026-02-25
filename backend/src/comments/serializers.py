from rest_framework import serializers
from .models import Comment
from common.serializers import ProfileFeedSerializer

class CommentSerializer(serializers.ModelSerializer):
    user = ProfileFeedSerializer(read_only=True)
    
    class Meta:
        model = Comment
        fields = ["id", "user", "comment", "created_at"]