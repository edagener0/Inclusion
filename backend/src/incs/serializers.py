from rest_framework import serializers
from .models import Inc
class IncSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inc
        fields = ["id", "content"]