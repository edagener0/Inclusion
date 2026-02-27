from .models import Post
from content.serializers import ContentBaseSerializer

class PostSerializer(ContentBaseSerializer):

    class Meta:
        model = Post
        fields = ["id", "user", "file", "description", "likes_count", "is_liked", "created_at"]