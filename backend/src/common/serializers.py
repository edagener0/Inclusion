from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class DetailResponseSerializer(serializers.Serializer):
    detail = serializers.CharField()


class MessageResponseSerializer(serializers.Serializer):
    message = serializers.CharField()


class LikeToggleResponseSerializer(DetailResponseSerializer):
    liked = serializers.BooleanField()


class FavoriteToggleResponseSerializer(DetailResponseSerializer):
    favorited = serializers.BooleanField()


class ProfileFeedSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "avatar"]
