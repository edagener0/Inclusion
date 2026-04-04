from rest_framework import serializers
from .models import (
    FriendRequest,
)
from common.serializers import ProfileFeedSerializer
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from .models import Friend

User = get_user_model()


class FriendRequestSentListRetrieveSerializer(serializers.ModelSerializer):
    to_user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), write_only=True
    )
    id = serializers.IntegerField(source="to_user.id", read_only=True)
    username = serializers.CharField(source="to_user.username", read_only=True)
    avatar = serializers.ImageField(source="to_user.avatar", read_only=True)

    class Meta:
        model = FriendRequest
        fields = ["to_user", "id", "username", "avatar"]


class FriendRequestCreateDestroySerializer(FriendRequestSentListRetrieveSerializer):
    def validate(self, attrs):
        from_user = self.context["request"].user
        to_user = attrs["to_user"]

        if from_user == to_user:
            raise ValidationError("Cannot send a friend request to yourself.")

        if FriendRequest.objects.filter(from_user=from_user, to_user=to_user).exists():
            raise ValidationError("Friend request already sent.")

        if (
            Friend.objects.filter(user1=from_user, user2=to_user).exists()
            or Friend.objects.filter(user1=to_user, user2=from_user).exists()
        ):
            raise ValidationError("You are already friends.")

        return attrs


class FriendRequestReceivedListRetrieveSerializer(serializers.ModelSerializer):
    from_user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), write_only=True
    )
    id = serializers.IntegerField(source="from_user.id", read_only=True)
    username = serializers.CharField(source="from_user.username", read_only=True)
    avatar = serializers.ImageField(source="from_user.avatar", read_only=True)

    class Meta:
        model = FriendRequest
        fields = ["from_user", "id", "username", "avatar"]


class FriendListSerializer(ProfileFeedSerializer):
    def get_fields(self):
        fields = super().get_fields()
        fields["is_friend"] = serializers.BooleanField(read_only=True, default=False)
        return fields
