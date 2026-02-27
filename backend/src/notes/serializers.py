from .models import Note
from content.serializers import ContentBaseSerializer

class NoteSerializer(ContentBaseSerializer):

    class Meta:
        model = Note
        fields = ["id", "user", "content", "likes_count", "is_liked", "created_at"]