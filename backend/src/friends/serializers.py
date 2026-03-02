from rest_framework import serializers
from .models import (
    FriendRequest,
)
from common.serializers import ProfileFeedSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class FriendRequestCreateDestroySerializer(serializers.ModelSerializer):
    from_user = serializers.PrimaryKeyRelatedField(read_only=True)
    to_user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = FriendRequest
        fields = ["from_user", "to_user"]


class FriendRequestListRetrieveSerializer(serializers.ModelSerializer):
    from_user = ProfileFeedSerializer(read_only=True)
    to_user = ProfileFeedSerializer(read_only=True)

    class Meta:
        model = FriendRequest
        fields = ["from_user", "to_user"]
