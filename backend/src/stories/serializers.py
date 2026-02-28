from .models import Story
from content.serializers import ContentBaseSerializer

class StorySerializer(ContentBaseSerializer):

    class Meta:
        model = Story
        fields = ["id", "user", "file", "likes_count", "is_liked", "created_at"]