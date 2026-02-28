from .models import Inc
from content.serializers import ContentBaseSerializer

class IncSerializer(ContentBaseSerializer):

    class Meta:
        model = Inc
        fields = ["id", "user", "content", "likes_count", "is_liked", "created_at"]