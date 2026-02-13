from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name", "avatar"]

class UserDetailUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name", "biography", "avatar"]
        read_only_fields = ["id", "username"]
        
    def update(self, instance, validated_data):
        user = self.context["request"].user

        if user.pk != instance.pk:
            raise serializers.ValidationError(
                {"authorization": "You may only edit your own profile."}
            )
        
        instance.first_name = validated_data["first_name"]
        instance.last_name = validated_data["last_name"]
        instance.biography = validated_data["biography"]
        instance.avatar = validated_data["avatar"]

        instance.save()

        return instance
    
    

    