from rest_framework import serializers
from .models import (
    FriendRequest,
)
from common.serializers import ProfileFeedSerializer
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from .models import Friend

User = get_user_model()

class FriendRequestCreateDestroySerializer(serializers.ModelSerializer):
    from_user = serializers.PrimaryKeyRelatedField(read_only=True)
    to_user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = FriendRequest
        fields = ["from_user", "to_user"]

    def validate(self, attrs):
        from_user = self.context["request"].user
        to_user = attrs["to_user"]

        if from_user == to_user:
            raise ValidationError("Cannot send a friend request to yourself.")

        if FriendRequest.objects.filter(from_user=from_user, to_user=to_user).exists():
            raise ValidationError("Friend request already sent.")

        if (Friend.objects.filter(user1=from_user, user2=to_user).exists() or 
           Friend.objects.filter(user1=to_user, user2=from_user).exists()):
            raise ValidationError("You are already friends.")

        return attrs

class FriendRequestListRetrieveSerializer(serializers.ModelSerializer):
    from_user = ProfileFeedSerializer(read_only=True)
    to_user = ProfileFeedSerializer(read_only=True)

    class Meta:
        model = FriendRequest
        fields = ["from_user", "to_user"]
