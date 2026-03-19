from rest_framework import serializers
from .models import User
from rest_framework.validators import UniqueValidator

class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email", "first_name", "last_name", "password"]
        extra_kwargs = {i:{"required": True, "write_only": True} for i in fields}
    
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with that username already exists.")
        
        RESTRICTED_USERNAMES = ["ADMIN", "ROOT", "SUPERUSER", "PROFILE", "MODERATOR", "STAFF"]

        if value.upper() in RESTRICTED_USERNAMES:
            raise serializers.ValidationError("This username is not allowed.")
        
        return value

    def create(self, validated_data):
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
