from rest_framework import serializers
from .models import User

class UserRegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True, 
        style = {
            "input_type": "password"
        },
    )
    confirm_password = serializers.CharField(
        write_only=True,
        style = {
            "input_type": "password"
        },
    )

    class Meta:
        model = User
        fields = ["username", "first_name", "last_name", "password", "confirm_password"]

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError(
                "Passwords do not match!"
            )
        
        return attrs
    
    def create(self, validated_data):
        validated_data.pop("confirm_password")
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
    
class UserMeSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "first_name", "last_name")