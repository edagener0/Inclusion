from rest_framework import serializers
from .models import Note
from common.serializers import ProfileFeedSerializer

class NoteSerializer(serializers.ModelSerializer):
    user = ProfileFeedSerializer(read_only=True)

    class Meta:
        model = Note
        fields = ["id", "user", "content", "created_at"]