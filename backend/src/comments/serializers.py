from .models import Comment
from content.serializers import ContentBaseSerializer

class CommentSerializer(ContentBaseSerializer):
    class Meta:
        model = Comment
        fields = ["id", "user", "commentary", "likes_count", "is_liked", "created_at"]