from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class ProfileSerializer(serializers.ModelSerializer):
    friends_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name", "avatar", "biography", "friends_count"]

    def get_friends_count(self, obj):
        return obj.friends.count()