from rest_framework import serializers
from .models import User
from rest_framework.validators import UniqueValidator

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
        fields = ["username", "email", "first_name", "last_name", "password", "confirm_password"]
        extra_kwargs = {i:{'required': True} for i in fields}

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
        fields = ["id", "username", "first_name", "last_name", "avatar"]
        read_only_fields = fields

class UserLoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "password"]
        write_only_fields = ["password"]
        
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        username_field = self.fields.get("username")
        if username_field:
            username_field.validators = [
                v for v in username_field.validators
                if not isinstance(v, UniqueValidator)
            ]