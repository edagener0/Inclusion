from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class ProfileSerializer(serializers.ModelSerializer):
    friends_count = serializers.IntegerField()
    is_friend = serializers.BooleanField()

    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name", "avatar", "biography", "friends_count", "is_friend"]